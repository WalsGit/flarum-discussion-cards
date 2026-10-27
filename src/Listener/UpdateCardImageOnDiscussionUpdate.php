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

use Flarum\Discussion\Discussion;
use Flarum\Post\Event\Revised;
use Flarum\Tags\Event\DiscussionWasTagged;
use Illuminate\Events\Dispatcher;
use Walsgit\Discussion\Cards\Services\CardImageRegenerationService;
use FoF\Blog\BlogMeta;
use FoF\Blog\Event\BlogMetaCreated;
use FoF\Blog\Event\BlogMetaUpdated;

class UpdateCardImageOnDiscussionUpdate
{
    public function __construct(protected CardImageRegenerationService $regenerator) {}

    public function subscribe(Dispatcher $events): void
    {
        $events->listen(Revised::class, [$this, 'onPostRevised']);
        $events->listen(DiscussionWasTagged::class, [$this, 'onDiscussionTagged']);
        $events->listen(BlogMetaCreated::class, [$this, 'onBlogMetaCreated']);
        $events->listen(BlogMetaUpdated::class, [$this, 'onBlogMetaUpdated']);
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

        $html = method_exists($post, 'formatContent')
            ? $post->formatContent()
            : null;

        $this->regenerator->tryRegenerate($post->discussion, $html);
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

        $this->regenerator->tryRegenerate($discussion, $html);
    }

    /**
     * 3. 3rd party Blog Extension support (fof/blog):
     * Regenerate card image when blog meta is created for an already existing discussion.
     * When an article is created, the blog meta is saved before its first post exists
     * (no first_post_id yet): the Posted listener then handles the card image.
     */
    public function onBlogMetaCreated(BlogMetaCreated $event)
    {
        $discussion = $event->blogMeta->discussion;

        if (!$discussion || !$discussion->first_post_id) {
            return;
        }

        $this->regenerateForBlogMeta($discussion, $event->blogMeta);
    }

    /**
     * 4. 3rd party Blog Extension support (fof/blog):
     * Regenerate card image when the featured image of a blog post changed.
     */
    public function onBlogMetaUpdated(BlogMetaUpdated $event)
    {
        if (!in_array('featured_image', $event->changed, true)) {
            return;
        }

        $discussion = $event->blogMeta->discussion;

        if (!$discussion) {
            return;
        }

        $this->regenerateForBlogMeta($discussion, $event->blogMeta);
    }

    protected function regenerateForBlogMeta(Discussion $discussion, BlogMeta $blogMeta): void
    {
        // The resolver reads the blog meta from the relation: use the freshly saved one.
        $discussion->setRelation('blogMeta', $blogMeta);

        $first = $discussion->firstPost;
        $html = ($first && method_exists($first, 'formatContent'))
            ? $first->formatContent()
            : null;

        $this->regenerator->tryRegenerate($discussion, $html);
    }
}
