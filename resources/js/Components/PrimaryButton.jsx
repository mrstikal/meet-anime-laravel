export default function PrimaryButton({ className = '', disabled, children, ...props }) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center',
        'px-4 py-2 rounded-md',
        'bg-zinc-200 text-zinc-900',
        'hover:bg-white',
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
