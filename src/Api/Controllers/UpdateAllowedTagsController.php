<?php

namespace Walsgit\Discussion\Cards\Api\Controllers;

use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\Exception\PermissionDeniedException;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Laminas\Diactoros\Response\JsonResponse;
use Flarum\Http\RequestUtil;

class UpdateAllowedTagsController implements RequestHandlerInterface
{
    protected $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        
        if (!$actor->isAdmin()) {
            throw new PermissionDeniedException();
        }

        $body = $request->getParsedBody();
        $allowedTags = isset($body['allowedTags']) ? json_encode($body['allowedTags']) : '[]';

        $this->settings->set('walsgit_discussion_cards_allowedTags', $allowedTags);

        return new JsonResponse(['status' => 'success']);
    }
}
