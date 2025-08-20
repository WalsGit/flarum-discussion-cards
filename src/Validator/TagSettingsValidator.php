<?php

namespace Walsgit\Discussion\Cards\Validator;

use Flarum\Foundation\AbstractValidator;

class TagSettingsValidator extends AbstractValidator
{
    protected $rules = [
        'primaryCards'     => 'nullable|numeric|min:0',
        'desktopCardWidth' => 'nullable|numeric|min:10|max:100',
        'tabletCardWidth'  => 'nullable|numeric|min:10|max:100',
    ];

    protected $messages = [
        'primaryCards.min'      => 'walsgit_discussion_cards.admin.errors.primaryCards',
        'desktopCardWidth.min'  => 'walsgit_discussion_cards.admin.errors.desktopCardWidth',
        'desktopCardWidth.max'  => 'walsgit_discussion_cards.admin.errors.desktopCardWidth',
        'tabletCardWidth.min'   => 'walsgit_discussion_cards.admin.errors.tabletCardWidth',
        'tabletCardWidth.max'   => 'walsgit_discussion_cards.admin.errors.tabletCardWidth',
    ];

    // For custom error messages
    protected function makeValidator(array $attributes)
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
