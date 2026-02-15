import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextInput(
  { type = 'text', className = '', isFocused = false, ...props },
  ref
) {
  const localRef = useRef(null);
  const inputRef = ref ?? localRef;

  useEffect(() => {
    if (isFocused && inputRef?.current) {
      inputRef.current.focus();
    }
  }, [isFocused, inputRef]);

  return (
    <input
      {...props}
      type={type}
      ref={inputRef}
      className={[
        'rounded-md shadow-sm',
        'bg-zinc-700 text-white border border-zinc-600',
        'focus:border-zinc-400 focus:ring-zinc-400/40',
        'w-full',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
});
