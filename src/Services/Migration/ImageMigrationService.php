<?php

/*
 * This file is part of walsgit/discussion-cards
 *
 *  Copyright (c) 2025 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Walsgit\Discussion\Cards\Services\Migration;

use Flarum\Foundation\Paths;
use Flarum\Settings\SettingsRepositoryInterface;
use Walsgit\Discussion\Cards\Services\ImageProcessingService;
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
    }

    /**
     * Version 1.4.0 changes how and where default card images are processed and stored;
     * This script will check the DB for the already set disucsion cards default image paths
     * and process (smaller webp file with new filenames) and migrate them to new location
     * then delete all old remaining discussion cards images still in /public/assets/ (using the old naming templates)
     */
    public function runMigration(): int
    {
        $public = rtrim($this->paths->public, DIRECTORY_SEPARATOR);
        $assetsDir = $public . DIRECTORY_SEPARATOR . 'assets';
        $migratedCount = 0;

        /*
        |--------------------------------------------------------------------------
        | 1) GENERAL DEFAULT IMAGE MIGRATION (only if a pre v1.4 filename is found in DB)
        |--------------------------------------------------------------------------
        */
        echo $this->translator->trans('walsgit-discussion-cards.admin.console.imageMigrationServiceStep1') . "\n";

        $oldGeneralFilename = $this->settings->get('walsgit_discussion_cards_default_image_path'); 

        // Old file was in /assets/card-image-{hash}.png
        if ($oldGeneralFilename && preg_match('#^card-image-[a-z0-9]+\.png$#i', $oldGeneralFilename)) {
            $oldPath = $assetsDir . DIRECTORY_SEPARATOR . $oldGeneralFilename;

            if (is_file($oldPath)) {
                $targetDir = $public . '/assets/extensions/walsgit-discussion-cards';
                @mkdir($targetDir, 0775, true);

                $targetFilename = 'default-card-image.webp';
                $targetPath = $targetDir . DIRECTORY_SEPARATOR . $targetFilename;

                try {
                    $this->imageService->processImage($oldPath, $targetPath);
                    $this->settings->set(
                        'walsgit_discussion_cards_default_image_path',
                        $targetFilename
                    );

                    echo $this->translator->trans('walsgit-discussion-cards.admin.console.imageMigrationServiceGeneralImageSuccess', ['oldfilename' => $oldGeneralFilename, 'newfilepath' => $targetPath]) . "\n";
                    $migratedCount++;
                } catch (\Throwable $e) {
                    echo $this->translator->trans('walsgit-discussion-cards.admin.console.imageMigrationServiceGeneralImageFail', ['filename' => $oldGeneralFilename]) . $e->getMessage() . "\n";
                }
            }
        }

        /*
        |--------------------------------------------------------------------------
        | 2) TAG DEFAULT IMAGES MIGRATION (only if a pre v1.4 filename is found in DB)
        |--------------------------------------------------------------------------
        */
        echo $this->translator->trans('walsgit-discussion-cards.admin.console.imageMigrationServiceStep2') . "\n";

        foreach (Tag::all() as $tag) {
            $oldTagFilename = $tag->walsgit_discussion_cards_tag_default_image;

            if (! $oldTagFilename) {
                continue;
            }

            // Old files were in /assets/tag-{id}-card-image-{hash}.png
            if (! preg_match('#^tag-' . $tag->id . '-card-image-[a-z0-9]+\.png$#i', $oldTagFilename)) {
                continue;
            }

            $oldPath = $assetsDir . DIRECTORY_SEPARATOR . $oldTagFilename;

            if (is_file($oldPath)) {
                $targetDir = $public . '/assets/extensions/walsgit-discussion-cards/tags';
                @mkdir($targetDir, 0775, true);

                $targetFilename = "tag-{$tag->id}-default-card-image.webp";
                $targetPath = $targetDir . DIRECTORY_SEPARATOR . $targetFilename;

                try {
                    $this->imageService->processImage($oldPath, $targetPath);

                    $tag->walsgit_discussion_cards_tag_default_image = 'tags/' . $targetFilename;
                    $tag->save();

                    echo $this->translator->trans('walsgit-discussion-cards.admin.console.imageMigrationServiceTagImageSuccess', ['oldfilename' => $oldTagFilename, 'tagid' => $tag->id, 'newfilepath' => $targetPath]) . "\n";
                    $migratedCount++;
                } catch (\Throwable $e) {
                    echo $this->translator->trans('walsgit-discussion-cards.admin.console.imageMigrationServiceTagImageFail', ['filename' => $oldTagFilename, 'tagid' => $tag->id]) . $e->getMessage() . "\n";
                }
            }
        }

        /*
        |--------------------------------------------------------------------------
        | 3) FINAL CLEANUP
        |--------------------------------------------------------------------------
        */
        echo $this->translator->trans('walsgit-discussion-cards.admin.console.imageMigrationServiceStep3') . "\n";

        $this->cleanupLegacyPngs($assetsDir);

        return $migratedCount;
    }

    /**
     * Delete all old non-migrated PNGs.
     */
    protected function cleanupLegacyPngs(string $assetsDir): void
    {
        $patterns = [
            $assetsDir . DIRECTORY_SEPARATOR . 'card-image-*.png',
            $assetsDir . DIRECTORY_SEPARATOR . 'tag-*-card-image-*.png',
        ];

        foreach ($patterns as $pattern) {
            foreach (glob($pattern) as $file) {
                $this->safeUnlink($file);
            }
        }
    }

    protected function safeUnlink(string $file): void
    {
        if (!is_file($file)) {
            return;
        }

        $success = @unlink($file);

        if ($success) {
            echo $this->translator->trans(
                'walsgit-discussion-cards.admin.console.imageMigrationServiceCleanupSuccess',
                ['filename' => basename($file)]
            ) . "\n";
        } else {
            $error = error_get_last();
            $msg = $error['message'] ?? $this->translator->trans('walsgit-discussion-cards.admin.console.imageMigrationServiceUnknownError');

            echo $this->translator->trans(
                'walsgit-discussion-cards.admin.console.imageMigrationServiceCleanupFail',
                ['filename' => basename($file), 'error' => $msg]
            ) . "\n";
        }
    }
}
