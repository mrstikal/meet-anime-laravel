export default function InputError({ message, className = '' }) {
  if (!message) return null;

  return <p className={['text-sm text-red-600', className].filter(Boolean).join(' ')}>{message}</p>;
}
