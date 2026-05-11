<?php

/*
 * This file is part of walsgit/flarum-discussion-cards
 *
 *  Copyright (c) 2025 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Walsgit\Discussion\Cards\Providers;

use Flarum\Foundation\AbstractServiceProvider;
use Walsgit\Discussion\Cards\Services\ImageProcessingService;
use Flarum\Foundation\Paths;
use Flarum\Foundation\Config;
use Flarum\Locale\Translator;

class ImageProcessingProvider extends AbstractServiceProvider
{
    public function register()
    {
        $this->container->singleton(ImageProcessingService::class, function () {
            return new ImageProcessingService(
                $this->container->make(Paths::class),
                $this->container->make(Translator::class),
                $this->container->make(Config::class)
            );
        });
    }
}
