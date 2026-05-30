import { useEffect, useRef } from 'react';

export interface PointerState {
  /** Normalized -1..1 across the element, y is flipped (up = +1). */
  x: number;
  y: number;
  /** Raw 0..1 across the element. */
  u: number;
  v: number;
  inside: boolean;
}

/**
 * Tracks pointer position relative to a target element WITHOUT triggering
 * React re-renders. The value lives in a ref so Three.js / rAF loops can read
 * it every frame at zero React cost.
 */
export function usePointer<T extends HTMLElement>(targetRef: React.RefObject<T>) {
  const pointer = useRef<PointerState>({ x: 0, y: 0, u: 0.5, v: 0.5, inside: false });

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    const handleMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const u = (e.clientX - rect.left) / rect.width;
      const v = (e.clientY - rect.top) / rect.height;
      pointer.current.u = u;
      pointer.current.v = v;
      pointer.current.x = u * 2 - 1;
      pointer.current.y = -(v * 2 - 1);
    };
    const handleEnter = () => (pointer.current.inside = true);
    const handleLeave = () => {
      pointer.current.inside = false;
      // ease target back toward center on leave
      pointer.current.x = 0;
      pointer.current.y = 0;
      pointer.current.u = 0.5;
      pointer.current.v = 0.5;
    };

    el.addEventListener('pointermove', handleMove);
    el.addEventListener('pointerenter', handleEnter);
    el.addEventListener('pointerleave', handleLeave);
    return () => {
      el.removeEventListener('pointermove', handleMove);
      el.removeEventListener('pointerenter', handleEnter);
      el.removeEventListener('pointerleave', handleLeave);
    };
  }, [targetRef]);

  return pointer;
}
