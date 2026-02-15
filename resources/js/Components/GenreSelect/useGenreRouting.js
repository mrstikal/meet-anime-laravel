import * as React from 'react';
import { useCurrentSearchParams, inertiaPush } from '@/lib/url';

export function useGenreRouting() {
  const searchParams = useCurrentSearchParams();
  const [isPending, startTransition] = React.useTransition();

  const currentGenre = searchParams.get('id') || '';

  const onChange = React.useCallback(
    (item) => {
      if (!item) return;

      const params = new URLSearchParams(searchParams.toString());

      if (item.value === '') params.delete('id');
      else params.set('id', item.value);

      const qs = params.toString();

      startTransition(() => {
        inertiaPush('/genres', new URLSearchParams(qs));
      });
    },
    [searchParams]
  );

  return { currentGenre, onChange, isPending };
}
