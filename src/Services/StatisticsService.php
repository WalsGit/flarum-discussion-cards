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
use Illuminate\Contracts\Cache\Repository as Cache;

class StatisticsService
{
    private const CACHE_KEY = 'walsgit.discussion-cards.statistics';
    private const CACHE_TTL = 900; // 15 minutes (= 900 seconds)

    public function __construct(
        protected Paths $paths,
        protected ConnectionInterface $db,
        protected Cache $cache
    ) {}

    public function getStats(): array
    {
        return $this->cache->remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            return $this->computeStats();
        });
    }

    public function refreshStats(): array
    {
        $stats = $this->computeStats();

        $this->cache->put(self::CACHE_KEY, $stats, self::CACHE_TTL);

        return $stats;
    }

    protected function computeStats(): array
    {
        $basePath = $this->paths->public . '/assets/extensions/walsgit-discussion-cards';
        $allImages = [];
        $discussionImages = [];

        // --- Listing all discussion images saved on disk ---
        if (is_dir($basePath)) {
            $iterator = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($basePath, \FilesystemIterator::SKIP_DOTS)
            );

            foreach ($iterator as $file) {
                if ($file->isFile()) {
                    $filename = $file->getFilename();
                    $allImages[] = $filename;

                    if (
                        str_starts_with($filename, 'discussion-') &&
                        !str_ends_with($filename, 'default-card-image.webp')
                    ) {
                        $discussionImages[] = $filename;
                    }
                }
            }
        }

        // --- Listing all used images (in DB) ---
        $usedImages = $this->db->table('discussions')
            ->whereNotNull('walsgit_card_image_url')
            ->pluck('walsgit_card_image_url')
            ->all();

        // Extracting filename to compare it with image files on disk
        $usedImagesSet = array_flip(array_map(fn($url) => basename($url), $usedImages));

        // --- Counting Discussions without images (in DB) ---
        $discussionsWithoutImages = $this->db->table('discussions')
            ->whereNull('walsgit_card_image_url')
            ->count();

        // --- Counting unused images (files on disk but not in DB) ---
        $unusedImages = 0;
        foreach ($discussionImages as $image) {
            if (!isset($usedImagesSet[$image])) {
                $unusedImages++;
            }
        }

        return [
            'totalImages' => count($allImages),
            'discussionImages' => count($discussionImages),
            'discussionsWithoutImages' => $discussionsWithoutImages,
            'unusedImages' => $unusedImages,
        ];
    }
}
