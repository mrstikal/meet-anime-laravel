import AppLayout from '@/Layouts/AppLayout';
import AnimeCard from '@/Components/AnimeCard';

export default function Home({ items }) {
  const topAnime = items ?? [];

  return (
    <AppLayout>
      <main className="py-8">
        <h1 className="text-4xl font-bold mb-8">Top Twenty Anime</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-6">
          {topAnime.map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} href={`/anime/${anime.mal_id}`} />
          ))}
        </div>
      </main>
    </AppLayout>
  );
}
