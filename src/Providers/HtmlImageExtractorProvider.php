<?php

/*
 * This file is part of walsgit/discussion-cards
 *
 *  Copyright (c) 2025 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Walsgit\Discussion\Cards\Providers;

use Illuminate\Support\ServiceProvider;
use Walsgit\Discussion\Cards\Services\HtmlImageExtractor;

class HtmlImageExtractorProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(HtmlImageExtractor::class, function () {
            return new HtmlImageExtractor();
        });
    }
}
