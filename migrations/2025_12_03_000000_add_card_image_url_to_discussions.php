<?php

/*
 * This file is part of walsgit/discussion-cards
 *
 *  Copyright (c) 2025 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if ($schema->hasColumn('discussions', 'walsgit_card_image_url')) {
            return;
        }

        $schema->table('discussions', function (Blueprint $table) {
            $table->string('walsgit_card_image_url')->nullable();
        });
    },

    'down' => function (Builder $schema) {
        if (! $schema->hasColumn('discussions', 'walsgit_card_image_url')) {
            return;
        }
        $schema->table('discussions', function (Blueprint $table) {
            $table->dropColumn('walsgit_card_image_url');
        });
    },
];