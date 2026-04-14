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

use Flarum\Foundation\Paths;
use Flarum\Tags\Api\Serializer\TagSerializer;
use Flarum\Tags\Tag;
use Flarum\Locale\Translator;
use Psr\Http\Message\ServerRequestInterface;
use Flarum\Api\Controller\AbstractShowController;
use Tobscure\JsonApi\Document;
use Walsgit\Discussion\Cards\Services\ImageProcessingService;
use Exception;

class TagImageController extends AbstractShowController
{
    public $serializer = TagSerializer::class;

    public function __construct(protected ImageProcessingService $imageService, protected Paths $paths, protected Translator $translator)
    {
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $request->getAttribute('actor')->assertAdmin();

        $method = strtoupper($request->getMethod());
        $tagId = $request->getParsedBody()['tagId'] ?? null;

        if (!$tagId) {
            throw new \InvalidArgumentException($this->translator->trans('walsgit_discussion_cards.admin.errors.tagImageNoTagId'));
        }

        $tag = Tag::findOrFail($tagId);

        switch ($method) {
            case 'POST':
                $result = $this->imageService->handleUpload($request, 'tag', [
                    'tagId' => $tagId
                ]);

                // mise à jour en base
                $tag->walsgit_discussion_cards_tag_default_image = 'tags/' . $result['path'];
                $tag->save();

                return $tag;

            case 'DELETE':
                $this->imageService->handleDelete('tag', "tag-$tagId-default-card-image.webp");
                $tag->walsgit_discussion_cards_tag_default_image = null;
                $tag->save();

                return $tag;

            default:
                throw new \Exception($this->translator->trans('walsgit_discussion_cards.admin.errors.tagImageUnsupportedMethod', ['method' => $method]));
        }
    }
}
