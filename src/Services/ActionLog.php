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

/**
 * Log of one action run from the admin page (see ActionLogger). Every line carries the action name,
 * its id (shared by all the requests of the action) and the id of the admin.
 * - info() / error(): the "Log actions" lines, in the shared admin-tools-actions file;
 * - detail() / item(): the "Log action details" lines, in the file of the tool (regenerate, repair or purge).
 */
final class ActionLog
{
    public function __construct(
        private LoggingService $logger,
        private LoggingService $detailsLogger,
        private string $action,
        private string $actionId,
        private int $userId,
        private bool $details
    ) {}

    /**
     * True when the "Log action details" option is on (one line per discussion / file).
     */
    public function wantsDetails(): bool
    {
        return $this->details;
    }

    public function info(string $message): void
    {
        $this->logger->info($this->prefix() . $message);
    }

    public function error(string $message): void
    {
        $this->logger->error($this->prefix() . $message);
    }

    /**
     * Detail line (only written with the "Log action details" option).
     */
    public function detail(string $message): void
    {
        if ($this->details) {
            $this->detailsLogger->info($this->prefix() . $message);
        }
    }

    /**
     * Detail line of a processed discussion (detail array of RegenerateImagesService::processIds()).
     */
    public function item(array $detail): void
    {
        if (!$this->details) {
            return;
        }

        $line = $this->prefix() . ItemLogFormatter::item($detail);

        ($detail['status'] ?? '') === RegenerateImagesService::STATUS_ERROR ? $this->detailsLogger->error($line) : $this->detailsLogger->info($line);
    }

    private function prefix(): string
    {
        return "[admin] {$this->action} id={$this->actionId} user={$this->userId} ";
    }
}
