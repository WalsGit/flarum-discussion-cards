<?php

/*
 * This file is part of walsgit/flarum-discussion-cards
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Walsgit\Discussion\Cards\Api\Controllers;

use Flarum\Http\RequestUtil;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\Foundation\Paths;
use Flarum\Locale\Translator;
use Illuminate\Validation\ValidationException;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Walsgit\Discussion\Cards\Services\ImageProcessingService;
use Walsgit\Discussion\Cards\Validator\ImageUploadValidator;
use Exception;

class AdminImageController implements RequestHandlerInterface
{
    public function __construct(
        protected SettingsRepositoryInterface $settings,
        protected ImageProcessingService $imageService,
        protected Paths $paths,
        protected Translator $translator,
        protected ImageUploadValidator $validator
    ) {}

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        RequestUtil::getActor($request)->assertAdmin();

        $method = strtoupper($request->getMethod());

        try {
            switch ($method) {
                case 'POST':
                    $uploadedFiles = $request->getUploadedFiles();
                    $this->validator->assertValid([
                        'walsgit_discussion_cards_default_image' => $uploadedFiles['walsgit_discussion_cards_default_image']
                            ?? $uploadedFiles['file']
                            ?? null,
                    ]);

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
        } catch (ValidationException $e) {
            throw $e;
        } catch (Exception $e) {
            return new JsonResponse([
                'error' => $this->translator->trans('walsgit_discussion_cards.admin.errors.adminImageProcessingError') . $e->getMessage(),
            ], 400);
        }
    }
}
