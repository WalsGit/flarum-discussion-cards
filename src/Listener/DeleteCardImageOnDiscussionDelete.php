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
use Flarum\Discussion\Event\Deleting;
use Flarum\Post\Event\Deleting as PostDeleting;
use Flarum\Foundation\Config;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Str;
use Flarum\Foundation\Paths;
use Walsgit\Discussion\Cards\Image\CardImageResolver;

class DeleteCardImageOnDiscussionDelete
{
    public function __construct(protected Config $config, protected Paths $paths, protected CardImageResolver $resolver) {}

    public function subscribe(Dispatcher $events): void
    {
        $events->listen(Deleting::class, [$this, 'onDiscussionDeleting']);
        $events->listen(PostDeleting::class, [$this, 'onFirstPostDeleting']);
    }

    /**
     * 1. Delete card image on discussion delete (forever)
     */
    public function onDiscussionDeleting(Deleting $event)
    {
        $imageUrl = $event->discussion->walsgit_card_image_url;

        // If no image or url ends with "default-card-image.webp" do nothing (don't delete)
        if (!$imageUrl || Str::endsWith($imageUrl, 'default-card-image.webp')) {
            return;
        }

        // convert ImageURL to local path and delete
        $this->deleteImageFile($imageUrl);
    }

    /**
     * 2. Delete card image on first post delete (forever)
     * Exceptions : when uses one of default card images or when only the first post is deleted (regenerate)
     */
    public function onFirstPostDeleting(PostDeleting $event)
    {
        $post = $event->post;
        $imageUrl = $post->discussion->walsgit_card_image_url;

        // If no image OR url ends with "default-card-image.webp" -> do nothing (don't delete)
        if (!$imageUrl || str::endsWith($imageUrl, 'default-card-image.webp')) {
            return;
        }

        // Convert ImageURL to local path and delete
        $this->deleteImageFile($imageUrl);

        // If post has replies -> regenerate card
        $replies = (int) $post->discussion->comment_count ?? null;
        if ($replies && $replies >= 1) {
            $discussion = $post->discussion;
            $html = 'deleted post'; // Set to a non empty string to trigger "update" regeneration in resolveFirstPostImage()
            $this->regenerateCardImage($discussion, $html);
            return;
        }
    }

    /**
     * Regenerate card images
     * (Duplicated from UpdateCardImageOnDiscussionUpdate.php)
     */
    protected function regenerateCardImage(Discussion $discussion, ?string $html)
    {
        try {
            $url = $this->resolver->resolve($discussion, $html);
            if ($url && $url !== $discussion->walsgit_card_image_url) {
                $discussion->walsgit_card_image_url = $url;
                $discussion->save();
            }
        } catch (\Throwable $e) {
            // Don't block post deletion
        }
    }

    /**
     * Convert ImageURL to local path and delete
     */
    protected function deleteImageFile(?string $imageUrl): void
    {
        $baseUrl = (string) ($this->config->url() ?? '');
        $localPath = str_replace($baseUrl, $this->paths->public, $imageUrl);
        if (file_exists($localPath)) {
            unlink($localPath);
        }
    }
}
