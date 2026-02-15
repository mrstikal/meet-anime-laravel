<?php

namespace App\Http\Controllers;

use App\Services\AnimeApi;
use Inertia\Inertia;

class CurrentSeasonController extends Controller
{
    public function index(AnimeApi $api)
    {
        $limit = 20;

        try {
            $payload = $api->currentSeason(1);
            $items = $payload['data'] ?? [];
            $hasNextPage = (bool) ($payload['pagination']['has_next_page'] ?? false);
            $nextPage = 2;

            $seasonLabel = null;
            $first = is_array($items) && isset($items[0]) ? $items[0] : null;
            if (is_array($first)) {
                $season = $first['season'] ?? null;
                $year = $first['year'] ?? null;
                $seasonLabel = ($season && $year) ? (ucfirst((string) $season) . ' ' . (string) $year) : null;
            }
        } catch (\Throwable $e) {
            $items = [];
            $hasNextPage = false;
            $nextPage = 2;
            $seasonLabel = null;
        }

        $title = $seasonLabel ? "Current season - {$seasonLabel}" : 'Current season';

        return Inertia::render('CurrentSeason/Index', [
            'title' => $title,
            'initialItems' => $items,
            'initialHasNextPage' => $hasNextPage,
            'initialNextPage' => $nextPage,
            'limit' => $limit,
        ]);
    }
}
