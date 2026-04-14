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

use Flarum\Api\Controller\AbstractShowController;
use Flarum\Http\RequestUtil;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\Tags\Api\Serializer\TagSerializer;
use Flarum\Tags\Tag;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Walsgit\Discussion\Cards\Validator\TagSettingsValidator;

class UpdateTagSettingsController extends AbstractShowController
{
    /**
     * {@inheritdoc}
     */
    public $serializer = TagSerializer::class;

    public function __construct(protected SettingsRepositoryInterface $settings, protected TagSettingsValidator $validator)
    {
    }

    /**
     * {@inheritdoc}
     */
    public function data(ServerRequestInterface $request, Document $document)
    {
        RequestUtil::getActor($request)->assertAdmin();

        $id = Arr::get($request->getQueryParams(), 'id');
        $data = Arr::get($request->getParsedBody(), 'data', []);

        $tagSettings = isset($data['tagSettings']) ? json_decode($data['tagSettings'], true) : [];

        $this->validator->assertValid($tagSettings);

        // Sauvegarde en base
        $tag = Tag::findOrFail($id);
        $tag->walsgit_discussion_cards_tag_settings = $data['tagSettings'];
        $tag->save();

        return $tag;
    }
}
