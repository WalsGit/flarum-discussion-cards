<?php

/*
 * This file is part of walsgit/discussion-cards
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
use Illuminate\Support\Str;
use Flarum\Foundation\Paths;
use Walsgit\Discussion\Cards\Services\ImageProcessingService;
use Walsgit\Discussion\Cards\Services\HtmlImageExtractor;
use Walsgit\Discussion\Cards\Services\TagImageSelector;

class CardImageResolver
{
    protected SettingsRepositoryInterface $settings;
    protected Config $config;
    protected Formatter $formatter;
    protected static array $headCache = [];
    protected Paths $paths;
    protected ImageProcessingService $imageService;
    protected HtmlImageExtractor $htmlImageExtractor;
    protected TagImageSelector $tagSelector;

    public function __construct(
        SettingsRepositoryInterface $settings,
        Config $config,
        Formatter $formatter,
        Paths $paths,
        ImageProcessingService $imageService,
        HtmlImageExtractor $htmlImageExtractor,
        TagImageSelector $tagSelector
    ) {
        $this->settings = $settings;
        $this->config = $config;
        $this->formatter = $formatter;
        $this->paths = $paths;
        $this->imageService = $imageService;
        $this->htmlImageExtractor = $htmlImageExtractor;
        $this->tagSelector = $tagSelector;
    }

    /**
     * Main resolver: returns an optimized image URL (absolute) or null.
     */
    public function resolve(Discussion $discussion): ?string
    {
        // 1) 3rd party Blog Extension support
        if ($image = $this->resolveBlogImage($discussion)) {
            return $this->getOptimizedCardImage($discussion, $image);
        }

        // 2) First image in first post
        if ($image = $this->resolveFirstPostImage($discussion)) {
            return $this->getOptimizedCardImage($discussion, $image);
        }

        // 3) Tag default image based on tag priority
        if ($image = $this->resolveTagImage($discussion)) {
            return $image; // already a buildAssetUrl() result
        }

        // 4) Fallback to global default image
        if ($image = $this->resolveGlobalDefault()) {
            return $this->buildAssetUrl($image);
        }

        return null;
    }

    // ====== Sub-resolvers ======

    /**
     * 3rd party Blog Extension support: resolve image from blog extension context
     * Priority: featured image > first image in blog post > blog-default image
     * Returns an absolute image URL or null.
     */
    protected function resolveBlogImage(Discussion $discussion): ?string
    {
        // 0. Only if installed and activated and useBlogImages setting activated too.
        $useBlogImages = (int) $this->settings->get('walsgit_discussion_cards_useBlogImages');

        if (empty($discussion->blogMeta) || !is_object($discussion->blogMeta) || $useBlogImages !== 1) {
            return null;
        }

        // 1. Featured image
        $featuredImage = $discussion->blogMeta->getAttribute('featured_image');
        if (!empty($featuredImage)) {
            $val = (string) $featuredImage;
            return $this->absoluteUrl($val);
        }

        // 2. First image in the first post
        $firstPost = $discussion->firstPost;
        if ($firstPost && method_exists($firstPost, 'formatContent')) {
            $rendered = $firstPost->formatContent();
            $imageUrl = $this->htmlImageExtractor->extract($rendered);
            if ($imageUrl && $this->isImageAccessible($imageUrl)) {
                return $imageUrl;
            }
        }

        // 3. Fallback to third-party blog default image (if configured)
        $blogDefault = $this->settings->get('blog_default_image_path'); // stored filename 'blog-default-{hash}.{ext}'
        if ($blogDefault) {
            $blogDefaultImageUrl = $this->absoluteUrl((string) 'assets/' . $blogDefault);
            $baseUrl = (string) ($this->config->url() ?? '');
            $localPath = str_replace($baseUrl, $this->paths->public, $blogDefaultImageUrl);

            if (file_exists($localPath)) {
                return $blogDefaultImageUrl;
            }
        }

        return null;
    }

    /**
     * Resolve the first image found in the discussion's first post
     * Returns absolute URL or null.
     */
    protected function resolveFirstPostImage(Discussion $discussion): ?string
    {
        $firstPost = $discussion->firstPost;
        if (! $firstPost || ! method_exists($firstPost, 'formatContent')) {
            return null;
        }

        $rendered = $firstPost->formatContent();
        $imageUrl = $this->htmlImageExtractor->extract($rendered);

        if ($imageUrl && $this->isImageAccessible($imageUrl)) {
            return $imageUrl;
        }

        return null;
    }

    /**
     * Resolve tag default image by priority using TagImageSelector.
     * Returns a built asset absolute URL or null.
     */
    protected function resolveTagImage(Discussion $discussion): ?string
    {
        try {
            $tags = $discussion->tags ?? $discussion->tags()
                ->select('id', 'position', 'parent_id', 'walsgit_discussion_cards_tag_default_image')
                ->get();
        } catch (\Throwable $e) {
            $tags = collect();
        }

        $tagImage = $this->tagSelector->selectTagImage($tags);

        if ($tagImage) {
            return $this->buildAssetUrl($tagImage);
        }

        return null;
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
     * Given a discussion and a source image URL (absolute), returns an absolute URL
     * pointing to the optimized webp asset (or returns the original imageUrl as fallback).
     */
    protected function getOptimizedCardImage(Discussion $discussion, string $imageUrl): string
    {
        // If this is already one of the default images (global or tag) we uploaded (no need to reoptimize)
        if (Str::endsWith($imageUrl, 'default-card-image.webp')) {
            return $imageUrl;
        }

        $assetsPath = $this->paths->public . '/assets/extensions/walsgit-discussion-cards';
        if (!is_dir($assetsPath)) {
            @mkdir($assetsPath, 0775, true);
        }

        // 3rd party Blog Extention Support (returns filename or null)
        $baseUrl = rtrim((string) $this->config->url(), '/');
        $optimizedBlog = $this->imageService->optimizeBlogDefaultImage($imageUrl, $baseUrl);
        if ($optimizedBlog) {
            return $this->buildAssetUrl($optimizedBlog);
        }

        // Check if image needs to be optimized

        $discussionId = $discussion->id;
        $urlHash = substr(sha1($imageUrl), 0, 10);

        
        // Compute ETag-like fingerprint via service (10 chars)
        if (!isset(self::$headCache[$imageUrl])) {
            $etagHash = $this->imageService->computeEtagHash($imageUrl, $baseUrl);
            self::$headCache[$imageUrl] = $etagHash;
        } else {
            $etagHash = self::$headCache[$imageUrl];
        }

        $filename = "discussion-{$discussionId}-{$urlHash}-{$etagHash}.webp";
        $filepath = $assetsPath . '/' . $filename;

        // If already optimized, return asset url
        if (file_exists($filepath)) {
            return $this->buildAssetUrl($filename);
        }

        // Remove old optimized files for this discussion
        $this->imageService->cleanupOldDiscussionImages($discussionId);

        // Fetch (download or copy) to a temporary file via service
        $temp = $this->imageService->downloadOrCopyImage($imageUrl);

        if (!$temp) {
            // fail -> fallback to original url
            return $imageUrl;
        }

        try {
            // Process image
            $this->imageService->processImage(
                $temp,
                $filepath,
                $this->imageService->getDefaultsFor('discussion')
            );
        } catch (\Throwable $e) {
            @unlink($temp);
            return $imageUrl;
        } finally {
            @unlink($temp);
            gc_collect_cycles();
        }

        return $this->buildAssetUrl($filename);
    }

    // ====== helpers ======

    protected function absoluteUrl(string $path): string
    {
        if (preg_match('#^https?://#i', $path)) {
            return $path;
        }

        return rtrim((string) $this->config->url(), '/') . '/' . ltrim($path, '/');
    }

    protected function buildAssetUrl(string $filename): string
    {
        return rtrim((string) $this->config->url(), '/') . '/assets/extensions/walsgit-discussion-cards/' . ltrim($filename, '/');
    }

    protected function isImageAccessible(string $url): bool
    {
        $baseUrl = (string) ($this->config->url() ?? '');

        // Local image
        if (Str::startsWith($url, $baseUrl)) {
            $localPath = str_replace($baseUrl, $this->paths->public, $url);
            return file_exists($localPath);
        }

        // Remote image
        $headers = @get_headers($url, 1);
        if (!$headers || !isset($headers[0])) {
            return false;
        }

        return !(
            str_contains($headers[0], '404') ||
            str_contains($headers[0], '403') ||
            str_contains($headers[0], '500')
        );
    }
}
