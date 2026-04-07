<?php

/*
 * This file is part of walsgit/discussion-cards
 *
 *  Copyright (c) 2026 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->table('discussions', function (Blueprint $table) {
            // Create index for general queries on card image URL
            $table->index('walsgit_card_image_url', 'idx_discussions_card_image_url');
            // Create index for finding discussions without card images
            $table->index(['walsgit_card_image_url', 'id'], 'idx_discussions_card_image_null');
        });
    },

    'down' => function (Builder $schema) {
        $schema->table('discussions', function (Blueprint $table) {
            $table->dropIndex('idx_discussions_card_image_url');
            $table->dropIndex('idx_discussions_card_image_null');
        });
    },
];