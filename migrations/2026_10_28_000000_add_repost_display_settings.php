<?php

/*
 * This file is part of walsgit/flarum-discussion-cards
 *
 *  Copyright (c) 2026 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

use Flarum\Database\Migration;

// Adds two new options for 3rd party extension support of Repost

return Migration::addSettings([
    'walsgit_discussion_cards_showRepostIcon' => 0,
    'walsgit_discussion_cards_showRepostDomain' => 0,
]);
