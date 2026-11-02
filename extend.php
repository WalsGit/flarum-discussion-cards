<?php

namespace Walsgit\Discussion\Cards;

use Flarum\Extend;
use Flarum\Api\Endpoint;
use Flarum\Api\Resource;
use Flarum\Api\Schema;
use Flarum\Discussion\Discussion;
use Flarum\Extension\ExtensionManager;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\Tags\Api\Resource\TagResource;

use Walsgit\Discussion\Cards\Api\Controllers\AdminImageController;
use Walsgit\Discussion\Cards\Api\Controllers\TagImageController;
use Walsgit\Discussion\Cards\Api\Controllers\UpdateTagSettingsController;
use Walsgit\Discussion\Cards\Api\Controllers\UpdateAllowedTagsController;
use Walsgit\Discussion\Cards\Api\Controllers\StatisticsController;
use Walsgit\Discussion\Cards\Api\Controllers\RefreshStatsController;
use Walsgit\Discussion\Cards\Api\Controllers\PurgeImagesController;
use Walsgit\Discussion\Cards\Api\Controllers\RegenerateImagesController;
use Walsgit\Discussion\Cards\Api\Controllers\ShowInfoController;
use Walsgit\Discussion\Cards\Api\Controllers\ScanBrokenImagesController;
use Walsgit\Discussion\Cards\Api\Controllers\ResetBrokenImagesController;
use Walsgit\Discussion\Cards\Api\Controllers\CheckDiscussionController;
use Walsgit\Discussion\Cards\Services\CardImageUrlBuilder;
use Walsgit\Discussion\Cards\Validator\TagSettingsValidator;
use Walsgit\Discussion\Cards\Validator\ImageUploadValidator;
use Walsgit\Discussion\Cards\Providers\ImageProcessingProvider;
use Walsgit\Discussion\Cards\Providers\HtmlImageExtractorProvider;
use Walsgit\Discussion\Cards\Providers\TagImageSelectorProvider;
use Walsgit\Discussion\Cards\Console\MigrateImagesCommand;
use Walsgit\Discussion\Cards\Console\PurgeImagesCommand;
use Walsgit\Discussion\Cards\Console\RegenerateImagesCommand;
use Walsgit\Discussion\Cards\Console\RepairImagesCommand;
use Walsgit\Discussion\Cards\Listener\UpdateCardImageOnDiscussionUpdate;
use Walsgit\Discussion\Cards\Listener\DeleteCardImageOnDiscussionDelete;
use Walsgit\Discussion\Cards\Middleware\RefreshBlogDefaultImage;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js')
        ->css(__DIR__ . '/less/admin.less'),

    (new Extend\Locales(__DIR__ . '/locale')),

    (new Extend\ApiResource(Resource\DiscussionResource::class))
        ->endpoint(['index'], function (Endpoint\Index $endpoint) {
            // firstPost is only needed for the text preview (global setting, no per-tag override).
            $settings = resolve(SettingsRepositoryInterface::class);

            if ((int) $settings->get('walsgit_discussion_cards_previewText') === 1) {
                $endpoint->addDefaultInclude(['firstPost']);

                // blogMeta (3rd party blog extension) is only needed for the blog posts' summary used as preview text.
                if ((int) $settings->get('walsgit_discussion_cards_useBlogSummary') === 1
                    && resolve(ExtensionManager::class)->isEnabled('fof-blog')) {
                    $endpoint->addDefaultInclude(['blogMeta']);
                }
            }

            return $endpoint;
        })
        ->fields(function () {
            return [
                Schema\Str::make('cardImageUrl')
                    ->get(function (Discussion $discussion) {
                        // Stored value is a relative path: the URL is rebuilt from the current forum URL
                        static $builder = null;
                        $builder ??= resolve(CardImageUrlBuilder::class);

                        return $builder->build($discussion->walsgit_card_image_url);
                    }),
            ];
        }),

    (new Extend\Event())
        ->listen(\Flarum\Post\Event\Posted::class, \Walsgit\Discussion\Cards\Listener\GenerateCardImageOnDiscussionCreate::class)
        ->subscribe(UpdateCardImageOnDiscussionUpdate::class)
        ->subscribe(DeleteCardImageOnDiscussionDelete::class),


    (new Extend\Settings())
        ->serializeToForum('walsgitDiscussionCardsAllowedTags', 'walsgit_discussion_cards_allowedTags')
        ->serializeToForum('walsgitDiscussionCardsOnIndexPage', 'walsgit_discussion_cards_onIndexPage')
        ->serializeToForum('walsgitDiscussionCardsPrimaryCards', 'walsgit_discussion_cards_primaryCards')
        ->serializeToForum('walsgitDiscussionCardsDesktopCardWidth', 'walsgit_discussion_cards_desktopCardWidth')
        ->serializeToForum('walsgitDiscussionCardsTabletCardWidth', 'walsgit_discussion_cards_tabletCardWidth')
        ->serializeToForum('walsgitDiscussionCardsDefaultImage', 'walsgit_discussion_cards_default_image_path')
        ->serializeToForum('walsgitDiscussionCardsPreviewText', 'walsgit_discussion_cards_previewText')
        ->serializeToForum('walsgitDiscussionCardsShowAuthor', 'walsgit_discussion_cards_showAuthor')
        ->serializeToForum('walsgitDiscussionCardsShowReplies', 'walsgit_discussion_cards_showReplies')
        ->serializeToForum('walsgitDiscussionCardsShowBadges', 'walsgit_discussion_cards_showBadges')
        ->serializeToForum('walsgitDiscussionCardsMarkReadCards', 'walsgit_discussion_cards_markReadCards')
        ->serializeToForum('walsgitDiscussionCardsShowViews', 'walsgit_discussion_cards_showViews')
        ->serializeToForum('walsgitDiscussionCardsUseBlogImages', 'walsgit_discussion_cards_useBlogImages')
        ->serializeToForum('walsgitDiscussionCardsUseBlogSummary', 'walsgit_discussion_cards_useBlogSummary')
        ->serializeToForum('walsgitDiscussionCardsShowRepliesOnRight', 'walsgit_discussion_cards_showRepliesOnRight')
        ->serializeToForum('walsgitDiscussionCardsShowLastPostInfo', 'walsgit_discussion_cards_showLastPostInfo')
        ->serializeToForum('walsgitDiscussionCardsAllowRepostLinks', 'walsgit_discussion_cards_allowRepostLinks')
        ->serializeToForum('walsgitDiscussionCardsShowRepostIcon', 'walsgit_discussion_cards_showRepostIcon')
        ->serializeToForum('walsgitDiscussionCardsShowRepostDomain', 'walsgit_discussion_cards_showRepostDomain')
        ->serializeToForum('walsgitDiscussionCardsUseListCards', 'walsgit_discussion_cards_useListCards')
        ->serializeToForum('walsgitDiscussionCardsListCardsCount', 'walsgit_discussion_cards_listCardsCount'),
    
    (new Extend\ApiResource(TagResource::class))
        ->fields(function () {
            return [
                Schema\Str::make('walsgitDiscussionCardsTagDefaultImage')
                    ->get(function ($tag) {
                        return $tag->walsgit_discussion_cards_tag_default_image ?: null;
                    }),
                Schema\Str::make('walsgitDiscussionCardsTagSettings')
                    ->get(function ($tag) {
                        return $tag->walsgit_discussion_cards_tag_settings;
                    }),
            ];
        }),

    (new Extend\Validator(TagSettingsValidator::class)),
    (new Extend\Validator(ImageUploadValidator::class)),

    // 3rd party extension fof/blog fires no event on its default image upload: refresh our optimized copy afterwards
    (new Extend\Middleware('api'))
        ->add(RefreshBlogDefaultImage::class),

    new Extend\ServiceProvider(ImageProcessingProvider::class),
    new Extend\ServiceProvider(HtmlImageExtractorProvider::class),
    new Extend\ServiceProvider(TagImageSelectorProvider::class),

    (new Extend\Routes('api'))
        ->post('/walsgit/discussion-cards/default-image', 'walsgit.discussion-cards.default-image-upload', AdminImageController::class)
        ->delete('/walsgit/discussion-cards/default-image', 'walsgit.discussion-cards.default-image-delete', AdminImageController::class)
        ->post('/walsgit/discussion-cards/tag-default-image/{tagId}', 'walsgit.discussion-cards.tag-default-image.upload', TagImageController::class)
        ->delete('/walsgit/discussion-cards/tag-default-image/{tagId}', 'walsgit.discussion-cards.tag-default-image.delete', TagImageController::class)
        ->patch('/walsgit/discussion-cards/tag-{tagId}-settings', 'walsgit.discussion-cards.tag-settings', UpdateTagSettingsController::class)
        ->post('/walsgit/discussion-cards/tag-update-allowed-tags', 'walsgit.discussion-cards.update-allowed-tags', UpdateAllowedTagsController::class)
        ->get('/walsgit/discussion-cards/image-stats', 'walsgit.discussion-cards.image-stats', StatisticsController::class)
        ->post('/walsgit/discussion-cards/image-stats/refresh', 'walsgit.discussion-cards.image-stats.refresh', RefreshStatsController::class)
        ->post('/walsgit/discussion-cards/purge-images', 'walsgit.discussion-cards.purge-images', PurgeImagesController::class)
        ->post('/walsgit/discussion-cards/regenerate-images', 'walsgit.discussion-cards.regenerate-images', RegenerateImagesController::class)
        ->get('/walsgit/discussion-cards/broken-images', 'walsgit.discussion-cards.broken-images', ScanBrokenImagesController::class)
        ->post('/walsgit/discussion-cards/broken-images/reset', 'walsgit.discussion-cards.broken-images.reset', ResetBrokenImagesController::class)
        ->get('/walsgit/discussion-cards/info', 'walsgit.discussion-cards.info', ShowInfoController::class)
        ->get('/walsgit/discussion-cards/check-discussion/{id}', 'walsgit.discussion-cards.check-discussion', CheckDiscussionController::class),
    
    (new Extend\Console())
        ->command(MigrateImagesCommand::class)
        ->command(PurgeImagesCommand::class)
        ->command(RegenerateImagesCommand::class)
        ->command(RepairImagesCommand::class),
];
