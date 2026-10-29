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
 * This adds a CLI command discussion-cards:repair-images to detect and repair broken card images:
 * discussions whose stored card image URL points to a file of the extension that no longer exists
 * (or to another domain / base path than the forum's current one).
 * discussion-cards:repair-images
 *      > scans the discussions and regenerates the card images of the broken ones
 * discussion-cards:repair-images --dry-run
 *      > will only scan and report, without regenerating anything
 * discussion-cards:repair-images --reset-null
 *      > after the regeneration, sets the card image URL of the discussions that are still broken back to NULL
 * Missing default images (general, tag or blog) are reported but cannot be repaired here: upload them again.
 */

namespace Walsgit\Discussion\Cards\Console;

use Flarum\Console\AbstractCommand;
use Flarum\Locale\Translator;
use Symfony\Component\Console\Helper\ProgressBar;
use Symfony\Component\Console\Input\InputOption;
use Walsgit\Discussion\Cards\Services\BrokenImagesService;
use Walsgit\Discussion\Cards\Services\RegenerateImagesService;

class RepairImagesCommand extends AbstractCommand
{
    public function __construct(
        protected BrokenImagesService $brokenImages,
        protected RegenerateImagesService $regenerator,
        protected Translator $translator
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->setName('discussion-cards:repair-images')
            ->setDescription('Detect and repair broken Discussion Cards images')
            ->addOption(
                'dry-run',
                null,
                InputOption::VALUE_NONE,
                'Only scan and report, without regenerating anything'
            )
            ->addOption(
                'reset-null',
                null,
                InputOption::VALUE_NONE,
                'Set the card image of the discussions still broken after the regeneration back to NULL'
            );
    }

    protected function fire(): int
    {
        $dryRun = (bool) $this->input->getOption('dry-run');
        $resetNull = (bool) $this->input->getOption('reset-null');

        $this->info($this->trans('Start'));

        if ($dryRun) {
            $this->output->writeln('<comment>' . $this->trans('DryRun') . '</comment>');
        }

        $scan = $this->brokenImages->scan(PHP_INT_MAX);
        $this->report($scan);

        $ids = $scan['ids'];

        if (empty($ids) && $scan['defaultMissing'] > 0) {
            $this->output->writeln('<comment>' . $this->trans('OnlyDefaults', ['count' => $scan['defaultMissing']]) . '</comment>');
        }

        if (empty($ids) || $dryRun) {
            $this->info($this->trans('End'));
            return 0;
        }

        $bar = new ProgressBar($this->output, count($ids));
        $bar->start();

        $result = $this->regenerator->processIds($ids, false, null, function (int $id, ?string $error) use ($bar) {
            if ($error !== null) {
                $this->error($this->trans('Error', ['id' => $id, 'message' => $error]));
            }

            $bar->advance();
        });

        $bar->finish();
        $this->output->writeln('');
        $this->info($this->trans('Regenerated', ['success' => $result['success'], 'errors' => $result['errors']]));

        // Scan again to know what is really fixed
        $after = $this->brokenImages->scan(PHP_INT_MAX);
        $remaining = $after['ids'];

        if (empty($remaining)) {
            // Missing default images are not repairable here: do not let "all fixed" suggest otherwise
            $this->info($after['defaultMissing'] > 0
                ? $this->trans('AllFixedDefaults', ['count' => $after['defaultMissing']])
                : $this->trans('AllFixed'));
        } elseif ($resetNull) {
            $reset = $this->brokenImages->resetToNull($remaining);
            $this->info($this->trans('Reset', ['count' => $reset]));
        } else {
            $this->output->writeln('<comment>' . $this->trans('StillBroken', ['count' => count($remaining)]) . '</comment>');
        }

        $this->info($this->trans('End'));

        return 0;
    }

    protected function report(array $scan): void
    {
        $this->info($this->trans('Report', [
            'missing' => $scan['missing'],
            'otherOrigin' => $scan['otherOrigin'],
            'defaultMissing' => $scan['defaultMissing'],
            'external' => $scan['external'],
        ]));

        foreach ($scan['defaults'] as $default) {
            $this->output->writeln('<comment>' . $this->trans('DefaultMissing', [
                'file' => $default['file'],
                'count' => $default['discussions'],
            ]) . '</comment>');
        }
    }

    protected function trans(string $key, array $params = []): string
    {
        return $this->translator->trans(
            'walsgit_discussion_cards.admin.console.repairImages' . $key,
            $params
        );
    }
}
