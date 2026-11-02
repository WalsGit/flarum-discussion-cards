<?php

/*
 * This file is part of walsgit/flarum-discussion-cards
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Walsgit\Discussion\Cards\Listener;

use Flarum\Discussion\Discussion;
use Flarum\Discussion\Event\Deleting;
use Flarum\Post\Event\Deleting as PostDeleting;
use Flarum\Foundation\Paths;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Str;
use Walsgit\Discussion\Cards\Services\CardImageRegenerationService;

class DeleteCardImageOnDiscussionDelete
{
    public function __construct(protected Paths $paths, protected CardImageRegenerationService $regenerator) {}

    public function subscribe(Dispatcher $events): void
    {
        $events->listen(Deleting::class, [$this, 'onDiscussionDeleting']);
        $events->listen(PostDeleting::class, [$this, 'onFirstPostDeleting']);
    }

    /**
     * 1. Delete the card image file when a discussion is deleted.
     */
    public function onDiscussionDeleting(Deleting $event)
    {
        $this->deleteImageFile($event->discussion);
    }

    /**
     * 2. When the first post is deleted: delete the card image file (if it was generated from that post)
     * and regenerate the card image from the fallbacks (tag default image, then general default image).
     */
    public function onFirstPostDeleting(PostDeleting $event)
    {
        $post = $event->post;

        // Only the first post provides the card image
        if ((int) $post->number !== 1) {
            return;
        }

        $discussion = $post->discussion;
        $imageUrl = $discussion?->walsgit_card_image_url;

        // No image, or one of the default images (shared files, never deleted here): nothing to do
        if (!$imageUrl || Str::endsWith($imageUrl, 'default-card-image.webp')) {
            return;
        }

        $this->deleteImageFile($discussion);
        // Non empty string: makes the resolver skip the first post lookup (see resolveFirstPostImage())
        $this->regenerator->tryRegenerate($discussion, 'deleted post');
    }

    /**
     * Delete the discussion's own card image file.
     * The stored value is the file path relative to the extension's assets folder: only a name matching
     * discussion-{id}-{hash}-{hash}.webp can be deleted (an external URL or a default image never matches).
     */
    protected function deleteImageFile(Discussion $discussion): void
    {
        $filename = (string) $discussion->walsgit_card_image_url;

        if (!preg_match('/^discussion-' . (int) $discussion->id . '-[a-f0-9]{10}-[a-f0-9]{10}\.webp$/', $filename)) {
            return;
        }

        $path = $this->paths->public . '/assets/extensions/walsgit-discussion-cards/' . $filename;

        if (is_file($path)) {
            @unlink($path);
        }
    }
}
