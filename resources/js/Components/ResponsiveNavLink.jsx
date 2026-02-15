import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
                                            active = false,
                                            className = '',
                                            children,
                                            ...props
                                          }) {
  return (
    <Link
      {...props}
      className={[
        'block w-full pl-3 pr-4 py-2 border-l-4 text-base font-medium transition',
        active
          ? 'border-zinc-300 text-zinc-100 bg-zinc-800/40'
          : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30 hover:border-zinc-500',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Link>
  );
}
