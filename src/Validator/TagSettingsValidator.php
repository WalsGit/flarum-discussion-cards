<?php

/*
 * This file is part of walsgit/discussion-cards
 *
 *  Copyright (c) 2025 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Walsgit\Discussion\Cards\Validator;

use Flarum\Foundation\AbstractValidator;

class TagSettingsValidator extends AbstractValidator
{
    protected array $rules = [
        'primaryCards'     => 'nullable|numeric|min:0',
        'desktopCardWidth' => 'nullable|numeric|min:10|max:100',
        'tabletCardWidth'  => 'nullable|numeric|min:10|max:100',
        'useListCards'  => 'nullable|numeric|min:0|max:1',
        'listCardsCount'  => 'nullable|numeric|min:0|max:20',
    ];

    protected $messages = [
        'primaryCards.min'      => 'walsgit_discussion_cards.admin.errors.primaryCards',
        'desktopCardWidth.min'  => 'walsgit_discussion_cards.admin.errors.desktopCardWidth',
        'desktopCardWidth.max'  => 'walsgit_discussion_cards.admin.errors.desktopCardWidth',
        'tabletCardWidth.min'   => 'walsgit_discussion_cards.admin.errors.tabletCardWidth',
        'tabletCardWidth.max'   => 'walsgit_discussion_cards.admin.errors.tabletCardWidth',
        'useListCards'   => 'walsgit_discussion_cards.admin.errors.useListCards',
        'listCardsCount'   => 'walsgit_discussion_cards.admin.errors.listCardsCount',
    ];

    protected function makeValidator(array $attributes): \Illuminate\Validation\Validator
    {
        $validator = parent::makeValidator($attributes);

        foreach ($this->messages as $rule => $key) {
            $validator->setCustomMessages([
                $rule => $this->translator->trans($key)
            ]);
        }

        return $validator;
    }
}
