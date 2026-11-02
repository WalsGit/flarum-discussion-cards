<?php

/*
 * This file is part of walsgit/flarum-discussion-cards
 *
 *  Copyright (c) 2026 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Walsgit\Discussion\Cards\Api\Controllers;

use Flarum\Discussion\Discussion;
use Flarum\Foundation\Paths;
use Flarum\Foundation\ValidationException;
use Flarum\Http\RequestUtil;
use Flarum\Locale\Translator;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Walsgit\Discussion\Cards\Services\CardImageUrlBuilder;
use Walsgit\Discussion\Cards\Services\RegenerateImagesService;

/**
 * Regenerates the card image of one discussion (forum discussion menu, admins only).
 * Not interactive: same network timeouts as the admin tools, not the short ones of the listeners.
 */
class RegenerateDiscussionImageController implements RequestHandlerInterface
{
    /** Stored value of a discussion image file (the only kind of file a regeneration can recreate). */
    protected const DISCUSSION_FILE = '#^discussion-\d+-[a-f0-9]+-[a-f0-9]+\.webp$#';

    public function __construct(
        protected RegenerateImagesService $regenerator,
        protected CardImageUrlBuilder $urlBuilder,
        protected Translator $translator,
        protected Paths $paths
    ) {}

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        RequestUtil::getActor($request)->assertAdmin();

        $rawId = Arr::get($request->getQueryParams(), 'id');

        if (!is_string($rawId) || !ctype_digit($rawId) || (int) $rawId < 1) {
            throw new ValidationException([
                'id' => $this->translator->trans('walsgit_discussion_cards.admin.errors.debugModalDiscussionId'),
            ]);
        }

        $id = (int) $rawId;

        if (!Discussion::query()->whereKey($id)->exists()) {
            return new JsonResponse(['errors' => [['status' => '404', 'code' => 'not_found']]], 404);
        }

        // Was the current image file missing from the disk? (the stored value does not change if it is recreated)
        $fileMissingBefore = $this->discussionFileMissing(
            Discussion::query()->whereKey($id)->value('walsgit_card_image_url')
        );

        try {
            $outcome = $this->regenerator->regenerateDiscussionDetailed($id);
        } catch (\Throwable $e) {
            return new JsonResponse(['errors' => [['status' => '500', 'code' => 'regeneration_failed']]], 500);
        }

        // Read back the stored value: it is null when the discussion ended up with no card image
        $stored = Discussion::query()->whereKey($id)->value('walsgit_card_image_url');

        $status = $outcome['status'];

        // Same path in the database, but the file was missing and has been recreated: it is a regeneration
        if ($status === RegenerateImagesService::STATUS_UNCHANGED && $fileMissingBefore && !$this->discussionFileMissing($stored)) {
            $status = RegenerateImagesService::STATUS_REGENERATED;
        }

        return new JsonResponse([
            // regenerated, unchanged or no_image (RegenerateImagesService::STATUS_*)
            'status'       => $status,
            'cardImageUrl' => $this->urlBuilder->build($stored),
        ]);
    }

    /**
     * True if the stored value is a discussion image file (strict name, inside the extension's folder)
     * that does not exist on the disk. Anything else (null, external URL, default image): false.
     */
    protected function discussionFileMissing(?string $stored): bool
    {
        if ($stored === null || !preg_match(self::DISCUSSION_FILE, $stored)) {
            return false;
        }

        return !is_file($this->paths->public . '/assets/extensions/walsgit-discussion-cards/' . $stored);
    }
}
