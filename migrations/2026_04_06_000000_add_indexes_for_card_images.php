<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $connection = $schema->getConnection();

        // Get existing indexes
        $indexesResult = $connection->select('SHOW INDEX FROM discussions');
        $existingIndexes = [];
        foreach ($indexesResult as $index) {
            $existingIndexes[] = $index->Key_name;
        }

        // Create index for general queries on card image URL
        if (!in_array('idx_discussions_card_image_url', $existingIndexes)) {
            $connection->statement(
                'CREATE INDEX idx_discussions_card_image_url ON discussions (walsgit_card_image_url)'
            );
        }

        // Create index for finding discussions without card images
        if (!in_array('idx_discussions_card_image_null', $existingIndexes)) {
            $connection->statement(
                'CREATE INDEX idx_discussions_card_image_null ON discussions (walsgit_card_image_url, id)'
            );
        }
    },

    'down' => function (Builder $schema) {
        $connection = $schema->getConnection();

        // Drop indexes
        $connection->statement('DROP INDEX IF EXISTS idx_discussions_card_image_url ON discussions');
        $connection->statement('DROP INDEX IF EXISTS idx_discussions_card_image_null ON discussions');
    },
];