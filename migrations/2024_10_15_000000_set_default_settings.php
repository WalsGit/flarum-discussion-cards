<?php

/*
 * This file is part of walsgit/discussion-cards
 *
 *  Copyright (c) 2024 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

use Flarum\Database\Migration;

$allowedTags = [];

return Migration::addSettings([
    'walsgit_discussion_cards_default_image_path' => null,
    'walsgit_discussion_cards_allowedTags' => json_encode($allowedTags),
    'walsgit_discussion_cards_onIndexPage' => 0,
    'walsgit_discussion_cards_primaryCards' => 4,
    'walsgit_discussion_cards_desktopCardWidth' => 49,
    'walsgit_discussion_cards_tabletCardWidth' => 49,
    'walsgit_discussion_cards_previewText' => 0,
    'walsgit_discussion_cards_showAuthor' => 0,
    'walsgit_discussion_cards_showReplies' => 0,
    'walsgit_discussion_cards_showBadges' => 0,
    'walsgit_discussion_cards_showReadCards' => 0,
    'walsgit_discussion_cards_showViews' => 0,
]);
