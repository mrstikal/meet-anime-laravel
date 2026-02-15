export default function InputLabel({ value, children, className = '', ...props }) {
  return (
    <label
      {...props}
      className={['block font-medium text-sm text-zinc-300', className].filter(Boolean).join(' ')}
    >
      {value ?? children}
    </label>
  );
}
