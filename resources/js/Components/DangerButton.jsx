export default function DangerButton({ className = '', disabled, children, ...props }) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center',
        'px-4 py-2 rounded-md',
        'bg-red-600 text-white',
        'hover:bg-red-500',
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
