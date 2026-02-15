import { Link, router } from '@inertiajs/react';
import {useMemo, useState} from "react";
import AppLayout from "@/Layouts/AppLayout.jsx";

function buildQueryString(params) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === null || v === undefined) return;
    const s = String(v).trim();
    if (s === '') return;
    qs.set(k, s);
  });
  const out = qs.toString();
  return out ? `?${out}` : '';
}

export default function AnimeIndex({ title, items, page, pagination, genre, q, orderBy, sort }) {
  const currentPage = page ?? 1;
  const hasNext = Boolean(pagination?.has_next_page);

  const [query, setQuery] = useState(q ?? '');
  const [order, setOrder] = useState(orderBy ?? '');
  const [dir, setDir] = useState(sort ?? '');

  const baseParams = useMemo(
    () => ({
      genre: genre ?? '',
      q: query ?? '',
      orderBy: order ?? '',
      sort: dir ?? '',
    }),
    [genre, query, order, dir]
  );

  function submit(e) {
    e.preventDefault();
    router.get('/anime', { ...baseParams, page: 1 }, { preserveScroll: true });
  }

  const prevHref = `/anime${buildQueryString({ ...baseParams, page: Math.max(1, currentPage - 1) })}`;
  const nextHref = `/anime${buildQueryString({ ...baseParams, page: currentPage + 1 })}`;

  return (
    <AppLayout title={title}>
      <form onSubmit={submit} className="mb-6 grid grid-cols-1 md:grid-cols-12 gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search anime..."
          className="md:col-span-6 px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 outline-none focus:ring-2 focus:ring-zinc-600"
        />

        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="md:col-span-3 px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 outline-none focus:ring-2 focus:ring-zinc-600"
        >
          <option value="">Default</option>
          <option value="score">Score</option>
          <option value="popularity">Popularity</option>
          <option value="favorites">Favorites</option>
          <option value="members">Members</option>
          <option value="title">Title</option>
          <option value="start_date">Start date</option>
          <option value="end_date">End date</option>
          <option value="rank">Rank</option>
        </select>

        <select
          value={dir}
          onChange={(e) => setDir(e.target.value)}
          className="md:col-span-2 px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 outline-none focus:ring-2 focus:ring-zinc-600"
        >
          <option value="">Dir</option>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>

        <button className="md:col-span-1 px-3 py-2 rounded-md bg-white text-black font-medium">
          Go
        </button>
      </form>

      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-zinc-400">
          Page: {currentPage}
          {genre ? (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded bg-zinc-800 text-zinc-200">
              Genre: {genre}
            </span>
          ) : null}
        </div>

        {(genre || (q ?? '').trim() || (orderBy ?? '').trim() || (sort ?? '').trim()) ? (
          <Link href="/anime" className="text-sm text-zinc-300 hover:text-white">
            Clear filters
          </Link>
        ) : null}
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {(items ?? []).map((a) => (
          <li key={a.mal_id} className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/30">
            <div className="font-medium">
              <Link href={`/anime/${a.mal_id}`} className="hover:underline underline-offset-4">
                {a.title ?? '(no title)'}
              </Link>
            </div>
            {a.score != null ? <div className="text-sm text-zinc-400">Score: {a.score}</div> : null}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex gap-2">
        <Link
          href={prevHref}
          className={[
            'px-3 py-2 rounded-md bg-zinc-800 text-white',
            currentPage <= 1 ? 'pointer-events-none opacity-50' : '',
          ].join(' ')}
          preserveScroll
        >
          Prev
        </Link>

        <Link
          href={nextHref}
          className={[
            'px-3 py-2 rounded-md bg-zinc-800 text-white',
            !hasNext ? 'pointer-events-none opacity-50' : '',
          ].join(' ')}
          preserveScroll
        >
          Next
        </Link>
      </div>
    </AppLayout>
  );
}
