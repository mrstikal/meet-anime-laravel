import * as React from 'react';
import SearchOverlay from '@/Components/SearchOverlay';
import { useCurrentSearchParams, inertiaPush } from '@/lib/url';

export default function AnimeSearchInput({ basePath = '/genres', placeholder = 'Find anime' }) {
  const searchParams = useCurrentSearchParams();

  const inputRef = React.useRef(null);

  const currentQ = searchParams.get('q') ?? '';
  const [value, setValue] = React.useState(currentQ);

  const [isPending, startTransition] = React.useTransition();

  const lastAppliedRef = React.useRef(currentQ.trim());

  React.useEffect(() => {
    const trimmedValue = value.trim();
    const isFocused = document.activeElement === inputRef.current;

    if (isFocused && trimmedValue !== lastAppliedRef.current) return;

    setValue(currentQ);
  }, [currentQ, value]);

  const applyToUrl = React.useCallback(
    (next) => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmed = (next ?? '').trim();
      if (trimmed && trimmed.length < 2) return;

      if (trimmed) params.set('q', trimmed);
      else params.delete('q');

      lastAppliedRef.current = trimmed;

      startTransition(() => {
        inertiaPush(basePath, params, { replace: true });
      });
    },
    [searchParams, basePath]
  );

  React.useEffect(() => {
    const nextTrimmed = value.trim();
    const currentTrimmed = currentQ.trim();

    if (nextTrimmed === currentTrimmed) return;

    const t = window.setTimeout(() => {
      applyToUrl(value);
    }, 600);

    return () => window.clearTimeout(t);
  }, [value, currentQ, applyToUrl]);

  return (
    <>
      <SearchOverlay active={isPending} text="Searching…" />
      <form
        className="mb-8"
        onSubmit={(e) => {
          e.preventDefault();
          applyToUrl(value);
        }}
      >
        <div className="relative">
          <input
            ref={inputRef}
            id="anime-search"
            className={[
              'bg-zinc-700 px-3.5 py-2 w-80 pr-10',
              'text-white rounded-md',
              'outline-none focus:ring-2 focus:ring-zinc-400/40',
            ].join(' ')}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
          />

          {value.trim().length > 0 && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setValue('');
                applyToUrl('');
              }}
              className="flex justify-end absolute inset-y-0 right-0 items-center pl-6 pr-4 text-white/90"
            >
              <span className="text-lg leading-none">×</span>
            </button>
          )}
        </div>
      </form>
    </>
  );
}
