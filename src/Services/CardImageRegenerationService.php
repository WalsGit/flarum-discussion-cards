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

use Flarum\Discussion\Discussion;
use Walsgit\Discussion\Cards\Image\CardImageResolver;

class CardImageRegenerationService
{
    public function __construct(
        protected CardImageResolver $resolver
    ) {}

    /**
     * Resolves the discussion card image and saves it (null included) if it changed.
     * Exceptions are not caught: use tryRegenerate() where errors must never block.
     *
     * @param string|null $firstPostHtml Rendered HTML of the first post (optional)
     * @return bool true if the saved card image changed
     */
    public function regenerate(Discussion $discussion, ?string $firstPostHtml = null): bool
    {
        $imageUrl = $this->resolver->resolve($discussion, $firstPostHtml);

        if ($imageUrl === $discussion->walsgit_card_image_url) {
            return false;
        }

        $discussion->walsgit_card_image_url = $imageUrl;
        $discussion->save();

        return true;
    }

    /**
     * Same as regenerate(), but never throws (for listeners, which must not block post actions).
     */
    public function tryRegenerate(Discussion $discussion, ?string $firstPostHtml = null): bool
    {
        try {
            return $this->regenerate($discussion, $firstPostHtml);
        } catch (\Throwable $e) {
            return false;
        }
    }
}
