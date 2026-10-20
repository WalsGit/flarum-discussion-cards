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

use RuntimeException;

/**
 * Thrown by RemoteImageFetcher when a remote image must not be (or could not be) fetched.
 * It never leaves the fetcher: public methods turn it into a null/false result.
 */
class RemoteImageException extends RuntimeException
{
}
