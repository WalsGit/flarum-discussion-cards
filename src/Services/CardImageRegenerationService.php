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
use Walsgit\Discussion\Cards\Image\CardImageDecision;
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
     * @param bool        $interactive   true when a user is waiting for the response (short network timeouts)
     * @return bool true if the saved card image changed
     */
    public function regenerate(Discussion $discussion, ?string $firstPostHtml = null, bool $interactive = false): bool
    {
        return $this->regenerateWithDecision($discussion, $firstPostHtml, $interactive)['changed'];
    }

    /**
     * Same as regenerate(), but also returns what the resolver decided (for the debug logs).
     *
     * @return array{changed: bool, decision: CardImageDecision}
     */
    public function regenerateWithDecision(Discussion $discussion, ?string $firstPostHtml = null, bool $interactive = false): array
    {
        $decision = $this->resolver->resolveWithDecision($discussion, $firstPostHtml, $interactive);

        if ($decision->file === $discussion->walsgit_card_image_url) {
            return ['changed' => false, 'decision' => $decision];
        }

        $discussion->walsgit_card_image_url = $decision->file;
        $discussion->save();

        return ['changed' => true, 'decision' => $decision];
    }

    /**
     * Same as regenerate(), but never throws and uses short network timeouts
     * (for listeners: they run while a user waits and must not block post actions).
     */
    public function tryRegenerate(Discussion $discussion, ?string $firstPostHtml = null): bool
    {
        try {
            return $this->regenerate($discussion, $firstPostHtml, true);
        } catch (\Throwable $e) {
            return false;
        }
    }
}
