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
use Walsgit\Discussion\Cards\Services\ActionLogger;
use Walsgit\Discussion\Cards\Services\PurgeImagesException;
use Walsgit\Discussion\Cards\Services\PurgeImagesService;

class PurgeImagesController implements RequestHandlerInterface
{
    public function __construct(
        protected PurgeImagesService $purger,
        protected Translator $translator,
        protected ActionLogger $actionLogger
    ) {}

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertAdmin();

        $queryParams = $request->getQueryParams();
        $all = isset($queryParams['all']) && $queryParams['all'] === 'true';
        $log = $this->actionLogger->open(
            $actor,
            $queryParams['action'] ?? null,
            $queryParams['actionId'] ?? null,
            ['purge-unused', 'purge-all']
        );

        $log?->info('Started');

        try {
            $result = $this->purger->purge($all);

            if ($log) {
                // For "Delete all" only log the summary, as a list of files could be too long
                if ($log->wantsDetails() && !$all) {
                    foreach ($result['deletedFiles'] as $file) {
                        $log->detail('deleted: ' . $file);
                    }

                    foreach ($result['skippedFiles'] as $file) {
                        $log->detail('skipped: ' . $file);
                    }
                }

                $log->info(sprintf(
                    'Summary: deleted=%d skipped=%d updated=%d',
                    $result['deleted'],
                    $result['skipped'],
                    $result['updated']
                ));
            }

            return new JsonResponse($result);
        } catch (PurgeImagesException $e) {
            $log?->error('Error: ' . $e->getMessage() . ' ' . json_encode($e->params));

            return new JsonResponse([
                'error' => $this->translator->trans(
                    'walsgit_discussion_cards.admin.console.' . $e->getMessage(),
                    $e->params
                ),
            ]);
        }
    }
}
