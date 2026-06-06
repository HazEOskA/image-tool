import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLang } from '../i18n';

/**
 * LiveProof
 *
 * The "live proof" section that sits directly under the streetwear / merch
 * drop builder. Instead of a generic SaaS proof card, this is modelled on the
 * REAL deployed portfolio it links to — observed live via Playwright:
 *
 *   https://animatedportfolio-osa.vercel.app
 *
 * That site is a dark "BUILDER OS / COMMAND CENTER": near-black canvas, orange
 * + terminal-green accents, monospace HUD labels ("02 / COMMAND CENTER",
 * "RUNTIME ACTIVE — SESSION #47"), an "AI SYSTEMS — LIVE CONSOLE" with module
 * bars and a streaming green log feed.
 *
 * So here the proof is a dominant live-console panel — an OS window wired to a
 * pulsing node "brain", a streaming terminal feed and live module readouts —
 * not a checkbox marketing card. No iframe: the external app stays fully
 * decoupled and we only link out (new tab). HUD jargon is intentionally English.
 */

const EASE = [0.21, 0.6, 0.35, 1] as const;

const LIVE_URL = 'https://animatedportfolio-osa.vercel.app';
const LIVE_HOST = 'animatedportfolio-osa.vercel.app';
const MAILTO =
  'mailto:osabarca@gmail.com?subject=NEONWERKS%20%E2%80%94%20Build%20My%20Visual%20System';

/** Brain nodes positioned in a 0–100 viewBox; each links back to the core. */
const NODES: readonly { x: number; y: number; label: string; accent: string }[] = [
  { x: 50, y: 13, label: 'AI', accent: '#34e2ff' },
  { x: 84, y: 30, label: '3D', accent: '#9b6bff' },
  { x: 80, y: 74, label: 'UI', accent: '#ff5ed3' },
  { x: 50, y: 88, label: 'FLOW', accent: '#4f8bff' },
  { x: 18, y: 72, label: 'SHADER', accent: '#34e2ff' },
  { x: 16, y: 30, label: 'MOTION', accent: '#9b6bff' },
];

const CORE = { x: 50, y: 50 };

/** Streaming console lines — mirrors the real portfolio's green log feed. */
const LOG_LINES: readonly string[] = [
  '> boot interactive-brain.os ......... ok',
  '> mount shader-pipeline ............. ok',
  '> rig framer-motion timeline ........ ok',
  '> deploy target: vercel ............. live',
  '> render loop ............... 60fps stable',
  '> session #47 ............... runtime active',
];

export default function LiveProof() {
  const { t } = useLang();
  const reduce = useReducedMotion();

  return (
    <section id="live-proof" className="relative mx-auto max-w-7xl px-6 py-24">
      {/* ambient glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-24 -z-10 h-72 w-[44rem] -translate-x-1/2 rounded-full bg-neon-purple/20 blur-[130px]"
        animate={reduce ? undefined : { opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* HUD top strip — system identifiers, not a tagline */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: EASE }}
        className="flex flex-wrap items-center justify-between gap-3 border-y border-white/10 py-3 font-mono text-[10px] uppercase tracking-[0.32em] text-white/45"
      >
        <span className="text-neon-cyan">02 / LIVE DEPLOYED SYSTEM</span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          <span className="text-emerald-300/90">RUNTIME ACTIVE</span>
          <span className="text-white/25">·</span>
          <span>VERCEL</span>
        </span>
      </motion.div>

      {/* heading */}
      <motion.header
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: EASE }}
        className="mt-8 max-w-3xl"
      >
        <h2 className="text-balance text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">
          <span className="text-gradient">{t.liveProof.title}</span>
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/55 sm:text-lg">
          {t.liveProof.body}
        </p>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mt-10 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]"
      >
        {/* ===== DOMINANT VISUAL: live command-center console ===== */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#08070f] to-[#040308] shadow-card">
          {/* subtle grid + glow */}
          <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 opacity-[0.5]" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 72% 30%, rgba(155,107,255,0.18), transparent 60%), radial-gradient(circle at 20% 85%, rgba(255,90,31,0.12), transparent 60%)',
            }}
          />

          {/* OS window bar showing the real deployed URL */}
          <div className="relative z-10 flex items-center gap-2 border-b border-white/10 bg-black/40 px-4 py-2.5 backdrop-blur-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <div className="ml-3 flex min-w-0 items-center gap-2 rounded-md border border-white/10 bg-white/5 px-2.5 py-0.5">
              <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-emerald-400" />
              <span className="truncate font-mono text-[10px] tracking-widest text-white/55">
                {LIVE_HOST}
              </span>
            </div>
            <span className="ml-auto hidden font-mono text-[9px] uppercase tracking-[0.3em] text-white/35 sm:block">
              BUILDER OS · v1.0
            </span>
          </div>

          {/* console body: brain map (dominant) + streaming terminal */}
          <div className="relative z-10 grid grid-cols-1 gap-px bg-white/[0.04] md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
            {/* brain map — the hero visual */}
            <div className="relative aspect-[4/3] bg-[#06050d] sm:aspect-[16/11]">
              <span className="pointer-events-none absolute left-3 top-3 z-10 font-mono text-[9px] uppercase tracking-[0.3em] text-neon-cyan/80">
                INTERACTIVE BRAIN
              </span>
              <BrainGraph reduce={!!reduce} />
              <span className="pointer-events-none absolute bottom-3 right-3 z-10 font-mono text-[9px] uppercase tracking-[0.3em] text-white/40">
                MOTION ENGINEERING
              </span>
            </div>

            {/* live terminal feed + module readouts */}
            <div className="flex flex-col bg-[#050409]">
              <Terminal reduce={!!reduce} />
              <div className="mt-auto space-y-2.5 border-t border-white/10 p-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/35">
                  Modules
                </p>
                {t.liveProof.modules.map((label, i) => (
                  <ModuleBar key={label} label={label} index={i} reduce={!!reduce} />
                ))}
              </div>
            </div>
          </div>

          {/* status footer strip */}
          <div className="relative z-10 flex items-center justify-between border-t border-white/10 bg-black/30 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.28em] text-white/40">
            <span>{t.liveProof.cardCaption}</span>
            <span className="flex items-center gap-1.5 text-emerald-300/80">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              LIVE
            </span>
          </div>
        </div>

        {/* ===== side rail: HUD readouts + CTAs (no marketing checkboxes) ===== */}
        <div className="relative flex flex-col justify-between gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-7">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-7 top-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #9b6bff, transparent)' }}
          />

          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              {t.liveProof.badge}
            </span>

            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">
              {t.liveProof.panelLabel}
            </p>

            {/* HUD readout rows — replaces the old checkmark list */}
            <dl className="mt-3 divide-y divide-white/[0.07] border-y border-white/[0.07] font-mono">
              {[
                ['DEPLOY', 'VERCEL · LIVE'],
                ['STACK', 'R3F · GLSL · MOTION'],
                ['RENDER', '60FPS · REAL-TIME'],
                ['TYPE', 'NOT A MOCKUP'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-3 py-2.5">
                  <dt className="text-[10px] uppercase tracking-[0.25em] text-white/35">{k}</dt>
                  <dd className="text-[11px] uppercase tracking-[0.18em] text-white/80">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={LIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple px-7 py-3.5 text-sm font-semibold text-ink-950 shadow-glow transition-transform hover:scale-[1.03]"
            >
              {t.liveProof.ctaPrimary}
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden>
                <path
                  d="M5 3h8v8M13 3 4 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href={MAILTO}
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/5"
            >
              {t.liveProof.ctaSecondary}
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/** Live streaming terminal feed — appends lines on a timer, blinking cursor. */
function Terminal({ reduce }: { reduce: boolean }) {
  const [count, setCount] = useState(reduce ? LOG_LINES.length : 1);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setCount((c) => (c >= LOG_LINES.length ? 1 : c + 1));
    }, 900);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div
      ref={ref}
      className="min-h-[7.5rem] flex-1 space-y-1.5 p-4 font-mono text-[10.5px] leading-relaxed sm:text-[11px]"
      aria-hidden
    >
      {LOG_LINES.slice(0, count).map((line) => (
        <motion.div
          key={line}
          initial={reduce ? false : { opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          className={
            /ok$|live$|active$|stable$/.test(line)
              ? 'text-emerald-300/90'
              : 'text-white/55'
          }
        >
          {line}
        </motion.div>
      ))}
      <span className="inline-block h-3.5 w-2 animate-pulse bg-emerald-400/80 align-middle" />
    </div>
  );
}

/** A single live module readout rendered as a pulsing progress bar. */
function ModuleBar({ label, index, reduce }: { label: string; index: number; reduce: boolean }) {
  const pct = [96, 100, 88][index] ?? 92;
  return (
    <div>
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em]">
        <span className="text-white/55">{label}</span>
        <span className="text-emerald-300/80">{pct}%</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink"
          initial={reduce ? false : { width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE, delay: 0.2 + index * 0.15 }}
        />
      </div>
    </div>
  );
}

/** Decorative live "brain" — pulsing nodes wired back to a glowing core. */
function BrainGraph({ reduce }: { reduce: boolean }) {
  return (
    <svg
      viewBox="0 0 100 75"
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
      aria-hidden
    >
      {/* synapse lines */}
      {NODES.map((n) => {
        const x = (n.x / 100) * 100;
        const y = (n.y / 100) * 75;
        const cx = (CORE.x / 100) * 100;
        const cy = (CORE.y / 100) * 75;
        return (
          <line
            key={`line-${n.label}`}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke={n.accent}
            strokeWidth={0.4}
            strokeOpacity={0.5}
            className={reduce ? undefined : 'animate-pulse-line'}
            style={{ animationDelay: `${(n.x % 5) * 0.4}s` }}
          />
        );
      })}

      {/* core glow */}
      <circle cx={50} cy={37.5} r={8} fill="#9b6bff" opacity={0.18} />
      <motion.circle
        cx={50}
        cy={37.5}
        r={4.4}
        fill="url(#coreGrad)"
        animate={reduce ? undefined : { r: [4.4, 5.4, 4.4], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* nodes */}
      {NODES.map((n, i) => {
        const x = (n.x / 100) * 100;
        const y = (n.y / 100) * 75;
        return (
          <g key={`node-${n.label}`}>
            <motion.circle
              cx={x}
              cy={y}
              r={2.6}
              fill={n.accent}
              animate={reduce ? undefined : { opacity: [0.55, 1, 0.55], r: [2.4, 3, 2.4] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
            />
            <text
              x={x}
              y={y - 4}
              textAnchor="middle"
              className="fill-white/55 font-mono"
              style={{ fontSize: '2.6px', letterSpacing: '0.3px' }}
            >
              {n.label}
            </text>
          </g>
        );
      })}

      <defs>
        <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#34e2ff" />
          <stop offset="100%" stopColor="#9b6bff" />
        </radialGradient>
      </defs>
    </svg>
  );
}
