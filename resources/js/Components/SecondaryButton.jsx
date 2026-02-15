export default function SecondaryButton({ className = '', disabled, children, ...props }) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center',
        'px-4 py-2 rounded-md',
        'bg-zinc-800 text-white border border-zinc-700',
        'hover:bg-zinc-700',
        'transition',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  );
}
