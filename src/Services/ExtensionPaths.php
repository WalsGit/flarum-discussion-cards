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

/**
 * Where the extension stores its card images, and the strict names of the files it can create.
 * The stored value of a card image is a path relative to ASSETS_DIR.
 */
final class ExtensionPaths
{
    /** Assets folder of the extension, relative to the public folder (no leading or trailing slash). */
    public const ASSETS_DIR = 'assets/extensions/walsgit-discussion-cards';

    /** Image generated for a discussion: discussion-{id}-{urlHash}-{etagHash}.webp */
    public const DISCUSSION_FILE = '#^discussion-\d+-[a-f0-9]+-[a-f0-9]+\.webp$#';

    /** Default image (general, tag or blog), relative to ASSETS_DIR. */
    public const DEFAULT_FILE = '#^(?:tags/tag-\d+-)?(?:[a-z0-9-]+-)?default-card-image\.webp$#';

    /** Absolute path of the assets folder (no trailing slash). */
    public static function assetsPath(Paths $paths): string
    {
        return $paths->public . '/' . self::ASSETS_DIR;
    }
}
