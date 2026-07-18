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

const SIZE = 92; // cyber-wasp footprint used for viewport clamping
const MARGIN = 18;
const CONTACT_EMAIL = 'osabarca@gmail.com';
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
  // first-contact message bubble (opened on click/tap; does NOT navigate)
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [bubbleSide, setBubbleSide] = useState<Tooltip['side']>('left');

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

  // Open/close the first-contact bubble. Anchors away from the nearest edge so
  // it never overflows the viewport. Does not navigate anywhere.
  const toggleBubble = () => {
    runId.current++; // stop any in-flight tour/flight so the bot holds still
    stopAnims();
    setTooltip(null);
    setShowHint(false);
    setBubbleSide(tooltipSide(x.get() + SIZE / 2));
    setBubbleOpen((o) => !o);
  };

  // Triggered from inside the bubble — preserves the original guided tour.
  const startTourFromBubble = () => {
    setBubbleOpen(false);
    autoTour();
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
      setBubbleOpen(false); // a real drag dismisses the message bubble
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
      // a click/tap opens the first-contact bubble — it does NOT navigate
      toggleBubble();
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
      toggleBubble();
    } else if (e.key === 'Escape' && bubbleOpen) {
      e.preventDefault();
      setBubbleOpen(false);
    }
  };

  const active = hovered || bubbleOpen || phase === 'drag' || phase === 'fly' || phase === 'tour';
  const eye = active ? '#34e2ff' : '#1f6f86';
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t.neonBot.bubble.mailSubject)}`;

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

      {/* first-contact message bubble — opens on click/tap, no navigation */}
      {bubbleOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.28, ease: [0.21, 0.6, 0.35, 1] }}
          role="dialog"
          aria-label="NEON BOT message"
          className={`pointer-events-auto absolute bottom-full mb-3 w-72 max-w-[78vw] overflow-hidden rounded-2xl border border-white/15 bg-ink-900/95 shadow-card backdrop-blur-xl ${
            bubbleSide === 'left' ? 'right-0' : bubbleSide === 'right' ? 'left-0' : 'left-1/2 -translate-x-1/2'
          }`}
        >
          {/* neon top edge */}
          <div
            className="pointer-events-none absolute inset-x-4 top-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #34e2ff, #9b6bff, transparent)' }}
          />
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-neon-cyan">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon-pink" />
                OSA // CYBER FAMILIAR
              </span>
              <button
                type="button"
                onClick={() => setBubbleOpen(false)}
                aria-label={t.neonBot.bubble.close}
                className="grid h-6 w-6 place-items-center rounded-full border border-white/15 text-white/55 transition-colors hover:bg-white/10 hover:text-white"
              >
                ×
              </button>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-white/85">{t.neonBot.bubble.greeting}</p>

            <div className="mt-4 flex flex-col gap-2">
              <a
                href={mailto}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple px-4 py-2 text-sm font-semibold text-ink-950 shadow-glow transition-transform hover:scale-[1.03]"
              >
                {t.neonBot.bubble.leaveMessage}
                <span aria-hidden>→</span>
              </a>
              <button
                type="button"
                onClick={startTourFromBubble}
                className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/5"
              >
                {t.neonBot.bubble.showTools}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* idle hint pill (opens leftward from the dock so it never overflows) */}
      {showHint && phase === 'idle' && !bubbleOpen && (
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
        className="neonbot-btn cyberwasp-btn relative block h-[92px] w-[92px] cursor-grab rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan active:cursor-grabbing"
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
          className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl transition-opacity duration-300"
          style={{ background: '#34e2ff', opacity: active ? 0.5 : 0.22 }}
        />

        <span className={`neonbot-float relative block h-full w-full ${phase === 'drag' ? '[animation-play-state:paused]' : ''}`}>
          <svg viewBox="0 0 100 82" className="h-full w-full overflow-visible" aria-hidden>
            <defs>
              <linearGradient id="wasp-armor" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#243544" />
                <stop offset="0.46" stopColor="#080d14" />
                <stop offset="1" stopColor="#16112d" />
              </linearGradient>
              <linearGradient id="wasp-stripe" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#dfff00" />
                <stop offset="0.55" stopColor="#00e5ea" />
                <stop offset="1" stopColor="#ff008c" />
              </linearGradient>
              <linearGradient id="wasp-wing-cyan" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ffffff" stopOpacity=".7" />
                <stop offset=".3" stopColor="#00e5ea" stopOpacity=".52" />
                <stop offset="1" stopColor="#00e5ea" stopOpacity=".04" />
              </linearGradient>
              <linearGradient id="wasp-wing-pink" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ffffff" stopOpacity=".65" />
                <stop offset=".35" stopColor="#ff008c" stopOpacity=".48" />
                <stop offset="1" stopColor="#ff008c" stopOpacity=".04" />
              </linearGradient>
              <filter id="wasp-glow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="2.2" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* four articulated holographic wings */}
            <g className="cyberwasp-wing cyberwasp-wing-left">
              <path d="M42 34C27 9 8 7 4 17c-3 10 21 21 38 24Z" fill="url(#wasp-wing-cyan)" stroke="#00e5ea" strokeWidth="1" />
              <path d="M42 40C23 35 7 40 10 51c3 9 24 1 36-7Z" fill="url(#wasp-wing-cyan)" stroke="#00e5ea" strokeWidth=".8" />
              <path d="M14 18 34 34M14 47l24-5" stroke="#fff" strokeOpacity=".38" strokeWidth=".6" />
            </g>
            <g className="cyberwasp-wing cyberwasp-wing-right">
              <path d="M58 34C73 9 92 7 96 17c3 10-21 21-38 24Z" fill="url(#wasp-wing-pink)" stroke="#ff008c" strokeWidth="1" />
              <path d="M58 40c19-5 35 0 32 11-3 9-24 1-36-7Z" fill="url(#wasp-wing-pink)" stroke="#ff008c" strokeWidth=".8" />
              <path d="m86 18-20 16m20 13-24-5" stroke="#fff" strokeOpacity=".34" strokeWidth=".6" />
            </g>

            {/* six mechanical legs */}
            <g className="cyberwasp-legs" fill="none" stroke="#65798a" strokeWidth="1.5" strokeLinecap="square">
              <path d="m39 42-15 8-7 11m23-14-12 12-1 12m18-21-7 14 3 8" />
              <path d="m61 42 15 8 7 11M60 47l12 12 1 12M55 50l7 14-3 8" />
              <path d="M14 61h7m3 10h7m10 11h6M86 61h-7m-3 10h-7m-10 11h-6" stroke="url(#wasp-stripe)" />
            </g>

            {/* abdomen + stinger */}
            <g className="cyberwasp-tail">
              <path d="M39 49c1 18 7 27 11 27s10-9 11-27Z" fill="url(#wasp-armor)" stroke="#506475" strokeWidth="1.2" />
              <path d="M41 55h18M43 62h14M46 69h8" stroke="url(#wasp-stripe)" strokeWidth="3" />
              <path d="m47 75 3 7 3-7" fill="#ff008c" filter="url(#wasp-glow)" />
            </g>

            {/* armored thorax */}
            <path d="m35 29 9-8h12l9 8-2 22-13 8-13-8Z" fill="url(#wasp-armor)" stroke="#00e5ea" strokeWidth="1.2" />
            <path d="m40 33 10-6 10 6-2 14-8 6-8-6Z" fill="#050a10" stroke="#263d4d" />
            <circle className="cyberwasp-core" cx="50" cy="40" r="4" fill={active ? '#dfff00' : '#00e5ea'} filter="url(#wasp-glow)" />
            <path d="M45 40h10M50 35v10" stroke="#fff" strokeWidth=".75" opacity=".72" />

            {/* head, antennae and visor eyes */}
            <path d="m38 16 7-8h10l7 8-4 12H42Z" fill="url(#wasp-armor)" stroke="#ff008c" strokeWidth="1.1" />
            <path d="M44 10 35 2m21 8 9-8" stroke="#65798a" strokeWidth="1.2" />
            <circle className={active ? 'neonbot-blink' : ''} cx="34" cy="2" r="1.8" fill="#00e5ea" />
            <circle className={active ? 'neonbot-blink' : ''} cx="66" cy="2" r="1.8" fill="#ff008c" />
            <path d="m42 17 6 2-6 3Zm16 0-6 2 6 3Z" fill={eye} filter="url(#wasp-glow)" />
            <path className={active ? 'neonbot-scan' : ''} d="M42 24h16" stroke="#00e5ea" strokeWidth="1" opacity=".55" />
          </svg>
        </span>
      </button>
    </motion.div>
  );
}
