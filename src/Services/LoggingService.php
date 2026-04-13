<?php

/*
 * This file is part of walsgit/discussion-cards
 *
 *  Copyright (c) 2026 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Walsgit\Discussion\Cards\Services;

use Flarum\Foundation\Paths;

class LoggingService
{
    protected Paths $paths;
    protected string $logDirectory;
    protected string $prefix;

    public function __construct(Paths $paths, string $prefix = 'general')
    {
        $this->paths = $paths;
        $this->prefix = $prefix;

        // Create log directory
        $this->logDirectory = $this->paths->base . '/storage/logs/walsgit-discussion-cards';
        if (!is_dir($this->logDirectory)) {
            @mkdir($this->logDirectory, 0775, true);
        }
    }

    /**
     * Log a message with the specified level
     */
    public function log(string $message, string $level = 'INFO'): void
    {
        $timestamp = date('Y-m-d H:i:s');
        $logMessage = "[{$timestamp}] [{$level}] {$message}" . PHP_EOL;

        // Daily log file naming
        $date = date('Y-m-d');
        $logFile = "{$this->logDirectory}/{$this->prefix}-{$date}.log";

        // Write to log file
        file_put_contents($logFile, $logMessage, FILE_APPEND | LOCK_EX);
    }

    /**
     * Log an info message
     */
    public function info(string $message): void
    {
        $this->log($message, 'INFO');
    }

    /**
     * Log a warning message
     */
    public function warning(string $message): void
    {
        $this->log($message, 'WARNING');
    }

    /**
     * Log an error message
     */
    public function error(string $message): void
    {
        $this->log($message, 'ERROR');
    }

    /**
     * Log a debug message
     */
    public function debug(string $message): void
    {
        $this->log($message, 'DEBUG');
    }

    /**
     * Get the current log file path for today
     */
    public function getCurrentLogFilePath(): string
    {
        $date = date('Y-m-d');
        return "{$this->logDirectory}/{$this->prefix}-{$date}.log";
    }
}