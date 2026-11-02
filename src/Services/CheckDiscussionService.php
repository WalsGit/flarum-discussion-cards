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
use Flarum\Foundation\Config;
use Flarum\Foundation\Paths;
use Flarum\Settings\SettingsRepositoryInterface;
use Walsgit\Discussion\Cards\Image\CardImageDecision;
use Walsgit\Discussion\Cards\Image\CardImageResolver;

class CheckDiscussionService
{
    public function __construct(
        protected Paths $paths,
        protected CardImageResolver $resolver,
        protected HtmlImageExtractor $htmlImageExtractor,
        protected SettingsRepositoryInterface $settings,
        protected Config $config,
        protected ImageProcessingService $imageService,
        protected TagImageSelector $tagSelector,
        protected RemoteImageFetcher $fetcher,
        protected CardImageUrlBuilder $urlBuilder,
    ) {
        $this->resolver = $resolver;
        $this->htmlImageExtractor = $htmlImageExtractor;
        $this->settings = $settings;
        $this->config = $config;
        $this->imageService = $imageService;
        $this->tagSelector = $tagSelector;
    }

    public function getDiscussionInfo(int $discussionId): array
    {
        $discussion = Discussion::with('firstPost')->find($discussionId);

        if (!$discussion) {
            return ["Error: discussion #{$discussionId} doesn't exist!"];
        }

        $output = [
            "Discussion id: {$discussionId} \n",
            "Title: {$discussion->title} \n",
            "Set card image in DB: {$discussion->walsgit_card_image_url} \n",
        ];

        // Get the first post's content
        $firstPostContent = "NOTICE: This discussion doesn't have a first post anymore (it must have been deleted),\nso it will be ignored and skipped during card image resolving process.";
        if ($discussion->firstPost) {
            $firstPostContent = $discussion->firstPost->formatContent();
        }

        $lines = [
            "================ First post's formatted content ================ \n",
            "{$firstPostContent} \n",
            "================================================================ \n",
            "\n",
            "***** Card image resolving process data ***** \n",
        ];

        array_push($output, $lines);

        /* *******************
         *  Resolver's process
         * ********************/

        /**1. Check if blog post */
        $blogPostImage = $this->resolver->resolveBlogImage($discussion);
        $blogMeta = $discussion->isRelation('blogMeta') ? $discussion->blogMeta : null;

        if ($blogMeta) {
            $lines = "1. Is it a blog post: YES (blog extension article)" . ($blogPostImage ? "" : ", but no blog image to use (option disabled or no image found)") . " \n";
        } elseif ($discussion->isRelation('blogMeta') && $this->hasBlogTag($discussion)) {
            $lines = "1. Is it a blog post: NO (regular discussion with a blog tag, it has no blog meta: usual resolving) \n";
        } else {
            $lines = "1. Is it a blog post: NO \n";
        }
        array_push($output, $lines);

        if ($blogMeta && $blogPostImage) {

            // Feature image
            $featuredImage = $blogMeta->getAttribute('featured_image');
            $lines = "└ Blog post's feature image: {$featuredImage} \n";
            array_push($output, $lines);

            // First post image
            $lines = "└ Blog post's first image in first post: SEE BELOW (2.) \n";
            array_push($output, $lines);

            // Blog default image
            $blogDefault = $this->settings->get('blog_default_image_path');
            $lines = "└ Blog's default image: {$blogDefault} \n";
            array_push($output, $lines);

            $lines = "└ Blog's candidate image: {$blogPostImage} \n";
            array_push($output, $lines);
        }

        // 2. Check first post's first image
        $firstPostImage = $this->htmlImageExtractor->extract($firstPostContent);
        $lines = "2. First image in first post: " . ($firstPostImage ?: "NONE FOUND") . " \n";
        array_push($output, $lines);

        if ($firstPostImage) {
            $lines = "└ Is the image accessible: " . ($this->resolver->isImageAccessible($firstPostImage) ? "YES" : "NO") . " \n";
            array_push($output, $lines);

            // Check image's size (local file, or remote headers)
            if ($this->imageService->isLocalUrl($firstPostImage)) {
                $localPath = $this->imageService->resolveLocalPath($firstPostImage);
                $imageSize = $localPath !== null ? @filesize($localPath) : null;
            } else {
                $imageSize = $this->fetcher->probe($firstPostImage)['content_length'] ?? null;
            }
            $lines = "└ Image's size: " . ($imageSize ? $this->humanReadableSize($imageSize) : "N/C") . " \n";
            array_push($output, $lines);
        }

        /** FINAL DECISION (same code path as the real card image generation) */
        $decision = $this->resolver->resolveWithDecision($discussion);

        array_push($output, "3. Resolver's decision (note: this check may generate the card image file) \n");

        foreach ($decision->skipped as $skipped) {
            $image = $skipped['image'] ? " ({$skipped['image']})" : "";
            array_push($output, "└ Skipped {$skipped['source']}: {$skipped['reason']}{$image} \n");
        }

        $sourceDetails = "";
        if ($decision->source === CardImageDecision::SOURCE_TAG) {
            $tags = $discussion->tags()
                ->select('id', 'name', 'walsgit_discussion_cards_tag_default_image')
                ->get();
            $tag = $tags->first(fn($t) => $decision->file === 'tags/' . basename((string) $t->walsgit_discussion_cards_tag_default_image));
            $sourceDetails = $tag ? " [from tag: {$tag->name}]" : "";
        }

        array_push($output, "└ Source picked: {$decision->source}{$sourceDetails} ({$decision->reason}) \n");

        if ($decision->sourceImage) {
            array_push($output, "└ Source image: {$decision->sourceImage} \n");
        }

        if ($decision->file === null) {
            array_push($output, "└ Card image: NONE (no global default image set, the stub will be used) \n");
        } else {
            array_push($output, "└ Card image URL: {$this->urlBuilder->build($decision->file)} \n");
            array_push($output, "└ Card image file: {$decision->file} \n");
        }

        return $output;
    }

    /**
     * Debug only: does the discussion carry one of the tags set as blog tags in the blog extension settings?
     */
    protected function hasBlogTag(Discussion $discussion): bool
    {
        $blogTags = array_filter(explode('|', (string) $this->settings->get('blog_tags', '')), 'is_numeric');

        if (empty($blogTags) || !$discussion->isRelation('tags')) {
            return false;
        }

        return $discussion->tags->whereIn('id', $blogTags)->isNotEmpty();
    }

    protected function humanReadableSize(int $sizeInBytes): string
    {
        /** Thanks to @rafaucau https://github.com/android-com-pl/flarum-db-snapshots/blob/c535786659ecd387ee6d922af368037e2ebf6e96/src/Helpers/Format.php */
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $i = $sizeInBytes ? floor(log($sizeInBytes, 1024)) : 1;

        return round($sizeInBytes / pow(1024, $i), 2) . ' ' . $units[$i];
    }
}
