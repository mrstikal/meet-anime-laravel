export function buildGenreSelectItems(genres) {
  return [{ label: 'All Genres', value: '' }, ...(genres ?? []).map((g) => ({ label: g.name, value: String(g.mal_id) }))];
}

export function filterGenreSelectItems(items, query) {
  const q = (query ?? '').trim().toLowerCase();
  if (!q) return items;
  return (items ?? []).filter((it) => (it.label ?? '').toLowerCase().includes(q));
}

export function getSelectedGenreSelectItem(items, currentValue) {
  return (items ?? []).find((it) => it.value === currentValue) ?? (items ?? [])[0];
}
