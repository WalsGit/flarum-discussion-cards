<?php

/*
 * This file is part of walsgit/flarum-discussion-cards
 *
 *  Copyright (c) 2025 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Walsgit\Discussion\Cards\Image;

use Flarum\Discussion\Discussion;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\Foundation\Config;
use Flarum\Formatter\Formatter;
use Flarum\Foundation\Paths;
use Walsgit\Discussion\Cards\Services\ExtensionPaths;
use Walsgit\Discussion\Cards\Services\ImageProcessingService;
use Walsgit\Discussion\Cards\Services\HtmlImageExtractor;
use Walsgit\Discussion\Cards\Services\RemoteImageFetcher;
use Walsgit\Discussion\Cards\Services\TagImageSelector;

class CardImageResolver
{
    public function __construct(
        protected SettingsRepositoryInterface $settings,
        protected Config $config,
        protected Formatter $formatter,
        protected Paths $paths,
        protected ImageProcessingService $imageService,
        protected HtmlImageExtractor $htmlImageExtractor,
        protected TagImageSelector $tagSelector,
        protected RemoteImageFetcher $fetcher
    ) {}

    /**
     * Main resolver: returns the card image path to store, relative to the extension's assets folder
     * (ex.: "discussion-1-abc-def.webp", "tags/tag-3-default-card-image.webp"), or null.
     *
     * @param bool $interactive true when a user is waiting (short network timeouts)
     */
    public function resolve(Discussion $discussion, ?string $firstPostHtml = null, bool $interactive = false): ?string
    {
        return $this->resolveWithDecision($discussion, $firstPostHtml, $interactive)->file;
    }

    /**
     * Same process as resolve() (it is the only implementation), but also reports
     * which source was chosen, the file used and the sources skipped on the way.
     */
    public function resolveWithDecision(Discussion $discussion, ?string $firstPostHtml = null, bool $interactive = false): CardImageDecision
    {
        $skipped = [];

        // 1. Support for 3rd party Blog Extension
        if ($image = $this->resolveBlogImage($discussion, $firstPostHtml, $interactive)) {
            if ($optimized = $this->getOptimizedCardImage($discussion, $image, $interactive)) {
                return $this->decision($optimized, CardImageDecision::SOURCE_BLOG, null, $image, $skipped);
            }
            $skipped[] = ['source' => CardImageDecision::SOURCE_BLOG, 'reason' => CardImageDecision::SKIP_OPTIMIZATION_FAILED, 'image' => $image];
        }

        // 2. First image in first post
        $image = $this->extractFirstPostImage($discussion, $firstPostHtml);
        if ($image === null) {
            $skipped[] = ['source' => CardImageDecision::SOURCE_FIRST_POST, 'reason' => CardImageDecision::SKIP_NO_IMAGE, 'image' => null];
        } elseif (!$this->isImageAccessible($image, $interactive)) {
            $skipped[] = ['source' => CardImageDecision::SOURCE_FIRST_POST, 'reason' => CardImageDecision::SKIP_NOT_ACCESSIBLE, 'image' => $image];
        } elseif ($optimized = $this->getOptimizedCardImage($discussion, $image, $interactive)) {
            return $this->decision($optimized, CardImageDecision::SOURCE_FIRST_POST, null, $image, $skipped);
        } else {
            $skipped[] = ['source' => CardImageDecision::SOURCE_FIRST_POST, 'reason' => CardImageDecision::SKIP_OPTIMIZATION_FAILED, 'image' => $image];
        }

        // 3. Tag default image based on tag priority
        if ($image = $this->resolveTagImage($discussion)) {
            return $this->decision($image, CardImageDecision::SOURCE_TAG, CardImageDecision::REASON_TAG, null, $skipped);
        }

        // 4. Fallback to global default image
        if ($image = $this->resolveGlobalDefault()) {
            return $this->decision($image, CardImageDecision::SOURCE_GLOBAL, CardImageDecision::REASON_GLOBAL, null, $skipped);
        }

        return new CardImageDecision(null, CardImageDecision::SOURCE_NONE, CardImageDecision::REASON_NONE, null, $skipped);
    }

    /**
     * Builds the decision for a chosen file (path relative to the extension's assets folder).
     * Without an explicit $reason, it is deduced from the file name.
     */
    protected function decision(string $file, string $source, ?string $reason, ?string $sourceImage, array $skipped): CardImageDecision
    {
        $reason ??= match (true) {
            str_starts_with($file, 'discussion-') => CardImageDecision::REASON_OPTIMIZED,
            $file === 'blog-default-card-image.webp' => CardImageDecision::REASON_BLOG_DEFAULT,
            default => CardImageDecision::REASON_EXTENSION_DEFAULT,
        };

        return new CardImageDecision($file, $source, $reason, $sourceImage, $skipped);
    }

    // ====== Sub-resolvers ======

    /**
     * 3rd party Blog Extension support: resolve image from blog extension context
     * Priority: featured image > first image in blog post > blog-default image
     * Returns an absolute image URL or null.
     */
    public function resolveBlogImage(Discussion $discussion, ?string $firstPostHtml = null, bool $interactive = false): ?string
    {
        $useBlogImages = (int) $this->settings->get('walsgit_discussion_cards_useBlogImages');

        if ($useBlogImages !== 1) {
            return null;
        }

        // For blog post creation & edition : use the injected relation if it exists.
        $blogMeta = $discussion->relationLoaded('blogMeta')
            ? $discussion->getRelation('blogMeta')
            : null;

        // if not, load it, but only when the blog extension is enabled (the relation is defined by it).
        // A discussion without blog meta (ex.: native discussion with a blog tag) follows the usual resolving.
        if (!$blogMeta && $discussion->isRelation('blogMeta')) {
            $blogMeta = $discussion->blogMeta;
        }

        if (!$blogMeta || !is_object($blogMeta)) {
            return null;
        }

        // 1. Featured image
        $featuredImage = $blogMeta->getAttribute('featured_image');
        if (!empty($featuredImage)) {
            return $this->absoluteUrl((string) $featuredImage);
        }

        // 2. First post image
        if (!empty($firstPostHtml)) {
            // 2-1. use provided first post HTML (only for create/update)
            $imageUrl = $this->htmlImageExtractor->extract($firstPostHtml);
            if ($imageUrl && $this->isImageAccessible($imageUrl, $interactive)) {
                return $imageUrl;
            }
        } else {
            // 2-2. Use the saved post in other cases
            $firstPost = $discussion->firstPost;
            if ($firstPost && method_exists($firstPost, 'formatContent')) {
                $rendered = $firstPost->formatContent();
                $imageUrl = $this->htmlImageExtractor->extract($rendered);
                if ($imageUrl && $this->isImageAccessible($imageUrl, $interactive)) {
                    return $imageUrl;
                }
            }
        }

        // 4. Blog default image
        $blogDefault = $this->settings->get('blog_default_image_path');
        if ($blogDefault) {
            $blogDefaultImageUrl = $this->absoluteUrl('assets/' . $blogDefault);

            if ($this->imageService->resolveLocalPath($blogDefaultImageUrl) !== null) {
                return $blogDefaultImageUrl;
            }
        }

        return null;
    }

    /**
     * Extract the first image URL found in the discussion's first post (no accessibility check).
     * Returns absolute URL or null.
     */
    protected function extractFirstPostImage(Discussion $discussion, ?string $firstPostHtml = null): ?string
    {
        if (!empty($firstPostHtml)) {
            // Use provided first post HTML (only for create/update)
            $imageUrl = $this->htmlImageExtractor->extract($firstPostHtml);
        } else {
            // Use the saved post in other cases
            $firstPost = $discussion->firstPost;

            if (! $firstPost || ! method_exists($firstPost, 'formatContent')) {
                return null;
            }

            $imageUrl = $this->htmlImageExtractor->extract($firstPost->formatContent());
        }

        return $imageUrl ?: null;
    }

    /**
     * Resolve tag default image by priority using TagImageSelector.
     * Returns the tag image path, relative to the extension's assets folder, or null.
     */
    protected function resolveTagImage(Discussion $discussion): ?string
    {
        try {
            $tags = $discussion->tags()
                ->select('id', 'position', 'parent_id', 'walsgit_discussion_cards_tag_default_image')
                ->get();
        } catch (\Throwable $e) {
            $tags = collect();
        }

        $tagImage = $this->tagSelector->selectTagImage($tags);

        return $tagImage ?: null;
    }

    /**
     * Resolve global default image filename (relative, e.g. 'default-card-image.webp') or null.
     */
    protected function resolveGlobalDefault(): ?string
    {
        $defaultImage = $this->settings->get('walsgit_discussion_cards_default_image_path');
        return $defaultImage ? (string) $defaultImage : null;
    }

    /**
     * Getting the optimized image for a card
     * Given a discussion and a source image URL (absolute), returns the path of the optimized webp asset,
     * relative to the extension's assets folder, or null if the image could not be optimized.
     */
    protected function getOptimizedCardImage(Discussion $discussion, string $imageUrl, bool $interactive = false): ?string
    {
        // If it's one of the extension's own default images (local file): no need to re-optimize
        if ($defaultImage = $this->imageService->resolveExtensionDefaultImage($imageUrl)) {
            return $defaultImage;
        }

        $assetsPath = ExtensionPaths::assetsPath($this->paths);
        if (!is_dir($assetsPath)) {
            @mkdir($assetsPath, 0775, true);
        }

        // 3rd party Blog Extension Support (returns filename or null)
        $baseUrl = rtrim((string) $this->config->url(), '/');
        $optimizedBlog = $this->imageService->optimizeBlogDefaultImage($imageUrl, $baseUrl);
        if ($optimizedBlog) {
            return $optimizedBlog;
        }

        // Check if image needs to be optimized

        $discussionId = $discussion->id;
        $urlHash = substr(sha1($imageUrl), 0, 10);

        // Compute ETag-like fingerprint via service (10 chars)
        $etagHash = $this->imageService->computeEtagHash($imageUrl, $baseUrl, $interactive);

        $filename = "discussion-{$discussionId}-{$urlHash}-{$etagHash}.webp";
        $filepath = $assetsPath . '/' . $filename;

        // If already optimized, return asset url
        if (file_exists($filepath)) {
            return $filename;
        }

        // Fetch (download or copy) to a temporary file via service
        $temp = $this->imageService->downloadOrCopyImage($imageUrl, $interactive);

        if (!$temp) {
            // fail -> let the resolver use the next fallback (tag / default image)
            return null;
        }

        try {
            // Process image
            $this->imageService->processImage(
                $temp,
                $filepath,
                $this->imageService->getDefaultsFor('discussion')
            );
        } catch (\Throwable $e) {
            // Remove a possibly partial file, the previous card image is left untouched
            @unlink($filepath);
            return null;
        } finally {
            @unlink($temp);
            gc_collect_cycles();
        }

        // The new image exists: the previous ones can now be removed
        $this->imageService->cleanupOldDiscussionImages($discussionId, $filename);

        return $filename;
    }

    /**
     * 3rd party Blog Extension support: (re)generate blog-default-card-image.webp from the blog's current
     * default image. The file is only rebuilt if the source is newer (see ImageProcessingService).
     */
    public function refreshBlogDefaultImage(): void
    {
        $blogDefault = $this->settings->get('blog_default_image_path');

        if (!$blogDefault) {
            return;
        }

        $this->imageService->optimizeBlogDefaultImage(
            $this->absoluteUrl('assets/' . $blogDefault),
            rtrim((string) $this->config->url(), '/')
        );
    }

    // ====== helpers ======

    protected function absoluteUrl(string $path): string
    {
        if (preg_match('#^https?://#i', $path)) {
            return $path;
        }

        return rtrim((string) $this->config->url(), '/') . '/' . ltrim($path, '/');
    }

    public function isImageAccessible(string $url, bool $interactive = false): bool
    {
        // Local image
        if ($this->imageService->isLocalUrl($url)) {
            return $this->imageService->resolveLocalPath($url) !== null;
        }

        // Remote image
        return $this->fetcher->isAccessible($url, $interactive);
    }
}
