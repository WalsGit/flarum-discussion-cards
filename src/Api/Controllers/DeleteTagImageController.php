<?php

namespace Walsgit\Discussion\Cards\Api\Controllers;

use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\Foundation\Paths;
use Flarum\Tags\Tag;
use Laminas\Diactoros\Response\EmptyResponse;
use League\Flysystem\Adapter\Local;
use League\Flysystem\Filesystem;
use Psr\Http\Message\ServerRequestInterface;

class DeleteTagImageController extends AbstractDeleteController
{
    protected $paths;

    public function __construct(Paths $paths)
    {
        $this->paths = $paths;
    }

    protected function delete(ServerRequestInterface $request)
    {
        $request->getAttribute('actor')->assertAdmin();

        $tagId = $request->getParsedBody()['tagId'] ?? null;
        $tag = Tag::findOrFail($tagId);

        $path = $tag->walsgit_discussion_cards_tag_default_image;

        $tag->walsgit_discussion_cards_tag_default_image = null;
        $tag->save();

        $uploadDir = new Filesystem(new Local($this->paths->public.'/assets'));

        if ($path && $uploadDir->has($path)) {
            $uploadDir->delete($path);
        }

        return new EmptyResponse(204);
    }
}
