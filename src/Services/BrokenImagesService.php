<?php

/*
 * This file is part of walsgit/flarum-discussion-cards
 *
 *  Copyright (c) 2026 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Walsgit\Discussion\Cards\Services;

use Flarum\Foundation\Paths;
use Illuminate\Database\ConnectionInterface;

/**
 * Detects the discussions whose stored card image points to an extension file that no longer exists.
 *
 * The stored value is a path relative to the extension's assets folder (an absolute URL can still be there
 * for external images saved before 2.1.0). Nothing is fetched and nothing is deleted here: the path is
 * validated against a strict allowlist, then looked up in a single listing of the extension's assets folder.
 */
class BrokenImagesService
{
    protected const DISCUSSION_FILE = '#^discussion-\d+-[a-f0-9]+-[a-f0-9]+\.webp$#';
    protected const DEFAULT_FILE = '#^(?:tags/tag-\d+-)?(?:[a-z0-9-]+-)?default-card-image\.webp$#';

    /** The file exists. */
    public const OK = 'ok';

    /** Discussion image: the file is gone from the disk. */
    public const MISSING = 'missing';

    /** Default image (general, tag or blog): the file is gone. Not fixed by a regeneration. */
    public const DEFAULT_MISSING = 'defaultMissing';

    /** Not an extension file (external URL saved before 2.1.0 or unknown name): not checked. */
    public const EXTERNAL = 'external';

    protected const CHUNK_SIZE = 1000;

    public function __construct(
        protected Paths $paths,
        protected ConnectionInterface $db
    ) {}

    /**
     * Files of the extension's assets folder, as a set keyed by path relative to that folder
     * (ex.: "discussion-1-abc-def.webp", "tags/tag-3-default-card-image.webp").
     *
     * @return array<string, true>
     */
    public function listFiles(): array
    {
        $basePath = $this->paths->public . '/assets/extensions/walsgit-discussion-cards';
        $files = [];

        if (!is_dir($basePath)) {
            return $files;
        }

        $offset = strlen(rtrim($basePath, '/\\')) + 1;
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($basePath, \FilesystemIterator::SKIP_DOTS)
        );

        foreach ($iterator as $file) {
            if ($file->isFile()) {
                $files[str_replace('\\', '/', substr($file->getPathname(), $offset))] = true;
            }
        }

        return $files;
    }

    /**
     * Classifies one stored value against the files on disk.
     *
     * @param array<string, true> $files result of listFiles()
     * @return array{0: string, 1: string|null} [category, file relative to the assets folder (null: external)]
     */
    public function classify(string $stored, array $files): array
    {
        // Absolute URL (external image saved before 2.1.0)
        if (preg_match('#^https?://#i', $stored)) {
            return [self::EXTERNAL, null];
        }

        $file = $stored;
        $isDiscussionFile = (bool) preg_match(self::DISCUSSION_FILE, $file);
        $isDefaultFile = !$isDiscussionFile && preg_match(self::DEFAULT_FILE, $file);

        if (!$isDiscussionFile && !$isDefaultFile) {
            return [self::EXTERNAL, null];
        }

        if (!isset($files[$file])) {
            return [$isDefaultFile ? self::DEFAULT_MISSING : self::MISSING, $file];
        }

        return [self::OK, $file];
    }

    /**
     * Scans every discussion that has a card image URL, in batches (keyset on the id).
     *
     * @param int $maxIds maximum number of repairable discussion ids returned (counts are always complete)
     * @return array{
     *     missing: int, defaultMissing: int, external: int, ok: int,
     *     defaults: array<int, array{file: string, discussions: int}>,
     *     ids: int[], truncated: bool
     * }
     */
    public function scan(int $maxIds = 5000): array
    {
        $files = $this->listFiles();
        $counts = [
            self::MISSING => 0,
            self::DEFAULT_MISSING => 0,
            self::EXTERNAL => 0,
            self::OK => 0,
        ];
        $defaults = [];
        $ids = [];
        $truncated = false;

        $this->db->table('discussions')
            ->whereNotNull('walsgit_card_image_url')
            ->select('id', 'walsgit_card_image_url')
            ->chunkById(self::CHUNK_SIZE, function ($rows) use ($files, &$counts, &$defaults, &$ids, &$truncated, $maxIds) {
                foreach ($rows as $row) {
                    [$category, $file] = $this->classify((string) $row->walsgit_card_image_url, $files);
                    $counts[$category]++;

                    if ($category === self::DEFAULT_MISSING) {
                        $defaults[$file] = ($defaults[$file] ?? 0) + 1;
                    } elseif ($category === self::MISSING) {
                        if (count($ids) < $maxIds) {
                            $ids[] = (int) $row->id;
                        } else {
                            $truncated = true;
                        }
                    }
                }
            });

        ksort($defaults);

        return [
            'missing' => $counts[self::MISSING],
            'defaultMissing' => $counts[self::DEFAULT_MISSING],
            'external' => $counts[self::EXTERNAL],
            'ok' => $counts[self::OK],
            'defaults' => array_map(
                fn($file, $discussions) => ['file' => $file, 'discussions' => $discussions],
                array_keys($defaults),
                array_values($defaults)
            ),
            'ids' => $ids,
            'truncated' => $truncated,
        ];
    }

    /**
     * Fallback when a regeneration could not fix a discussion: sets its card image URL back to NULL
     * (a later "without image" regeneration will pick it up).
     * Every id is checked again: only discussions whose image file is still missing are touched,
     * so broken default images (which a NULL would not fix) and healthy cards are left alone.
     *
     * @param int[] $ids
     * @return int number of discussions reset (or that would be, with $dryRun)
     */
    public function resetToNull(array $ids, bool $dryRun = false): int
    {
        $files = $this->listFiles();
        $reset = 0;

        foreach (array_chunk(array_values(array_unique(array_map('intval', $ids))), 500) as $chunk) {
            $rows = $this->db->table('discussions')
                ->whereIn('id', $chunk)
                ->whereNotNull('walsgit_card_image_url')
                ->select('id', 'walsgit_card_image_url')
                ->get();

            $toReset = [];

            foreach ($rows as $row) {
                [$category] = $this->classify((string) $row->walsgit_card_image_url, $files);

                if ($category === self::MISSING) {
                    $toReset[] = (int) $row->id;
                }
            }

            if (!empty($toReset)) {
                if (!$dryRun) {
                    $this->db->table('discussions')->whereIn('id', $toReset)->update(['walsgit_card_image_url' => null]);
                }

                $reset += count($toReset);
            }
        }

        return $reset;
    }
}
