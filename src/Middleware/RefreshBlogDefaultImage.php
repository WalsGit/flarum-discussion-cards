<?php

/*
 * This file is part of walsgit/flarum-discussion-cards
 *
 *  Copyright (c) 2026 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Walsgit\Discussion\Cards\Middleware;

use Illuminate\Contracts\Container\Container;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Walsgit\Discussion\Cards\Image\CardImageResolver;
use Walsgit\Discussion\Cards\Services\ImageProcessingService;

/**
 * 3rd party Blog Extension support (fof/blog):
 * the blog extension does not fire any event when its default image is uploaded.
 * After a successful upload, refresh our optimized copy (blog-default-card-image.webp) so that
 * the cards already using it show the new image. After a successful deletion, remove the copy
 * (cards are not re-resolved automatically, it could be very long on a big forum: the admin
 * runs "Regenerate images" afterwards).
 */
class RefreshBlogDefaultImage implements MiddlewareInterface
{
    protected const BLOG_DEFAULT_FILE = 'blog-default-card-image.webp';

    // The container is used lazily: this middleware is built on every API request.
    public function __construct(protected Container $container) {}

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $response = $handler->handle($request);

        if ($response->getStatusCode() >= 300) {
            return $response;
        }

        // Routes of 3rd party extension fof/blog (the URI path is relative to /api here: use the route name)
        $route = $request->getAttribute('routeName');

        if ($route === 'blog.default_image.upload' || $route === 'blog.default_image.delete') {
            try {
                $route === 'blog.default_image.upload' ? $this->refresh() : $this->clean();
            } catch (\Throwable $e) {
            // Never break the blog extension's response.
            }
        }

        return $response;
    }

    protected function refresh(): void
    {
        $this->container->make(CardImageResolver::class)->refreshBlogDefaultImage();
    }

    /**
     * The blog default image is removed: delete our optimized copy of it.
     */
    protected function clean(): void
    {
        $this->container->make(ImageProcessingService::class)
            ->handleDelete('default', self::BLOG_DEFAULT_FILE);
    }
}
