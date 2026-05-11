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
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Laminas\Diactoros\Response\JsonResponse;
use Walsgit\Discussion\Cards\Services\CheckDiscussionService;
use Walsgit\Discussion\Cards\Validator\DebugModalValidator;

class CheckDiscussionController implements RequestHandlerInterface
{
    public function __construct(
        protected CheckDiscussionService $checkDiscussionService,
        protected DebugModalValidator $validator
    ) {
        $this->validator = $validator;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertAdmin();

        $discussionId = Arr::get($request->getQueryParams(), 'id');

        $check = ['discussionId' => $discussionId];
        $this->validator->assertValid($check);

        return new JsonResponse(
            $this->checkDiscussionService->getDiscussionInfo($discussionId)
        );
    }
}
