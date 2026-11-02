<?php

/*
 * This file is part of walsgit/flarum-discussion-cards
 *
 *  Copyright (c) 2026 Wa!id.
 *
 *  For detailed copyright and license information, please view the
 *  LICENSE file that was distributed with this source code.
 */

namespace Walsgit\Discussion\Cards\Services;

use Flarum\Foundation\Paths;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;

/**
 * Opens the debug log of an action run from the admin page, according to the "Log actions" and
 * "Log action details" settings (the Console has its own --log option and is not concerned).
 * The action name and id come from the client: they are checked, never written as received.
 */
class ActionLogger
{
    /** "Log actions" lines of all the admin tools go to the same daily file: admin-tools-actions-YYYY-MM-DD.log */
    public const LOG_PREFIX = 'admin-tools-actions';

    /** Known actions and the log file prefix of their "Log action details" lines (same files as the Console). */
    protected const ACTIONS = [
        'regenerate-latest'  => 'regenerate',
        'regenerate-ltno'    => 'regenerate',
        'regenerate-without' => 'regenerate',
        'repair'             => 'repair',
        'purge-unused'       => 'purge',
        'purge-all'          => 'purge',
    ];

    public function __construct(
        protected SettingsRepositoryInterface $settings,
        protected Paths $paths
    ) {}

    /**
     * @param string[] $allowed actions the calling endpoint accepts
     * @return ActionLog|null null when logging is off, or when the action or its id is not valid
     */
    public function open(User $actor, mixed $action, mixed $actionId, array $allowed): ?ActionLog
    {
        $details = (int) $this->settings->get('walsgit_discussion_cards_logActionDetails') === 1;

        if (!$details && (int) $this->settings->get('walsgit_discussion_cards_logActions') !== 1) {
            return null;
        }

        if (!is_string($action) || !in_array($action, $allowed, true) || !isset(self::ACTIONS[$action])) {
            return null;
        }

        if (!is_string($actionId) || !preg_match('/^[a-z0-9]{4,12}$/', $actionId)) {
            return null;
        }

        return new ActionLog(
            new LoggingService($this->paths, self::LOG_PREFIX),
            new LoggingService($this->paths, self::ACTIONS[$action]),
            $action,
            $actionId,
            (int) $actor->id,
            $details
        );
    }
}
