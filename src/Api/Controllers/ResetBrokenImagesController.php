<?php

/*
 * This file is part of walsgit/flarum-discussion-cards
 *
 *  Copyright (c) 2026 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Walsgit\Discussion\Cards\Api\Controllers;

use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Walsgit\Discussion\Cards\Services\BrokenImagesService;

class ResetBrokenImagesController implements RequestHandlerInterface
{
    /** Maximum number of ids accepted in one request. */
    protected const MAX_IDS = 500;

    public function __construct(protected BrokenImagesService $brokenImages) {}

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        RequestUtil::getActor($request)->assertAdmin();

        $ids = Arr::get((array) $request->getParsedBody(), 'ids');
        $ids = is_array($ids)
            ? array_values(array_unique(array_filter(
                array_map('intval', array_filter(array_slice($ids, 0, self::MAX_IDS), 'is_numeric'))
            )))
            : [];

        return new JsonResponse(['reset' => $this->brokenImages->resetToNull($ids)]);
    }
}
