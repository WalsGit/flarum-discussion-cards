<?php

/*
 * This file is part of walsgit/discussion-cards
 *
 *  Copyright (c) 2024 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {

        $schema->table('tags', function (Blueprint $table) {
                $table->text('walsgit_discussion_cards_tag_settings')->nullable()->after('walsgit_discussion_cards_tag_default_image');
        });
    },

    'down' => function (Builder $schema) {
        $schema->table('tags', function (Blueprint $table) {
            $table->dropColumn('walsgit_discussion_cards_tag_settings');
        });
    },
];