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
use Flarum\Tags\Tag;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Walsgit\Discussion\Cards\Validator\TagSettingsValidator;

class UpdateTagSettingsController implements RequestHandlerInterface
{
    /** Settings that can be overridden per tag (all integers). */
    protected const ALLOWED_KEYS = [
        'primaryCards',
        'desktopCardWidth',
        'tabletCardWidth',
        'useListCards',
        'listCardsCount',
    ];

    public function __construct(protected TagSettingsValidator $validator, protected Translator $translator) {}

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        // Admin check first: a non-admin must never learn whether a tag exists
        RequestUtil::getActor($request)->assertAdmin();

        $routeParams = $request->getAttribute('routeParameters', []);
        $tagId = Arr::get($routeParams, 'tagId') ?? null;

        if (!$tagId) {
            throw new \InvalidArgumentException($this->translator->trans('walsgit_discussion_cards.admin.errors.tagSettingsNoTagId'));
        }

        $tag = Tag::findOrFail($tagId);

        $settings = $this->parseSettings($request);
        $this->validator->assertValid($settings);

        // Keep only known, non empty values, as integers
        $clean = [];
        foreach ($settings as $key => $value) {
            if ($value !== null && $value !== '') {
                $clean[$key] = (int) $value;
            }
        }

        $tag->walsgit_discussion_cards_tag_settings = json_encode((object) $clean);
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

    /**
     * Reads the tag settings JSON from the request and keeps only the known keys.
     *
     * @throws ValidationException when the data is missing or is not a valid JSON object
     */
    protected function parseSettings(ServerRequestInterface $request): array
    {
        $data = Arr::get((array) $request->getParsedBody(), 'data');
        $raw = is_array($data) ? ($data['tagSettings'] ?? null) : null;
        $decoded = is_string($raw) ? json_decode($raw, true) : null;

        if (!is_array($decoded)) {
            throw new ValidationException([
                'tagSettings' => $this->translator->trans('walsgit_discussion_cards.admin.errors.tagSettingsInvalid'),
            ]);
        }

        return Arr::only($decoded, self::ALLOWED_KEYS);
    }
}
