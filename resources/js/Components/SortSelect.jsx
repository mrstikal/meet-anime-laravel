import * as React from 'react';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';

import CheckIcon from '@/assets/images/check.svg';
import ChevronIcon from '@/assets/images/chevron-down.svg';

import { useComboWidth } from '@/Components/GenreSelect/useComboWidth';
import { useGenreSelectFloating } from '@/Components/GenreSelect/useGenreSelectFloating';
import SearchOverlay from '@/Components/SearchOverlay';
import { useCurrentSearchParams, inertiaPush } from '@/lib/url';

const ITEMS = [
  { label: 'Title (A → Z)', value: { orderBy: 'title', sort: 'asc' } },
  { label: 'Title (Z → A)', value: { orderBy: 'title', sort: 'desc' } },
  { label: 'Score (High → Low)', value: { orderBy: 'score', sort: 'desc' } },
  { label: 'Score (Low → High)', value: { orderBy: 'score', sort: 'asc' } },
  { label: 'Popularity (High → Low)', value: { orderBy: 'popularity', sort: 'desc' } },
  { label: 'Popularity (Low → High)', value: { orderBy: 'popularity', sort: 'asc' } },
];

function getSelected(items, orderBy, sort) {
  return items.find((it) => it.value.orderBy === orderBy && it.value.sort === sort) ?? items[0];
}

export default function SortSelect() {
  const searchParams = useCurrentSearchParams();
  const [isPending, startTransition] = React.useTransition();

  const currentOrderBy = searchParams.get('orderBy') ?? 'score';
  const currentSort = searchParams.get('sort') ?? 'desc';

  const selectedItem = React.useMemo(
    () => getSelected(ITEMS, currentOrderBy, currentSort),
    [currentOrderBy, currentSort]
  );

  const [query, setQuery] = React.useState('');
  const filteredItems = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ITEMS;
    return ITEMS.filter((it) => it.label.toLowerCase().includes(q));
  }, [query]);

  const inputElRef = React.useRef(null);
  const comboWidth = useComboWidth({
    inputElRef,
    items: filteredItems.map((x) => ({ label: x.label, value: x.label })),
  });

  const { floatingStyles, setReference, setFloating } = useGenreSelectFloating();

  const onChange = React.useCallback(
    (item) => {
      if (!item) return;

      const params = new URLSearchParams(searchParams.toString());
      params.set('orderBy', item.value.orderBy);
      params.set('sort', item.value.sort);

      startTransition(() => {
        inertiaPush('/genres', params);
      });
    },
    [searchParams]
  );

  return (
    <>
      <SearchOverlay active={isPending} text="Sorting…" />

      <div>
        <Combobox value={selectedItem} onChange={onChange}>
          <div className="relative">
            <div className="relative" ref={setReference} style={comboWidth ? { width: comboWidth } : undefined}>
              <ComboboxInput
                id="sort-select"
                ref={inputElRef}
                className={[
                  'bg-zinc-700 px-3.5 py-2 w-full pr-10',
                  'text-white rounded-md',
                  'outline-none focus:ring-2 focus:ring-zinc-400/40',
                ].join(' ')}
                displayValue={(item) => item?.label ?? ''}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Řazení…"
              />

              <ComboboxButton
                className="flex justify-end absolute inset-y-0 right-0 items-center pl-6 pr-4 text-white/90"
                aria-label="Open Sort List"
              >
                <ChevronIcon className="h-4 w-3 text-white/90" />
              </ComboboxButton>
            </div>

            <ComboboxOptions
              ref={setFloating}
              style={floatingStyles}
              className={[
                'z-50 overflow-hidden rounded-md shadow-lg',
                'bg-zinc-800 py-1',
                'overflow-y-auto scroll-py-1 scrollbar-thin-dark',
                'empty:hidden whitespace-nowrap',
              ].join(' ')}
            >
              {filteredItems.map((it) => (
                <ComboboxOption
                  key={`${it.value.orderBy}_${it.value.sort}`}
                  value={it}
                  className={[
                    'px-4 py-1 flex justify-between items-center cursor-pointer outline-none',
                    'data-focus:bg-zinc-900',
                  ].join(' ')}
                >
                  <span className="text-white">{it.label}</span>
                  <span className="relative ml-2 text-white">
                    {it.value.orderBy === currentOrderBy && it.value.sort === currentSort ? (
                      <CheckIcon className="h-3 w-3 text-white" />
                    ) : null}
                  </span>
                </ComboboxOption>
              ))}

              {filteredItems.length === 0 && (
                <div className="px-4 py-2 text-sm text-zinc-300">Nic nenalezeno.</div>
              )}
            </ComboboxOptions>
          </div>
        </Combobox>
      </div>
    </>
  );
}
