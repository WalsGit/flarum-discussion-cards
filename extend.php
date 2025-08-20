<?php

namespace Walsgit\Discussion\Cards;

use Flarum\Extend;
use Flarum\Api\Controller\ListDiscussionsController;
use Walsgit\Discussion\Cards\Api\Controllers\UploadImageController;
use Walsgit\Discussion\Cards\Api\Controllers\DeleteImageController;
use Walsgit\Discussion\Cards\Api\Controllers\UploadTagImageController;
use Walsgit\Discussion\Cards\Api\Controllers\DeleteTagImageController;
use Walsgit\Discussion\Cards\Api\Controllers\UpdateAllowedTagsController;
use Walsgit\Discussion\Cards\Api\Controllers\UpdateTagSettingsController;
use Flarum\Tags\Api\Serializer\TagSerializer;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js')
        ->css(__DIR__ . '/less/admin.less'),

    (new Extend\Locales(__DIR__ . '/locale')),

    (new Extend\ApiController(ListDiscussionsController::class))
        ->addInclude(['firstPost', 'posts', 'posts.user']),

    new Extenders\RegisterLessVariables(),

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
        ->serializeToForum('walsgitDiscussionCardsAllowRepostLinks', 'walsgit_discussion_cards_allowRepostLinks'),
    
        (new Extend\ApiSerializer(TagSerializer::class))
        ->attribute('walsgitDiscussionCardsTagDefaultImage', function ($serializer, $model) {
            return $model->walsgit_discussion_cards_tag_default_image;
        })
        ->attribute('walsgitDiscussionCardsTagSettings', function ($serializer, $model) {
            return $model->walsgit_discussion_cards_tag_settings;
        }),

    (new Extend\Routes('api'))
        ->post('/walsgit_discussion_cards_default_image', 'walsgit_discussion_cards_default_image', UploadImageController::class)
        ->delete('/walsgit_discussion_cards_default_image', 'walsgit_discussion_cards_default_image.delete', DeleteImageController::class)
        ->post('/walsgit_discussion_cards_tag_default_image', 'walsgit_discussion_cards_tag_default_image', UploadTagImageController::class)
        ->delete('/walsgit_discussion_cards_tag_default_image', 'walsgit_discussion_cards_tag_default_image.delete', DeleteTagImageController::class)
        ->post('/walsgit_discussion_cards_tag_update_allowedTags', 'walsgit_discussion_cards_updateAllowedTags', UpdateAllowedTagsController::class)
        ->patch('/tags/{id}/tagSettings', 'walsgit_discussion_cards_updateTagSettings', UpdateTagSettingsController::class)
];
