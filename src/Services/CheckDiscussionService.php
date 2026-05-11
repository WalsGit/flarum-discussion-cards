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
use Walsgit\Discussion\Cards\Image\CardImageResolver;
use Walsgit\Discussion\Cards\Services\HtmlImageExtractor;
use Walsgit\Discussion\Cards\Services\ImageProcessingService;
use Walsgit\Discussion\Cards\Services\TagImageSelector;

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

        if (!$discussion) return ["Error: discussion #{$discussionId} doesn't exist!"];

        $output = [
            "Discussion id: {$discussionId} \n",
            "Title: {$discussion->title} \n",
            "Set card image in DB: {$discussion->walsgit_card_image_url} \n",
        ];

        // Get the first post's content
        $firstPostContent = "NOTICE: This discussion doesn't have a first post anymore (it must have been deleted),\nso it will be ignored and skipped during card image resolving process.";
        if ($discussion->firstPost) $firstPostContent = $discussion->firstPost->formatContent();

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

        $lines = "1. Is it a blog post: " . ($blogPostImage ? "YES" : "NO") . " \n";
        array_push($output, $lines);

        if ($blogPostImage) {
            $blogMeta = $discussion->blogMeta;

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

            // Resolver's result
            $lines = [
                "└ Resolver's picked image: {$blogPostImage} \n",
                "└ Card image filename: " . $this->cardImageName($discussionId, $blogPostImage) . " \n",
            ];
            array_push($output, $lines);
        }

        // 2. Check first post's first image
        $firstPostImage = $this->htmlImageExtractor->extract($firstPostContent);
        $lines = "2. First image in first post: " . ($firstPostImage ?: "NONE FOUND") . " \n";
        array_push($output, $lines);

        if ($firstPostImage) {
            $lines = "└ Is the image accessible: " . ($this->resolver->isImageAccessible($firstPostImage) ? "YES" : "NO") . " \n";
            array_push($output, $lines);

            // Check remote image's size
            $context = stream_context_create(
                [
                    'http' => array(
                        'method' => 'HEAD'
                    )
                ]
            );
            $headers = get_headers($firstPostImage, true, $context);
            $imageSize = $headers['Content-Length'] ?? null;
            $lines = "└ Remote image's size: " . ($imageSize ? $this->humanReadableSize($imageSize) : "N/C") . " \n";
            array_push($output, $lines);

            // Get the generated filename of the saved card image
            $filename = $this->cardImageName($discussionId, $firstPostImage);
            $lines = "└ Card image filename: {$filename} \n";
            array_push($output, $lines);
        }

        /** FALLBACKS */
        if (!$blogPostImage && !$firstPostImage) {
            // 3. Check Tag priority
            $tags = $discussion->tags()
                ->select('id', 'name', 'walsgit_discussion_cards_tag_default_image')
                ->get();
            $tagImage = $this->tagSelector->selectTagImage($tags);
            $tagName = null;
            foreach ($tags as $tag) {

                if ($tag->walsgit_discussion_cards_tag_default_image == $tagImage) {
                    $tagName = $tag->name;
                    break;
                }
            }

            $lines = "3. Tag default image fallback: " . ($tagImage ? "[from: {$tagName}] {$tagImage}" : "NONE") . " \n";
            array_push($output, $lines);

            // 4. Check general default image
            if (!$tagImage) {
                $defaultImage = $this->settings->get('walsgit_discussion_cards_default_image_path');
                $lines = "4. Global default image fallback: " . ($defaultImage ?: "NONE SET, Stub will be used.") . " \n";
                array_push($output, $lines);
            }
        }

        return $output;
    }

    protected function humanReadableSize(int $sizeInBytes): string
    {
        /** Thanks to @rafaucau https://github.com/android-com-pl/flarum-db-snapshots/blob/c535786659ecd387ee6d922af368037e2ebf6e96/src/Helpers/Format.php */
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $i = $sizeInBytes ? floor(log($sizeInBytes, 1024)) : 1;

        return round($sizeInBytes / pow(1024, $i), 2) . ' ' . $units[$i];
    }

    protected function cardImageName(int $discussionId, string $imageURL): string
    {
        // Get the generated filename of the saved card image
        $baseUrl = rtrim((string) $this->config->url(), '/');
        $urlHash = substr(sha1($imageURL), 0, 10);
        $etagHash = $this->imageService->computeEtagHash($imageURL, $baseUrl);
        $filename = "discussion-{$discussionId}-{$urlHash}-{$etagHash}.webp";

        return $filename;
    }
}
