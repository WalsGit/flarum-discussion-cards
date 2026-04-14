<?php

/*
 * This file is part of walsgit/discussion-cards
 *
 *  Copyright (c) 2025 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Walsgit\Discussion\Cards\Listeners;

use Flarum\Post\Event\Revised;
use Flarum\Tags\Event\DiscussionWasTagged;
use Walsgit\Discussion\Cards\Image\CardImageResolver;

class UpdateCardImageOnDiscussionUpdate
{
    public function __construct(protected CardImageResolver $resolver)
    {
    }

    /**
     * 1. Regenerate card image When a discussion (first post) is edited/modified
     */
    public function onPostRevised(Revised $event)
    {
        $post = $event->post;

        if ($post->number !== 1) {
            return;
        }

        $discussion = $post->discussion;

        $html = method_exists($post, 'formatContent')
            ? $post->formatContent()
            : null;

        $this->regenerateCardImage($discussion, $html);
    }

    /**
     * 2. Regenerate card image when discussion tags are edited/modified
     */
    public function onDiscussionTagged(DiscussionWasTagged $event)
    {
        $discussion = $event->discussion;

        $first = $discussion->firstPost;
        $html = ($first && method_exists($first, 'formatContent'))
            ? $first->formatContent()
            : null;

        $this->regenerateCardImage($discussion, $html);
    }

    /**
     * 3. 3rd party Blog Extension support:
     * Regenerate card image when a blog post is edited/modified (mainly for featured image changes)
    */
    public function onBlogMetaSaving($event)
    {
        if (!isset($event->blogMeta) || !is_object($event->blogMeta)) {
            return;
        }

        // Get the discussion ID
        $discussion = $event->blogMeta->discussion
            ?? \Flarum\Discussion\Discussion::find($event->blogMeta->discussion_id);

        if (!$discussion) {
            return;
        }

        // Check if the featured image changed
        $newFeatured = $event->data['attributes']['featuredImage'] ?? null;
        if ($newFeatured !== null) {
            $discussion->setRelation('blogMeta', $event->blogMeta);
        }

        $first = $discussion->firstPost;
        $html = ($first && method_exists($first, 'formatContent'))
            ? $first->formatContent()
            : null;

        $this->regenerateCardImage($discussion, $html);
    }

    /**
     * Regenerate card images
     */
    protected function regenerateCardImage($discussion, ?string $html)
    {
        try {
            $url = $this->resolver->resolve($discussion, $html);
            if ($url && $url !== $discussion->walsgit_card_image_url) {
                $discussion->walsgit_card_image_url = $url;
                $discussion->save();
            }
        } catch (\Throwable $e) {
            // Don't block post edition
        }
    }
}
