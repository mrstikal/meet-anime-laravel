import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, className = '', children, ...props }) {
  return (
    <Link
      {...props}
      className={[
        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition',
        active
          ? 'border-zinc-300 text-zinc-100'
          : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-500',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Link>
  );
}
