<?php

/*
 * This file is part of walsgit/discussion-cards
 *
 *  Copyright (c) 2026 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

    /**
     * This adds a CLI command discussion-cards:regenerate-images to re-analyse discussions' first posts and re-generate their card images.
     * 
     * discussion-cards:regenerate-images 
     *      > will regenerate card images for the "Latest" 20 discussions (default)
     * discussion-cards:regenerate-images -l | --latest [number of discussions]
     *      > will regenerate card images for the [number] "Latest" discussions (latest active discussions aka with the latest replies, default number is 20)
     * discussion-cards:regenerate-images -t | --top [number of discussions]
     *      > will regenerate card images for the [number] "Top" discussions (discussions with the most replies, default number is 20)
     * discussion-cards:regenerate-images -N | --newest [number of discussions]
     *      > will regenerate card images for the [number] "Newest" discussions (newest created discussions, default number is 20)
     * discussion-cards:regenerate-images -o | --oldest [number of discussions]
     *      > will regenerate card images for the [number] "Oldest" discussions (oldest created discussions, default number is 20)
     * discussion-cards:regenerate-images -a | --all 
     *      > will regenerate card images for ALL discussions (ignores any other --flag option except --dry-run)
     * discussion-cards:regenerate-images -d | --discussion [discussion.id] 
     *      > will regenerate card images of specific discussion ids (comma separated)
     * discussion-cards:regenerate-images --tag [tag.id OR tag.slug] 
     *      > will regenerate card images of specific tag ids or slug (comma separated) only for tags that have discussion cards activated for them
     * discussion-cards:regenerate-images -b | --batch-size [number of discussions]
     *      > will set a custom batch size for the number of discussions to be processed at once (default is 100)
     * discussion-cards:regenerate-images --dry-run
     *      > will simulate without regenerating anything
     * 
     * ======== 3rd party extensions support ========
     * > If flarumite/simple-discussion-views or michaelbelgium/flarum-discussion-views is installed and activated:
     * discussion-cards:regenerate-images -p | --popular [number of discussions]
     *      > will regenerate card images for the [number] "Popular" discussions (most viewed discussions if Discussion Views is activated, default number is 20)
     * discussion-cards:regenerate-images -u | --unpopular [number of discussions]
     *      > will regenerate card images for the [number] "Unpopular" discussions (least viewed discussions if 3rd party extension Discussion Views is activated, default number is 20)
     */

namespace Walsgit\Discussion\Cards\Console;

use Flarum\Console\AbstractCommand;
use Flarum\Discussion\Discussion;
use Flarum\Extension\ExtensionManager;
use Flarum\Locale\Translator;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\Tags\Tag;
use Illuminate\Database\Eloquent\Builder;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Question\ConfirmationQuestion;
use Symfony\Component\Console\Helper\ProgressBar;
use Symfony\Component\Console\Exception\InvalidOptionException;
use Walsgit\Discussion\Cards\Services\CardImageRegenerationService;


class RegenerateImagesCommand extends AbstractCommand
{
    protected static $defaultName = 'discussion-cards:regenerate-images';

    private const DEFAULT_LIMIT = 20;
    private const DEFAULT_BATCH_SIZE = 100;

    public function __construct(
        protected CardImageRegenerationService $regenerator,
        protected Translator $translator,
        protected ExtensionManager $extensionManager,
        protected SettingsRepositoryInterface $settings
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->setDescription('Regenerate discussion card images')
            ->addOption('latest', 'l', InputOption::VALUE_OPTIONAL, 'Regenerate card images for the N number of latest discussions (default is 20)')
            ->addOption('top', 't', InputOption::VALUE_OPTIONAL, 'Regenerate card images for the N number of top discussions (default is 20)')
            ->addOption('newest', 'N', InputOption::VALUE_OPTIONAL, 'Regenerate card images for the N number of newest discussions (default is 20)')
            ->addOption('oldest', 'o', InputOption::VALUE_OPTIONAL, 'Regenerate card images for the N number of oldest discussions (default is 20)')
            ->addOption('popular', 'p', InputOption::VALUE_OPTIONAL, 'Regenerate card images for the N number of popular discussions (default is 20)')
            ->addOption('unpopular', 'u', InputOption::VALUE_OPTIONAL, 'Regenerate card images for the N number of unpopular discussions (default is 20)')
            ->addOption('discussion', 'd', InputOption::VALUE_OPTIONAL, 'Regenerate card images for specified discussion id(s) (comma separated)')
            ->addOption('all', 'a', InputOption::VALUE_NONE, 'Regenerate card images for all discussions')
            ->addOption('dry-run', null, InputOption::VALUE_NONE, 'Simulate without changing or saving anything')
            ->addOption('batch-size', 'b', InputOption::VALUE_OPTIONAL, 'Set a custom batch size for the number of discussions to process at a time', self::DEFAULT_BATCH_SIZE)
            ->addOption('tag', null, InputOption::VALUE_OPTIONAL, 'Regenerate card images for all discussions of specified tag id(s) and/or quoted tag slug(s) (comma separated)');
    }

    protected function fire(): int
    {
        $this->validateShortOptions();

        $dryRun    = (bool) $this->input->getOption('dry-run');
        $all       = (bool) $this->input->getOption('all');
        $batchSize = max(1, (int) $this->input->getOption('batch-size'));

        // --all
        if ($all && !$dryRun) {
            $helper   = $this->getHelper('question');
            $question = new ConfirmationQuestion($this->trans('ConfirmAll') . ' ', false);

            if (!$helper->ask($this->input, $this->output, $question)) {
                $this->info($this->trans('Cancelled'));
                return Command::SUCCESS;
            }
        }

        if ($all) {
            return $this->processAllDiscussions($batchSize, $dryRun);
        }

        // --tag
        $rawTag = $this->input->getOption('tag');

        if ($this->input->hasParameterOption('--tag') && ($rawTag === null || $rawTag === '')) {
            $this->error($this->trans('InvalidTagOption'));
            return Command::FAILURE;
        }

        $discussionIds = $this->collectDiscussionIds();

        if (empty($discussionIds)) {
            $this->info($this->trans('NothingToDo'));
            return Command::SUCCESS;
        }

        return $this->processDiscussionIds($discussionIds, $batchSize, $dryRun);
    }

    /**
     * =====================
     * DISCUSSION SELECTION
     * =====================
     */

    private function collectDiscussionIds(): array
    {
        $ids = [];

        // Explicit discussion IDs
        if ($raw = $this->input->getOption('discussion')) {
            $ids = array_merge(
                $ids,
                array_filter(array_map('intval', explode(',', $raw)))
            );
        }

        // Tag-based selection
        if ($this->input->hasParameterOption('--tag')) {
            $ids = array_merge($ids, $this->getDiscussionsByTags());
        }

        // Sorting-based selection (cumulative)
        foreach (['latest', 'top', 'newest', 'oldest', 'popular', 'unpopular'] as $type) {
            if ($this->hasSelectionFlag($type)) {
                $raw   = $this->input->getOption($type);
                $limit = is_numeric($raw) ? max(1, (int) $raw) : self::DEFAULT_LIMIT;
                $ids   = array_merge($ids, $this->getDiscussions($type, $limit));
            }
        }

        return array_values(array_unique($ids));
    }

    private function getDiscussions(string $type, int $limit): array
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

    private function applyViewsOrder(Builder $query, string $direction): void
    {
        // 3rd party extension support for flarumite/simple-discussion-views
        if ($this->extensionManager->isEnabled('flarumite-simple-discussion-views')) {
            $query->orderBy('view_count', $direction);
            return;
        }

        // 3rd party extension support for michaelbelgium/flarum-discussion-views
        if ($this->extensionManager->isEnabled('michaelbelgium-discussion-views')) {
            $query
                ->leftJoin(
                    'discussion_views',
                    'discussion_views.discussion_id',
                    '=',
                    'discussions.id'
                )
                ->select('discussions.id')
                ->groupBy('discussions.id')
                ->orderByRaw('COUNT(discussion_views.id) ' . strtoupper($direction))
                ->orderByRaw('MAX(discussion_views.visited_at) DESC')
                ->orderBy('discussions.id', 'DESC');

            return;
        }

        // No results if neither is active
        $query->whereRaw('1 = 0');
    }

    private function getDiscussionsByTags(): array
    {
        $raw = $this->input->getOption('tag');

        $parts = array_filter(array_map('trim', explode(',', $raw)));

        if (!$parts) {
            return [];
        }

        $explicitIds = [];
        $slugs       = [];

        foreach ($parts as $part) {
            if (ctype_digit($part)) {
                $explicitIds[] = (int) $part;
            } else {
                $slugs[] = trim($part, '"');
            }
        }

        // Resolve slugs to IDs
        $slugIds = [];

        if ($slugs) {
            $slugIds = Tag::query()
                ->whereIn('slug', $slugs)
                ->pluck('id')
                ->all();
        }

        $requestedTagIds = array_unique(
            array_merge($explicitIds, $slugIds)
        );

        if (!$requestedTagIds) {
            return [];
        }

        // Filter only tags where Discussion Cards is enabled
        $allowedTagIds = $this->getAllowedTagIds();

        $validTagIds = array_values(
            array_intersect($requestedTagIds, $allowedTagIds)
        );

        if (!$validTagIds) {
            return [];
        }

        return Discussion::query()
            ->whereHas('tags', function ($q) use ($validTagIds) {
                $q->whereIn('tags.id', $validTagIds);
            })
            ->pluck('id')
            ->all();
    }


    /**
     * =====================
     * PROCESSING
     * =====================
     */

    private function processDiscussionIds(array $ids, int $batchSize, bool $dryRun): int
    {
        $total   = count($ids);
        $success = 0;
        $errors  = 0;

        $this->info($this->trans('Start', ['count' => $total]));

        $bar = new ProgressBar($this->output, $total);
        $bar->start();

        foreach (array_chunk($ids, $batchSize) as $batch) {
            foreach ($batch as $id) {
                try {
                    if (!$dryRun) {
                        $this->regenerateDiscussion($id);
                    }
                    $success++;
                } catch (\Throwable $e) {
                    $errors++;
                    $this->error(
                        $this->trans('Error', [
                            'id'      => $id,
                            'message' => $e->getMessage(),
                        ])
                    );
                }

                $bar->advance();
            }
        }

        $bar->finish();
        $this->output->writeln('');

        $this->printSummary($total, $success, $errors, $dryRun);

        return Command::SUCCESS;
    }

    private function processAllDiscussions(int $batchSize, bool $dryRun): int
    {
        $total   = Discussion::count();
        $success = 0;
        $errors  = 0;
        $offset  = 0;

        $this->info($this->trans('StartAll', ['count' => $total]));

        $bar = new ProgressBar($this->output, $total);
        $bar->start();

        do {
            $ids = Discussion::query()
                ->orderBy('id')
                ->offset($offset)
                ->limit($batchSize)
                ->pluck('id')
                ->all();

            if (empty($ids)) {
                break;
            }

            foreach ($ids as $id) {
                try {
                    if (!$dryRun) {
                        $this->regenerateDiscussion($id);
                    }
                    $success++;
                } catch (\Throwable $e) {
                    $errors++;
                    $this->error(
                        $this->trans('Error', [
                            'id'      => $id,
                            'message' => $e->getMessage(),
                        ])
                    );
                }

                $bar->advance();
            }

            $offset += $batchSize;
        } while (true);

        $bar->finish();
        $this->output->writeln('');

        $this->printSummary($total, $success, $errors, $dryRun);

        return Command::SUCCESS;
    }

    /**
     * =====================
     * REGENERATION
     * =====================
     */

    private function regenerateDiscussion(int $discussionId): void
    {
        $discussion = Discussion::with('firstPost')->find($discussionId);

        if (!$discussion || !$discussion->firstPost) {
            throw new \RuntimeException('first post not found');
        }

        $html = $discussion->firstPost->content;

        $this->regenerator->regenerate($discussion, $html, true);
    }

    /**
     * =====================
     * HELPERS
     * =====================
     */

    private function validateShortOptions(): void
    {
        foreach ($_SERVER['argv'] as $arg) {
            if (
                str_starts_with($arg, '-') &&
                !str_starts_with($arg, '--') &&
                strlen($arg) > 2
            ) {
                throw new InvalidOptionException(
                    sprintf('The "%s" option does not exist.', $arg)
                );
            }
        }
    }

    private function hasSelectionFlag(string $type): bool
    {
        return $this->input->hasParameterOption([
            '--' . $type,
            match ($type) {
                'latest'    => '-l',
                'top'       => '-t',
                'newest'    => '-N',
                'oldest'    => '-o',
                'popular'   => '-p',
                'unpopular' => '-u',
            }
        ]);
    }

    private function getAllowedTagIds(): array
    {
        $raw = $this->settings->get('walsgit_discussion_cards_allowedTags');

        if (!$raw) {
            return [];
        }

        $ids = json_decode($raw, true);

        return is_array($ids)
            ? array_map('intval', $ids)
            : [];
    }



    /**
     * =====================
     * FEEDBACK / I18N
     * =====================
     */

    private function printSummary(?int $total, int $success, int $errors, bool $dryRun): void
    {
        $this->info(
            $this->trans('Summary', [
                'total'   => $total ?? ($success + $errors),
                'success' => $success,
                'errors'  => $errors,
                'mode'    => $dryRun ? ' [DRY-RUN]' : '',
            ])
        );
    }

    protected function trans(string $key, array $params = []): string
    {
        return $this->translator->trans(
            'walsgit_discussion_cards.admin.console.regenerateImages' . $key,
            $params
        );
    }
}

