<?php

namespace Walsgit\Discussion\Cards\Api\Controllers;

use Flarum\Api\Controller\ShowForumController;
use Flarum\Foundation\Paths;
use Flarum\Tags\Tag;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Intervention\Image\ImageManagerStatic as Image;
use League\Flysystem\Adapter\Local;
use League\Flysystem\Filesystem;
use League\Flysystem\MountManager;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class UploadTagImageController extends ShowForumController
{
    protected $paths;

    public function __construct(Paths $paths)
    {
        $this->paths = $paths;
    }

    public function data(ServerRequestInterface $request, Document $document)
    {
        $request->getAttribute('actor')->assertAdmin();

        $file = Arr::get($request->getUploadedFiles(), 'walsgit_discussion_cards_tag_default_image');
        $tagId = Arr::get($request->getParsedBody(), 'tagId');

        $tag = Tag::findOrFail($tagId);

        $tmpFile = tempnam($this->paths->storage . '/tmp', 'card_image');
        $file->moveTo($tmpFile);

        $image = Image::make($tmpFile)
            ->resize(400, null, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            })->encode('png');

        file_put_contents($tmpFile, $image);

        $mount = new MountManager([
            'source' => new Filesystem(new Local(pathinfo($tmpFile, PATHINFO_DIRNAME))),
            'target' => new Filesystem(new Local($this->paths->public . '/assets')),
        ]);

        if ($tag->walsgit_discussion_cards_tag_default_image && $mount->has($file = "target://{$tag->walsgit_discussion_cards_tag_default_image}")) {
            $mount->delete($file);
        }

        $uploadName = 'tag-' . $tagId . '-card-image-' . Str::lower(Str::random(8)) . '.png';

        $mount->move('source://' . pathinfo($tmpFile, PATHINFO_BASENAME), "target://$uploadName");

        $tag->walsgit_discussion_cards_tag_default_image = $uploadName;
        $tag->save();

        return parent::data($request, $document);
    }
}
