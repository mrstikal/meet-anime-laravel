<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class AnimeApi
{
    private string $baseUrl;
    private int $cacheSeconds;

    public function __construct()
    {
        $this->baseUrl = (string) config('services.anime.base_url', 'https://api.jikan.moe/v4');
        $this->cacheSeconds = (int) config('services.anime.cache_seconds', 600);
    }

    /**
     * Generic cached GET request.
     */
    private function get(string $path, array $query = [], ?int $cacheSeconds = null): array
    {
        $ttl = $cacheSeconds ?? $this->cacheSeconds;

        $cacheKey = 'anime_api:' . md5($path . '|' . http_build_query($query));

        return Cache::remember($cacheKey, $ttl, function () use ($path, $query) {
            $response = Http::baseUrl($this->baseUrl)
                ->acceptJson()
                ->timeout(15)
                ->retry(2, 300)
                ->get($path, $query);

            $response->throw();

            return $response->json();
        });
    }

    public function animeDetail(int $malId): array
    {
        return $this->get("/anime/{$malId}", [], 3600);
    }

    public function topAnime(int $page = 1, int $limit = 20): array
    {
        return $this->get('/top/anime', [
            'page' => $page,
            'limit' => $limit,
        ]);
    }

    public function animeList(int $page = 1, int $limit = 20, array $filters = []): array
    {
        $query = [
            'page' => $page,
            'limit' => $limit,
        ];

        if (!empty($filters['genreId'])) {
            $query['genres'] = (int) $filters['genreId'];
        }

        if (!empty($filters['q'])) {
            $query['q'] = (string) $filters['q'];
        }

        if (!empty($filters['orderBy'])) {
            $query['order_by'] = (string) $filters['orderBy'];
        }

        if (!empty($filters['sort'])) {
            $query['sort'] = (string) $filters['sort'];
        }

        return $this->get('/anime', $query);
    }

    public function animeGenres(): array
    {
        return $this->get('/genres/anime');
    }

    public function currentSeason(int $page = 1): array
    {
        return $this->get('/seasons/now', [
            'page' => $page,
        ]);
    }

    public function characters(int $page = 1, ?string $q = null): array
    {
        $query = ['page' => $page];
        if ($q !== null && trim($q) !== '') {
            $query['q'] = $q;
        }

        return $this->get('/characters', $query);
    }

  public function characterDetail(int $malId): array
      {
          return $this->get("/characters/{$malId}/full", [], 3600);
      }
}
