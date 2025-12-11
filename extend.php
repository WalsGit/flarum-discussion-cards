<?php

namespace Walsgit\Discussion\Cards;

use Flarum\Extend;
use Flarum\Api\Controller\ListDiscussionsController;
use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Api\Serializer\PostSerializer;
use Flarum\Discussion\Discussion;
use Flarum\Discussion\Event\Deleting;
use Flarum\Tags\Api\Serializer\TagSerializer;
use Flarum\Post\Event\Revised;
use Flarum\Post\Event\Deleting as PostDeleting;
use Flarum\Tags\Event\DiscussionWasTagged;
use V17Development\FlarumBlog\Event\BlogMetaSaving;

use Walsgit\Discussion\Cards\Api\Controllers\AdminImageController;
use Walsgit\Discussion\Cards\Api\Controllers\TagImageController;
use Walsgit\Discussion\Cards\Api\Controllers\UpdateAllowedTagsController;
use Walsgit\Discussion\Cards\Api\Controllers\UpdateTagSettingsController;
use Walsgit\Discussion\Cards\Validator\TagSettingsValidator;
use Walsgit\Discussion\Cards\Validator\ImageUploadValidator;
use Walsgit\Discussion\Cards\Providers\ImageProcessingProvider;
use Walsgit\Discussion\Cards\Providers\HtmlImageExtractorProvider;
use Walsgit\Discussion\Cards\Providers\TagImageSelectorProvider;
use Walsgit\Discussion\Cards\Console\MigrateImagesCommand;
use Walsgit\Discussion\Cards\Listeners\UpdateCardImageOnDiscussionUpdate;
use Walsgit\Discussion\Cards\Listeners\DeleteCardImageOnDiscussionDelete;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js')
        ->css(__DIR__ . '/less/admin.less'),

    (new Extend\Locales(__DIR__ . '/locale')),

    new Extenders\RegisterLessVariables(),

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
        ->attribute('cardImageUrl', function ($serializer, Discussion $discussion) {
            return $discussion->walsgit_card_image_url ?: null;
        }),

    (new Extend\Event())
        ->listen(\Flarum\Post\Event\Posted::class, \Walsgit\Discussion\Cards\Listeners\GenerateCardImageOnDiscussionCreate::class)
        ->listen(Revised::class, [UpdateCardImageOnDiscussionUpdate::class, 'onPostRevised'])
        ->listen(DiscussionWasTagged::class, [UpdateCardImageOnDiscussionUpdate::class, 'onDiscussionTagged'])
        ->listen(BlogMetaSaving::class, [UpdateCardImageOnDiscussionUpdate::class, 'onBlogMetaSaving'])
        ->Listen(Deleting::class, [DeleteCardImageOnDiscussionDelete::class, 'onDiscussionDeleting'])
        ->Listen(PostDeleting::class, [DeleteCardImageOnDiscussionDelete::class, 'onFirstPostDeleting']),


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
        ->serializeToForum('walsgitDiscussionCardsUseListCards', 'walsgit_discussion_cards_useListCards')
        ->serializeToForum('walsgitDiscussionCardsListCardsCount', 'walsgit_discussion_cards_listCardsCount'),
    
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
    
    (new Extend\Console())
        ->command(MigrateImagesCommand::class),
];
