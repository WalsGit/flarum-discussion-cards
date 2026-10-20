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

use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Uri;
use GuzzleHttp\Psr7\UriResolver;
use GuzzleHttp\RequestOptions;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\UriInterface;
use Throwable;

/**
 * Single entry point for every HTTP request made to a remote image.
 *
 * - http/https only, on ports 80 and 443 only, no credentials in the URL
 * - hard timeouts and a maximum download size (enforced while streaming)
 * - refuses non public addresses (private, loopback, link-local, reserved...),
 *   checked on the IPs the host name resolves to, and the validated IP is the one
 *   the connection is made to (no second DNS lookup)
 * - redirects are followed manually and every hop goes through the same checks
 */
class RemoteImageFetcher
{
    public const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

    protected const CONNECT_TIMEOUT = 3;      // seconds
    protected const TOTAL_TIMEOUT = 10;       // seconds, for one fetch (all redirect hops included)
    protected const MAX_REDIRECTS = 3;
    protected const PROBE_MAX_BODY = 262144;  // 256 KB: cap for redirect bodies when only headers are wanted
    protected const PROBE_CACHE_TTL = 60;     // seconds
    protected const PROBE_CACHE_MAX = 100;    // entries
    protected const ALLOWED_PORTS = [80, 443];

    /** Address ranges that are never fetched (CIDR notation). */
    protected const BLOCKED_RANGES = [
        // IPv4
        '0.0.0.0/8',        // "this network"
        '10.0.0.0/8',       // private
        '100.64.0.0/10',    // carrier-grade NAT
        '127.0.0.0/8',      // loopback
        '169.254.0.0/16',   // link-local (cloud metadata services live here)
        '172.16.0.0/12',    // private
        '192.0.0.0/24',     // IETF protocol assignments
        '192.0.2.0/24',     // documentation
        '192.168.0.0/16',   // private
        '198.18.0.0/15',    // benchmarking
        '198.51.100.0/24',  // documentation
        '203.0.113.0/24',   // documentation
        '224.0.0.0/4',      // multicast
        '240.0.0.0/4',      // reserved
        // IPv6
        '::/96',            // unspecified, loopback and IPv4-compatible
        '64:ff9b::/96',     // NAT64
        '100::/64',         // discard-only
        '2001::/32',        // Teredo
        '2001:db8::/32',    // documentation
        '2002::/16',        // 6to4
        'fc00::/7',         // unique local (private)
        'fe80::/10',        // link-local
        'ff00::/8',         // multicast
    ];

    protected ?Client $client = null;

    /** @var array<string, array{time: int, info: array|null}> */
    protected array $probeCache = [];

    /**
     * Requests the headers of a remote image (one request, cached for a short time).
     *
     * @return array{status: int, etag: string, last_modified: string, content_length: int|null, content_type: string}|null
     *         null when the URL is refused or the request failed
     */
    public function probe(string $url): ?array
    {
        $cached = $this->probeCache[$url] ?? null;

        if ($cached !== null && (time() - $cached['time']) < self::PROBE_CACHE_TTL) {
            return $cached['info'];
        }

        $response = $this->request($url, null, self::PROBE_MAX_BODY, true);
        $info = $response !== null ? $this->extractInfo($response) : null;

        if (count($this->probeCache) >= self::PROBE_CACHE_MAX) {
            array_shift($this->probeCache);
        }

        $this->probeCache[$url] = ['time' => time(), 'info' => $info];

        return $info;
    }

    /**
     * True if the remote URL answers with a 2xx status.
     */
    public function isAccessible(string $url): bool
    {
        $info = $this->probe($url);

        return $info !== null && $info['status'] >= 200 && $info['status'] < 300;
    }

    /**
     * Downloads a remote file into $targetPath (an existing, writable file).
     * Returns false if the URL is refused, the request fails or the file is too big.
     */
    public function download(string $url, string $targetPath): bool
    {
        $response = $this->request($url, $targetPath, self::MAX_BYTES, false);

        if ($response === null || !$this->isSuccess($response)) {
            return false;
        }

        clearstatcache(true, $targetPath);
        $size = @filesize($targetPath);

        return $size !== false && $size > 0 && $size <= self::MAX_BYTES;
    }

    /**
     * Sends a GET request, following redirects manually.
     *
     * @param string|null $sinkPath    file the body is written to (null: body is not kept)
     * @param bool        $headersOnly stop as soon as the final response headers are received
     * @return ResponseInterface|null  the final response, or null if anything went wrong
     */
    protected function request(string $url, ?string $sinkPath, int $maxBytes, bool $headersOnly): ?ResponseInterface
    {
        $deadline = microtime(true) + self::TOTAL_TIMEOUT;

        try {
            $current = new Uri($url);

            for ($hop = 0; $hop <= self::MAX_REDIRECTS; $hop++) {
                $response = $this->sendOnce($current, $deadline, $sinkPath, $maxBytes, $headersOnly);

                if (!$this->isRedirect($response)) {
                    return $response;
                }

                $current = UriResolver::resolve($current, new Uri($response->getHeaderLine('Location')));
            }
        } catch (Throwable) {
            // Refused target, network error, timeout, file too big...: all end up as "no response"
        }

        return null; // failure, or too many redirects
    }

    /**
     * Sends one request (no redirect handling). The target is validated first.
     *
     * @throws Throwable when the target is refused or the request fails
     */
    protected function sendOnce(UriInterface $uri, float $deadline, ?string $sinkPath, int $maxBytes, bool $headersOnly): ResponseInterface
    {
        $resolveEntry = $this->assertSafeTarget($uri);

        $remaining = $deadline - microtime(true);

        if ($remaining <= 0) {
            throw new RemoteImageException('Timeout reached');
        }

        $captured = null;
        $stopped = false;

        $options = $this->buildOptions($remaining, $maxBytes, $headersOnly, $captured, $stopped);

        if ($sinkPath !== null) {
            $options[RequestOptions::SINK] = $sinkPath;
        }

        // Connect to the IP we validated, not to whatever the name resolves to a second time
        if ($resolveEntry !== null && defined('CURLOPT_RESOLVE')) {
            $options['curl'] = [CURLOPT_RESOLVE => [$resolveEntry]];
        }

        try {
            return $this->client()->request('GET', $uri, $options);
        } catch (Throwable $e) {
            // We interrupted the transfer on purpose after the headers: the response is still usable
            if ($stopped && $captured !== null) {
                return $captured;
            }

            throw $e;
        }
    }

    /**
     * Guzzle options for one hop.
     *
     * @param ResponseInterface|null $captured filled with the response as soon as its headers arrive
     * @param bool                   $stopped  set to true when we interrupt the transfer on purpose
     */
    protected function buildOptions(float $remaining, int $maxBytes, bool $headersOnly, ?ResponseInterface &$captured, bool &$stopped): array
    {
        return [
            RequestOptions::ALLOW_REDIRECTS => false,
            RequestOptions::HTTP_ERRORS     => false,
            RequestOptions::DECODE_CONTENT  => false, // no compressed bodies: the size cap must apply to real bytes
            RequestOptions::CONNECT_TIMEOUT => min(self::CONNECT_TIMEOUT, $remaining),
            RequestOptions::TIMEOUT         => $remaining,
            RequestOptions::HEADERS         => [
                'User-Agent' => 'Flarum Discussion Cards (+https://github.com/WalsGit/flarum-discussion-cards)',
                'Accept'     => 'image/*,*/*;q=0.5',
            ],
            RequestOptions::ON_HEADERS      => function (ResponseInterface $response) use (&$captured, &$stopped, $maxBytes, $headersOnly) {
                $captured = $response;

                // Redirect: the next hop is handled by the caller
                if ($this->isRedirect($response)) {
                    return;
                }

                // Final response: no need for the body if we only want headers or if it is an error
                if ($headersOnly || !$this->isSuccess($response)) {
                    $stopped = true;

                    throw new RemoteImageException('Stopped after headers');
                }

                $this->assertNotTooLarge($response->getHeaderLine('Content-Length'), $maxBytes);
            },
            // Called while downloading: protects against a missing or wrong Content-Length
            RequestOptions::PROGRESS        => function ($downloadTotal, $downloaded) use ($maxBytes) {
                if ($downloaded > $maxBytes) {
                    throw new RemoteImageException('Remote file too large');
                }
            },
        ];
    }

    protected function assertNotTooLarge(string $contentLength, int $maxBytes): void
    {
        if (ctype_digit($contentLength) && (int) $contentLength > $maxBytes) {
            throw new RemoteImageException('Remote file too large');
        }
    }

    protected function isRedirect(ResponseInterface $response): bool
    {
        $status = $response->getStatusCode();

        return $status >= 300 && $status < 400 && $response->hasHeader('Location');
    }

    protected function isSuccess(ResponseInterface $response): bool
    {
        $status = $response->getStatusCode();

        return $status >= 200 && $status < 300;
    }

    protected function extractInfo(ResponseInterface $response): array
    {
        $length = $response->getHeaderLine('Content-Length');

        return [
            'status'         => $response->getStatusCode(),
            'etag'           => $response->getHeaderLine('ETag'),
            'last_modified'  => $response->getHeaderLine('Last-Modified'),
            'content_length' => ctype_digit($length) ? (int) $length : null,
            'content_type'   => $response->getHeaderLine('Content-Type'),
        ];
    }

    /**
     * Throws if the URL must not be requested.
     *
     * @return string|null a CURLOPT_RESOLVE entry pinning the host to a validated IP (null for IP literals)
     * @throws RemoteImageException
     */
    protected function assertSafeTarget(UriInterface $uri): ?string
    {
        $scheme = strtolower($uri->getScheme());

        if (!in_array($scheme, ['http', 'https'], true)) {
            throw new RemoteImageException('Unsupported scheme');
        }

        if ($uri->getUserInfo() !== '') {
            throw new RemoteImageException('Credentials in URL are not allowed');
        }

        // IPv6 literals come wrapped in brackets
        $host = trim($uri->getHost(), '[]');

        if ($host === '') {
            throw new RemoteImageException('Missing host');
        }

        $port = $uri->getPort() ?? ($scheme === 'https' ? 443 : 80);

        if (!in_array($port, self::ALLOWED_PORTS, true)) {
            throw new RemoteImageException('Port not allowed');
        }

        // IP literal: nothing to resolve
        if (filter_var($host, FILTER_VALIDATE_IP) !== false) {
            $this->assertPublicIps([$host]);

            return null;
        }

        $ips = $this->resolveHost($host);

        if (empty($ips)) {
            throw new RemoteImageException('Host could not be resolved');
        }

        $this->assertPublicIps($ips);

        $ip = $ips[0];

        return sprintf('%s:%d:%s', $host, $port, str_contains($ip, ':') ? "[{$ip}]" : $ip);
    }

    /**
     * All addresses must be public (a mixed DNS answer is refused).
     *
     * @param string[] $ips
     * @throws RemoteImageException
     */
    protected function assertPublicIps(array $ips): void
    {
        foreach ($ips as $ip) {
            if (!$this->isPublicIp($ip)) {
                throw new RemoteImageException('Address not allowed');
            }
        }
    }

    /**
     * @return string[] resolved IP addresses, IPv4 first
     */
    protected function resolveHost(string $host): array
    {
        $ips = [];

        $records = @dns_get_record($host, DNS_A | DNS_AAAA);

        if (is_array($records)) {
            foreach ($records as $record) {
                $ip = $record['ip'] ?? $record['ipv6'] ?? null;

                if (is_string($ip) && $ip !== '') {
                    $ips[] = $ip;
                }
            }
        }

        // Fallback on the system resolver (also reads the hosts file), IPv4 only
        if (empty($ips)) {
            $fallback = @gethostbynamel($host);

            if (is_array($fallback)) {
                $ips = $fallback;
            }
        }

        $ips = array_values(array_unique($ips));

        usort($ips, fn($a, $b) => str_contains($a, ':') <=> str_contains($b, ':'));

        return $ips;
    }

    protected function isPublicIp(string $ip): bool
    {
        $packed = @inet_pton($ip);

        if ($packed === false) {
            return false;
        }

        // IPv4-mapped IPv6 address (::ffff:a.b.c.d): check the embedded IPv4 address instead
        if (strlen($packed) === 16 && str_starts_with($packed, str_repeat("\0", 10) . "\xff\xff")) {
            return $this->isPublicIp((string) inet_ntop(substr($packed, 12)));
        }

        return !$this->isInBlockedRange($packed);
    }

    protected function isInBlockedRange(string $packedIp): bool
    {
        foreach (self::BLOCKED_RANGES as $range) {
            if ($this->ipInRange($packedIp, $range)) {
                return true;
            }
        }

        return false;
    }

    protected function ipInRange(string $packedIp, string $cidr): bool
    {
        [$subnet, $bits] = explode('/', $cidr);

        $packedSubnet = inet_pton($subnet);

        // IPv4 address vs IPv6 range (or the opposite): never in range
        if ($packedSubnet === false || strlen($packedSubnet) !== strlen($packedIp)) {
            return false;
        }

        $bits = (int) $bits;
        $fullBytes = intdiv($bits, 8);
        $remainingBits = $bits % 8;

        if (substr($packedIp, 0, $fullBytes) !== substr($packedSubnet, 0, $fullBytes)) {
            return false;
        }

        // Whole bytes are equal: compare the few remaining bits, if any
        $mask = (0xFF << (8 - $remainingBits)) & 0xFF;

        return $remainingBits === 0
            || (ord($packedIp[$fullBytes]) & $mask) === (ord($packedSubnet[$fullBytes]) & $mask);
    }

    protected function client(): Client
    {
        return $this->client ??= new Client();
    }
}
