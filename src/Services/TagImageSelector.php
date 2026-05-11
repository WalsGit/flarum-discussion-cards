<?php

/*
 * This file is part of walsgit/flarum-discussion-cards
 *
 *  Copyright (c) 2025 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Walsgit\Discussion\Cards\Services;

use Illuminate\Support\Collection;

class TagImageSelector
{
    /**
     * @param Collection $tags  Collection de modèles Tag (id, parent_id, position, walsgit_discussion_cards_tag_default_image)
     * @return string|null
     */
    public function selectTagImage(Collection $tags): ?string
    {
        if ($tags->isEmpty()) {
            return null;
        }

        /*
        * Use the tag's default image (if set), and if multiple tags, choose using these priority rules: 
        * 1. The image of the highest positioned child primary tag of the highest positioned parent primary tag (or next highest positioned child etc.)
        * 2. The image of the highest positioned parent primary tag (or the next highest primary tag etc.)
        * 3. The image of the secondary tag with the lowest id (because they don't have positions)
        */

        // Separate primary & secondary tags
        $primary = $tags->filter(fn($t) => $t->position !== null);
        $secondary = $tags->filter(fn($t) => $t->position === null && $t->parent_id === null);

        // --- 1st priority : highest positioned child primary tag of the highest positioned parent primary tag, with a set default image ---

        $primaryParents = $primary
            ->filter(fn($t) => $t->parent_id === null)
            ->sortBy(fn($t) => $t->position ?? PHP_INT_MAX);

        foreach ($primaryParents as $parent) {

            $children = $primary
                ->filter(fn($c) => $c->parent_id == $parent->id)
                ->sortBy(fn($t) => $t->position ?? PHP_INT_MAX);

            foreach ($children as $child) {
                if (!empty($child->walsgit_discussion_cards_tag_default_image)) {
                    return $child->walsgit_discussion_cards_tag_default_image;
                }
            }
        }

        // --- 2nd priority : The image of the highest positioned parent primary tag with a set default image ---

        foreach ($primaryParents as $parent) {
            if (!empty($parent->walsgit_discussion_cards_tag_default_image)) {
                return $parent->walsgit_discussion_cards_tag_default_image;
            }
        }

        // --- 3rd priority : the secondary tag with the lowest id (because they don't have positions) ---

        foreach ($secondary->sortBy('id') as $tag) {
            if (!empty($tag->walsgit_discussion_cards_tag_default_image)) {
                return $tag->walsgit_discussion_cards_tag_default_image;
            }
        }

        return null;
    }
}
