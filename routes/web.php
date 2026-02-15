<?php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\Api\AnimeController as ApiAnimeController;
use App\Http\Controllers\Api\SeasonNowController;
use App\Http\Controllers\Api\CharactersController as ApiCharactersController;

use App\Http\Controllers\AnimeController;
use App\Http\Controllers\CurrentSeasonController;
use App\Http\Controllers\GenresController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\CharactersController;
use App\Http\Controllers\ProfileController;


Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/anime', [AnimeController::class, 'index'])->name('anime.index');
Route::get('/anime/{id}', [AnimeController::class, 'show'])
    ->whereNumber('id')
    ->name('anime.show');

Route::get('/characters', [CharactersController::class, 'index'])->name('characters.index');
Route::get('/genres', [GenresController::class, 'index'])->name('genres.index');
Route::get('/current-season', [CurrentSeasonController::class, 'index'])->name('currentSeason.index');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/api/anime', [ApiAnimeController::class, 'index'])->name('api.anime');
Route::get('/api/season-now', [SeasonNowController::class, 'index'])->name('api.seasonNow');
Route::get('/api/characters', [ApiCharactersController::class, 'index'])->name('api.characters');

Route::get('/characters/{id}', [CharactersController::class, 'show'])
    ->whereNumber('id')
    ->name('characters.show');


require __DIR__.'/auth.php';
