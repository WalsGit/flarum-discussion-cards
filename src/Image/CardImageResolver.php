<?php

namespace Walsgit\Discussion\Cards\Image;

use Flarum\Discussion\Discussion;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\Foundation\Config;
use Flarum\Formatter\Formatter;
use Intervention\Image\ImageManagerStatic as Image;
use Illuminate\Support\Str;
use Flarum\Foundation\Paths;

class CardImageResolver
{
    protected $settings;
    protected $config;
    protected $formatter;
    protected static array $headCache = [];
    protected $paths;

    public function __construct(SettingsRepositoryInterface $settings, Config $config, Formatter $formatter, Paths $paths)
    {
        $this->settings = $settings;
        $this->config   = $config;
        $this->formatter = $formatter;
        $this->paths = $paths;
    }

    /**
     * Resolves which image to use for the discussion card and saves an optimized version of the image (if it doesn't already exist).
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
                return $this->getOptimizedCardImage($discussion, $this->absoluteUrl($val));
            }

            // 2. Use the first image in the blog post (first post)
            $firstPost = $discussion->firstPost;
            if ($firstPost && method_exists($firstPost, 'formatContent')) {
                $rendered = $firstPost->formatContent();
                $imageUrl = $this->extractFirstImageFromHtml($rendered);
                if ($imageUrl) {
                    if ($this->isImageAccessible($imageUrl)) {
                        return $this->getOptimizedCardImage($discussion, $imageUrl);
                    }
                }
            }

            // 3. Fallback to default blog image (set in the 3rd party blog extension settings)
            $blogDefault = $this->settings->get('blog_default_image_path'); // stores the default blog image filename 'blog-default-hash.ext' as a string
            if ($blogDefault) {
                $blogDefaultImageUrl = $this->absoluteUrl((string) 'assets/'.$blogDefault); // Blog extension's default image is uploaded to /assets/blog-default-hash.ext
                $baseUrl = (string) ($this->config->url() ?? '');
                $localPath = str_replace($baseUrl, $this->paths->public, $blogDefaultImageUrl);

                if (file_exists($localPath)) {
                    return $this->getOptimizedCardImage($discussion, $blogDefaultImageUrl);
                }
            }
        }

        // --- default discussion cards behaviour ---
        // 4. Use the first image of the first post
        $firstPost = $discussion->firstPost;
        if ($firstPost && method_exists($firstPost, 'formatContent')) {
            $rendered = $firstPost->formatContent();
            $imageUrl = $this->extractFirstImageFromHtml($rendered);
            if ($imageUrl) {
                if ($this->isImageAccessible($imageUrl)) {
                    return $this->getOptimizedCardImage($discussion, $imageUrl);
                }
            }
        }

        // 5. Use the tag's default image (if set), and if multiple tags : check the post's priority tag's default image (if any) using the following priority order (tags with no default image set are skipped):
        /*
        * 1. The image of the highest positioned child primary tag of the highest positioned parent primary tag (or next highest positioned child etc.)
        * 2. The image of the highest positioned parent primary tag (or the next highest primary tag etc.)
        * 3. The image of the secondary tag with the lowest id (because they don't have positions)
        * 4. The general default image (Go to Step 6. below)
        */
        try {
            $tags = $discussion->tags ?? $discussion->tags()
                    ->select('id', 'position', 'parent_id', 'walsgit_discussion_cards_tag_default_image')
                    ->get();
        } catch (\Throwable $e) {
            $tags = collect();
        }

        if ($tags && $tags instanceof \Illuminate\Support\Collection) {

            // Primary Tags have position != null (-> 0+)
            // Secondary Tags have position == null && parent_id == null

            $primaryTags = $tags->filter(function ($t) {
                return $t->position !== null;
            });

            $primaryParents = $primaryTags
                ->filter(function ($t) {
                    return $t->parent_id === null;
                })
                ->sortBy(function ($t) {
                    return $t->position === null ? PHP_INT_MAX : $t->position;
                });

            // First priority: highest positioned (lowest number) primary child tag (of highest parent) with a default image set
            foreach ($primaryParents as $parent) {
                $children = $primaryTags
                    ->filter(function ($c) use ($parent) {
                        return $c->parent_id !== null && $c->parent_id == $parent->id;
                    })
                    ->sortBy(function ($t) {
                        return $t->position === null ? PHP_INT_MAX : $t->position;
                    });

                foreach ($children as $child) {
                    if (!empty($child->walsgit_discussion_cards_tag_default_image)) {
                        return $this->buildAssetUrl((string) $child->walsgit_discussion_cards_tag_default_image);
                    }
                }
            }

            // Second priority: highest positioned (lowest number) primary parent with a default image set
            foreach ($primaryParents as $parent) {
                if (!empty($parent->walsgit_discussion_cards_tag_default_image)) {
                    return $this->buildAssetUrl((string) $parent->walsgit_discussion_cards_tag_default_image);
                }
            }

            // Third priority: lowest id of secondary tag with a default image set
            $secondary = $tags
                ->filter(function ($t) {
                    return $t->position === null && $t->parent_id === null;
                })
                ->sortBy('id');

            foreach ($secondary as $tag) {
                if (!empty($tag->walsgit_discussion_cards_tag_default_image)) {
                    return $this->buildAssetUrl((string) $tag->walsgit_discussion_cards_tag_default_image);
                }
            }

        }

        // 6. Fallback on the global default image set in discussion cards' settings
        $defaultImage = $this->settings->get('walsgit_discussion_cards_default_image_path');
        if ($defaultImage) {
            return $this->buildAssetUrl((string) $defaultImage);
        }

        return null;
    }

    // --- Card image optimization ---
    protected function getOptimizedCardImage(Discussion $discussion, string $imageUrl): string
    {        
        // Skip if already one of the extension default images (already optimized when uploaded)
        if (Str::endsWith($imageUrl, 'default-card-image.webp')) {
            return $imageUrl;
        }

        $assetsPath = $this->paths->public . '/assets/extensions/walsgit-discussion-cards';
        if (!is_dir($assetsPath)) {
            @mkdir($assetsPath, 0775, true);
        }

        $baseUrl = (string) ($this->config->url() ?? '');

        // --- BLOG DEFAULT IMAGE DETECTION (third party extension) ---
        // (baseurl/assets/blog-default-{hash}.{ext})
        if (preg_match('#^' . preg_quote($baseUrl, '#') . '/assets/blog-default-([a-z0-9]+)\.(jpe?g|png|gif|webp)$#i', $imageUrl, $m)) {
            $hash = $m[1];
            $filename = "blog-default-{$hash}.webp";
            $filepath = $assetsPath . '/' . $filename;

            if (file_exists($filepath)) {
                return $this->buildAssetUrl($filename);
            }

            $localPath = str_replace($baseUrl, $this->paths->public, $imageUrl);

            // Remove old optimized blog default images
            foreach (glob("$assetsPath/blog-default-*.webp") as $old) {
                @unlink($old);
            }

            // Image optimization
            try {
                @ini_set('memory_limit', '256M');

                $img = Image::make($localPath);

                $img->resize(400, null, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });

                $img->encode('webp', 80)->save($filepath);

                $img->destroy();
            } catch (\Throwable $e) {
                return $imageUrl; // fallback to original image
            }

            return $this->buildAssetUrl($filename);
        }
        // --- END BLOG DEFAULT IMAGE DETECTION ---

        $discussionId = $discussion->id;
        $urlHash = substr(sha1($imageUrl), 0, 10);

        // To avoid re-downloading an image (remote) at every refresh of a page, we will check the url hash and to cover the cases where the url doesn't change but the image does, we'll do a HEAD request to get the Etag, content-length and last modified fields, and store that info as hashes in the saved optimized file name (to compare with on subsequent checks): new image will only be downloaded if changes were found.
        // --- HEAD cache to avoid multiple HEAD requests ---
        if (!isset(self::$headCache[$imageUrl])) {
            // Check if local files
            if ($baseUrl && is_string($imageUrl) && Str::startsWith($imageUrl, $baseUrl)) {
                $localPath = str_replace($baseUrl, $this->paths->public, $imageUrl);

                if (file_exists($localPath)) {
                    $lastModified = filemtime($localPath);
                    $etagHash = substr(sha1($lastModified), 0, 10);
                } else {
                    $etagHash = substr(sha1('missing'), 0, 10);
                }
            } else {
                // Remote image
                $headers = @get_headers($imageUrl, 1);

                $etag = $headers['ETag'] ?? '';
                $lastModified = $headers['Last-Modified'] ?? '';
                $contentLength = $headers['Content-Length'] ?? '';

                if (is_array($etag)) $etag = end($etag);
                if (is_array($lastModified)) $lastModified = end($lastModified);
                if (is_array($contentLength)) $contentLength = end($contentLength);

                $etagHash = substr(sha1($etag . $lastModified . $contentLength), 0, 10);

            }

            self::$headCache[$imageUrl] = $etagHash;
        } else {
            $etagHash = self::$headCache[$imageUrl];
        }
        // --- End HEAD cache ---

        $filename = "discussion-{$discussionId}-{$urlHash}-{$etagHash}.webp";
        $filepath = $assetsPath . '/' . $filename;

        // If optimized version already exists, return it
        if (file_exists($filepath)) {
            return $this->buildAssetUrl($filename);
        }

        // Remove old optimized files for this discussion
        foreach (glob("$assetsPath/discussion-{$discussionId}-*.webp") as $old) {
            @unlink($old);
        }

        // --- Getting the image file ---
        $temp = tempnam(sys_get_temp_dir(), 'cardimg_');
        $raw = false;
        $maxSize = 5 * 1024 * 1024; // Max size 5 MB

        // Local image
        if ($baseUrl && is_string($imageUrl) && Str::startsWith($imageUrl, $baseUrl)) {
            $localPath = str_replace($baseUrl, $this->paths->public, $imageUrl);

            if (file_exists($localPath)) {
                $size = @filesize($localPath);
                if ($size !== false && $size > $maxSize) {
                    // Too big don't optimize
                    @unlink($temp);
                    return $imageUrl;
                }

                $raw = @file_get_contents($localPath);
            }
        } else {
            // Remote image

            // Check Content-Length if available
            $headers = @get_headers($imageUrl, 1);
            if (isset($headers['Content-Length'])) {
                $size = is_array($headers['Content-Length']) ? end($headers['Content-Length']) : $headers['Content-Length'];
                if (is_numeric($size) && (int) $size > $maxSize) {
                    @unlink($temp);
                    return $imageUrl;
                }
            }

            $raw = @file_get_contents($imageUrl);
        }

        if ($raw === false) {
            @unlink($temp);
            return $imageUrl;
        }

        file_put_contents($temp, $raw);
        unset($raw);

        // --- Image processing ---
        try {
            @ini_set('memory_limit', '256M');

            $img = Image::make($temp);

            $img->resize(400, null, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });

            $img->encode('webp', 80)->save($filepath);
        } catch (\Throwable $e) {
            @unlink($temp);
            return $imageUrl;
        } finally {
            if (isset($img)) {
                $img->destroy();
                unset($img);
            }
            @unlink($temp);
            gc_collect_cycles();
        }

        return $this->buildAssetUrl($filename);
    }


    /**
     * Get the first image from the first post's html and checks for
     * - <img src="..."> (ignoring those with .emoji classes)
     * - url(...)
     */
    protected function extractFirstImageFromHtml(string $html): ?string
    {
        $html = html_entity_decode($html, ENT_QUOTES | ENT_HTML5);

        $candidates = [];

        // A - Look for <img...> or url(...) & ignore .emoji
        $patternImg = '/<img(?![^>]*class=["\']emoji["\'])[^>]*?src=["\']([^"\']+)["\'][^>]*>|url\(([^)]+)\)/i';
        if (preg_match_all($patternImg, $html, $matches, PREG_OFFSET_CAPTURE)) {
            foreach ($matches as $match) {
                foreach ($match as $sub) {
                    if (is_array($sub) && !empty($sub[0]) && filter_var($sub[0], FILTER_VALIDATE_URL)) {
                        $candidates[$sub[1]] = $sub[0];
                    }
                }
            }
        }
        
        // Extractor looking for service specific patterns (imgur, dailymotion etc.) to get the thumbnail url
        $extractors = [
            [
                'name' => 'Imgur',
                'pattern' => '/src=["\']([^"\']*imgur\.min\.html[^"\']*)["\']/i',
                'callback' => function ($match, $pos) {
                    if (preg_match('/#(?!.*\/)(.+)/', $match, $m2)) {
                        $id = $m2[1];
                        $url = "https://i.imgur.com/{$id}.jpg";
                        
                        return $url;
                    }
                    
                    return null;
                },
            ],
            [
                'name' => 'Dailymotion',
                'pattern' => '/<iframe[^>]+src=["\'](?:https?:)?\/\/www\.dailymotion\.com\/embed\/video\/([a-zA-Z0-9]+)["\']/i',
                'callback' => function ($match, $pos) {
                    $id = $match;
                    $url = "https://www.dailymotion.com/thumbnail/video/{$id}";
                    
                    return $url;
                },
            ],
        ];

        foreach ($extractors as $ext) {
            if (preg_match($ext['pattern'], $html, $match, PREG_OFFSET_CAPTURE)) {
                $found = $match[1][0] ?? null;
                $pos = $match[1][1] ?? null;
                if ($found && $pos !== null) {
                    $thumbUrl = $ext['callback']($found, $pos);
                    if ($thumbUrl) {
                        $candidates[$pos] = $thumbUrl;
                    }
                }
            }
        }

        // Sort image urls by order of appearance in html and return the first one
        if (!empty($candidates)) {
            ksort($candidates, SORT_NUMERIC);
            $first = reset($candidates);

            return $first;
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
