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
use Walsgit\Discussion\Cards\Services\RegenerateImagesService;

class RegenerateImagesController implements RequestHandlerInterface
{
    /** Seconds after which a request stops processing and returns the remaining ids. */
    protected const TIME_BUDGET = 10.0;

    /** Maximum number of ids accepted in one request. */
    protected const MAX_IDS = 200;

    public function __construct(protected RegenerateImagesService $regenerator) {}

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        RequestUtil::getActor($request)->assertAdmin();

        $body = (array) $request->getParsedBody();
        $ids = Arr::get($body, 'ids');

        if (is_array($ids)) {
            // Next calls: ids left over by the previous call
            $ids = array_values(array_unique(array_filter(
                array_map('intval', array_filter(array_slice($ids, 0, self::MAX_IDS), 'is_numeric'))
            )));
        } else {
            // First call: the server selects the discussions from a preset
            $ids = $this->regenerator->selectByMode((string) Arr::get($body, 'mode', 'latest'));
        }

        $result = $this->regenerator->processIds($ids, false, self::TIME_BUDGET);

        return new JsonResponse([
            'selected'  => count($ids),
            'success'   => $result['success'],
            'errors'    => $result['errors'],
            'failures'  => $result['failures'],
            'remaining' => $result['remaining'],
        ]);
    }
}
