<?php

/*
 * This file is part of walsgit/flarum-discussion-cards
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
 *      > will regenerate card images for ALL discussions (ignores any other --flag option except --dry-run & --without)
 * discussion-cards:regenerate-images -w | --without [number of discussions without images to process]
 *      > will regenerate card images only for discussions without images (walsgit_card_image_url is NULL)
 *      > when used alone, processes latest 20 discussions without images
 *      > when combined with other flags, filters those discussions to only include those without images
 *      > when used with --all, regenerates images for ALL discussions without images
 *      > if a number is specified, limits processing to that many discussions without images
 *      > used alone (or with a number), it always takes the latest discussions still without images: those that no image can be
 *        found for (no image in the first post, no tag or general default image) are taken again at each run;
 *        use --all --without to go through every discussion without images once
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
 * > If fof/discussion-views or michaelbelgium/flarum-discussion-views is installed and activated:
 * discussion-cards:regenerate-images -p | --popular [number of discussions]
 *      > will regenerate card images for the [number] "Popular" discussions (most viewed discussions if Discussion Views is activated, default number is 20)
 * discussion-cards:regenerate-images -u | --unpopular [number of discussions]
 *      > will regenerate card images for the [number] "Unpopular" discussions (least viewed discussions if 3rd party extension Discussion Views is activated, default number is 20)
 */

namespace Walsgit\Discussion\Cards\Console;

use Flarum\Console\AbstractCommand;
use Flarum\Discussion\Discussion;
use Flarum\Locale\Translator;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\Tags\Tag;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Question\ConfirmationQuestion;
use Symfony\Component\Console\Helper\ProgressBar;
use Symfony\Component\Console\Exception\InvalidOptionException;
use Walsgit\Discussion\Cards\Services\RegenerateImagesService;

class RegenerateImagesCommand extends AbstractCommand
{
    private const DEFAULT_LIMIT = 20;
    private const DEFAULT_BATCH_SIZE = 100;

    public function __construct(
        protected RegenerateImagesService $regenerator,
        protected Translator $translator,
        protected SettingsRepositoryInterface $settings
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->setName('discussion-cards:regenerate-images')
            ->setDescription('Regenerate discussion card images')
            ->addOption('latest', 'l', InputOption::VALUE_OPTIONAL, 'Regenerate card images for the N number of latest discussions (default is 20)')
            ->addOption('top', 't', InputOption::VALUE_OPTIONAL, 'Regenerate card images for the N number of top discussions (default is 20)')
            ->addOption('newest', 'N', InputOption::VALUE_OPTIONAL, 'Regenerate card images for the N number of newest discussions (default is 20)')
            ->addOption('oldest', 'o', InputOption::VALUE_OPTIONAL, 'Regenerate card images for the N number of oldest discussions (default is 20)')
            ->addOption('popular', 'p', InputOption::VALUE_OPTIONAL, 'Regenerate card images for the N number of popular discussions (default is 20)')
            ->addOption('unpopular', 'u', InputOption::VALUE_OPTIONAL, 'Regenerate card images for the N number of unpopular discussions (default is 20)')
            ->addOption('discussion', 'd', InputOption::VALUE_OPTIONAL, 'Regenerate card images for specified discussion id(s) (comma separated)')
            ->addOption('all', 'a', InputOption::VALUE_NONE, 'Regenerate card images for all discussions')
            ->addOption('without', 'w', InputOption::VALUE_OPTIONAL, 'Regenerate card images only for discussions without images (walsgit_card_image_url is NULL). Alone, it takes the latest ones; with --all, it goes through all of them once', 'false')
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

        // --without: 'false' when not used, null when used without a number
        $without      = $this->input->getOption('without');
        $useWithout   = $without !== 'false';
        $withoutLimit = is_numeric($without) ? max(1, (int) $without) : null;

        // --all --without
        if ($all && $useWithout) {
            return $this->processAllWithoutImages($withoutLimit, $batchSize, $dryRun);
        }

        // --all
        if ($all && !$dryRun) {
            $helper   = $this->getHelperSet()->get('question');
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

        if (!$this->hasExplicitSelection()) {
            // No selection flag: latest discussions, or latest discussions without images with --without
            $discussionIds = $useWithout
                ? $this->regenerator->getDiscussionIdsWithoutImages($withoutLimit ?? self::DEFAULT_LIMIT)
                : $this->regenerator->getDiscussionIds('latest', self::DEFAULT_LIMIT);
        } else {
            $discussionIds = $this->collectDiscussionIds();

            // --without combined with other flags: keep only the discussions without images
            if ($useWithout) {
                $discussionIds = $this->filterDiscussionsWithoutImages($discussionIds);

                if ($withoutLimit !== null) {
                    $discussionIds = array_slice($discussionIds, 0, $withoutLimit);
                }
            }
        }

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
                if (in_array($type, ['popular', 'unpopular'], true) && !$this->regenerator->isViewsSortAvailable()) {
                    $this->output->writeln('<comment>' . $this->trans('ViewsExtensionRequired', ['option' => '--' . $type]) . '</comment>');
                }

                $raw   = $this->input->getOption($type);
                $limit = is_numeric($raw) ? max(1, (int) $raw) : self::DEFAULT_LIMIT;
                $ids   = array_merge($ids, $this->regenerator->getDiscussionIds($type, $limit));
            }
        }

        return array_values(array_unique($ids));
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

    private function filterDiscussionsWithoutImages(array $discussionIds): array
    {
        if (empty($discussionIds)) {
            return [];
        }

        $withoutImages = Discussion::query()
            ->whereIn('id', $discussionIds)
            ->whereNull('walsgit_card_image_url')
            ->pluck('id')
            ->map(fn($id) => (int) $id)
            ->all();

        return array_values(array_intersect($discussionIds, $withoutImages));
    }

    private function hasAnySortingFlag(): bool
    {
        foreach (['latest', 'top', 'newest', 'oldest', 'popular', 'unpopular'] as $type) {
            if ($this->hasSelectionFlag($type)) {
                return true;
            }
        }
        return false;
    }

    /**
     * True if the user chose which discussions to process (--discussion, --tag or a sorting flag).
     */
    private function hasExplicitSelection(): bool
    {
        return $this->input->hasParameterOption(['--discussion', '-d'])
            || $this->input->hasParameterOption('--tag')
            || $this->hasAnySortingFlag();
    }

    /**
     * =====================
     * PROCESSING
     * =====================
     */

    private function processDiscussionIds(array $ids, int $batchSize, bool $dryRun): int
    {
        $total = count($ids);

        $this->info($this->trans('Start', ['count' => $total]));

        $bar = new ProgressBar($this->output, $total);
        $bar->start();

        $result = $this->regenerator->processIds(
            $ids,
            $dryRun,
            null,
            $this->progressCallback($bar)
        );

        $bar->finish();
        $this->output->writeln('');

        $this->printSummary($total, $result, $dryRun);

        return Command::SUCCESS;
    }

    private function processAllDiscussions(int $batchSize, bool $dryRun): int
    {
        $total  = Discussion::count();
        $totals = $this->emptyTotals();
        $offset = 0;

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

            $this->addTotals($totals, $this->regenerator->processIds($ids, $dryRun, null, $this->progressCallback($bar)));

            $offset += $batchSize;
        } while (true);

        $bar->finish();
        $this->output->writeln('');

        $this->printSummary($total, $totals, $dryRun);

        return Command::SUCCESS;
    }

    private function processAllWithoutImages(?int $limit, int $batchSize, bool $dryRun): int
    {
        $total = Discussion::query()->whereNull('walsgit_card_image_url')->count();

        if ($limit !== null) {
            $total = min($limit, $total);
        }

        if ($total === 0) {
            $this->info($this->trans('NothingToDo'));
            return Command::SUCCESS;
        }

        $this->info($this->trans('StartAllWithout', ['count' => $total]));

        $bar = new ProgressBar($this->output, $total);
        $bar->start();

        $processed = 0;
        $totals    = $this->emptyTotals();
        $lastId    = 0;

        while ($limit === null || $processed < $limit) {
            $take = $limit === null ? $batchSize : min($batchSize, $limit - $processed);

            // Keyset pagination: processed rows may leave the whereNull set, so no offset
            $ids = Discussion::query()
                ->whereNull('walsgit_card_image_url')
                ->where('id', '>', $lastId)
                ->orderBy('id')
                ->limit($take)
                ->pluck('id')
                ->map(fn($id) => (int) $id)
                ->all();

            if (empty($ids)) {
                break;
            }

            $this->addTotals($totals, $this->regenerator->processIds($ids, $dryRun, null, $this->progressCallback($bar)));
            $processed += count($ids);
            $lastId     = max($ids);
        }

        $bar->finish();
        $this->output->writeln('');

        $this->printSummary($processed, $totals, $dryRun);

        return Command::SUCCESS;
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

    private function emptyTotals(): array
    {
        return ['success' => 0, 'regenerated' => 0, 'unchanged' => 0, 'noImage' => 0, 'errors' => 0];
    }

    private function addTotals(array &$totals, array $result): void
    {
        foreach (array_keys($totals) as $key) {
            $totals[$key] += $result[$key];
        }
    }

    private function progressCallback(ProgressBar $bar): callable
    {
        return function (int $id, ?string $error) use ($bar) {
            if ($error !== null) {
                $this->error(
                    $this->trans('Error', [
                        'id'      => $id,
                        'message' => $error,
                    ])
                );
            }

            $bar->advance();
        };
    }

    /**
     * @param array{success: int, regenerated: int, unchanged: int, noImage: int, errors: int} $totals
     */
    private function printSummary(?int $total, array $totals, bool $dryRun): void
    {
        $total ??= $totals['success'] + $totals['errors'];

        // A dry run resolves nothing: only the numbers of discussions that would be processed are known
        if ($dryRun) {
            $this->info(
                $this->trans('Summary', [
                    'total'   => $total,
                    'success' => $totals['success'],
                    'errors'  => $totals['errors'],
                    'mode'    => ' [DRY-RUN]',
                ])
            );

            return;
        }

        $this->info(
            $this->trans('SummaryDetailed', [
                'total'       => $total,
                'regenerated' => $totals['regenerated'],
                'unchanged'   => $totals['unchanged'],
                'noImage'     => $totals['noImage'],
                'errors'      => $totals['errors'],
            ])
        );

        if ($totals['noImage'] > 0) {
            $this->output->writeln('<comment>' . $this->trans('NoImageHint', ['count' => $totals['noImage']]) . '</comment>');
        }
    }

    protected function trans(string $key, array $params = []): string
    {
        return $this->translator->trans(
            'walsgit_discussion_cards.admin.console.regenerateImages' . $key,
            $params
        );
    }
}
