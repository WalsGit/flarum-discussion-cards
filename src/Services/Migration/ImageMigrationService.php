<?php

/*
 * This file is part of walsgit/discussion-cards
 *
 *  Copyright (c) 2026 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Walsgit\Discussion\Cards\Services\Migration;

use Flarum\Foundation\Paths;
use Flarum\Settings\SettingsRepositoryInterface;
use Walsgit\Discussion\Cards\Services\ImageProcessingService;
use Walsgit\Discussion\Cards\Services\LoggingService;
use Flarum\Tags\Tag;
use Illuminate\Database\Connection;
use Flarum\Locale\Translator;

class ImageMigrationService
{
    protected Paths $paths;
    protected SettingsRepositoryInterface $settings;
    protected ImageProcessingService $imageService;
    protected Connection $db;
    protected $translator;
    protected LoggingService $logger;

    public function __construct(
        Paths $paths,
        SettingsRepositoryInterface $settings,
        ImageProcessingService $imageService,
        Connection $db,
        Translator $translator
    ) {
        $this->paths = $paths;
        $this->settings = $settings;
        $this->imageService = $imageService;
        $this->db = $db;
        $this->translator = $translator;

        // Initialize logger with 'migration' prefix
        $this->logger = new LoggingService($paths, 'migration');
    }

    /**
     * Version 1.4.0 changes how and where default card images are processed and stored;
     * This script will check the DB for the already set discussion cards default image paths
     * and process (smaller webp file with new filenames) and migrate them to new location
     * then delete all old remaining discussion cards images still in /public/assets/ (using the old naming templates)
     */
    public function runMigration(): int
    {
        $public = rtrim($this->paths->public, DIRECTORY_SEPARATOR);
        $assetsDir = $public . DIRECTORY_SEPARATOR . 'assets';
        $migratedCount = 0;

        // Log start of migration
        $this->logger->info("Starting image migration process");

        /*
        |--------------------------------------------------------------------------
        | 1) GENERAL DEFAULT IMAGE MIGRATION (only if a pre v1.4 filename is found in DB)
        |--------------------------------------------------------------------------
        */
        echo $this->translator->trans('walsgit-discussion-cards.admin.console.imageMigrationServiceStep1') . "\n";
        $this->logger->info("Processing general default image migration");

        $oldGeneralFilename = $this->settings->get('walsgit_discussion_cards_default_image_path');
        $this->logger->info("Found general default image in settings: " . ($oldGeneralFilename ?: 'None'));

        // Old file was in /assets/card-image-{hash}.png
        if ($oldGeneralFilename && preg_match('#^card-image-[a-z0-9]+\.png$#i', $oldGeneralFilename)) {
            $oldPath = $assetsDir . DIRECTORY_SEPARATOR . $oldGeneralFilename;
            $this->logger->info("Checking if old general image exists at: {$oldPath}");

            if (is_file($oldPath)) {
                $targetDir = $public . '/assets/extensions/walsgit-discussion-cards';
                @mkdir($targetDir, 0775, true);

                $targetFilename = 'default-card-image.webp';
                $targetPath = $targetDir . DIRECTORY_SEPARATOR . $targetFilename;
                $this->logger->info("Processing general image: {$oldPath} -> {$targetPath}");

                try {
                    $this->imageService->processImage($oldPath, $targetPath);
                    $this->settings->set(
                        'walsgit_discussion_cards_default_image_path',
                        $targetFilename
                    );

                    echo $this->translator->trans('walsgit-discussion-cards.admin.console.imageMigrationServiceGeneralImageSuccess', ['oldfilename' => $oldGeneralFilename, 'newfilepath' => $targetPath]) . "\n";
                    $this->logger->info("Successfully migrated general default image: {$oldGeneralFilename} -> {$targetFilename}");
                    $this->logger->info("Successfully set {$targetFilename} as the new general default image in the settings (DB)");
                    $migratedCount++;
                } catch (\Throwable $e) {
                    echo $this->translator->trans('walsgit-discussion-cards.admin.console.imageMigrationServiceGeneralImageFail', ['filename' => $oldGeneralFilename]) . $e->getMessage() . "\n";
                    $this->logger->error("Failed to migrate general default image from {$oldGeneralFilename} to {$targetFilename} and/or to set {$targetFilename} as the new general default image in the settings (DB), Error: " . $e->getMessage());
                }
            } else {
                $this->logger->warning("Old general default image file not found: {$oldPath}");
            }
        }

        /*
        |--------------------------------------------------------------------------
        | 2) TAG DEFAULT IMAGES MIGRATION (only if a pre v1.4 filename is found in DB)
        |--------------------------------------------------------------------------
        */
        echo $this->translator->trans('walsgit-discussion-cards.admin.console.imageMigrationServiceStep2') . "\n";
        $this->logger->info("Processing tag default images migration");

        $tags = Tag::all();
        $this->logger->info("Found " . $tags->count() . " tags to process");

        foreach ($tags as $tag) {
            $oldTagFilename = $tag->walsgit_discussion_cards_tag_default_image;
            $this->logger->info("Processing tag ID {$tag->id}: " . ($oldTagFilename ?: 'no default image'));

            if (! $oldTagFilename) {
                continue;
            }

            // Old files were in /assets/tag-{id}-card-image-{hash}.png
            if (! preg_match('#^tag-' . $tag->id . '-card-image-[a-z0-9]+\.png$#i', $oldTagFilename)) {
                $this->logger->debug("Skipping tag {$tag->id}, found filename {$oldTagFilename} doesn't match old pattern");
                continue;
            }

            $oldPath = $assetsDir . DIRECTORY_SEPARATOR . $oldTagFilename;
            $this->logger->info("Checking if old tag default image exists at: {$oldPath}");

            if (is_file($oldPath)) {
                $targetDir = $public . '/assets/extensions/walsgit-discussion-cards/tags';
                @mkdir($targetDir, 0775, true);

                $targetFilename = "tag-{$tag->id}-default-card-image.webp";
                $targetPath = $targetDir . DIRECTORY_SEPARATOR . $targetFilename;
                $this->logger->info("Processing tag image: {$oldPath} -> {$targetPath}...");

                try {
                    $this->imageService->processImage($oldPath, $targetPath);

                    $tag->walsgit_discussion_cards_tag_default_image = 'tags/' . $targetFilename;
                    $tag->save();

                    echo $this->translator->trans('walsgit-discussion-cards.admin.console.imageMigrationServiceTagImageSuccess', ['oldfilename' => $oldTagFilename, 'tagid' => $tag->id, 'newfilepath' => $targetPath]) . "\n";
                    $this->logger->info("Successfully migrated tag {$tag->id} default image: {$oldTagFilename} -> {$targetFilename}");
                    $this->logger->info("Successfully set {$targetFilename} as the new tag {$tag->id} default image in the tag settings (DB)");
                    $migratedCount++;
                } catch (\Throwable $e) {
                    echo $this->translator->trans('walsgit-discussion-cards.admin.console.imageMigrationServiceTagImageFail', ['filename' => $oldTagFilename, 'tagid' => $tag->id]) . $e->getMessage() . "\n";
                    $this->logger->error("Failed to migrate tag {$tag->id} default image from {$oldTagFilename} to {$targetFilename} and/or to set {$targetFilename} as the new tag default image in the settings (DB), Error: " . $e->getMessage());
                }
            } else {
                $this->logger->warning("Old tag default image file {$oldPath} not found.");
            }
        }

        /*
        |--------------------------------------------------------------------------
        | 3) FINAL CLEANUP
        |--------------------------------------------------------------------------
        */
        echo $this->translator->trans('walsgit-discussion-cards.admin.console.imageMigrationServiceStep3') . "\n";
        $this->logger->info("Starting final cleanup of legacy PNG files...");

        $this->cleanupLegacyPngs($assetsDir);

        $this->logger->info("Migration process completed. Total migrated images: {$migratedCount}");
        return $migratedCount;
    }

    /**
     * Delete all old non-migrated PNGs.
     */
    protected function cleanupLegacyPngs(string $assetsDir): void
    {
        $this->logger->info("Cleaning up legacy PNG files from: {$assetsDir}");

        $patterns = [
            $assetsDir . DIRECTORY_SEPARATOR . 'card-image-*.png',
            $assetsDir . DIRECTORY_SEPARATOR . 'tag-*-card-image-*.png',
        ];

        $deletedCount = 0;
        foreach ($patterns as $pattern) {
            $this->logger->debug("Searching for files matching pattern: {$pattern}");
            foreach (glob($pattern) as $file) {
                $this->logger->debug("Attempting to delete legacy file: " . basename($file));
                if ($this->safeUnlink($file)) {
                    $deletedCount++;
                }
            }
        }

        $this->logger->info("Cleanup completed. Deleted {$deletedCount} legacy files");
    }

    protected function safeUnlink(string $file): bool
    {
        if (!is_file($file)) {
            $this->logger->warning("File not found for deletion: " . basename($file));
            return false;
        }

        $success = @unlink($file);

        if ($success) {
            echo $this->translator->trans(
                'walsgit-discussion-cards.admin.console.imageMigrationServiceCleanupSuccess',
                ['filename' => basename($file)]
            ) . "\n";
            $this->logger->info("Successfully deleted file: " . basename($file));
            return true;
        } else {
            $error = error_get_last();
            $msg = $error['message'] ?? $this->translator->trans('walsgit-discussion-cards.admin.console.imageMigrationServiceUnknownError');

            echo $this->translator->trans(
                'walsgit-discussion-cards.admin.console.imageMigrationServiceCleanupFail',
                ['filename' => basename($file), 'error' => $msg]
            ) . "\n";

            $this->logger->error("Failed to delete file: " . basename($file) . ", Error: " . $msg);
            return false;
        }
    }
}
