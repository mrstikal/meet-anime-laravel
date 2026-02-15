import Navigation from '@/Components/Navigation';
import { Head, Link } from '@inertiajs/react';

export default function AppLayout({ title, children }) {
  const appName = 'Meet Anime';

  return (
    <div className="min-h-screen">
      <Head title={title ? `${title} - ${appName}` : appName} />

      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xs -mx-8">
        <Navigation />
      </header>

      <div className="px-8">{children}</div>

      <div className="text-center py-3 px-8 mt-4 text-sm text-zinc-500 border-t border-zinc-800">
        Created by
        <a href="mailto:a@mrstik.cz" className="text-zinc-400 ml-1 underline">
          Alexej Mrštík
        </a>{' '}
        using Laravel, React and the Jikan API.
      </div>
    </div>
  );
}
