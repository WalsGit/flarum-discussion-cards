<?php

/*
 * This file is part of walsgit/flarum-discussion-cards
 *
 *  Copyright (c) 2025 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Walsgit\Discussion\Cards\Api\Controllers;

use Flarum\Foundation\ValidationException;
use Flarum\Http\RequestUtil;
use Flarum\Locale\Translator;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\Tags\Tag;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class UpdateAllowedTagsController implements RequestHandlerInterface
{
    public function __construct(
        protected SettingsRepositoryInterface $settings,
        protected Translator $translator
    ) {}

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        RequestUtil::getActor($request)->assertAdmin();

        $ids = Arr::get((array) $request->getParsedBody(), 'allowedTags');

        if (!is_array($ids)) {
            throw new ValidationException([
                'allowedTags' => $this->translator->trans('walsgit_discussion_cards.admin.errors.allowedTagsInvalid'),
            ]);
        }

        // Keep positive integer ids only (int or digit string), without duplicates
        $ids = array_filter($ids, fn($id) => is_int($id) || (is_string($id) && ctype_digit($id)));
        $ids = array_values(array_unique(array_filter(
            array_map('intval', $ids),
            fn($id) => $id > 0
        )));

        // Keep only tags that really exist
        $existing = Tag::query()
            ->whereIn('id', $ids)
            ->pluck('id')
            ->map(fn($id) => (int) $id)
            ->all();

        $ids = array_values(array_intersect($ids, $existing));
        sort($ids);

        // Normalized format: JSON array of id strings, ex.: ["1","4","12"]
        $this->settings->set(
            'walsgit_discussion_cards_allowedTags',
            json_encode(array_map('strval', $ids))
        );

        return new JsonResponse(['status' => 'success']);
    }
}
