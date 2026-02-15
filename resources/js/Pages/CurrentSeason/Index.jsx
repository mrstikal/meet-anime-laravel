import AppLayout from '@/Layouts/AppLayout';
import CurrentSeasonLoadMore from './CurrentSeasonLoadMore';

export default function CurrentSeasonIndex({
                                             title,
                                             initialItems,
                                             initialHasNextPage,
                                             initialNextPage,
                                             limit,
                                           }) {
  return (
    <AppLayout>
      <main className="py-8">
        <h1 className="text-4xl font-bold mb-6">{title ?? 'Current season'}</h1>

        <CurrentSeasonLoadMore
          initialItems={initialItems ?? []}
          initialHasNextPage={Boolean(initialHasNextPage)}
          initialNextPage={Number(initialNextPage) || 2}
          limit={Number(limit) || 20}
        />
      </main>
    </AppLayout>
  );
}
