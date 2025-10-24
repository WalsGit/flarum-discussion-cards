<?php

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

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @var TagSettingsValidator
     */
    protected $validator;

    /**
     * @param SettingsRepositoryInterface $settings
     * @param TagSettingsValidator        $validator
     */
    public function __construct(SettingsRepositoryInterface $settings, TagSettingsValidator $validator)
    {
        $this->settings = $settings;
        $this->validator = $validator;
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
