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

use Flarum\Discussion\Discussion;
use Flarum\Foundation\ValidationException;
use Flarum\Http\RequestUtil;
use Flarum\Locale\Translator;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Walsgit\Discussion\Cards\Services\CardImageUrlBuilder;
use Walsgit\Discussion\Cards\Services\RegenerateImagesService;

/**
 * Regenerates the card image of one discussion (forum discussion menu, admins only).
 * Not interactive: same network timeouts as the admin tools, not the short ones of the listeners.
 */
class RegenerateDiscussionImageController implements RequestHandlerInterface
{
    public function __construct(
        protected RegenerateImagesService $regenerator,
        protected CardImageUrlBuilder $urlBuilder,
        protected Translator $translator
    ) {}

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        RequestUtil::getActor($request)->assertAdmin();

        $rawId = Arr::get($request->getQueryParams(), 'id');

        if (!is_string($rawId) || !ctype_digit($rawId) || (int) $rawId < 1) {
            throw new ValidationException([
                'id' => $this->translator->trans('walsgit_discussion_cards.admin.errors.debugModalDiscussionId'),
            ]);
        }

        $id = (int) $rawId;

        if (!Discussion::query()->whereKey($id)->exists()) {
            return new JsonResponse(['errors' => [['status' => '404', 'code' => 'not_found']]], 404);
        }

        try {
            $outcome = $this->regenerator->regenerateDiscussionDetailed($id);
        } catch (\Throwable $e) {
            return new JsonResponse(['errors' => [['status' => '500', 'code' => 'regeneration_failed']]], 500);
        }

        // Read back the stored value: it is null when the discussion ended up with no card image
        $stored = Discussion::query()->whereKey($id)->value('walsgit_card_image_url');

        return new JsonResponse([
            // regenerated, unchanged or no_image (RegenerateImagesService::STATUS_*)
            'status'       => $outcome['status'],
            'cardImageUrl' => $this->urlBuilder->build($stored),
        ]);
    }
}
