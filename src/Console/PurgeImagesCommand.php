<?php

/*
 * This file is part of walsgit/discussion-cards
 *
 *  Copyright (c) 2026 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

    /**
     * This adds a CLI command discussion-cards:purge-images to delete non-used (orphan) card images or delete all of them.
     * Note that default images (general, tag) will never be deleted by these commands
     * discussion-cards:purge-images 
     *      > will delete permanently all discussion card images not in use (not in db)
     * discussion-cards:purge-images -a | --all 
     *      > will delete ALL discussion card images (excluding default images)
     * discussion-cards:purge-images -d | --discussion [discussion.id] 
     *      > will delete the card images of specific discussion ids (comma separated, excluding default images)
     * discussion-cards:purge-images --dry-run
     *      > will simulate without deleting anything
     */

namespace Walsgit\Discussion\Cards\Console;

use Flarum\Console\AbstractCommand;
use Flarum\Foundation\Paths;
use Flarum\Locale\Translator;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Support\Str;
use Symfony\Component\Console\Input\InputOption;

class PurgeImagesCommand extends AbstractCommand
{
    protected Paths $paths;
    protected ConnectionInterface $db;
    protected Translator $translator;

    protected bool $dryRun = false;

    protected int $deletedFiles = 0;
    protected int $skippedFiles = 0;
    protected int $updatedDiscussions = 0;

    protected $lockHandle = null;
    protected int $lockTimeout = 30;

    public function __construct(
        Paths $paths,
        ConnectionInterface $db,
        Translator $translator
    ) {
        parent::__construct();

        $this->paths = $paths;
        $this->db = $db;
        $this->translator = $translator;
    }

    protected function configure(): void
    {
        $this
            ->setName('discussion-cards:purge-images')
            ->setDescription('Purge Discussion Cards images')
            ->addOption(
                'all',
                'a',
                InputOption::VALUE_NONE,
                'Delete all discussion-* images'
            )
            ->addOption(
                'discussion',
                'd',
                InputOption::VALUE_REQUIRED,
                'Delete card images of specific discussion IDs (comma separated)'
            )
            ->addOption(
                'dry-run',
                null,
                InputOption::VALUE_NONE,
                'Simulate without deleting anything'
            );
    }

    protected function fire(): int
    {
        $all = (bool) $this->input->getOption('all');
        $this->dryRun = (bool) $this->input->getOption('dry-run');
        $discussionOption = $this->input->getOption('discussion');

        if ($all && is_string($discussionOption)) {
            return $this->invalid();
        }

        if (is_string($discussionOption)) {
            $discussionOption = trim($discussionOption);

            if ($discussionOption === '' || !preg_match('/^\d+(,\d+)*$/', $discussionOption)) {
                return $this->invalid();
            }
        }

        if (!$this->acquireLock()) {
            $this->error($this->trans('purgeImagesAlreadyRunning'));
            return 1;
        }

        try {
            $directory = '/assets/extensions/walsgit-discussion-cards';
            $imagesPath = $this->paths->public . $directory;

            if (!is_dir($imagesPath)) {
                $this->error(
                    $this->trans('purgeImagesDirectoryNotFound', ['directory' => $directory])
                );
                return 1;
            }

            $this->info($this->trans('purgeImagesStart'));

            if ($this->dryRun) {
                $this->output->writeln(
                    '<comment>' . $this->trans('purgeImagesDryRun') . '</comment>'
                );
            }

            if ($all) {
                $this->purgeAllDiscussionImages($imagesPath);
            } elseif (is_string($discussionOption)) {
                foreach (array_map('intval', explode(',', $discussionOption)) as $id) {
                    $this->purgeDiscussionImages($imagesPath, $id);
                }
            } else {
                $this->purgeOrphanImages($imagesPath);
            }

            $this->printSummary();
            $this->info($this->trans('purgeImagesEnd'));

            return 0;
        } finally {
            $this->releaseLock();
        }
    }

    /* ============================================================= */

    protected function acquireLock(): bool
    {
        $lockDir = $this->paths->storage . '/locks';

        if (!is_dir($lockDir)) {
            mkdir($lockDir, 0755, true);
        }

        $lockFile = $lockDir . '/discussion-cards-purge-images.lock';
        $this->lockHandle = fopen($lockFile, 'c');

        if ($this->lockHandle === false) {
            return false;
        }

        $start = time();

        while (!flock($this->lockHandle, LOCK_EX | LOCK_NB)) {
            if ((time() - $start) >= $this->lockTimeout) {
                return false;
            }
            usleep(250000);
        }

        $this->logVerbose('purgeImagesLockAcquired');

        return true;
    }

    protected function releaseLock(): void
    {
        if ($this->lockHandle) {
            flock($this->lockHandle, LOCK_UN);
            fclose($this->lockHandle);
            $this->lockHandle = null;

            $this->logVerbose('purgeImagesLockReleased');
        }
    }

    protected function purgeOrphanImages(string $path): void
    {
        $this->info($this->trans('purgeImagesScan'));

        $used = $this->db->table('discussions')
            ->whereNotNull('walsgit_card_image_url')
            ->pluck('walsgit_card_image_url')
            ->map(fn ($url) => basename($url))
            ->flip()
            ->all();

        foreach (scandir($path) as $file) {
            if ($this->isDeletableDiscussionImage($file)) {
                if (!isset($used[$file])) {
                    $this->deleteFile($path, $file);
                } else {
                    $this->skippedFiles++;
                    $this->logVerbose('purgeImagesFileSkipped', ['file' => $file]);
                }
            }
        }
    }

    protected function purgeAllDiscussionImages(string $path): void
    {
        foreach (scandir($path) as $file) {
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

    protected function purgeDiscussionImages(string $path, int $discussionId): void
    {
        foreach (scandir($path) as $file) {
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
        $this->output->writeln(
            $this->trans('purgeImagesDelete', ['file' => $file])
        );

        if (!$this->dryRun) {
            unlink($path . '/' . $file);
        }

        $this->deletedFiles++;
    }

    protected function isDeletableDiscussionImage(string $file): bool
    {
        return
            Str::startsWith($file, 'discussion-') &&
            Str::endsWith($file, '.webp') &&
            !Str::contains($file, 'default-card-image');
    }

    protected function printSummary(): void
    {
        $this->info($this->trans('purgeImagesSummary', [
            'deleted' => $this->deletedFiles,
            'skipped' => $this->skippedFiles,
            'updated' => $this->updatedDiscussions,
        ]));
    }

    protected function invalid(): int
    {
        $this->error($this->trans('purgeImagesInvalidArguments'));
        return 1;
    }

    protected function logVerbose(string $key, array $params = []): void
    {
        if ($this->output->isVerbose()) {
            $this->output->writeln(
                '<comment>' . $this->trans($key, $params) . '</comment>'
            );
        }
    }

    protected function trans(string $key, array $params = []): string
    {
        return $this->translator->trans(
            'walsgit_discussion_cards.admin.console.' . $key,
            $params
        );
    }
}

