<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CharactersSmartService;
use Illuminate\Http\Request;

class CharactersController extends Controller
{
    public function index(Request $request, CharactersSmartService $smart)
    {
        $page = (int) $request->query('page', 1);
        $limit = (int) $request->query('limit', 20);

        $orderBy = $request->query('orderBy', 'favorites');
        $sort = $request->query('sort', 'desc');
        $q = $request->query('q');

        $orderBy = is_string($orderBy) && in_array($orderBy, ['name', 'favorites'], true) ? $orderBy : 'favorites';
        $sort = is_string($sort) && in_array($sort, ['asc', 'desc'], true) ? $sort : 'desc';
        $q = is_string($q) ? $q : null;

        $result = $smart->getCharactersPage([
            'page' => $page,
            'limit' => $limit,
            'orderBy' => $orderBy,
            'sort' => $sort,
            'q' => $q,
        ]);

        return response()->json($result);
    }
}
