<?php

/*
 * This file is part of walsgit/flarum-discussion-cards
 *
 *  Copyright (c) 2026 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Walsgit\Discussion\Cards\Console;

use Flarum\Foundation\Paths;
use Symfony\Component\Console\Formatter\OutputFormatter;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Walsgit\Discussion\Cards\Services\ItemLogFormatter;
use Walsgit\Discussion\Cards\Services\LoggingService;
use Walsgit\Discussion\Cards\Services\RegenerateImagesService;

/**
 * Debug output of a Console command run :
 * - `--log`: every detail line is written to the command's log file in storage/logs/walsgit-discussion-cards/*.log;
 * - `-v`: every detail line is shown in the terminal.
 * Without any of them, nothing is logged and nothing more is shown.
 */
class RunReporter
{
    protected ?LoggingService $logger = null;
    protected bool $verbose;
    protected bool $dryRun = false;
    protected int $total = 0;
    protected int $done = 0;

    public function __construct(
        protected InputInterface $input,
        protected OutputInterface $output,
        Paths $paths,
        string $logPrefix
    ) {
        $this->verbose = $output->isVerbose();

        if ($input->hasOption('log') && $input->getOption('log')) {
            $this->logger = new LoggingService($paths, $logPrefix);
        }
    }

    public function isVerbose(): bool
    {
        return $this->verbose;
    }

    /**
     * True when the details are wanted somewhere (terminal and/or file).
     */
    public function wantsDetails(): bool
    {
        return $this->verbose || $this->logger !== null;
    }

    /**
     * Writes the first line of the log: the command that was run.
     */
    public function start(bool $dryRun = false): void
    {
        $this->dryRun = $dryRun;
        $this->logOnly('Command: php flarum ' . ($this->input instanceof \Stringable ? (string) $this->input : ''));
    }

    /**
     * Number of items the next calls to item() will cover (for the "N/NN" progress).
     */
    public function setTotal(int $total): void
    {
        $this->total = $total;
        $this->done = 0;
    }

    /**
     * One processed discussion (detail array of RegenerateImagesService::processIds()).
     */
    public function item(array $detail): void
    {
        $this->done++;

        $this->line(
            ItemLogFormatter::item($detail, $this->total > 0 ? $this->done . '/' . $this->total : null, $this->dryRun),
            ($detail['status'] ?? '') === RegenerateImagesService::STATUS_ERROR ? 'ERROR' : 'INFO'
        );
    }

    /**
     * A detail line: shown in the terminal with -v and written to the file with --log.
     */
    public function line(string $text, string $level = 'INFO'): void
    {
        $text = ($this->dryRun ? '[DRY-RUN] ' : '') . $text;

        if ($this->verbose) {
            $escaped = OutputFormatter::escape($text);
            $this->output->writeln($level === 'ERROR' ? '<error>' . $escaped . '</error>' : $escaped);
        }

        $this->logger?->log($text, $level);
    }

    /**
     * A line for the file only (summaries already shown in the terminal in the user's language).
     */
    public function logOnly(string $text, string $level = 'INFO'): void
    {
        $this->logger?->log(($this->dryRun ? '[DRY-RUN] ' : '') . $text, $level);
    }
}
