<?php

/*
 * This file is part of walsgit/flarum-discussion-cards
 *
 *  Copyright (c) 2026 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Walsgit\Discussion\Cards\Services;

use Exception;
use Flarum\Discussion\Discussion;
use Flarum\Extension\ExtensionManager;
use Illuminate\Database\Eloquent\Builder;
use Walsgit\Discussion\Cards\Image\CardImageDecision;

class RegenerateImagesService
{
    public const DEFAULT_LIMIT = 20;

    public const STATUS_REGENERATED = 'regenerated';
    public const STATUS_UNCHANGED = 'unchanged';
    public const STATUS_NO_IMAGE = 'no_image';

    // Only in the detail given to the processIds() callback (not returned by regenerateDiscussionDetailed())
    public const STATUS_ERROR = 'error';
    public const STATUS_DRY_RUN = 'dry_run';

    public function __construct(
        protected CardImageRegenerationService $regenerator,
        protected ExtensionManager $extensionManager
    ) {}

    /**
     * Regenerates the card images of the given discussions, one by one.
     *
     * @param int[]         $ids
     * @param float|null    $timeBudget seconds after which we stop and return the remaining ids (null: no limit).
     *                                  At least one discussion is always processed.
     * @param callable|null $onItem     called after each discussion with (int $id, ?string $errorMessage, array $detail);
     *                                  $detail is described by ItemLogFormatter::item() (id, status, source, file, sourceImage,
     *                                  skipped, error), callbacks may declare only the first parameters
     *
     * `success` counts every discussion processed without error (regenerated + unchanged + noImage; all of them in a
     * dry run, where nothing is resolved). `noImage` are the discussions still without any card image because the resolver
     * found nothing (no image in the first post, no tag or general default image).
     *
     * @return array{success: int, regenerated: int, unchanged: int, noImage: int, errors: int, failures: array<int, array{id: int, message: string}>, remaining: int[]}
     */
    public function processIds(array $ids, bool $dryRun = false, ?float $timeBudget = null, ?callable $onItem = null): array
    {
        $start = microtime(true);
        $remaining = array_values($ids);
        $success = 0;
        $regenerated = 0;
        $unchanged = 0;
        $noImage = 0;
        $errors = 0;
        $failures = [];

        while (!empty($remaining)) {
            $processed = $success + $errors;

            if ($timeBudget !== null && $processed > 0 && (microtime(true) - $start) >= $timeBudget) {
                break;
            }

            $id = (int) array_shift($remaining);
            $error = null;
            $detail = ['id' => $id, 'status' => self::STATUS_DRY_RUN];

            try {
                if (!$dryRun) {
                    $outcome = $this->regenerateDiscussionDetailed($id);
                    $decision = $outcome['decision'];
                    $detail = [
                        'id' => $id,
                        'status' => $outcome['status'],
                        'source' => $decision->source,
                        'file' => $decision->file,
                        'sourceImage' => $decision->sourceImage,
                        'skipped' => $decision->skipped,
                    ];

                    match ($outcome['status']) {
                        self::STATUS_REGENERATED => $regenerated++,
                        self::STATUS_NO_IMAGE => $noImage++,
                        default => $unchanged++,
                    };
                }
                $success++;
            } catch (\Throwable $e) {
                $errors++;
                $error = $e->getMessage();
                $failures[] = ['id' => $id, 'message' => $error];
                $detail = ['id' => $id, 'status' => self::STATUS_ERROR, 'error' => $error];
            }

            if ($onItem !== null) {
                $onItem($id, $error, $detail);
            }
        }

        return [
            'success'     => $success,
            'regenerated' => $regenerated,
            'unchanged'   => $unchanged,
            'noImage'     => $noImage,
            'errors'      => $errors,
            'failures'    => $failures,
            'remaining'   => $remaining,
        ];
    }

    /**
     * @return array{status: string, decision: CardImageDecision} status is one of the STATUS_* constants
     */
    public function regenerateDiscussionDetailed(int $discussionId): array
    {
        $discussion = Discussion::with('firstPost')->find($discussionId);

        if (!$discussion) {
            throw new Exception("Discussion doesn't exist!");
        }

        $html = $discussion->firstPost ? $discussion->firstPost->formatContent() : null;

        $result = $this->regenerator->regenerateWithDecision($discussion, $html);

        if ($result['changed']) {
            $status = self::STATUS_REGENERATED;
        } else {
            $status = $discussion->walsgit_card_image_url === null
                ? self::STATUS_NO_IMAGE
                : self::STATUS_UNCHANGED;
        }

        return ['status' => $status, 'decision' => $result['decision']];
    }

    /**
     * Discussion ids for a preset used by the admin modal: 'latest', 'ltno' or 'without'.
     *
     * @return int[]
     */
    public function selectByMode(string $mode): array
    {
        switch ($mode) {
            case 'ltno':
                return array_values(array_unique(array_merge(
                    $this->getDiscussionIds('latest', self::DEFAULT_LIMIT),
                    $this->getDiscussionIds('top', self::DEFAULT_LIMIT),
                    $this->getDiscussionIds('newest', self::DEFAULT_LIMIT),
                    $this->getDiscussionIds('oldest', self::DEFAULT_LIMIT)
                )));

            case 'without':
                return $this->getDiscussionIdsWithoutImages(self::DEFAULT_LIMIT);

            default:
                return $this->getDiscussionIds('latest', self::DEFAULT_LIMIT);
        }
    }

    /**
     * @return int[]
     */
    public function getDiscussionIds(string $type, int $limit): array
    {
        $query = Discussion::query();

        switch ($type) {
            case 'latest':
                $query->orderByDesc('last_posted_at');
                break;

            case 'top':
                $query->orderByDesc('comment_count');
                break;

            case 'newest':
                $query->orderByDesc('created_at');
                break;

            case 'oldest':
                $query->orderBy('created_at');
                break;

            case 'popular':
                $this->applyViewsOrder($query, 'desc');
                break;

            case 'unpopular':
                $this->applyViewsOrder($query, 'asc');
                break;

            default:
                return [];
        }

        return $query
            ->limit($limit)
            ->pluck('id')
            ->all();
    }

    /**
     * @return int[]
     */
    public function getDiscussionIdsWithoutImages(int $limit): array
    {
        return Discussion::query()
            ->whereNull('walsgit_card_image_url')
            ->orderByDesc('last_posted_at')
            ->limit($limit)
            ->pluck('id')
            ->all();
    }

    /**
     * Checks if a supported "views" extension is enabled (needed for the popular / unpopular sorting).
     */
    public function isViewsSortAvailable(): bool
    {
        return $this->extensionManager->isEnabled('fof-discussion-views')
            || $this->extensionManager->isEnabled('michaelbelgium-discussion-views');
    }

    protected function applyViewsOrder(Builder $query, string $direction): void
    {
        // fof/discussion-views & michaelbelgium/flarum-discussion-views both use discussions.view_count
        if ($this->isViewsSortAvailable()) {
            // id DESC breaks ties so the most recent discussions come first
            $query->orderBy('view_count', $direction)->orderByDesc('id');
            return;
        }

        // No results if neither is active
        $query->whereRaw('1 = 0');
    }
}
