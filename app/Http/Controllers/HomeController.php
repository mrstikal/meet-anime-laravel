<?php

namespace App\Http\Controllers;

use App\Services\AnimeApi;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(AnimeApi $api)
    {
        $payload = $api->topAnime(1, 20);

        return Inertia::render('Home', [
            'items' => $payload['data'] ?? [],
        ]);
    }
}
