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
 * discussion-cards:repair-images --log
 *      > will log details to storage/logs/walsgit-discussion-cards/repair-YYYY-MM-DD.log (and delete any log files older than 7 days)
 * Missing default images (general, tag or blog) are reported but cannot be repaired here: upload them again.
 */

namespace Walsgit\Discussion\Cards\Console;

use Flarum\Console\AbstractCommand;
use Flarum\Foundation\Paths;
use Flarum\Locale\Translator;
use Symfony\Component\Console\Helper\ProgressBar;
use Symfony\Component\Console\Input\InputOption;
use Walsgit\Discussion\Cards\Services\BrokenImagesService;
use Walsgit\Discussion\Cards\Services\RegenerateImagesService;

class RepairImagesCommand extends AbstractCommand
{
    protected RunReporter $reporter;

    public function __construct(
        protected BrokenImagesService $brokenImages,
        protected RegenerateImagesService $regenerator,
        protected Translator $translator,
        protected Paths $paths
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
            )
            ->addOption(
                'log',
                null,
                InputOption::VALUE_NONE,
                'Write the command and the detail of each discussion to the log file (storage/logs/walsgit-discussion-cards/repair-YYYY-MM-DD.log). Use -v to also show the details in the terminal'
            );
    }

    protected function fire(): int
    {
        $dryRun = (bool) $this->input->getOption('dry-run');
        $resetNull = (bool) $this->input->getOption('reset-null');

        $this->reporter = new RunReporter($this->input, $this->output, $this->paths, 'repair');
        $this->reporter->start($dryRun);

        $this->info($this->trans('Start'));

        if ($dryRun) {
            $this->output->writeln('<comment>' . $this->trans('DryRun') . '</comment>');
        }

        $scan = $this->brokenImages->scan(PHP_INT_MAX);
        $this->report($scan);

        $ids = $scan['ids'];

        if ($this->reporter->wantsDetails() && !empty($ids)) {
            $this->reporter->line('Broken discussions to repair: ' . count($ids));

            foreach (array_chunk($ids, 50) as $chunk) {
                $this->reporter->line('ids: ' . implode(',', $chunk));
            }
        }

        if (empty($ids) && $scan['defaultMissing'] > 0) {
            $this->output->writeln('<comment>' . $this->trans('OnlyDefaults', ['count' => $scan['defaultMissing']]) . '</comment>');
        }

        if (empty($ids) || $dryRun) {
            $this->reporter->logOnly(empty($ids) ? 'Nothing to repair' : 'Dry run: nothing regenerated');
            $this->info($this->trans('End'));
            return 0;
        }

        $this->reporter->setTotal(count($ids));

        // With -v the details are listed line by line (with their own N/NN), so no progress bar
        $bar = null;

        if (!$this->reporter->isVerbose()) {
            $bar = new ProgressBar($this->output, count($ids));
            $bar->start();
        }

        $result = $this->regenerator->processIds($ids, false, null, function (int $id, ?string $error, array $detail = []) use ($bar) {
            if ($this->reporter->wantsDetails() && !empty($detail)) {
                $this->reporter->item($detail);
            }

            // With -v the detail line already shows the error
            if ($error !== null && !$this->reporter->isVerbose()) {
                $this->error($this->trans('Error', ['id' => $id, 'message' => $error]));
            }

            $bar?->advance();
        });

        if ($bar !== null) {
            $bar->finish();
            $this->output->writeln('');
        }

        $this->info($this->trans('Regenerated', ['success' => $result['success'], 'errors' => $result['errors']]));
        $this->reporter->logOnly(sprintf(
            'Regeneration: success=%d regenerated=%d unchanged=%d noImage=%d errors=%d',
            $result['success'],
            $result['regenerated'],
            $result['unchanged'],
            $result['noImage'],
            $result['errors']
        ));

        // Scan again to know what is really fixed
        $after = $this->brokenImages->scan(PHP_INT_MAX);
        $remaining = $after['ids'];

        if (empty($remaining)) {
            // Missing default images are not repairable here: do not let "all fixed" suggest otherwise
            $this->reporter->logOnly('Rescan: no repairable broken image left');
            $this->info($after['defaultMissing'] > 0
                ? $this->trans('AllFixedDefaults', ['count' => $after['defaultMissing']])
                : $this->trans('AllFixed'));
        } elseif ($resetNull) {
            $reset = $this->brokenImages->resetToNull($remaining);
            $this->reporter->logOnly('Rescan: still broken=' . count($remaining) . ", set back to NULL={$reset}");
            $this->info($this->trans('Reset', ['count' => $reset]));
        } else {
            $this->reporter->logOnly('Rescan: still broken=' . count($remaining));
            $this->output->writeln('<comment>' . $this->trans('StillBroken', ['count' => count($remaining)]) . '</comment>');
        }

        $this->info($this->trans('End'));

        return 0;
    }

    protected function report(array $scan): void
    {
        $this->reporter->logOnly(sprintf(
            'Scan: missing=%d otherOrigin=%d defaultMissing=%d external=%d',
            $scan['missing'],
            $scan['otherOrigin'],
            $scan['defaultMissing'],
            $scan['external']
        ));

        foreach ($scan['defaults'] as $default) {
            $this->reporter->logOnly("Default image missing: {$default['file']} (discussions: {$default['discussions']})", 'WARNING');
        }

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
