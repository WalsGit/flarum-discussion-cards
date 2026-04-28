<?php

/*
 * This file is part of walsgit/discussion-cards
 *
 *  Copyright (c) 2025 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Walsgit\Discussion\Cards\Listener;

use Flarum\Post\Event\Posted;
use Walsgit\Discussion\Cards\Image\CardImageResolver;

class GenerateCardImageOnDiscussionCreate
{
    public function __construct(protected CardImageResolver $resolver)
    {
    }

    public function handle(Posted $event)
    {
        $post = $event->post;

        // Only on first post of a discussion
        if ($post->number !== 1) {
            return;
        }

        $discussion = $post->discussion;

        // Get the formatted HTML content
        if (method_exists($post, 'formatContent')) {
            $html = $post->formatContent();
        } else {
            $html = null;
        }

        try {
            $url = $this->resolver->resolve($discussion, $html);

            if ($url) {
                $discussion->walsgit_card_image_url = $url;
                $discussion->save();
            }

        } catch (\Throwable $e) {
            // Don't block post creation
        }
    }
}
