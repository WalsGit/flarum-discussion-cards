<?php

/*
 * This file is part of walsgit/flarum-discussion-cards
 *
 *  Copyright (c) 2026 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Walsgit\Discussion\Cards\Image;

/**
 * What CardImageResolver decided for a discussion, and why.
 */
final class CardImageDecision
{
    public const SOURCE_BLOG = 'blog';
    public const SOURCE_FIRST_POST = 'first_post';
    public const SOURCE_TAG = 'tag';
    public const SOURCE_GLOBAL = 'global';
    public const SOURCE_NONE = 'none';

    // Why a source was skipped
    public const SKIP_NO_IMAGE = 'no_image';
    public const SKIP_NOT_ACCESSIBLE = 'not_accessible';
    public const SKIP_OPTIMIZATION_FAILED = 'optimization_failed';

    // How the chosen image was obtained
    public const REASON_OPTIMIZED = 'optimized';            // discussion-*.webp generated (or already there)
    public const REASON_BLOG_DEFAULT = 'blog_default';      // blog-default-card-image.webp
    public const REASON_EXTENSION_DEFAULT = 'default_image'; // extension default image reused as is
    public const REASON_TAG = 'tag_default';
    public const REASON_GLOBAL = 'global_default';
    public const REASON_NONE = 'no_image';

    /**
     * @param string|null $url         final absolute URL (what resolve() returns), null if none
     * @param string|null $file        path of the chosen file inside the extension's assets folder, null if none
     * @param string|null $sourceImage source image URL the card image was built from (blog / first post only)
     * @param array       $skipped     sources tried before, as [['source' => ..., 'reason' => ..., 'image' => ...], ...]
     */
    public function __construct(
        public readonly ?string $url,
        public readonly string $source,
        public readonly string $reason,
        public readonly ?string $file = null,
        public readonly ?string $sourceImage = null,
        public readonly array $skipped = [],
    ) {}
}
