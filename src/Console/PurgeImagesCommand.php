<?php

/*
 * This file is part of walsgit/flarum-discussion-cards
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
use Flarum\Locale\Translator;
use Symfony\Component\Console\Input\InputOption;
use Walsgit\Discussion\Cards\Services\PurgeImagesException;
use Walsgit\Discussion\Cards\Services\PurgeImagesService;

class PurgeImagesCommand extends AbstractCommand
{
    public function __construct(
        protected PurgeImagesService $purger,
        protected Translator $translator
    ) {
        parent::__construct();
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
        $dryRun = (bool) $this->input->getOption('dry-run');
        $discussionOption = $this->input->getOption('discussion');
        $discussionIds = [];

        if ($all && is_string($discussionOption)) {
            return $this->invalid();
        }

        if (is_string($discussionOption)) {
            $discussionOption = trim($discussionOption);

            if ($discussionOption === '' || !preg_match('/^\d+(,\d+)*$/', $discussionOption)) {
                return $this->invalid();
            }

            $discussionIds = array_map('intval', explode(',', $discussionOption));
        }

        $this->info($this->trans('purgeImagesStart'));

        if ($dryRun) {
            $this->output->writeln('<comment>' . $this->trans('purgeImagesDryRun') . '</comment>');
        }

        if (!$all && empty($discussionIds)) {
            $this->info($this->trans('purgeImagesScan'));
        }

        try {
            $result = $this->purger->purge($all, $discussionIds, $dryRun);
        } catch (PurgeImagesException $e) {
            $this->error($this->trans($e->getMessage(), $e->params));
            return 1;
        }

        foreach ($result['deletedFiles'] as $file) {
            $this->output->writeln($this->trans('purgeImagesDelete', ['file' => $file]));
        }

        if ($this->output->isVerbose()) {
            foreach ($result['skippedFiles'] as $file) {
                $this->output->writeln(
                    '<comment>' . $this->trans('purgeImagesFileSkipped', ['file' => $file]) . '</comment>'
                );
            }
        }

        $this->info($this->trans('purgeImagesSummary', [
            'deleted' => $result['deleted'],
            'skipped' => $result['skipped'],
            'updated' => $result['updated'],
        ]));
        $this->info($this->trans('purgeImagesEnd'));

        return 0;
    }

    protected function invalid(): int
    {
        $this->error($this->trans('purgeImagesInvalidArguments'));
        return 1;
    }

    protected function trans(string $key, array $params = []): string
    {
        return $this->translator->trans(
            'walsgit_discussion_cards.admin.console.' . $key,
            $params
        );
    }
}
