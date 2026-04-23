<?php

/*
 * This file is part of walsgit/discussion-cards
 *
 *  Copyright (c) 2025 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Walsgit\Discussion\Cards\Api\Controllers;

use Flarum\Tags\Tag;
use Flarum\Locale\Translator;
use Illuminate\Support\Arr;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Laminas\Diactoros\Response\JsonResponse;
use Walsgit\Discussion\Cards\Validator\TagSettingsValidator;
use Exception;
use Flarum\Http\RequestUtil;

class UpdateTagSettingsController implements RequestHandlerInterface
{
    public function __construct(protected TagSettingsValidator $validator, protected Translator $translator)
    {
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $routeParams = $request->getAttribute('routeParameters', []);
        $tagId = Arr::get($routeParams, 'tagId') ?? null;

        if (!$tagId) {
            throw new \InvalidArgumentException($this->translator->trans('walsgit_discussion_cards.admin.errors.tagSettingsNoTagId'));
        }

        $tag = Tag::findOrFail($tagId);

        RequestUtil::getActor($request)->assertAdmin();

        $data = Arr::get($request->getParsedBody(), 'data', []);
        $tagSettings = isset($data['tagSettings']) ? json_decode($data['tagSettings'], true) : [];

        $this->validator->assertValid($tagSettings);

        $tag->walsgit_discussion_cards_tag_settings = $data['tagSettings'];
        $tag->save();

        return new JsonResponse([
            'data' => [
                'id' => $tag->id,
                'attributes' => [
                    'walsgitDiscussionCardsTagSettings' => $tag->walsgit_discussion_cards_tag_settings
                ]
            ]
        ]);
    }
}