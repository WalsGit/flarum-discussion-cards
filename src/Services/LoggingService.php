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

use Flarum\Foundation\Paths;

class LoggingService
{
    /**
     * Debug logs older than this many days are deleted (see cleanOldLogs()).
     */
    public const RETENTION_DAYS = 7;

    /**
     * Prefixes of the debug logs subject to the retention. Others (e.g. `migration`) are never deleted.
     */
    protected const CLEANED_PREFIXES = ['regenerate', 'repair', 'purge'];

    protected static bool $cleaned = false;

    protected string $logDirectory;

    public function __construct(protected Paths $paths, protected string $prefix = 'general')
    {
        // Create log directory
        $this->logDirectory = $this->paths->storage . '/logs/walsgit-discussion-cards';
        if (!is_dir($this->logDirectory)) {
            @mkdir($this->logDirectory, 0775, true);
        }
    }

    /**
     * Log a message with the specified level
     *
     * @param array $context optional key => value pairs appended to the message
     */
    public function log(string $message, string $level = 'INFO', array $context = []): void
    {
        $this->cleanOldLogs();

        $timestamp = date('Y-m-d H:i:s');
        $logMessage = "[{$timestamp}] [{$level}] {$message}" . $this->formatContext($context) . PHP_EOL;

        // Write to log file
        @file_put_contents($this->getCurrentLogFilePath(), $logMessage, FILE_APPEND | LOCK_EX);
    }

    /**
     * Log an info message
     */
    public function info(string $message, array $context = []): void
    {
        $this->log($message, 'INFO', $context);
    }

    /**
     * Log a warning message
     */
    public function warning(string $message, array $context = []): void
    {
        $this->log($message, 'WARNING', $context);
    }

    /**
     * Log an error message
     */
    public function error(string $message, array $context = []): void
    {
        $this->log($message, 'ERROR', $context);
    }

    /**
     * Log a debug message
     */
    public function debug(string $message, array $context = []): void
    {
        $this->log($message, 'DEBUG', $context);
    }

    /**
     * Get the current log file path for today
     */
    public function getCurrentLogFilePath(): string
    {
        $date = date('Y-m-d');
        return "{$this->logDirectory}/{$this->prefix}-{$date}.log";
    }

    /**
     * Deletes the debug logs older than RETENTION_DAYS, once per process, when something is about to be written
     * (no cron needed). Only files of the extension's log folder whose name is exactly
     * `<regenerate|repair|purge>-YYYY-MM-DD.log` are considered; the age comes from the date in the name.
     * Never throws.
     */
    protected function cleanOldLogs(): void
    {
        if (self::$cleaned) {
            return;
        }

        self::$cleaned = true;

        try {
            $files = @scandir($this->logDirectory);

            if ($files === false) {
                return;
            }

            $limit = date('Y-m-d', strtotime('-' . self::RETENTION_DAYS . ' days'));
            $pattern = '/^(?:' . implode('|', self::CLEANED_PREFIXES) . ')-(\d{4}-\d{2}-\d{2})\.log$/';

            foreach ($files as $file) {
                if (preg_match($pattern, $file, $matches) && $matches[1] < $limit) {
                    $path = $this->logDirectory . '/' . $file;

                    if (is_file($path) && !is_link($path)) {
                        @unlink($path);
                    }
                }
            }
        } catch (\Throwable $e) {
            // Do nothing
        }
    }

    protected function formatContext(array $context): string
    {
        if (empty($context)) {
            return '';
        }

        $parts = [];

        foreach ($context as $key => $value) {
            $parts[] = $key . '=' . (is_scalar($value) || $value === null ? var_export($value, true) : json_encode($value));
        }

        return ' ' . implode(' ', $parts);
    }
}
