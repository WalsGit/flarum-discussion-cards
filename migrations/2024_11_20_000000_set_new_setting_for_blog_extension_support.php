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
    'walsgit_discussion_cards_useBlogImages' => 0,
    'walsgit_discussion_cards_useBlogSummary' => 0,
]);
