<?php

namespace App\Http\Controllers;

use App\Services\AnimeApi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnimeController extends Controller
{
    public function index(Request $request, AnimeApi $api)
    {
        $page = (int) $request->query('page', 1);
        $page = $page > 0 ? $page : 1;

        $payload = $api->topAnime($page, 20);

        return Inertia::render('Anime/Index', [
            'title' => 'Anime',
            'page' => $page,
            'items' => $payload['data'] ?? [],
            'pagination' => $payload['pagination'] ?? null,
        ]);
    }

    public function show(int $id, AnimeApi $api)
    {
        $payload = $api->animeDetail($id);
        $anime = $payload['data'] ?? null;

        if (!is_array($anime)) {
            abort(404);
        }

        return Inertia::render('Anime/Show', [
            'title' => is_array($anime) ? ($anime['title'] ?? 'Anime detail') : 'Anime detail',
            'anime' => $anime,
        ]);
    }
}
