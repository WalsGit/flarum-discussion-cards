<?php

/*
 * This file is part of walsgit/discussion-cards
 *
 *  Copyright (c) 2025 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Walsgit\Discussion\Cards\Console;

use Flarum\Console\AbstractCommand;
use Walsgit\Discussion\Cards\Services\Migration\ImageMigrationService;
use Flarum\Locale\Translator;

class MigrateImagesCommand extends AbstractCommand
{
    public function __construct(protected ImageMigrationService $migrator, protected Translator $translator)
    {
        parent::__construct();
    }

    /**
     * Version 1.4.0 changes how and where default card images are processed and stored;
     * This adds a CLI command discussion-cards:migrate-images to help migrate the old default card images
     * The command will run on updates or on demand and will make irreversible changes like deleting old card images.
     */

    protected function configure()
    {
        $this
            ->setName('discussion-cards:migrate-images')
            ->setDescription('Process and migrates old default Discussion Cards images (from pre v1.4 of the extension) to new location');
    }

    protected function fire()
    {
        $this->info($this->translator->trans('walsgit-discussion-cards.admin.console.migrateImagesStart'));

        try {
            $count = $this->migrator->runMigration();
            $this->info($this->translator->trans('walsgit-discussion-cards.admin.console.migrateImagesEnd', ['count' => $count]));
        } catch (\Throwable $e) {
            $this->error($this->translator->trans('walsgit-discussion-cards.admin.console.migrateImagesError') . $e->getMessage());
            $this->error($e->getTraceAsString());
            return 1;
        }

        return 0;
    }
}
