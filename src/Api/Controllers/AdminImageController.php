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

use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\Foundation\Paths;
use Flarum\Locale\Translator;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Walsgit\Discussion\Cards\Services\ImageProcessingService;
use Exception;

class AdminImageController implements RequestHandlerInterface
{
    protected $settings;
    protected ImageProcessingService $imageService;
    protected Paths $paths;
    protected Translator $translator;

    public function __construct(SettingsRepositoryInterface $settings, ImageProcessingService $imageService, Paths $paths, Translator $translator)
    {
        $this->settings = $settings;
        $this->imageService = $imageService;
        $this->paths = $paths;
        $this->translator = $translator;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $method = strtoupper($request->getMethod());

        try {
            switch ($method) {
                case 'POST':
                $result = $this->imageService->handleUpload($request, 'default');

                if (empty($result['path'])) {
                    throw new Exception($this->translator->trans('walsgit_discussion_cards.admin.errors.adminImageNoPath'));
                }

                $this->settings->set('walsgit_discussion_cards_default_image_path', $result['path']);

                return new JsonResponse([
                    'status' => 'ok',
                    'path'   => $result['path'],
                    'url'    => $result['url'],
                ]);

                case 'DELETE':
                    $deleted = $this->imageService->handleDelete('default');
                    $this->settings->set('walsgit_discussion_cards_default_image_path', null);
                    return new JsonResponse([
                        'status' => $deleted ? 'deleted' : 'not_found',
                    ]);

                default:
                    return new JsonResponse(['error' => $this->translator->trans('walsgit_discussion_cards.admin.errors.adminImageUnauthorizedMethod')], 405);
            }
        } catch (Exception $e) {
            // Messages visibles uniquement côté admin
            return new JsonResponse([
                'error' => $this->translator->trans('walsgit_discussion_cards.admin.errors.adminImageProcessingError') . $e->getMessage(),
            ], 400);
        }
    }
}
