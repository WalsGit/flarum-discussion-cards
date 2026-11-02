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
use Illuminate\Support\Str;

class PurgeImagesService
{
    protected const LOCK_TIMEOUT = 5; // seconds

    protected bool $dryRun = false;

    /** @var string[] */
    protected array $deletedFiles = [];

    /** @var string[] */
    protected array $skippedFiles = [];

    protected int $updatedDiscussions = 0;

    /** @var resource|null */
    protected $lockHandle = null;

    public function __construct(
        protected Paths $paths,
        protected ConnectionInterface $db
    ) {}

    /**
     * Purges discussion card images (default images are never deleted).
     *
     * - no option: deletes the images not used by any discussion (orphans)
     * - $all: deletes all discussion images
     * - $discussionIds: deletes the images of these discussions
     *
     * @param int[] $discussionIds
     * @return array{deleted: int, skipped: int, updated: int, deletedFiles: string[], skippedFiles: string[], dryRun: bool}
     * @throws PurgeImagesException
     */
    public function purge(bool $all = false, array $discussionIds = [], bool $dryRun = false): array
    {
        $this->dryRun = $dryRun;
        $this->deletedFiles = [];
        $this->skippedFiles = [];
        $this->updatedDiscussions = 0;

        $directory = '/' . ExtensionPaths::ASSETS_DIR;
        $path = $this->paths->public . $directory;

        if (!is_dir($path)) {
            throw new PurgeImagesException('purgeImagesDirectoryNotFound', ['directory' => $directory]);
        }

        $this->acquireLock();

        try {
            if ($all) {
                $this->purgeAll($path);
            } elseif (!empty($discussionIds)) {
                foreach ($discussionIds as $id) {
                    $this->purgeDiscussion($path, (int) $id);
                }
            } else {
                $this->purgeOrphans($path);
            }
        } finally {
            $this->releaseLock();
        }

        return [
            'deleted'      => count($this->deletedFiles),
            'skipped'      => count($this->skippedFiles),
            'updated'      => $this->updatedDiscussions,
            'deletedFiles' => $this->deletedFiles,
            'skippedFiles' => $this->skippedFiles,
            'dryRun'       => $this->dryRun,
        ];
    }

    protected function purgeOrphans(string $path): void
    {
        $used = $this->db->table('discussions')
            ->whereNotNull('walsgit_card_image_url')
            ->pluck('walsgit_card_image_url')
            ->map(fn($url) => basename($url))
            ->flip()
            ->all();

        foreach ($this->listFiles($path) as $file) {
            if (!$this->isDeletableDiscussionImage($file)) {
                continue;
            }

            if (isset($used[$file])) {
                $this->skippedFiles[] = $file;
            } else {
                $this->deleteFile($path, $file);
            }
        }
    }

    protected function purgeAll(string $path): void
    {
        foreach ($this->listFiles($path) as $file) {
            if ($this->isDeletableDiscussionImage($file)) {
                $this->deleteFile($path, $file);
            }
        }

        if (!$this->dryRun) {
            $this->updatedDiscussions = $this->db->table('discussions')
                ->whereNotNull('walsgit_card_image_url')
                ->where('walsgit_card_image_url', 'not like', '%default-card-image.webp')
                ->update(['walsgit_card_image_url' => null]);
        }
    }

    protected function purgeDiscussion(string $path, int $discussionId): void
    {
        foreach ($this->listFiles($path) as $file) {
            if (
                $this->isDeletableDiscussionImage($file) &&
                Str::startsWith($file, 'discussion-' . $discussionId . '-')
            ) {
                $this->deleteFile($path, $file);
            }
        }

        if (!$this->dryRun) {
            $this->updatedDiscussions += $this->db->table('discussions')
                ->where('id', $discussionId)
                ->whereNotNull('walsgit_card_image_url')
                ->update(['walsgit_card_image_url' => null]);
        }
    }

    protected function deleteFile(string $path, string $file): void
    {
        if (!$this->dryRun) {
            @unlink($path . '/' . $file);
        }

        $this->deletedFiles[] = $file;
    }

    /**
     * @return string[]
     */
    protected function listFiles(string $path): array
    {
        return scandir($path) ?: [];
    }

    protected function isDeletableDiscussionImage(string $file): bool
    {
        return
            Str::startsWith($file, 'discussion-') &&
            Str::endsWith($file, '.webp') &&
            !Str::contains($file, 'default-card-image');
    }

    /**
     * @throws PurgeImagesException when another purge is already running
     */
    protected function acquireLock(): void
    {
        $lockDir = $this->paths->storage . '/locks';

        if (!is_dir($lockDir)) {
            @mkdir($lockDir, 0755, true);
        }

        $handle = @fopen($lockDir . '/discussion-cards-purge-images.lock', 'c');

        if ($handle === false) {
            throw new PurgeImagesException('purgeImagesAlreadyRunning');
        }

        $start = time();

        while (!flock($handle, LOCK_EX | LOCK_NB)) {
            if ((time() - $start) >= self::LOCK_TIMEOUT) {
                fclose($handle);
                throw new PurgeImagesException('purgeImagesAlreadyRunning');
            }

            usleep(250000);
        }

        $this->lockHandle = $handle;
    }

    protected function releaseLock(): void
    {
        if ($this->lockHandle) {
            flock($this->lockHandle, LOCK_UN);
            fclose($this->lockHandle);
            $this->lockHandle = null;
        }
    }
}
