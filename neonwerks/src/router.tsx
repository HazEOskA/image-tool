import { useEffect, useState, type AnchorHTMLAttributes, type MouseEvent } from 'react';

/**
 * Minimal dependency-free client router.
 *
 * The app is a static SPA and Vercel already rewrites every non-asset path to
 * index.html, so path-based deep links (e.g. /cases/nightshift-supply) resolve
 * to the bundle and this router renders the right view. Real <a href> values
 * are preserved, so middle-click / new-tab / no-JS all degrade gracefully to a
 * full navigation that the Vercel rewrite still serves.
 */

function normalize(path: string): string {
  const clean = path.replace(/\/+$/, '');
  return clean === '' ? '/' : clean;
}

export function useRoute(): string {
  const [path, setPath] = useState(() => normalize(window.location.pathname));
  useEffect(() => {
    const onPop = () => setPath(normalize(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  return path;
}

export function navigate(to: string) {
  const target = normalize(to.split('#')[0]);
  const hash = to.includes('#') ? to.slice(to.indexOf('#')) : '';
  if (target === normalize(window.location.pathname) && !hash) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
  if (hash) {
    // let the destination render, then jump to the anchor
    requestAnimationFrame(() => {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  } else {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

/** Internal link that uses pushState but keeps a working href fallback. */
export function Link({ to, onClick, children, ...rest }: LinkProps) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    // respect modifier keys / non-primary buttons -> let the browser handle it
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    navigate(to);
  };
  return (
    <a href={to} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
