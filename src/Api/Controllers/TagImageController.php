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

use Flarum\Tags\Tag;
use Flarum\Locale\Translator;
use Illuminate\Support\Arr;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Laminas\Diactoros\Response\JsonResponse;
use Walsgit\Discussion\Cards\Services\ImageProcessingService;
use Exception;

class TagImageController implements RequestHandlerInterface
{
    public function __construct(protected ImageProcessingService $imageService, protected Translator $translator) {}

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $routeParams = $request->getAttribute('routeParameters', []);

        $method = strtoupper($request->getMethod());
        $tagId = Arr::get($routeParams, 'tagId') ?? null;

        if (!$tagId) {
            throw new \InvalidArgumentException($this->translator->trans('walsgit_discussion_cards.admin.errors.tagImageNoTagId'));
        }

        $tag = Tag::findOrFail($tagId);

        switch ($method) {
            case 'POST':
                $result = $this->imageService->handleUpload($request, 'tag', [
                    'tagId' => $tagId
                ]);

                $tag->walsgit_discussion_cards_tag_default_image = 'tags/' . $result['path'];
                $tag->save();

                return $this->createTagResponse($tag);

            case 'DELETE':
                $this->imageService->handleDelete('tag', "tag-{$tagId}-default-card-image.webp");
                $tag->walsgit_discussion_cards_tag_default_image = null;
                $tag->save();

                return $this->createTagResponse($tag);

            default:
                throw new \Exception($this->translator->trans('walsgit_discussion_cards.admin.errors.tagImageUnsupportedMethod', ['method' => $method]));
        }
    }

    protected function createTagResponse(Tag $tag): JsonResponse
    {
        $data = [
            'id' => $tag->id,
            'attributes' => [
                'name' => $tag->name,
                'description' => $tag->description,
                'slug' => $tag->slug,
                'color' => $tag->color,
                'icon' => $tag->icon,
                'isHidden' => $tag->is_hidden,
                'isPrimary' => $tag->is_primary,
                'isRestricted' => $tag->is_restricted,
                'discussionCount' => $tag->discussion_count,
                'position' => $tag->position,
                'defaultSort' => $tag->default_sort,
                'lastPostedAt' => $tag->last_posted_at,
                'walsgitDiscussionCardsTagDefaultImage' => $tag->walsgit_discussion_cards_tag_default_image,
                'walsgitDiscussionCardsTagSettings' => $tag->walsgit_discussion_cards_tag_settings,
            ]
        ];

        return new JsonResponse(['data' => $data]);
    }
}
