<?php

namespace App\Http\Controllers;

use App\Services\AnimeApi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GenresController extends Controller
{
    public function index(Request $request, AnimeApi $api)
    {
        $genrePayload = $api->animeGenres();
        $genres = $genrePayload['data'] ?? [];

        $limit = 20;
        $page = 1;

        $selectedGenreId = $request->query('id');
        $selectedGenreId = is_string($selectedGenreId) && ctype_digit($selectedGenreId) ? $selectedGenreId : null;

        $orderBy = $request->query('orderBy', 'score');
        $orderBy = is_string($orderBy) ? $orderBy : 'score';

        $sort = $request->query('sort', 'desc');
        $sort = is_string($sort) ? $sort : 'desc';

        $q = $request->query('q');
        $q = is_string($q) ? trim($q) : '';
        $q = $q !== '' ? $q : null;

        try {
            if ($selectedGenreId) {
                $payload = $api->animeList($page, $limit, [
                    'genreId' => $selectedGenreId,
                    'orderBy' => $orderBy,
                    'sort' => $sort,
                    'q' => $q,
                ]);
            } else {
                $hasOrdering = !empty($orderBy) || !empty($sort);
                $hasQuery = !empty($q);

                if ($hasOrdering || $hasQuery) {
                    $payload = $api->animeList($page, $limit, [
                        'orderBy' => $orderBy,
                        'sort' => $sort,
                        'q' => $q,
                    ]);
                } else {
                    $payload = $api->topAnime($page, $limit);
                }
            }

            $items = $payload['data'] ?? [];
            $hasNextPage = (bool) ($payload['pagination']['has_next_page'] ?? false);
            $nextPage = 2;
        } catch (\Throwable $e) {
            $items = [];
            $hasNextPage = false;
            $nextPage = 2;
        }

        return Inertia::render('Genres/Index', [
            'genres' => $genres,

            'selectedGenreId' => $selectedGenreId,
            'orderBy' => $orderBy,
            'sort' => $sort,
            'q' => $q ?? '',

            'initialItems' => $items,
            'initialHasNextPage' => $hasNextPage,
            'initialNextPage' => $nextPage,
            'limit' => $limit,

            'title' => 'Genres',
        ]);
    }
}
