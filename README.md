# Meet Anime (Laravel + Inertia + React)

## Yeah, I love anime.  
And I found out that there is an (unofficial but functional) Jikan API for MyAnimeList.
So I created this small tech demo for browsing anime data.

Built with:
- Laravel (PHP)
- Inertia.js + React
- Vite
- Tailwind CSS v4 (CSS-first)
- SVG icons as React components (SVGR)

## Design
I used a neutral color scheme with subtle pastel accents that allow the images to stand out.  
The quality of images and richness of texts may vary piece to piece, but that's not something I can influence. 
Please direct any complaints to MyAnimeList :) 

## Features

- **Top 20**: top anime list
- **Genres**: genre picker + sorting + search + *Load more*
- **Characters**: sorting + search + *Load more* with a “smart” backend that filters noisy entries and validates images
- **Current season**: current season list + *Load more*
- Detail pages:
  - `/anime/{id}`
  - `/characters/{id}`

## Requirements

- PHP 8.2+
- Composer
- Node.js 18+ (or any recent LTS)
- npm

## Local setup

    git clone https://github.com/mrstikal/meet-anime-laravel.git
    cd meet-anime

    composer install
    cp .env.example .env
    php artisan key:generate

    npm install
    npm run dev

In a second terminal tab:

    php artisan serve

Now open:
- http://127.0.0.1:8000

If you use Laravel Herd, just add the site and keep `npm run dev` running.

## Environment variables

Add/keep the following in `.env`:

    ANIME_API_BASE_URL=https://api.jikan.moe/v4
    ANIME_API_CACHE_SECONDS=600

    VITE_APP_NAME="Meet Anime"

## Production build

Build frontend assets:

    npm run build

Laravel optimizations:

    php artisan optimize:clear
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache

## Notes about “smart” Characters backend

The Characters page uses a backend service that may scan multiple Jikan pages to collect a clean set of results:
- filters out “noise” names
- validates character image URLs with a capped budget
- adds a small delay between upstream requests

If you want it faster, tune the constants in the smart service (scan budget, delay, image checks).

## Troubleshooting

### CSS / Tailwind not applying
Make sure Vite is running:

    npm run dev

### SVG imports
SVGs are stored in:

- `resources/js/assets/images`

They are imported as React components, e.g.:

    import Logo from '@/assets/images/logo.svg';

    <Logo className="h-10 w-auto" />

### API rate limits
Jikan can rate-limit requests. The app uses caching where appropriate, but you may still hit limits during rapid testing.

## License
MIT
