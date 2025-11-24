<?php

namespace Walsgit\Discussion\Cards;

use Flarum\Extend;
use Flarum\Api\Controller\ListDiscussionsController;
use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Discussion\Discussion;
use Flarum\Tags\Api\Serializer\TagSerializer;
use Flarum\Api\Serializer\PostSerializer;

use Walsgit\Discussion\Cards\Api\Controllers\AdminImageController;
use Walsgit\Discussion\Cards\Api\Controllers\TagImageController;
use Walsgit\Discussion\Cards\Api\Controllers\UpdateAllowedTagsController;
use Walsgit\Discussion\Cards\Api\Controllers\UpdateTagSettingsController;
use Walsgit\Discussion\Cards\Validator\TagSettingsValidator;
use Walsgit\Discussion\Cards\Validator\ImageUploadValidator;
use Walsgit\Discussion\Cards\Image\CardImageResolver;
use Walsgit\Discussion\Cards\Providers\ImageProcessingProvider;
use Walsgit\Discussion\Cards\Providers\HtmlImageExtractorProvider;
use Walsgit\Discussion\Cards\Providers\TagImageSelectorProvider;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js')
        ->css(__DIR__ . '/less/admin.less'),

    (new Extend\Locales(__DIR__ . '/locale')),

    (new Extend\ApiController(ListDiscussionsController::class))
        ->addInclude(['firstPost', 'posts', 'posts.user', 'tags']),
    
    (new Extend\ApiSerializer(PostSerializer::class))
        ->attribute('contentHtml', function (PostSerializer $serializer, $post) {
            if ($post instanceof \Flarum\Post\CommentPost) {
                return $post->formatContent();
            }
            return null;
        }),
    
    (new Extend\ApiSerializer(DiscussionSerializer::class))
        ->attribute('cardImageUrl', function (DiscussionSerializer $serializer, Discussion $discussion) {
            /** @var CardImageResolver $resolver */
            $resolver = resolve(CardImageResolver::class);
            return $resolver->resolve($discussion);
        }),
    
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
        ->serializeToForum('walsgitDiscussionCardsAllowRepostLinks', 'walsgit_discussion_cards_allowRepostLinks')
        ->serializeToForum('walsgitDiscussionCardsUseListCards', 'walsgit_discussion_cards_useListCards'),
    
    (new Extend\ApiSerializer(TagSerializer::class))
        ->attribute('walsgitDiscussionCardsTagDefaultImage', function ($serializer, $model) {
            return $model->walsgit_discussion_cards_tag_default_image ?: null;
        })
        ->attribute('walsgitDiscussionCardsTagSettings', function ($serializer, $model) {
            return $model->walsgit_discussion_cards_tag_settings;
        }),

    (new Extend\Validator(TagsettingsValidator::class)),
    (new Extend\Validator(ImageUploadValidator::class)),

    new Extend\ServiceProvider(ImageProcessingProvider::class),
    new Extend\ServiceProvider(HtmlImageExtractorProvider::class),
    new Extend\ServiceProvider(TagImageSelectorProvider::class),

    (new Extend\Routes('api'))
        ->post('/walsgit_discussion_cards_default_image', 'walsgit_discussion_cards_default_image.upload', AdminImageController::class)
        ->delete('/walsgit_discussion_cards_default_image', 'walsgit_discussion_cards_default_image.delete', AdminImageController::class)
        ->post('/walsgit_discussion_cards_tag_default_image', 'walsgit_discussion_cards_tag_default_image.upload', TagImageController::class)
        ->delete('/walsgit_discussion_cards_tag_default_image', 'walsgit_discussion_cards_tag_default_image.delete', TagImageController::class)
        ->post('/walsgit_discussion_cards_tag_update_allowedTags', 'walsgit_discussion_cards_updateAllowedTags', UpdateAllowedTagsController::class)
        ->patch('/tags/{id}/tagSettings', 'walsgit_discussion_cards_updateTagSettings', UpdateTagSettingsController::class),
];
