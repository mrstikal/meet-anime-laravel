<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AnimeApi;
use Illuminate\Http\Request;

class SeasonNowController extends Controller
{
    public function index(Request $request, AnimeApi $api)
    {
        $page = (int) $request->query('page', 1);
        $page = $page > 0 ? $page : 1;

        $limit = (int) $request->query('limit', 20);
        $limit = $limit > 0 ? min($limit, 25) : 20;

        $payload = $api->currentSeason($page);

        return response()->json([
            'items' => $payload['data'] ?? [],
            'hasNextPage' => (bool) ($payload['pagination']['has_next_page'] ?? false),
            'nextPage' => $page + 1,
        ]);
    }
}
