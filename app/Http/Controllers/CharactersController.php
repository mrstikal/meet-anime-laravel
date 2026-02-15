<?php

namespace App\Http\Controllers;

use App\Services\AnimeApi;
use App\Services\CharactersSmartService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CharactersController extends Controller
{
    public function index(Request $request, CharactersSmartService $smart)
    {
        $orderBy = $request->query('orderBy', 'favorites');
        $sort = $request->query('sort', 'desc');
        $q = $request->query('q');

        $orderBy = is_string($orderBy) && in_array($orderBy, ['name', 'favorites'], true) ? $orderBy : 'favorites';
        $sort = is_string($sort) && in_array($sort, ['asc', 'desc'], true) ? $sort : 'desc';
        $q = is_string($q) ? trim($q) : '';
        $q = $q !== '' ? $q : null;

        $limit = 20;

        try {
            $initial = $smart->getCharactersPage([
                'page' => 1,
                'limit' => $limit,
                'orderBy' => $orderBy,
                'sort' => $sort,
                'q' => $q,
            ]);
        } catch (\Throwable $e) {
            $initial = ['items' => [], 'hasNextPage' => false, 'nextPage' => 2];
        }

        return Inertia::render('Characters/Index', [
            'initialItems' => $initial['items'] ?? [],
            'initialHasNextPage' => (bool) ($initial['hasNextPage'] ?? false),
            'initialNextPage' => (int) ($initial['nextPage'] ?? 2),
            'orderBy' => $orderBy,
            'sort' => $sort,
            'q' => $q ?? '',
            'limit' => $limit,
        ]);
    }

  public function show(int $id, AnimeApi $api)
      {
          $payload = $api->characterDetail($id);
          $character = $payload['data'] ?? null;

          if (!is_array($character)) {
              abort(404);
          }

          return Inertia::render('Characters/Show', [
              'title' => $character['name'] ?? 'Character',
              'character' => $character,
          ]);
      }
}
