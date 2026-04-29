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
    protected LoggingService $logger;
    protected int $failedMigrationCount = 0;

    public function __construct(
        protected Paths $paths,
        protected SettingsRepositoryInterface $settings,
        protected ImageProcessingService $imageService,
        protected Connection $db,
        protected Translator $translator
    ) {
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
        $this->failedMigrationCount = 0;

        // Log start of migration
        $this->logger->info("*** Starting image migration process ***");

        // Validate environment before starting migration
        $this->validateEnvironment($public);

        /*
        |--------------------------------------------------------------------------
        | 1) GENERAL DEFAULT IMAGE MIGRATION (only if a pre v1.4 filename is found in DB)
        |--------------------------------------------------------------------------
        */
        echo $this->translator->trans('walsgit_discussion_cards.admin.console.imageMigrationServiceStep1') . "\n";
        $this->logger->info("Processing general default image migration...");

        $oldGeneralFilename = $this->settings->get('walsgit_discussion_cards_default_image_path');
        $this->logger->info("Found general default image in settings: " . ($oldGeneralFilename ?: 'None'));

        // Old file was in /assets/card-image-{hash}.png
        if ($oldGeneralFilename && preg_match('#^card-image-[a-z0-9]+\.png$#i', $oldGeneralFilename)) {
            $oldPath = $assetsDir . DIRECTORY_SEPARATOR . $oldGeneralFilename;
            $this->logger->info("Checking if old general image exists at: {$oldPath}");

            if (is_file($oldPath)) {
                $targetDir = $public . '/assets/extensions/walsgit-discussion-cards';
                // Use our validation method instead of error suppression
                if ($this->ensureDirectoryExists($targetDir, 0775)) {
                    $targetFilename = 'default-card-image.webp';
                    $targetPath = $targetDir . DIRECTORY_SEPARATOR . $targetFilename;
                    $this->logger->info("Processing general image: {$oldPath} -> {$targetPath}");

                    try {
                        $this->imageService->processImage($oldPath, $targetPath);
                        $this->settings->set(
                            'walsgit_discussion_cards_default_image_path',
                            $targetFilename
                        );

                        echo $this->translator->trans('walsgit_discussion_cards.admin.console.imageMigrationServiceGeneralImageSuccess', ['oldfilename' => $oldGeneralFilename, 'newfilepath' => $targetPath]) . "\n";
                        $this->logger->info("Successfully migrated general default image: {$oldGeneralFilename} -> {$targetFilename}");
                        $this->logger->info("Successfully set {$targetFilename} as the new general default image in the settings (DB)");
                        $migratedCount++;
                    } catch (\Throwable $e) {
                        echo $this->translator->trans('walsgit_discussion_cards.admin.console.imageMigrationServiceGeneralImageFail', ['filename' => $oldGeneralFilename]) . $e->getMessage() . "\n";
                        $this->logger->error("Failed to migrate general default image from {$oldGeneralFilename} to {$targetFilename} and/or to set {$targetFilename} as the new general default image in the settings (DB), Error: " . $e->getMessage());
                        $this->failedMigrationCount++;
                    }
                } else {
                    echo $this->translator->trans('walsgit_discussion_cards.admin.console.imageMigrationServiceGeneralImageFail', ['filename' => $oldGeneralFilename]) . " Failed to create/access target directory.\n";
                    $this->logger->error("Failed to create/access target directory: {$targetDir}");
                    $this->failedMigrationCount++;
                }
            } else {
                $this->logger->warning("Old general default image file not found: {$oldPath}");
            }
        } else {
            $this->logger->info("No migration needed for general default image.");
        }

        /*
        |--------------------------------------------------------------------------
        | 2) TAG DEFAULT IMAGES MIGRATION (only if a pre v1.4 filename is found in DB)
        |--------------------------------------------------------------------------
        */
        echo $this->translator->trans('walsgit_discussion_cards.admin.console.imageMigrationServiceStep2') . "\n";
        $this->logger->info("Processing tag default images migration...");

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
                // Use our validation method instead of error suppression
                if ($this->ensureDirectoryExists($targetDir, 0775)) {
                    $targetFilename = "tag-{$tag->id}-default-card-image.webp";
                    $targetPath = $targetDir . DIRECTORY_SEPARATOR . $targetFilename;
                    $this->logger->info("Processing tag image: {$oldPath} -> {$targetPath}...");

                    try {
                        $this->imageService->processImage($oldPath, $targetPath);

                        $tag->walsgit_discussion_cards_tag_default_image = 'tags/' . $targetFilename;
                        $tag->save();

                        echo $this->translator->trans('walsgit_discussion_cards.admin.console.imageMigrationServiceTagImageSuccess', ['oldfilename' => $oldTagFilename, 'tagid' => $tag->id, 'newfilepath' => $targetPath]) . "\n";
                        $this->logger->info("Successfully migrated tag {$tag->id} default image: {$oldTagFilename} -> {$targetFilename}");
                        $this->logger->info("Successfully set {$targetFilename} as the new tag {$tag->id} default image in the tag settings (DB)");
                        $migratedCount++;
                    } catch (\Throwable $e) {
                        echo $this->translator->trans('walsgit_discussion_cards.admin.console.imageMigrationServiceTagImageFail', ['filename' => $oldTagFilename, 'tagid' => $tag->id]) . $e->getMessage() . "\n";
                        $this->logger->error("Failed to migrate tag {$tag->id} default image from {$oldTagFilename} to {$targetFilename} and/or to set {$targetFilename} as the new tag default image in the settings (DB), Error: " . $e->getMessage());
                        $this->failedMigrationCount++;
                    }
                } else {
                    echo $this->translator->trans('walsgit_discussion_cards.admin.console.imageMigrationServiceTagImageFail', ['filename' => $oldTagFilename, 'tagid' => $tag->id]) . " Failed to create/access target directory.\n";
                    $this->logger->error("Failed to create/access target directory: {$targetDir}");
                    $this->failedMigrationCount++;
                }
            } else {
                $this->logger->warning("Old tag default image file {$oldPath} NOT FOUND.");
            }
        }

        /*
        |--------------------------------------------------------------------------
        | 3) FINAL CLEANUP
        |--------------------------------------------------------------------------
        */
        echo $this->translator->trans('walsgit_discussion_cards.admin.console.imageMigrationServiceStep3') . "\n";
        $this->logger->info("Starting final cleanup of legacy PNG files...");

        // Only perform cleanup if no migrations failed
        if ($this->failedMigrationCount === 0) {
            $this->cleanupLegacyPngs($assetsDir);
        } else {
            $this->logger->info("Skipping cleanup due to {$this->failedMigrationCount} failed migrations");
            echo $this->translator->trans('walsgit-discussion-cards.admin.console.imageMigrationServiceNoCleanup', ['failedMigrations' => $this->failedMigrationCount]);
        }

        $this->logger->info("Migration process completed. Total migrated images: {$migratedCount}, Failed: {$this->failedMigrationCount}");
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
        // Check if file exists first
        if (!file_exists($file)) {
            $this->logger->info("File does not exist (already deleted or never existed): " . basename($file));
            return true; // Consider as successful since there's nothing to delete
        }

        // Check if it's actually a file
        if (!is_file($file)) {
            $this->logger->warning("Path exists but is not a file: " . basename($file));
            return false;
        }

        // Check if file is writable (deletable)
        if (!is_writable($file)) {
            $this->logger->error("File exists but is not deletable (permission denied): " . basename($file));
            echo $this->translator->trans(
                'walsgit_discussion_cards.admin.console.imageMigrationServiceCleanupFail',
                ['filename' => basename($file), 'error' => 'Permission denied']
            ) . "\n";
            return false;
        }

        // Attempt to delete the file
        $success = @unlink($file);

        if ($success) {
            echo $this->translator->trans(
                'walsgit_discussion_cards.admin.console.imageMigrationServiceCleanupSuccess',
                ['filename' => basename($file)]
            ) . "\n";
            $this->logger->info("Successfully deleted file: " . basename($file));
            return true;
        } else {
            $error = error_get_last();
            $msg = $error['message'] ?? $this->translator->trans('walsgit_discussion_cards.admin.console.imageMigrationServiceUnknownError');

            // Provide more specific error messages
            if (strpos($msg, 'Permission denied') !== false) {
                $errorMsg = 'Permission denied';
            } elseif (strpos($msg, 'No such file or directory') !== false) {
                $errorMsg = 'File not found';
            } else {
                $errorMsg = $msg;
            }

            echo $this->translator->trans(
                'walsgit_discussion_cards.admin.console.imageMigrationServiceCleanupFail',
                ['filename' => basename($file), 'error' => $errorMsg]
            ) . "\n";

            $this->logger->error("Failed to delete file: " . basename($file) . ", Error: " . $errorMsg);
            return false;
        }
    }

    /**
     * Validate environment and required directories before migration.
     *
     * @param string $public Public directory path
     * @throws \RuntimeException If validation fails
     */
    protected function validateEnvironment(string $public): void
    {
        $this->logger->info("Validating environment for migration...");

        // Check base assets directory
        $assetsDir = $public . DIRECTORY_SEPARATOR . 'assets';
        if (!$this->ensureDirectoryExists($assetsDir, 0755)) {
            $this->logger->error("Cannot access or create assets directory: {$assetsDir}");
            throw new \RuntimeException("Cannot access or create assets directory: $assetsDir");
        }

        // Check target directories
        $targetBaseDir = $public . '/assets/extensions/walsgit-discussion-cards';
        if (!$this->ensureDirectoryExists($targetBaseDir, 0775)) {
            $this->logger->error("Cannot create or access target directory: {$targetBaseDir}");
            throw new \RuntimeException("Cannot create or access target directory: $targetBaseDir");
        }

        $targetTagsDir = $targetBaseDir . '/tags';
        if (!$this->ensureDirectoryExists($targetTagsDir, 0775)) {
            $this->logger->error("Cannot create or access tags directory: {$targetTagsDir}");
            throw new \RuntimeException("Cannot create or access tags directory: $targetTagsDir");
        }

        $this->logger->info("Environment validation completed successfully");
    }

    /**
     * Ensure directory exists with proper permissions.
     *
     * @param string $dir Directory path
     * @param int $permissions Directory permissions
     * @return bool True if directory is accessible, false otherwise
     */
    protected function ensureDirectoryExists(string $dir, int $permissions): bool
    {
        // If directory exists, check if it's writable
        if (is_dir($dir)) {
            if (!is_writable($dir)) {
                $this->logger->error("Directory exists but is not writable: $dir");
                return false;
            }
            $this->logger->debug("Directory already exists and is writable: $dir");
            return true;
        }

        // Try to create directory
        if (!@mkdir($dir, $permissions, true)) {
            $error = error_get_last();
            $errorMsg = $error['message'] ?? 'Unknown error';

            // Check if it's a permission issue
            if (strpos($errorMsg, 'Permission denied') !== false) {
                $this->logger->error("Permission denied when creating directory: $dir - Error: $errorMsg");
                return false;
            }

            // Check if parent directory doesn't exist or is not writable
            $parentDir = dirname($dir);
            if (!is_dir($parentDir)) {
                $this->logger->error("Parent directory does not exist: $parentDir");
                return false;
            }

            if (!is_writable($parentDir)) {
                $this->logger->error("Parent directory is not writable: $parentDir");
                return false;
            }

            $this->logger->error("Failed to create directory: $dir - Error: $errorMsg");
            return false;
        }

        $this->logger->info("Successfully created directory: $dir with permissions " . decoct($permissions));
        return true;
    }
}
