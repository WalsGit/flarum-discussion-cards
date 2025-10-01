<?php

namespace Walsgit\Discussion\Cards\Image;

use Flarum\Discussion\Discussion;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\Foundation\Config;
use Flarum\Formatter\Formatter;

class CardImageResolver
{
    protected $settings;
    protected $config;
    protected $formatter;

    public function __construct(SettingsRepositoryInterface $settings, Config $config, Formatter $formatter)
    {
        $this->settings = $settings;
        $this->config   = $config;
        $this->formatter = $formatter;
    }

    /**
     * Resolves which image to use for the discussion card.
     */
    public function resolve(Discussion $discussion): ?string
    {
        
        // --- In case of a blog post (when third party blog extension is active) ---
        // and when useBlogImages is activated for discussion cards
        $useBlogImages = (int) $this->settings->get('walsgit_discussion_cards_useBlogImages');
        if (!empty($discussion->blogMeta) && is_object($discussion->blogMeta) && $useBlogImages === 1) {
            // 1. Use the featured image if it's set
            $featuredImage = $discussion->blogMeta->getAttribute('featured_image');            
            if (!empty($featuredImage)) {
                $val = (string) $featuredImage;
                return $this->absoluteUrl($val);
            }

            // 2. Use the first image in the blog post (first post)
            $firstPost = $discussion->firstPost;
            if ($firstPost && method_exists($firstPost, 'formatContent')) {
                $rendered = $firstPost->formatContent();
                $imageUrl = $this->extractFirstImageFromHtml($rendered);
                if ($imageUrl) {
                    return $imageUrl;
                }
            }

            // 3. Fallback to default blog image (set in the 3rd party blog extension settings)
            $blogDefault = $this->settings->get('blog_default_image_path'); // stores the default blog image filename 'blog-default-hash.ext' as a string
            if ($blogDefault) {
                return $this->absoluteUrl((string) 'assets/'.$blogDefault); // Blog extension's default image is uploaded to /assests/blog-default-hash.ext
            }
        }

        // --- default discussion cards behaviour ---
        // 4. Use the first image of the first post
        $firstPost = $discussion->firstPost;
        if ($firstPost && method_exists($firstPost, 'formatContent')) {
            $rendered = $firstPost->formatContent();
            $imageUrl = $this->extractFirstImageFromHtml($rendered);
            if ($imageUrl) {
                return $imageUrl;
            }
        }

        // 5. Fallback on the post's priority tag's default image
        $tag = $this->getPrimaryTag($discussion);
        if ($tag && !empty($tag->walsgit_discussion_cards_tag_default_image)) {
            return $this->buildAssetUrl((string) $tag->walsgit_discussion_cards_tag_default_image);
        }

        // 6. Fallback on the global default image set in discussion cards' settings
        $defaultImage = $this->settings->get('walsgit_discussion_cards_default_image_path');
        if ($defaultImage) {
            return $this->buildAssetUrl((string) $defaultImage);
        }

        return null;
    }



    /**
     * Get the first image from the first post's html and checks for
     * - <img src="..."> (ignoring those with .emoji classes)
     * - url(...)
     */
    protected function extractFirstImageFromHtml(string $html): ?string
    {
        $html = html_entity_decode($html, ENT_QUOTES | ENT_HTML5);

        $pattern = '/<img(?![^>]*class=["\']emoji["\'])[^>]*?src=["\']([^"\']+)["\'][^>]*>|url\(([^)]+)\)/i';

        if (preg_match_all($pattern, $html, $matches, PREG_SET_ORDER)) {
            $all = [];
            foreach ($matches as $match) {
                $candidate = null;
                if (!empty($match[1])) {
                    $candidate = trim($match[1], '\'"');
                } elseif (!empty($match[2])) {
                    $candidate = trim($match[2], '\'"');
                }

                if ($candidate) {
                    $all[] = $candidate;
                }
            }

            if (!empty($all)) {
                return $all[0];
            }
        }

        return null;
    }

    protected function absoluteUrl(string $path): string
    {
        if (preg_match('#^https?://#i', $path)) {
            return $path;
        }
        return rtrim($this->config['url'], '/') . '/' . ltrim($path, '/');
    }

    protected function buildAssetUrl(string $filename): string
    {
        return rtrim($this->config['url'], '/') . '/assets/extensions/walsgit-discussion-cards/' . ltrim($filename, '/');
    }

    protected function getPrimaryTag(Discussion $discussion)
    {
        try {
            return $discussion->tags()->orderBy('position')->first();
        } catch (\Throwable $e) {
            return null;
        }
    }
}
