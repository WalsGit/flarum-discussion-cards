<?php

/*
 * This file is part of walsgit/discussion-cards
 *
 *  Copyright (c) 2025 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Walsgit\Discussion\Cards\Services;

class HtmlImageExtractor
{
    /**
     * Extracts the first image URL from a block of HTML.
     * It detects:
     *  - <img src="...">
     *  - url(...)
     *  - Imgur embeds (partial)
     *  - Dailymotion embeds
     */
    public function extract(string $html): ?string
    {
        $html = html_entity_decode($html, ENT_QUOTES | ENT_HTML5);

        $candidates = [];

        // A — <img> or url(...)
        $patternImg = '/<img(?![^>]*class=["\']emoji["\'])[^>]*?src=["\']([^"\']+)["\'][^>]*>|url\(([^)]+)\)/i';
        if (preg_match_all($patternImg, $html, $matches, PREG_OFFSET_CAPTURE)) {
            foreach ($matches as $match) {
                foreach ($match as $sub) {
                    if (is_array($sub) && !empty($sub[0]) && filter_var($sub[0], FILTER_VALIDATE_URL)) {
                        $candidates[$sub[1]] = $sub[0];
                    }
                }
            }
        }

        // B — Additional extractors (Imgur, Dailymotion…)
        // Imgur detection only works for single image (galleries & videos can't be detected with this method)
        $extractors = [
            [
                'pattern' => '/src=["\']([^"\']*imgur\.min\.html[^"\']*)["\']/i',
                'callback' => function ($match) {
                    if (preg_match('/#(?!.*\/)(.+)/', $match, $m2)) {
                        $id = $m2[1];
                        return "https://i.imgur.com/{$id}.jpg";
                    }
                    return null;
                },
            ],
            [
                'pattern' => '/<iframe[^>]+src=["\'](?:https?:)?\/\/www\.dailymotion\.com\/embed\/video\/([a-zA-Z0-9]+)["\']/i',
                'callback' => function ($match) {
                    return "https://www.dailymotion.com/thumbnail/video/{$match}";
                },
            ],
        ];

        foreach ($extractors as $ext) {
            if (preg_match($ext['pattern'], $html, $match, PREG_OFFSET_CAPTURE)) {
                $found = $match[1][0] ?? null;
                $pos = $match[1][1] ?? null;

                if ($found && $pos !== null) {
                    $thumb = $ext['callback']($found);
                    if ($thumb) {
                        $candidates[$pos] = $thumb;
                    }
                }
            }
        }

        // Return first candidate by HTML position
        if (!empty($candidates)) {
            ksort($candidates, SORT_NUMERIC);
            return reset($candidates);
        }

        return null;
    }
}
