<?php

namespace Walsgit\Discussion\Cards\Extenders;

use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use Flarum\Frontend\Assets;
use Flarum\Frontend\Compiler\Source\SourceCollector;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Container\Container;
use Flarum\Tags\Tag;


class RegisterLessVariables implements ExtenderInterface
{
    public function extend(Container $container, Extension $extension = null)
    {
        $container->resolving('flarum.assets.forum', function (Assets $assets) {
            $assets->css(function (SourceCollector $sources) {
                $sources->addString(function () {
                    $settings = app(SettingsRepositoryInterface::class);
                    
                    $defaultDesktopCardWidth = $settings->get('walsgit_discussion_cards_desktopCardWidth');
                    $defaultTabletCardWidth = $settings->get('walsgit_discussion_cards_tabletCardWidth');
                    
                    $tags = Tag::all();

                    $css = "@desktop-card-width: {$defaultDesktopCardWidth}%;\n";
                    $css .= "@tablet-card-width: {$defaultTabletCardWidth}%;\n";

                    foreach ($tags as $tag) {
                        $tagSettings = $tag->walsgit_discussion_cards_tag_settings
                                        ? json_decode($tag->walsgit_discussion_cards_tag_settings, true)
                                        : [];
                        $desktopWidth = $tagSettings['desktopCardWidth'] ?? $defaultDesktopCardWidth;
                        $tabletWidth = $tagSettings['tabletCardWidth'] ?? $defaultTabletCardWidth;

                        $css .= <<<CSS
                        .CardsListItem.Card[data-tag-id="{$tag->id}"] {
                            @media @desktop-up {
                                width: {$desktopWidth}%;
                            }
                            @media @tablet {
                                width: {$tabletWidth}%;
                            }
                        }
                        CSS;
                    }

                    return $css;
                });
            });
        });
    }
}
