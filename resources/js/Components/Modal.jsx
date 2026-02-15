import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ show = false, onClose = () => {}, children, maxWidth = '2xl' }) {
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }

    if (show) document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [show, onClose]);

  if (!show) return null;

  const widthClass =
    maxWidth === 'sm' ? 'max-w-sm' :
      maxWidth === 'md' ? 'max-w-md' :
        maxWidth === 'lg' ? 'max-w-lg' :
          maxWidth === 'xl' ? 'max-w-xl' :
            maxWidth === '2xl' ? 'max-w-2xl' :
              'max-w-2xl';

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        className={[
          'relative w-full',
          widthClass,
          'rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-100 shadow-xl',
          'p-6',
        ].join(' ')}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
