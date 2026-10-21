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

use RuntimeException;

/**
 * Thrown by PurgeImagesService when a purge cannot run.
 * The message is a translation key (under walsgit_discussion_cards.admin.console.).
 */
class PurgeImagesException extends RuntimeException
{
    public function __construct(string $translationKey, public readonly array $params = [])
    {
        parent::__construct($translationKey);
    }
}
