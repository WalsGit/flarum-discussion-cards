<?php

/*
 * This file is part of walsgit/discussion-cards
 *
 *  Copyright (c) 2026 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Walsgit\Discussion\Cards\Api\Controllers;

use Flarum\Http\RequestUtil;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Flarum\Foundation\Paths;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class RegenerateImagesController implements RequestHandlerInterface
{
    protected Paths $paths;

    public function __construct(Paths $paths)
    {
        $this->paths = $paths;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertAdmin();

        $queryParams = $request->getQueryParams();
        //$all = isset($queryParams['all']) && $queryParams['all'] === 'true';
        $ltno = isset($queryParams['ltno']) && $queryParams['ltno'] === 'true';

        // Setting the command to use
        $command = ['php', 'flarum', 'discussion-cards:regenerate-images'];
        // if ($all) {
        //     $command[] = '--all';
        // }
        if ($ltno) {
            $command[] = '-l';
            $command[] = '-t';
            $command[] = '-N';
            $command[] = '-o';
        }

        // Executing the command
        $process = new Process($command);
        $process->setWorkingDirectory($this->paths->base);
        $process->setTimeout(300); // 5 minutes timeout

        try {
            $process->mustRun();

            $output = $process->getOutput();
            $errorOutput = $process->getErrorOutput();

            // Parsing summary to get the stats
            $summary = $this->parseSummary($output);

            $result = [
                'command' => implode(' ', $command),
                'output' => explode("\n", trim($output)),
                'errorOutput' => $errorOutput,
                'exitCode' => $process->getExitCode(),
                'summary' => $summary
            ];

        } catch (ProcessFailedException $exception) {
            $result = [
                'command' => implode(' ', $command),
                'output' => [],
                'errorOutput' => $exception->getMessage(),
                'exitCode' => $exception->getProcess()->getExitCode(),
                'summary' => [
                    'total' => 0,
                    'success' => 0,
                    'errors' => 0
                ]
            ];
        }

        return new JsonResponse($result);
    }

    /**
     * Parse the command output to extract statistics
     */
    private function parseSummary($output)
    {
        $summary = [
            'total' => 0,
            'success' => 0,
            'errors' => 0
        ];

        $lines = explode("\n", $output);
        foreach ($lines as $line) {
            if (preg_match('/Regeneration summary: (\d+) processed, (\d+) successful & (\d+) errors/', $line, $matches)) {
                $summary['total'] = (int)$matches[1];
                $summary['success'] = (int)$matches[2];
                $summary['errors'] = (int)$matches[3];
                break;
            }
        }

        return $summary;
    }
}