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
use Flarum\Foundation\ValidationException;

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
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    /**
     * {@inheritdoc}
     */
    public function data(ServerRequestInterface $request, Document $document)
    {
        RequestUtil::getActor($request);
        $id = Arr::get($request->getQueryParams(), 'id');
        $data = Arr::get($request->getParsedBody(), 'data', []);
        $tagSettings = isset($data['tagSettings']) ? json_decode($data['tagSettings'], true) : [];

        // Validate the tag settings
        $this->validateTagSettings($tagSettings);
        
        $tag = Tag::findOrFail($id);
        $tag->walsgit_discussion_cards_tag_settings = $data['tagSettings'];
        $tag->save();

        return $tag;
    }

    private function validateTagSettings($settings)
    {
        $translator = resolve('translator');

        $validator = resolve('validator')->make($settings, [
            'primaryCards' => 'nullable|numeric|min:0',
            'desktopCardWidth' => 'nullable|numeric|min:10|max:100',
            'tabletCardWidth' => 'nullable|numeric|min:10|max:100',
        ],
        [
            'primaryCards.min' => $translator->trans('walsgit_discussion_cards.admin.tag_modal.validation.primaryCards_error'),
            'desktopCardWidth.min' => $translator->trans('walsgit_discussion_cards.admin.tag_modal.validation.desktopCardWidth_error'),
            'desktopCardWidth.max' => $translator->trans('walsgit_discussion_cards.admin.tag_modal.validation.desktopCardWidth_error'),
            'tabletCardWidth.min' => $translator->trans('walsgit_discussion_cards.admin.tag_modal.validation.tabletCardWidth_error'),
            'tabletCardWidth.max' => $translator->trans('walsgit_discussion_cards.admin.tag_modal.validation.tabletCardWidth_error'),
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->toArray();
            $firstError = reset($errors);
            throw new ValidationException([
                'message' => is_array($firstError) ? $firstError[0] : $firstError
            ]);
        }
    }
}
