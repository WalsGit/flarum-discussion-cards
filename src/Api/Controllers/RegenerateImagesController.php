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
use Walsgit\Discussion\Cards\Services\ActionLogger;
use Walsgit\Discussion\Cards\Services\RegenerateImagesService;

class RegenerateImagesController implements RequestHandlerInterface
{
    /** Seconds after which a request stops processing and returns the remaining ids. */
    protected const TIME_BUDGET = 10.0;

    /** Maximum number of ids accepted in one request. */
    protected const MAX_IDS = 200;

    public function __construct(
        protected RegenerateImagesService $regenerator,
        protected ActionLogger $actionLogger
    ) {}

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertAdmin();

        $body = (array) $request->getParsedBody();
        $log = $this->actionLogger->open(
            $actor,
            Arr::get($body, 'action'),
            Arr::get($body, 'actionId'),
            ['regenerate-latest', 'regenerate-ltno', 'regenerate-without', 'repair']
        );
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

        // The first batch of an action carries the preset (regenerate) or the start flag (repair)
        if ($log && (Arr::has($body, 'mode') || Arr::get($body, 'start') === true)) {
            $log->info('Started: ' . count($ids) . ' discussion(s) in the first batch');
        }

        $onItem = $log && $log->wantsDetails()
            ? function (int $id, ?string $error, array $detail = []) use ($log) {
                if (!empty($detail)) {
                    $log->item($detail);
                }
            }
            : null;

        $result = $this->regenerator->processIds($ids, false, self::TIME_BUDGET, $onItem);

        $log?->info(sprintf(
            'Batch: success=%d regenerated=%d unchanged=%d noImage=%d errors=%d remaining=%d',
            $result['success'],
            $result['regenerated'],
            $result['unchanged'],
            $result['noImage'],
            $result['errors'],
            count($result['remaining'])
        ));

        return new JsonResponse([
            'selected'    => count($ids),
            'success'     => $result['success'],
            'regenerated' => $result['regenerated'],
            'unchanged'   => $result['unchanged'],
            'noImage'     => $result['noImage'],
            'errors'      => $result['errors'],
            'failures'    => $result['failures'],
            'remaining'   => $result['remaining'],
        ]);
    }
}
