<?php

namespace Walsgit\Discussion\Cards\Validator;

use Flarum\Foundation\AbstractValidator;
use Flarum\Locale\Translator;
use Psr\Http\Message\UploadedFileInterface;

class ImageUploadValidator extends AbstractValidator
{
    protected function getRules(): array
    {
        return [
            'walsgit_discussion_cards_tag_default_image' => [
                'required',
                function ($attribute, $value, $fail) {
                    /** @var Translator $translator */
                    $translator = resolve(Translator::class);

                    if (!$value instanceof UploadedFileInterface) {
                        return $fail(
                            $translator->trans('walsgit_discussion_cards.admin.errors.invalidFile')
                        );
                    }

                    // Taille maximale = 2 Mo
                    if ($value->getSize() > 2 * 1024 * 1024) {
                        return $fail(
                            $translator->trans('walsgit_discussion_cards.admin.errors.fileSize')
                        );
                    }

                    // Types MIME autorisés
                    $allowed = ['image/jpeg', 'image/png', 'image/webp'];
                    if (!in_array($value->getClientMediaType(), $allowed, true)) {
                        return $fail(
                            $translator->trans('walsgit_discussion_cards.admin.errors.invalidMime')
                        );
                    }
                },
            ],
        ];
    }

    protected function getMessages(): array
    {
        /** @var Translator $translator */
        $translator = resolve(Translator::class);

        return [
            'walsgit_discussion_cards_tag_default_image.required' =>
                $translator->trans('walsgit_discussion_cards.admin.errors.required'),
        ];
    }
}
