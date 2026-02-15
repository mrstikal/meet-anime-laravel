import { Link } from '@inertiajs/react';

export default function AnimeGrid({ anime }) {
  const allAnime = (anime ?? []).map((a) => {
    const imageUrl =
      a?.anime?.images?.webp?.image_url ??
      a?.anime?.images?.jpg?.image_url ??
      a?.anime?.images?.webp?.small_image_url ??
      a?.anime?.images?.jpg?.small_image_url ??
      null;

    return {
      id: a?.anime?.mal_id,
      title: a?.anime?.title ?? '',
      image: imageUrl,
      role: a?.role ?? '',
    };
  });

  return (
    <>
      <h2 className="text-2xl pb-3 pt-4">Appeared in</h2>
      <section className="flex flex-wrap gap-5">
        {allAnime.map((it) => (
          <Link
            href={`/anime/${Number(it.id)}`}
            key={String(it.id)}
            className="w-40 shrink-0"
          >
            {it.image ? (
              <img
                src={it.image}
                alt={it.title}
                className="w-full h-auto object-cover aspect-7/10"
                loading="lazy"
              />
            ) : (
              <div className="w-full aspect-7/10 bg-zinc-600 flex items-center justify-center">
                <span className="text-zinc-400 text-sm">No image</span>
              </div>
            )}

            {it.title.length > 0 ? (
              <p className="text-xs pt-2 text-zinc-300">{it.title}</p>
            ) : null}

            {it.role.length > 0 ? (
              <p className="text-xs pt-1 text-zinc-300">
                <span className="font-bold">Role:</span> {it.role}
              </p>
            ) : null}
          </Link>
        ))}
      </section>
    </>
  );
}
