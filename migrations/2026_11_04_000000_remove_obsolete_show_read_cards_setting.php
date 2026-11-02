<?php

/*
 * This file is part of walsgit/flarum-discussion-cards
 *
 *  Copyright (c) 2026 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

use Flarum\Settings\DatabaseSettingsRepository;
use Illuminate\Database\Schema\Builder;

// walsgit_discussion_cards_showReadCards was set by the first migration but is no longer used
// Replaced by walsgit_discussion_cards_markReadCards a while ago.

return [
    'up' => function (Builder $schema) {
        (new DatabaseSettingsRepository($schema->getConnection()))
            ->delete('walsgit_discussion_cards_showReadCards');
    },
    'down' => function (Builder $schema) {
        (new DatabaseSettingsRepository($schema->getConnection()))
            ->set('walsgit_discussion_cards_showReadCards', 0);
    },
];
