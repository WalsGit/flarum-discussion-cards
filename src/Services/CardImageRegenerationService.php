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

use Flarum\Discussion\Discussion;
use Walsgit\Discussion\Cards\Image\CardImageResolver;

class CardImageRegenerationService
{
    public function __construct(
        protected CardImageResolver $resolver
    ) {}

    /**
     * Regenerates and persists the discussion card image.
     *
     * - Uses CardImageResolver to determine the image URL
     * - Persists the resolved image on the discussion
     * - Returns true if an image has been applied, false otherwise
     *
     * @param Discussion   $discussion
     * @param string|null  $firstPostHtml  Rendered HTML of the first post (optional)
     * @param bool         $force          Force regeneration even if an image already exists
     */
    public function regenerate(Discussion $discussion, ?string $firstPostHtml = null, bool $force = false): bool {
        // Do not regenerate unless forced
        if (!$force && !empty($discussion->walsgit_card_image_url)) {
            return false;
        }

        $imageUrl = $this->resolver->resolve($discussion, $firstPostHtml);

        if (!$imageUrl) {
            return false;
        }

        // Persist resolved image
        $discussion->walsgit_card_image_url = $imageUrl;
        $discussion->save();

        return true;
    }

    /**
     * Clears the current card image (used before a forced regeneration).
     */
    public function clear(Discussion $discussion): void
    {
        $discussion->walsgit_card_image_url = null;
        $discussion->save();
    }
}
