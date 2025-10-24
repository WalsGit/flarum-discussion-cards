<?php

namespace Walsgit\Discussion\Cards\Api\Controllers;

use Flarum\Api\Controller\ShowForumController;
use Flarum\Foundation\Paths;
use Flarum\Http\RequestUtil;
use Flarum\Settings\SettingsRepositoryInterface;
use Intervention\Image\ImageManagerStatic as Image;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Walsgit\Discussion\Cards\Validator\ImageUploadValidator;

class UploadImageController extends ShowForumController
{
    protected SettingsRepositoryInterface $settings;
    protected Paths $paths;
    protected ImageUploadValidator $validator;

    public function __construct(SettingsRepositoryInterface $settings, Paths $paths, ImageUploadValidator $validator)
    {
        $this->settings = $settings;
        $this->paths = $paths;
        $this->validator = $validator;
    }

    public function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertAdmin();

        $uploadedFile = $request->getUploadedFiles()['walsgit_discussion_cards_default_image'] ?? null;

        // File Validation
        $this->validator->assertValid(['walsgit_discussion_cards_default_image' => $uploadedFile]);

        // Path & filename settings
        $uploadDir = $this->paths->public . '/assets/extensions/walsgit-discussion-cards';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $filename = 'default-card-image.webp';
        $filePath = $uploadDir . '/' . $filename;

        // Image processing
        $image = Image::make($uploadedFile->getStream()->getMetadata('uri'))
            ->resize(400, null, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            })
            ->encode('webp', 80);

        $image->save($filePath);

        // Save filename in settings
        $this->settings->set('walsgit_discussion_cards_default_image_path', $filename);

        return parent::data($request, $document);
    }
}
