<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class CharactersSmartService
{
    private const PER_PAGE_LIMIT = 25; // Jikan max for /characters
    private const MAX_PAGES_TO_SCAN = 10;
    private const PER_REQUEST_DELAY_MS = 400;

    private const IMAGE_TIMEOUT_MS = 2500;
    private const MAX_IMAGE_CHECKS = 120;

    /**
     * @return array{items: array<int, array>, hasNextPage: bool, nextPage: int}
     */
    public function getCharactersPage(array $opts = []): array
    {
        $startPage = (int) ($opts['page'] ?? 1);
        $startPage = $startPage > 0 ? $startPage : 1;

        $targetLimit = (int) ($opts['limit'] ?? 20);
        $targetLimit = $targetLimit > 0 ? min($targetLimit, 50) : 20;

        $orderBy = isset($opts['orderBy']) && is_string($opts['orderBy']) ? $opts['orderBy'] : null;
        $sort = isset($opts['sort']) && is_string($opts['sort']) ? $opts['sort'] : null;
        $q = isset($opts['q']) && is_string($opts['q']) ? trim($opts['q']) : null;
        $q = $q !== '' ? $q : null;

        $collected = [];
        $page = $startPage;
        $scanned = 0;
        $hasNextPage = true;

        $imageChecksUsed = 0;

        while (count($collected) < $targetLimit && $scanned < self::MAX_PAGES_TO_SCAN && $hasNextPage) {
            $payload = $this->fetchCharactersList($page, [
                'limit' => self::PER_PAGE_LIMIT,
                'orderBy' => $orderBy,
                'sort' => $sort,
                'q' => $q,
            ]);

            $data = $payload['data'] ?? [];
            $hasNextPage = (bool) ($payload['pagination']['has_next_page'] ?? false);

            foreach ($data as $c) {
                if (count($collected) >= $targetLimit) break;

                $name = trim((string) ($c['name'] ?? ''));
                if ($this->isNoiseMALName($name)) continue;

                $favorites = isset($c['favorites']) && is_numeric($c['favorites']) ? (int) $c['favorites'] : null;
                $nicknames = is_array($c['nicknames'] ?? null) ? array_values(array_filter($c['nicknames'])) : [];

                $image = $this->pickImageUrl($c);

                // If image invalid/unreachable -> set null (placeholder), never "skip"
                if (is_string($image) && $image !== '') {
                    if ($imageChecksUsed < self::MAX_IMAGE_CHECKS) {
                        $imageChecksUsed += 1;
                        if (!$this->isImageReachable($image)) {
                            $image = null;
                        }
                    } else {
                        $image = null;
                    }
                } else {
                    $image = null;
                }

                $collected[] = [
                    'id' => (int) ($c['mal_id'] ?? 0),
                    'name' => $name,
                    'image' => $image,
                    'favorites' => $favorites,
                    'nicknames' => $nicknames,
                ];
            }

            $page += 1;
            $scanned += 1;

            if (count($collected) < $targetLimit && $hasNextPage && $scanned < self::MAX_PAGES_TO_SCAN) {
                usleep(self::PER_REQUEST_DELAY_MS * 1000);
            }
        }

        return [
            'items' => $this->dedupeById($collected),
            'hasNextPage' => $hasNextPage && $scanned < self::MAX_PAGES_TO_SCAN,
            'nextPage' => $page,
        ];
    }

    private function dedupeById(array $items): array
    {
        $seen = [];
        $out = [];
        foreach ($items as $it) {
            $id = $it['id'] ?? null;
            if (!is_int($id) || $id <= 0) continue;
            if (isset($seen[$id])) continue;
            $seen[$id] = true;
            $out[] = $it;
        }
        return $out;
    }

    private function fetchCharactersList(int $page, array $opts): array
    {
        $query = [
            'page' => $page,
            'limit' => (int) ($opts['limit'] ?? self::PER_PAGE_LIMIT),
        ];

        if (!empty($opts['q'])) $query['q'] = (string) $opts['q'];
        if (!empty($opts['orderBy'])) $query['order_by'] = (string) $opts['orderBy'];
        if (!empty($opts['sort'])) $query['sort'] = (string) $opts['sort'];

        $baseUrl = (string) config('services.anime.base_url', 'https://api.jikan.moe/v4');

        $res = Http::baseUrl($baseUrl)
            ->acceptJson()
            ->timeout(15)
            ->retry(2, 300)
            ->get('/characters', $query);

        $res->throw();

        return $res->json();
    }

    private function pickImageUrl(array $c): ?string
    {
        return $c['images']['jpg']['image_url']
            ?? $c['images']['webp']['image_url']
            ?? null;
    }

    private function isNoiseMALName(string $name): bool
    {
        $n = trim(mb_strtolower($name));
        if ($n === '') return true;
        if ($n === '-' || $n === '—') return true;
        if ($n === '- myanimelist.net') return true;
        if ($n === 'myanimelist.net') return true;
        if (str_starts_with($n, '-') && str_contains($n, 'myanimelist.net')) return true;
        return false;
    }

    private function isImageReachable(string $url): bool
    {
        $key = 'img_reachable:' . sha1($url);

        return Cache::remember($key, 60 * 60 * 12, function () use ($url) {
            try {
                $head = Http::timeout(self::IMAGE_TIMEOUT_MS / 1000)
                    ->withOptions(['verify' => false])
                    ->head($url);

                if ($head->ok()) return true;

                $get = Http::timeout(self::IMAGE_TIMEOUT_MS / 1000)
                    ->withOptions(['verify' => false])
                    ->get($url);

                return $get->ok();
            } catch (\Throwable $e) {
                return false;
            }
        });
    }
}
