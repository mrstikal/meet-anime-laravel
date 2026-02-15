import AppLayout from '@/Layouts/AppLayout';

import GenreSelect from '@/Components/GenreSelect/GenreSelect';
import SortSelect from '@/Components/SortSelect';
import AnimeSearchInput from '@/Components/AnimeSearchInput';

import GenreGridLoadMore from './GenreGridLoadMore';

export default function GenresIndex({
                                      title = 'Genres',
                                      genres,

                                      selectedGenreId,
                                      orderBy,
                                      sort,
                                      q,

                                      initialItems,
                                      initialHasNextPage,
                                      initialNextPage,
                                      limit,
                                    }) {
  return (
    <AppLayout>
      <main className="py-8">
        <h1 className="text-4xl font-bold mb-6">{title}</h1>

        <div className="flex flex-col gap-x-4 gap-y-3 md:flex-row md:items-start">
          <GenreSelect genres={genres ?? []} />
          <SortSelect />
          <AnimeSearchInput basePath="/genres" placeholder="Find anime" />
        </div>

        <GenreGridLoadMore
          initialItems={initialItems ?? []}
          initialHasNextPage={Boolean(initialHasNextPage)}
          initialNextPage={Number(initialNextPage) || 2}
          selectedGenreId={selectedGenreId ?? undefined}
          orderBy={orderBy ?? undefined}
          sort={sort ?? undefined}
          query={(q ?? '').trim() || undefined}
          limit={Number(limit) || 20}
        />
      </main>
    </AppLayout>
  );
}
