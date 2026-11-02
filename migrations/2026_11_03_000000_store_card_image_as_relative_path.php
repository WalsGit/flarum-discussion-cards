<?php

/*
 * This file is part of walsgit/flarum-discussion-cards
 *
 *  Copyright (c) 2026 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

use Flarum\Foundation\Config;
use Illuminate\Database\Schema\Builder;

/*
 * discussions.walsgit_card_image_url used to hold an absolute URL. It now holds the path of the image
 * relative to the extension's assets folder (ex.: "discussion-12-abc-def.webp"), so a change of domain,
 * scheme or sub-folder no longer breaks the cards. The column itself is unchanged.
 *
 * Values that don't have standard extension file names (external URLs stored before 2.1.0 or unknown names) are left as they are.
 */

$wdcMarker = '/assets/extensions/walsgit-discussion-cards/';
$wdcDiscussionFile = '#^discussion-\d+-[a-f0-9]+-[a-f0-9]+\.webp$#';
$wdcDefaultFile = '#^(?:tags/tag-\d+-)?(?:[a-z0-9-]+-)?default-card-image\.webp$#';

/**
 * Relative path of an extension file from its absolute URL, or null if the URL is not one of them.
 */
$wdcToRelative = function (string $url) use ($wdcMarker, $wdcDiscussionFile, $wdcDefaultFile): ?string {
    $path = rawurldecode((string) parse_url($url, PHP_URL_PATH));
    $position = strpos($path, $wdcMarker);

    if ($position === false) {
        return null;
    }

    $file = substr($path, $position + strlen($wdcMarker));

    if (preg_match($wdcDiscussionFile, $file) || preg_match($wdcDefaultFile, $file)) {
        return $file;
    }

    return null;
};

return [
    'up' => function (Builder $schema) use ($wdcToRelative) {
        $db = $schema->getConnection();

        // Rows already converted are skipped, so the migration can be run again safely
        $db->table('discussions')
            ->whereNotNull('walsgit_card_image_url')
            ->select('id', 'walsgit_card_image_url')
            ->chunkById(1000, function ($rows) use ($db, $wdcToRelative) {
                foreach ($rows as $row) {
                    $value = (string) $row->walsgit_card_image_url;

                    if (!preg_match('#^https?://#i', $value)) {
                        continue;
                    }

                    $relative = $wdcToRelative($value);

                    if ($relative !== null) {
                        $db->table('discussions')->where('id', $row->id)->update(['walsgit_card_image_url' => $relative]);
                    }
                }
            });
    },

    'down' => function (Builder $schema) use ($wdcMarker) {
        $db = $schema->getConnection();
        $prefix = rtrim((string) resolve(Config::class)->url(), '/') . $wdcMarker;

        // Absolute URLs use the forum URL configured now, not the one they had before the migration
        $db->table('discussions')
            ->whereNotNull('walsgit_card_image_url')
            ->select('id', 'walsgit_card_image_url')
            ->chunkById(1000, function ($rows) use ($db, $prefix) {
                foreach ($rows as $row) {
                    $value = (string) $row->walsgit_card_image_url;

                    if ($value === '' || preg_match('#^https?://#i', $value)) {
                        continue;
                    }

                    $db->table('discussions')->where('id', $row->id)->update(['walsgit_card_image_url' => $prefix . ltrim($value, '/')]);
                }
            });
    },
];
