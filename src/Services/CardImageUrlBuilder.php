<?php

/*
 * This file is part of walsgit/flarum-discussion-cards
 *
 *  Copyright (c) 2026 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Walsgit\Discussion\Cards\Services;

use Flarum\Http\UrlGenerator;

/**
 * Turns the value stored in discussions.walsgit_card_image_url into the URL sent to the frontend.
 *
 * The column holds a path relative to the extension's assets folder, so the forum's domain, scheme
 * and sub-folder are only read here, from the current configuration.
 */
class CardImageUrlBuilder
{
    protected ?string $prefix = null;

    public function __construct(protected UrlGenerator $url) {}

    /**
     * @param string|null $stored value of the column
     * @return string|null absolute URL, or null if there is no card image
     */
    public function build(?string $stored): ?string
    {
        if ($stored === null || $stored === '') {
            return null;
        }

        // External URL stored before 2.1.0: kept as is (a relative path never starts with a scheme)
        if (preg_match('#^https?://#i', $stored)) {
            return $stored;
        }

        // Computed once, not once per discussion
        $this->prefix ??= $this->url->to('forum')->path('assets/extensions/walsgit-discussion-cards/');

        return $this->prefix . ltrim($stored, '/');
    }
}
