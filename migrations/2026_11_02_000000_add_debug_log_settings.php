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

// Adds the two debug options that log the actions run from the admin page

return Migration::addSettings([
    'walsgit_discussion_cards_logActions' => 0,
    'walsgit_discussion_cards_logActionDetails' => 0,
]);
