<?php

/*
 * This file is part of walsgit/flarum-discussion-cards
 *
 *  Copyright (c) 2025 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Walsgit\Discussion\Cards\Services;

use Flarum\Foundation\Paths;
use Flarum\Locale\Translator;
use Flarum\Foundation\Config;
use Psr\Http\Message\ServerRequestInterface;
use Intervention\Image\ImageManager;
use Intervention\Image\Encoders\WebpEncoder;
use InvalidArgumentException;
use Exception;

class ImageProcessingService
{
    protected array $directories = [
        'default'    => 'assets/extensions/walsgit-discussion-cards/',
        'tag'        => 'assets/extensions/walsgit-discussion-cards/tags/',
        'discussion' => 'assets/extensions/walsgit-discussion-cards/discussions/',
    ];

    protected array $defaults = [
        'width'     => 400,
        'quality'   => 80,
        'upscaling' => false,
    ];

    public function __construct(
        protected Paths $paths,
        protected Translator $translator,
        protected Config $config,
        protected RemoteImageFetcher $fetcher
    ) {}

    /**
     * Uploading images
     */
    public function handleUpload(ServerRequestInterface $request, string $origin, array $options = []): array
    {
        $options = array_merge($this->defaults, $options);

        $uploadedFiles = $request->getUploadedFiles();
        $uploadedFile =
            $uploadedFiles['file']
            ?? $uploadedFiles['walsgit_discussion_cards_default_image']
            ?? $uploadedFiles['walsgit_discussion_cards_tag_default_image']
            ?? null;

        if (!$uploadedFile) {
            throw new InvalidArgumentException($this->translator->trans('walsgit_discussion_cards.admin.errors.noFileUploaded'));
        }

        $tmpPath = $uploadedFile->getStream()->getMetadata('uri');
        $storagePath = $this->getStoragePath($origin);

        if (!is_dir($storagePath)) {
            @mkdir($storagePath, 0775, true);
        }

        $filename = $this->generateFilename($origin, $request);
        $targetPath = $storagePath . DIRECTORY_SEPARATOR . $filename;

        $this->processImage($tmpPath, $targetPath, $options);

        $publicDir = rtrim($this->paths->public, DIRECTORY_SEPARATOR);
        $relativeUrl = str_replace($publicDir, '', $targetPath);

        return [
            'path' => $filename,
            'url'  => $relativeUrl,
        ];
    }

    /**
     * Process Images (resize & convert to WebP)
     */
    public function processImage(string $sourcePath, string $targetPath, array $options = []): void
    {

        $options = array_merge($this->defaults, $options);

        if (!file_exists($sourcePath)) {
            throw new InvalidArgumentException($this->translator->trans('walsgit_discussion_cards.admin.errors.imageProcessingSourceNotFound', ['path' => $sourcePath]));
        }

        try {
            @ini_set('memory_limit', '256M');

            $this->assertSafeDimensions($sourcePath);

            $image = ImageManager::gd()->read($sourcePath);

            // Scale image
            $image = $options['upscaling']
                ? $image->scale(width: $options['width'])
                : $image->scaleDown(width: $options['width']);

            // Convert to webp & save
            $encoded = $image->encode(new WebpEncoder(quality: $options['quality']));
            $encoded->save($targetPath);
        } catch (Exception $e) {
            throw new Exception($this->translator->trans('walsgit_discussion_cards.admin.errors.imageProcessingFailed') . ' ' . $e->getMessage());
        }
    }

    /** Max pixels allowed before decoding (a decoded image takes about 4 bytes per pixel in memory). */
    protected const MAX_PIXELS = 20000000;

    /**
     * Reads only the image header to refuse unreadable files and oversized images before decoding.
     */
    protected function assertSafeDimensions(string $path): void
    {
        $size = @getimagesize($path);

        if ($size === false) {
            throw new InvalidArgumentException('Not a readable image file.');
        }

        [$width, $height] = $size;

        if ($width < 1 || $height < 1 || ($width * $height) > self::MAX_PIXELS) {
            throw new InvalidArgumentException("Image dimensions too large ({$width}x{$height}).");
        }
    }

    /**
     * Delete images
     */
    public function handleDelete(string $origin, ?string $filename = null): bool
    {
        $storagePath = $this->getStoragePath($origin);

        if (!$filename) {
            $filename = $this->generateFilename($origin);
        }

        $file = $storagePath . DIRECTORY_SEPARATOR . $filename;

        if (file_exists($file)) {
            return unlink($file);
        }

        return false;
    }

    /**
     * Get the absolute path to the folder based on origin
     */
    public function getStoragePath(string $origin): string
    {
        $publicDir = $this->paths->public;
        $relative = $this->directories[$origin] ?? $this->directories['default'];

        return rtrim($publicDir . DIRECTORY_SEPARATOR . $relative, DIRECTORY_SEPARATOR);
    }

    /**
     * Generate the proper image filename based on context.
     */
    public function generateFilename(string $origin, $context = null): string
    {
        // Special case for 3rd party BLOG Extension: blog-default-{hash}.png will generate blog-default-card-image.webp
        if ($origin === 'discussion' && $context && $context->getParsedBody()['filename'] ?? null) {
            $filename = $context->getParsedBody()['filename'];
            if (preg_match('/^blog\-default\-[a-z0-9]+\.png$/i', $filename)) {
                return 'blog-default-card-image.webp';
            }
        }

        switch ($origin) {
            case 'default':
                return 'default-card-image.webp';

            case 'tag':
                // 1) If the call passed tagId in $options (as 3rd argument of handleUpload)
                if (is_array($context) && isset($context['tagId'])) {
                    $tagId = $context['tagId'];
                }
                // 2) Else, fallback to QueryParams
                elseif ($context && method_exists($context, 'getQueryParams')) {
                    $tagId = $context->getQueryParams()['tagId'] ?? null;
                } else {
                    $tagId = null;
                }

                if (!$tagId) {
                    throw new InvalidArgumentException(
                        $this->translator->trans('walsgit_discussion_cards.admin.errors.filenameTagidMissing')
                    );
                }

                return "tag-{$tagId}-default-card-image.webp";

            case 'discussion':
                if (
                    empty($context['discussionId']) ||
                    empty($context['urlHash']) ||
                    empty($context['etagHash'])
                ) {
                    return '';
                }
                return "discussion-{$context['discussionId']}-{$context['urlHash']}-{$context['etagHash']}.webp";

            default:
                throw new InvalidArgumentException($this->translator->trans('walsgit_discussion_cards.admin.errors.filenameInvalidOrigin', ['origin' => $origin]));
        }
    }

    /**
     * Get Image processing values based on context
     */
    public function getDefaultsFor(string $origin): array
    {
        $defaults = $this->defaults;

        if ($origin === 'discussion') {
            $defaults['width'] = 400;
            $defaults['quality'] = 80;
        }

        return $defaults;
    }

    /**
     * Download a remote image OR copy a local one into a temporary file.
     * Returns the path to the temporary file, or null on failure.
     */
    public function downloadOrCopyImage(string $imageUrl): ?string
    {
        $baseUrl = rtrim((string) $this->config->url(), '/');

        // 1. Create temp file
        $temp = tempnam(sys_get_temp_dir(), 'cardimg_');
        if (!$temp) {
            return null;
        }

        // --- LOCAL IMAGE -------------------------------------------------------
        if ($baseUrl && str_starts_with($imageUrl, $baseUrl)) {
            $localPath = str_replace($baseUrl, $this->paths->public, $imageUrl);

            $size = is_file($localPath) ? @filesize($localPath) : false;

            // Missing, unreadable or too large → fallback (no optimization)
            if ($size === false || $size > RemoteImageFetcher::MAX_BYTES || !@copy($localPath, $temp)) {
                @unlink($temp);
                return null;
            }

            return $temp;
        }

        // --- REMOTE IMAGE ------------------------------------------------------
        if (!$this->fetcher->download($imageUrl, $temp)) {
            @unlink($temp);
            return null;
        }

        return $temp;
    }

    /**
     * Generate Hash that will be used to check if image has changed
     * before (downloading &) processing it. The hash will be saved in the filename for futur checks
     */
    public function computeEtagHash(string $imageUrl, string $baseUrl): string
    {
        // --- Step 1: check if it's a local image ---
        if ($baseUrl && str_starts_with($imageUrl, $baseUrl)) {

            // Convert public URL to absolute local path
            $localPath = str_replace($baseUrl, $this->paths->public, $imageUrl);

            if (file_exists($localPath)) {
                // If file exists → hash based on filemtime
                $mtime = filemtime($localPath);

                return substr(sha1($mtime), 0, 10);
            } else {
                return substr(sha1('missing'), 0, 10);
            }
        }

        // --- Step 2: remote image (one request, cached by the fetcher) ---
        $info = $this->fetcher->probe($imageUrl);

        // If the request failed or was refused → use image url as hash
        if ($info === null) {
            return substr(sha1($imageUrl), 0, 10);
        }

        $fingerprint = $info['etag'] . $info['last_modified'] . ($info['content_length'] ?? '');

        // If all 3 values are empty → use image url as hash
        if ($fingerprint === '') {
            return substr(sha1($imageUrl), 0, 10);
        }

        return substr(sha1($fingerprint), 0, 10);
    }


    /*
    * Remove old discussion card images
    */
    public function cleanupOldDiscussionImages(int $discussionId): void
    {
        $path = $this->paths->public . '/assets/extensions/walsgit-discussion-cards';
        $pattern = $path . "/discussion-{$discussionId}-*.webp";

        foreach (glob($pattern) as $old) {
            @unlink($old);
        }
    }

    /**
     * 3rd party Blog Extension support:
     * Optimize the "blog-default-{hash}.png" image provided by the blog extension.
     * Returns the optimized WebP filename, or null if the URL is not a blog-default image.
     */
    public function optimizeBlogDefaultImage(string $imageUrl, string $baseUrl): ?string
    {
        // Match URLs like:  baseurl/assets/blog-default-xxxx.png|jpg|gif|webp
        if (!preg_match('#^' . preg_quote($baseUrl, '#') . '/assets/blog-default-([a-z0-9]+)\.(jpe?g|png|gif|webp)$#i', $imageUrl, $m)) {
            return null; // Not a blog-default image
        }

        $filename = "blog-default-card-image.webp";

        $assetsPath = $this->paths->public . '/assets/extensions/walsgit-discussion-cards';
        if (!is_dir($assetsPath)) {
            @mkdir($assetsPath, 0775, true);
        }

        $filepath = $assetsPath . '/' . $filename;

        // If already optimized return filename
        if (file_exists($filepath)) {
            return $filename;
        }

        // Local source path
        $localPath = str_replace($baseUrl, $this->paths->public, $imageUrl);
        if (!file_exists($localPath)) {
            return null; // fallback to original
        }

        try {
            @ini_set('memory_limit', '256M');
            $this->processImage($localPath, $filepath, $this->getDefaultsFor('discussion'));
        } catch (\Throwable $e) {
            return null;
        }

        return $filename;
    }
}
