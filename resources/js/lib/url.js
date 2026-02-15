import { router, usePage } from '@inertiajs/react';

export function useCurrentSearchParams() {
  const { url } = usePage(); // e.g. "/genres?id=1&sort=desc"
  const qs = url.includes('?') ? url.split('?')[1] : '';
  return new URLSearchParams(qs);
}

export function inertiaPush(pathname, params, options = {}) {
  const qs = params.toString();
  const href = qs ? `${pathname}?${qs}` : pathname;

  router.get(href, {}, {
    preserveScroll: true,
    preserveState: true,
    replace: false,
    ...options,
  });
}
