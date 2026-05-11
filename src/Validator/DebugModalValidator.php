<?php

/*
 * This file is part of walsgit/flarum-discussion-cards
 *
 *  Copyright (c) 2026 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Walsgit\Discussion\Cards\Validator;

use Flarum\Foundation\AbstractValidator;

class DebugModalValidator extends AbstractValidator
{
    protected array $rules = [
        'discussionId'     => 'nullable|numeric|min:1',
    ];

    protected $messages = [
        'discussionId.min'      => 'walsgit_discussion_cards.admin.errors.debugModalDiscussionId',
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
