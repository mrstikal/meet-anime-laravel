import AppLayout from '@/Layouts/AppLayout';
import CharacterSortSelect from '@/Components/CharacterSortSelect';
import AnimeSearchInput from '@/Components/AnimeSearchInput';
import CharactersGridLoadMore from '@/Components/CharactersGridLoadMore';

export default function CharactersIndex({
                                          initialItems,
                                          initialHasNextPage,
                                          initialNextPage,
                                          orderBy,
                                          sort,
                                          q,
                                          limit,
                                        }) {
  return (
    <AppLayout>
      <main className="py-8">
        <h1 className="text-4xl font-bold mb-6">Characters</h1>

        <div className="flex flex-col gap-x-4 gap-y-2 md:flex-row md:items-start">
          <CharacterSortSelect />
          <AnimeSearchInput basePath="/characters" placeholder="Find character" />
        </div>

        <CharactersGridLoadMore
          initialItems={initialItems ?? []}
          initialHasNextPage={Boolean(initialHasNextPage)}
          initialNextPage={Number(initialNextPage) || 2}
          orderBy={orderBy ?? 'favorites'}
          sort={sort ?? 'desc'}
          query={(q ?? '').trim() || undefined}
          limit={Number(limit) || 20}
        />
      </main>
    </AppLayout>
  );
}
