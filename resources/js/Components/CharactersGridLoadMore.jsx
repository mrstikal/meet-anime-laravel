import * as React from 'react';
import CharacterCard from '@/Components/CharacterCard';

function dedupeById(list) {
  const seen = new Set();
  return (list ?? []).filter((x) => {
    const id = x?.id;
    if (id == null) return true;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

export default function CharactersGridLoadMore({
                                                 initialItems,
                                                 initialHasNextPage,
                                                 initialNextPage,
                                                 orderBy,
                                                 sort,
                                                 query,
                                                 limit = 20,
                                               }) {
  const [items, setItems] = React.useState(dedupeById(initialItems));
  const [hasNextPage, setHasNextPage] = React.useState(Boolean(initialHasNextPage));
  const [nextPage, setNextPage] = React.useState(Number(initialNextPage) || 2);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    setItems(dedupeById(initialItems));
    setHasNextPage(Boolean(initialHasNextPage));
    setNextPage(Number(initialNextPage) || 2);
    setLoading(false);
    setError(null);
  }, [initialItems, initialHasNextPage, initialNextPage]);

  async function onLoadMore() {
    if (loading || !hasNextPage) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set('page', String(nextPage));
      params.set('limit', String(limit));
      if (orderBy) params.set('orderBy', orderBy);
      if (sort) params.set('sort', sort);
      if (query) params.set('q', query);

      const res = await fetch(`/api/characters?${params.toString()}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error('Request failed');

      const json = await res.json();

      setItems((prev) => dedupeById([...prev, ...(json.items ?? [])]));
      setHasNextPage(Boolean(json.hasNextPage));
      setNextPage(Number(json.nextPage) || (nextPage + 1));
    } catch {
      setError('Nepodařilo se načíst další položky.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-6">
        {items.map((c) => (
          <CharacterCard key={c.id} character={c} />
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        {hasNextPage ? (
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loading}
            className={[
              'px-4 py-2 rounded-md',
              'bg-zinc-800 text-white',
              'hover:bg-zinc-700',
              'disabled:opacity-60 disabled:cursor-not-allowed',
            ].join(' ')}
          >
            {loading ? 'Loading…' : 'Load more'}
          </button>
        ) : items.length > 0 ? (
          <p className="text-sm text-zinc-400">To je vše.</p>
        ) : null}
      </div>
    </div>
  );
}
