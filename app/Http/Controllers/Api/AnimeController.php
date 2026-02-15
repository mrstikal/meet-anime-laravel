<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AnimeApi;
use Illuminate\Http\Request;

class AnimeController extends Controller
{
    public function index(Request $request, AnimeApi $api)
    {
        $page = (int) $request->query('page', 1);
        $page = $page > 0 ? $page : 1;

        $limit = (int) $request->query('limit', 20);
        $limit = $limit > 0 ? min($limit, 25) : 20;

        $genreId = $request->query('genreId');
        $genreId = is_string($genreId) && ctype_digit($genreId) ? $genreId : null;

        $orderBy = $request->query('orderBy');
        $orderBy = is_string($orderBy) ? $orderBy : null;

        $sort = $request->query('sort');
        $sort = is_string($sort) ? $sort : null;

        $q = $request->query('q');
        $q = is_string($q) ? trim($q) : null;

        $payload = $api->animeList($page, $limit, [
            'genreId' => $genreId,
            'orderBy' => $orderBy,
            'sort' => $sort,
            'q' => $q,
        ]);

        return response()->json([
            'items' => $payload['data'] ?? [],
            'hasNextPage' => (bool) ($payload['pagination']['has_next_page'] ?? false),
            'nextPage' => $page + 1,
        ]);
    }
}
