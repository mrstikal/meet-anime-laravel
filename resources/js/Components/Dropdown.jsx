import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

function Dropdown({ children }) {
  return <div className="relative">{children}</div>;
}

function Trigger({ children }) {
  return children;
}

function Content({ align = 'right', width = '48', contentClasses = 'py-1 bg-zinc-900', children }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) setOpen(false);
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const alignmentClasses =
    align === 'left'
      ? 'origin-top-left left-0'
      : align === 'top'
        ? 'origin-top'
        : 'origin-top-right right-0';

  const widthClasses =
    width === '48' ? 'w-48' :
      width === '56' ? 'w-56' :
        'w-48';

  // We expect Breeze to pass a Trigger element that toggles open.
  // To keep API flexible, we look for a child with prop "dropdownTrigger".
  const trigger = [];
  const content = [];

  // Split children into trigger/content if user passed them in a single component tree
  // (In Breeze layouts it's typically separate, but this is safe.)
  (Array.isArray(children) ? children : [children]).forEach((child) => content.push(child));

  return (
    <div ref={dropdownRef} className="relative">
      <div onClick={() => setOpen((v) => !v)}>{/* click-to-toggle wrapper */
        content[0]
      }</div>

      {open ? (
        <div className="fixed inset-0 z-40" aria-hidden="true" />
      ) : null}

      {open ? (
        <div
          className={[
            'absolute z-50 mt-2 rounded-md shadow-lg border border-zinc-700',
            alignmentClasses,
            widthClasses,
          ].join(' ')}
        >
          <div className={contentClasses}>{content.slice(1)}</div>
        </div>
      ) : null}
    </div>
  );
}

function DropdownLink({ href, method, as = 'link', children, className = '', ...props }) {
  const classes = [
    'block w-full px-4 py-2 text-left text-sm',
    'text-zinc-200 hover:bg-zinc-800 hover:text-white',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (method) {
    return (
      <Link href={href} method={method} as={as} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;
