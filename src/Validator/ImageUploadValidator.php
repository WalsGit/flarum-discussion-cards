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
                $this->validateUploadedFile($attribute, $value, $fail);
            },
        ],
        'walsgit_discussion_cards_default_image' => [
            'required',
            function ($attribute, $value, $fail) {
                $this->validateUploadedFile($attribute, $value, $fail);
            },
        ],
    ];
}
    /**
     * Callable used by the rules above.
     *
     * @param string $attribute
     * @param mixed $value
     * @param callable $fail
     */
    public function validateUploadedFile($attribute, $value, $fail)
    {
        /** @var Translator $translator */
        $translator = resolve(Translator::class);

        if (!$value instanceof UploadedFileInterface) {
            return $fail($translator->trans('walsgit_discussion_cards.admin.errors.invalidFile'));
        }

        // Check file size (< 2 Mb)
        $size = $value->getSize();

        if ($size === null) {
            $stream = $value->getStream();
            $metaUri = $stream->getMetadata('uri');
            if ($metaUri && is_file($metaUri)) {
                $size = filesize($metaUri);
            } else {
                $contents = $stream->getContents();
                $size = is_string($contents) ? strlen($contents) : null;
                // rewind the stream so later code can read it again
                if (is_object($stream) && method_exists($stream, 'rewind')) {
                    $stream->rewind();
                }
            }
        }

        if ($size !== null && $size > 2 * 1024 * 1024) {
            return $fail($translator->trans('walsgit_discussion_cards.admin.errors.fileSize'));
        }

        // Check MIME type
        $allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];

        $isAllowed = false;

        $stream = $value->getStream();
        $metaUri = $stream->getMetadata('uri');

        if ($metaUri && is_file($metaUri) && function_exists('finfo_file')) {
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $detected = finfo_file($finfo, $metaUri);
            finfo_close($finfo);

            if ($detected && in_array($detected, $allowed, true)) {
                $isAllowed = true;
            }
        }

        if (!$isAllowed) {
            return $fail($translator->trans('walsgit_discussion_cards.admin.errors.invalidMime'));
        }
    }

    protected function getMessages(): array
    {
        /** @var Translator $translator */
        $translator = resolve(Translator::class);

        return [
            'walsgit_discussion_cards_tag_default_image.required' => $translator->trans('walsgit_discussion_cards.admin.errors.required'),
            'walsgit_discussion_cards_default_image.required' => $translator->trans('walsgit_discussion_cards.admin.errors.required'),
        ];
    }
}
