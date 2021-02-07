<?php

namespace Dem13n\Discussion\Cards;

use Flarum\Extend;
use Flarum\Api\Controller\ListDiscussionsController;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js')
        ->css(__DIR__ . '/less/admin.less'),

    (new Extend\ApiController(ListDiscussionsController::class))
        ->addInclude('firstPost'),

    (new Extend\Locales(__DIR__ . '/locale')),

    (new Extend\Settings())
        ->serializeToForum('defaultImg', 'dem13n_discussion_cards_defaultImg')
        ->serializeToForum('allowedTags', 'dem13n_discussion_cards_allowedTags')
        ->serializeToForum('cardBadges', 'dem13n_discussion_cards_cardBadges')
        ->serializeToForum('smallCards', 'dem13n_discussion_cards_smallCards')
        ->serializeToForum('cardFooter', 'dem13n_discussion_cards_cardFooter')
        ->serializeToForum('previewText', 'dem13n_discussion_cards_previewText')
];
