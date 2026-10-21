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
use Flarum\Locale\Translator;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Walsgit\Discussion\Cards\Services\PurgeImagesException;
use Walsgit\Discussion\Cards\Services\PurgeImagesService;

class PurgeImagesController implements RequestHandlerInterface
{
    public function __construct(
        protected PurgeImagesService $purger,
        protected Translator $translator
    ) {}

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        RequestUtil::getActor($request)->assertAdmin();

        $queryParams = $request->getQueryParams();
        $all = isset($queryParams['all']) && $queryParams['all'] === 'true';

        try {
            return new JsonResponse($this->purger->purge($all));
        } catch (PurgeImagesException $e) {
            return new JsonResponse([
                'error' => $this->translator->trans(
                    'walsgit_discussion_cards.admin.console.' . $e->getMessage(),
                    $e->params
                ),
            ]);
        }
    }
}
