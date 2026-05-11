<?php

/*
 * This file is part of walsgit/discussion-cards
 *
 *  Copyright (c) 2026 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Walsgit\Discussion\Cards\Services;

use Flarum\Foundation\Paths;

class InfoService
{    
    public function __construct(
        protected Paths $paths,
    ) {}

    public function getFileSystemInfo(): array
    {
        $assetsPath = $this->paths->public . '/assets/extensions/walsgit-discussion-cards';
        $logsPath = $this->paths->storage . '/logs/walsgit-discussion-cards';
        $tempPath = sys_get_temp_dir();

        $assetsPathText = InfoService::getDirInfo($assetsPath);
        $logsPathText = InfoService::getDirInfo($logsPath);
        $tempPathText = InfoService::getDirInfo($tempPath);
        
        return [
            "Folder {$assetsPath} {$assetsPathText} \n",
            "Folder {$logsPath} {$logsPathText} \n",
            "Folder {$tempPath} {$logsPathText} \n",
        ];
    }

    protected function getDirInfo(string $path): string
    {
        $exists = is_dir($path);
        $writable = 'No';
        $permissions = null;
        if ($exists) {
            $writable = is_writable($path);
            $permissions = substr(sprintf('%o', fileperms($path)), -3);
        }


        return $exists 
            ? "exists " . ($writable ? "and is writable" : "but is NOT writable (permissions: {$permissions}")
            : "doesn't exist";
    }
}
