<?php

namespace Walsgit\Discussion\Cards\Api\Controllers;

use Flarum\Api\Controller\AbstractShowController;
use Flarum\Foundation\Paths;
use Flarum\Http\RequestUtil;
use Flarum\Tags\Api\Serializer\TagSerializer;
use Flarum\Tags\Tag;
use Illuminate\Support\Arr;
use Intervention\Image\ImageManagerStatic as Image;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Walsgit\Discussion\Cards\Validator\ImageUploadValidator;

class UploadTagImageController extends AbstractShowController
{
    public $serializer = TagSerializer::class;

    protected $validator;
    protected $paths;

    public function __construct(ImageUploadValidator $validator, Paths $paths)
    {
        $this->validator = $validator;
        $this->paths = $paths;
    }

    /** 
     * Handling the uploaded image
    **/
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertAdmin();

        $tagId = Arr::get($request->getParsedBody(), 'tagId');
        $uploadedFile = $request->getUploadedFiles()['walsgit_discussion_cards_tag_default_image'] ?? null;

        // file Validation
        $this->validator->assertValid(['walsgit_discussion_cards_tag_default_image' => $uploadedFile]);

        $tag = Tag::findOrFail($tagId);

        $uploadDir = $this->paths->public . '/assets/extensions/walsgit-discussion-cards';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $filename = 'tag-' . $tag->id . '-default-card-image.webp';
        $filePath = $uploadDir . '/' . $filename;

        // Processing uploaded image
        Image::make($uploadedFile->getStream()->getMetadata('uri'))
            ->resize(400, null, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            })
            ->encode('webp', 80)
            ->save($filePath);

        $tag->walsgit_discussion_cards_tag_default_image = $filename;
        $tag->save();

        return $tag;
    }
}
