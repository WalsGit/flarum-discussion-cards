<?php

/*
 * This file is part of walsgit/flarum-discussion-cards
 *
 *  Copyright (c) 2025 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Walsgit\Discussion\Cards\Listener;

use Flarum\Post\Event\Posted;
use Walsgit\Discussion\Cards\Services\CardImageRegenerationService;

class GenerateCardImageOnDiscussionCreate
{
    public function __construct(protected CardImageRegenerationService $regenerator) {}

    public function handle(Posted $event)
    {
        $post = $event->post;

        // Only on first post of a discussion
        if ($post->number !== 1) {
            return;
        }

        $html = method_exists($post, 'formatContent')
            ? $post->formatContent()
            : null;

        $this->regenerator->tryRegenerate($post->discussion, $html);
    }
}
