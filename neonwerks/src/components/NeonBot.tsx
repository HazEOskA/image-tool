import { useCallback, useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, type AnimationPlaybackControls } from 'framer-motion';
import { useLang } from '../i18n';
import './NeonBot.css';

/**
 * NEON BOT — a small draggable drone that guides visitors through the four
 * pipeline tools.
 *
 * Interaction model:
 *  - Press + drag (mouse / touch): the bot follows the pointer.
 *      • released near a [data-tool-id] card -> snaps to it + shows a tooltip
 *      • released away -> a quick thruster boost, then returns to its dock
 *  - Tap / click / Enter / Space (no drag): auto-tours all four stations,
 *    scrolling each card into view (the mobile-friendly fallback).
 *
 * Movement uses Framer motion values + the imperative `animate()` so dragging
 * never triggers React re-renders. Only small visual-state changes do.
 */

const SIZE = 60; // interactive footprint used for clamping
const MARGIN = 18;
const DRAG_THRESHOLD = 6; // px before a press counts as a drag (vs a tap)
const HIT_PAD = 70; // how far outside a card still counts as "near"

type Phase = 'idle' | 'drag' | 'fly' | 'return' | 'tour';
interface Station {
  id: string;
  name: string;
  tip: string;
}
interface Tooltip {
  name: string;
  tip: string;
  side: 'left' | 'right' | 'center';
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
function dockCoords() {
  return {
    x: window.innerWidth - SIZE - MARGIN,
    y: window.innerHeight - SIZE - MARGIN,
  };
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function NeonBot() {
  const { t } = useLang();

  const x = useMotionValue(typeof window !== 'undefined' ? dockCoords().x : 0);
  const y = useMotionValue(typeof window !== 'undefined' ? dockCoords().y : 0);

  const [phase, setPhase] = useState<Phase>('idle');
  const [hovered, setHovered] = useState(false);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const [showHint, setShowHint] = useState(true);

  // refs that must not trigger re-renders
  const animX = useRef<AnimationPlaybackControls | null>(null);
  const animY = useRef<AnimationPlaybackControls | null>(null);
  const runId = useRef(0); // invalidates in-flight async tours / flights
  const drag = useRef({ active: false, moved: false, offX: 0, offY: 0, startX: 0, startY: 0 });
  const phaseRef = useRef<Phase>('idle');

  const setPhaseBoth = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };

  const stopAnims = () => {
    animX.current?.stop();
    animY.current?.stop();
  };

  const moveTo = useCallback(
    (tx: number, ty: number, opts?: Parameters<typeof animate>[2]) => {
      stopAnims();
      const conf = { type: 'spring', stiffness: 210, damping: 24, ...(opts as object) } as const;
      animX.current = animate(x, tx, conf);
      animY.current = animate(y, ty, conf);
      // AnimationPlaybackControls is thenable -> awaiting resolves on finish
      return Promise.all([animX.current, animY.current]).catch(() => {});
    },
    [x, y],
  );

  const returnToDock = useCallback(async () => {
    const id = ++runId.current;
    setPhaseBoth('return');
    setTooltip(null);
    const d = dockCoords();
    await moveTo(d.x, d.y);
    if (runId.current === id) setPhaseBoth('idle');
  }, [moveTo]);

  // keep the bot parked at the dock while idle, across viewport resizes
  useEffect(() => {
    const d = dockCoords();
    x.set(d.x);
    y.set(d.y);
    const onResize = () => {
      if (phaseRef.current === 'idle' || phaseRef.current === 'return') {
        const nd = dockCoords();
        x.set(nd.x);
        y.set(nd.y);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [x, y]);

  const readStations = (): { st: Station; rect: DOMRect }[] => {
    const out: { st: Station; rect: DOMRect }[] = [];
    t.neonBot.stations.forEach((st) => {
      const el = document.querySelector(`[data-tool-id="${st.id}"]`);
      if (el) out.push({ st, rect: el.getBoundingClientRect() });
    });
    return out;
  };

  const tooltipSide = (cx: number): Tooltip['side'] => {
    if (cx > window.innerWidth - 150) return 'left';
    if (cx < 150) return 'right';
    return 'center';
  };

  const flyToStation = useCallback(
    async (entry: { st: Station; rect: DOMRect }) => {
      const id = ++runId.current;
      setPhaseBoth('fly');
      setShowHint(false);
      const { rect, st } = entry;
      const tx = clamp(rect.left + rect.width / 2 - SIZE / 2, MARGIN, window.innerWidth - SIZE - MARGIN);
      const ty = clamp(rect.top + rect.height / 2 - SIZE / 2, MARGIN, window.innerHeight - SIZE - MARGIN);
      await moveTo(tx, ty);
      if (runId.current !== id) return;
      setTooltip({ name: st.name, tip: st.tip, side: tooltipSide(tx + SIZE / 2) });
      await sleep(2600);
      if (runId.current !== id) return;
      returnToDock();
    },
    [moveTo, returnToDock],
  );

  const boostBack = useCallback(async () => {
    const id = ++runId.current;
    setPhaseBoth('return');
    setTooltip(null);
    // quick thruster kick upward, then home
    await moveTo(x.get(), y.get() - 46, { type: 'spring', stiffness: 600, damping: 18 });
    if (runId.current !== id) return;
    const d = dockCoords();
    await moveTo(d.x, d.y);
    if (runId.current === id) setPhaseBoth('idle');
  }, [moveTo, x, y]);

  const autoTour = useCallback(async () => {
    const id = ++runId.current;
    setShowHint(false);
    setPhaseBoth('tour');
    const stations = t.neonBot.stations;
    for (const st of stations) {
      if (runId.current !== id) return;
      const el = document.querySelector(`[data-tool-id="${st.id}"]`);
      if (!el) continue;
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await sleep(520);
      if (runId.current !== id) return;
      const rect = el.getBoundingClientRect();
      const tx = clamp(rect.left + rect.width / 2 - SIZE / 2, MARGIN, window.innerWidth - SIZE - MARGIN);
      const ty = clamp(rect.top + rect.height / 2 - SIZE / 2, MARGIN, window.innerHeight - SIZE - MARGIN);
      await moveTo(tx, ty);
      if (runId.current !== id) return;
      setTooltip({ name: st.name, tip: st.tip, side: tooltipSide(tx + SIZE / 2) });
      await sleep(1600);
      if (runId.current !== id) return;
      setTooltip(null);
      await sleep(160);
    }
    if (runId.current === id) returnToDock();
  }, [moveTo, returnToDock, t.neonBot.stations]);

  /* ---------- pointer drag ---------- */

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    runId.current++; // cancel any running tour / flight
    stopAnims();
    setTooltip(null);
    setShowHint(false);
    drag.current = {
      active: true,
      moved: false,
      offX: e.clientX - x.get(),
      offY: e.clientY - y.get(),
      startX: e.clientX,
      startY: e.clientY,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;
    if (!drag.current.moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
      drag.current.moved = true;
      setPhaseBoth('drag');
    }
    if (drag.current.moved) {
      x.set(clamp(e.clientX - drag.current.offX, MARGIN, window.innerWidth - SIZE - MARGIN));
      y.set(clamp(e.clientY - drag.current.offY, MARGIN, window.innerHeight - SIZE - MARGIN));
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!drag.current.active) return;
    const wasDrag = drag.current.moved;
    drag.current.active = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* capture may already be gone */
    }

    if (!wasDrag) {
      autoTour();
      return;
    }
    // dropped after a drag: snap to nearest station, else boost home
    const bx = x.get() + SIZE / 2;
    const by = y.get() + SIZE / 2;
    let best: { st: Station; rect: DOMRect } | null = null;
    let bestDist = Infinity;
    for (const entry of readStations()) {
      const r = entry.rect;
      const near =
        bx >= r.left - HIT_PAD &&
        bx <= r.right + HIT_PAD &&
        by >= r.top - HIT_PAD &&
        by <= r.bottom + HIT_PAD;
      if (!near) continue;
      const d = Math.hypot(bx - (r.left + r.width / 2), by - (r.top + r.height / 2));
      if (d < bestDist) {
        bestDist = d;
        best = entry;
      }
    }
    if (best) flyToStation(best);
    else boostBack();
  };

  const onPointerCancel = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    returnToDock();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      autoTour();
    }
  };

  const active = hovered || phase === 'drag' || phase === 'fly' || phase === 'tour';
  const eye = active ? '#34e2ff' : '#1f6f86';

  return (
    <motion.div
      className="neonbot-root fixed left-0 top-0 z-[60]"
      style={{ x, y }}
      aria-hidden={false}
    >
      {/* tooltip */}
      {tooltip && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25, ease: [0.21, 0.6, 0.35, 1] }}
          role="status"
          className={`pointer-events-none absolute bottom-full mb-3 w-52 rounded-xl border border-white/15 bg-ink-900/95 p-3 shadow-card backdrop-blur-xl ${
            tooltip.side === 'left'
              ? 'right-0'
              : tooltip.side === 'right'
                ? 'left-0'
                : 'left-1/2 -translate-x-1/2'
          }`}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-neon-cyan">{tooltip.name}</p>
          <p className="mt-1 text-xs leading-relaxed text-white/80">{tooltip.tip}</p>
        </motion.div>
      )}

      {/* idle hint pill (opens leftward from the dock so it never overflows) */}
      {showHint && phase === 'idle' && (
        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-full border border-white/10 bg-ink-900/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white/55 backdrop-blur-xl"
        >
          {t.neonBot.hint}
        </motion.div>
      )}

      {phase === 'tour' && (
        <span className="sr-only" role="status">
          {t.neonBot.tourLabel}
        </span>
      )}

      <button
        type="button"
        className="neonbot-btn relative block h-[60px] w-[60px] cursor-grab rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan active:cursor-grabbing"
        style={{ touchAction: 'none' }}
        aria-label={t.neonBot.aria}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onKeyDown={onKeyDown}
      >
        {/* glow halo */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl transition-opacity duration-300"
          style={{ background: '#34e2ff', opacity: active ? 0.5 : 0.22 }}
        />

        <span className={`neonbot-float relative block h-full w-full ${phase === 'drag' ? '[animation-play-state:paused]' : ''}`}>
          <svg viewBox="0 0 64 76" className="h-full w-full overflow-visible" aria-hidden>
            <defs>
              <linearGradient id="nb-body" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#1b2233" />
                <stop offset="1" stopColor="#0b0e17" />
              </linearGradient>
              <linearGradient id="nb-visor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#0a1620" />
                <stop offset="1" stopColor="#04293a" />
              </linearGradient>
            </defs>

            {/* antenna */}
            <line x1="32" y1="10" x2="32" y2="2" stroke="#5b6680" strokeWidth="1.6" strokeLinecap="round" />
            <circle className={active ? 'neonbot-blink' : ''} cx="32" cy="3" r="2.6" fill="#ff5ed3" />

            {/* head / body shell */}
            <rect x="10" y="10" width="44" height="40" rx="18" fill="url(#nb-body)" stroke="#3a455e" strokeWidth="1.4" />
            {/* side cables / vents */}
            <path d="M12 26 q-5 4 0 8" fill="none" stroke="#3a455e" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M52 26 q5 4 0 8" fill="none" stroke="#3a455e" strokeWidth="1.4" strokeLinecap="round" />

            {/* visor */}
            <rect x="17" y="18" width="30" height="22" rx="11" fill="url(#nb-visor)" stroke={active ? '#34e2ff' : '#1f3540'} strokeWidth="1.4" />
            {/* scan line */}
            <rect className={active ? 'neonbot-scan' : ''} x="20" y="28" width="24" height="1.6" rx="1" fill="#34e2ff" opacity="0.5" />
            {/* eyes */}
            <circle cx="26" cy="29" r="3.4" fill={eye} style={{ filter: active ? 'drop-shadow(0 0 4px #34e2ff)' : 'none' }} />
            <circle cx="38" cy="29" r="3.4" fill={eye} style={{ filter: active ? 'drop-shadow(0 0 4px #34e2ff)' : 'none' }} />

            {/* chest light */}
            <circle cx="32" cy="46" r="2.2" fill={active ? '#9b6bff' : '#2b3350'} />

            {/* thruster */}
            <g className={active ? 'neonbot-thruster' : ''} style={{ opacity: active ? 1 : 0.4 }}>
              <path d="M24 52 q8 18 16 0 q-8 8 -16 0 z" fill="#34e2ff" opacity="0.85" />
              <path d="M28 52 q4 11 8 0 q-4 5 -8 0 z" fill="#ffffff" opacity="0.9" />
            </g>
          </svg>
        </span>
      </button>
    </motion.div>
  );
}
