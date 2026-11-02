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
 * Builds the one-line of a processed discussion used by the debug logs
 * (Console `--log` / `-v`, and the admin "Log action details" option).
 * Never contains the discussion title (personal data); source URLs are stripped of their query string and fragment.
 */
final class ItemLogFormatter
{
    /**
     * @param array{id: int, status: string, source?: ?string, file?: ?string, sourceImage?: ?string, skipped?: array, error?: ?string} $detail
     * @param string|null $progress e.g. "12/340"
     */
    public static function item(array $detail, ?string $progress = null, bool $dryRun = false): string
    {
        $line = '#' . $detail['id'] . ' ';

        if ($dryRun) {
            $line .= 'would be processed';
        } elseif (($detail['status'] ?? '') === 'error') {
            $line .= 'error: ' . ($detail['error'] ?? 'unknown error');
        } else {
            $parts = [$detail['status']];

            if (!empty($detail['source'])) {
                $parts[] = 'source=' . $detail['source'];
            }

            if (!empty($detail['file'])) {
                $parts[] = 'file=' . basename($detail['file']);
            }

            if (!empty($detail['sourceImage'])) {
                $parts[] = 'from=' . self::url($detail['sourceImage']);
            }

            if (!empty($detail['skipped'])) {
                $parts[] = 'skipped=' . implode(',', array_map(
                    fn(array $skip) => ($skip['source'] ?? '?') . ':' . ($skip['reason'] ?? '?'),
                    $detail['skipped']
                ));
            }

            $line .= implode(' ', $parts);
        }

        return $progress !== null ? $line . ' (' . $progress . ')' : $line;
    }

    /**
     * Removes the query string and the fragment (signed URLs may carry tokens).
     */
    public static function url(?string $url): string
    {
        if ($url === null || $url === '') {
            return '';
        }

        return preg_replace('/[?#].*$/s', '', $url) ?? '';
    }
}
