export default function Checkbox({ className = '', ...props }) {
  return (
    <input
      {...props}
      type="checkbox"
      className={[
        'rounded border-zinc-600 bg-zinc-700 text-zinc-200 shadow-sm',
        'focus:ring-zinc-400/40 focus:border-zinc-400',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
}
