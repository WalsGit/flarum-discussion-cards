<?php

/*
 * This file is part of walsgit/discussion-cards
 *
 *  Copyright (c) 2026 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Walsgit\Discussion\Cards\Listeners;

use Flarum\Post\Event\Deleting;
use Walsgit\Discussion\Cards\Image\CardImageResolver;

class UpdateCardImageOnFirstPostDelete
{
    public function __construct(protected CardImageResolver $resolver)
    {
    }

    public function handle(Deleting $event)
    {
        $post = $event->post;

        // Only on first post of a discussion
        if ($post->number !== 1) {
            return;
        }

        $discussion = $post->discussion;

        try {
            $url = $this->resolver->resolve($discussion, null);

            if ($url) {
                $discussion->walsgit_card_image_url = $url;
                $discussion->save();
            }

        } catch (\Throwable $e) {
            // Don't block post deletion
        }
    }
}
