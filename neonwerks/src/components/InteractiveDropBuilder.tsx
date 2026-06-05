import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLang } from '../i18n';

/**
 * InteractiveDropBuilder
 *
 * "Pick a vibe -> see the launch direction" demo. Translates the productized
 * streetwear-launch-pack offer into a single hover/click moment a layperson
 * understands instantly.
 *
 * Section headings + the deliverables list translate via copy.ts. Per-style
 * brand voice (drop name, headline, CTA label) stays English-only on purpose
 * — same pattern as NEONWERKS / GLSL / brand identifiers across the site.
 */

const EASE = [0.21, 0.6, 0.35, 1] as const;

interface DropStyle {
  id: 'night' | 'graffiti' | 'luxury' | 'cyber';
  name: string;
  drop: string;
  headline: string;
  description: string;
  cta: string;
  accent: string;
  accent2: string;
  bgClass: string;
  bgGradient: string;
  typeClass: string;
  dropTypeClass: string;
}

const STYLES: readonly DropStyle[] = [
  {
    id: 'night',
    name: 'Night Mode',
    drop: 'NS-01 Heavy Hoodie',
    headline: 'Built for the night shift.',
    description: 'Heavy cotton, oversized fit, low-key presence. For people who move when the city slows down.',
    cta: 'Pre-order the drop',
    accent: '#34e2ff',
    accent2: '#4f8bff',
    bgClass: 'from-[#06121f] to-[#040810]',
    bgGradient:
      'radial-gradient(circle at 30% 25%, rgba(52,226,255,0.18), transparent 60%), radial-gradient(circle at 80% 80%, rgba(79,139,255,0.18), transparent 65%)',
    typeClass: 'font-sans',
    dropTypeClass: 'font-mono uppercase tracking-[0.2em] text-xs',
  },
  {
    id: 'graffiti',
    name: 'Graffiti Drop',
    drop: 'TAG-09 Spray Crew Tee',
    headline: 'Tag the city. Wear the signal.',
    description: 'Spray-paint energy, bold marks, crew identity. Built for the ones who leave a trace.',
    cta: 'Join the drop',
    accent: '#ff5ed3',
    accent2: '#ffb454',
    bgClass: 'from-[#1a0712] to-[#0a0306]',
    bgGradient:
      'radial-gradient(circle at 75% 30%, rgba(255,94,211,0.22), transparent 55%), radial-gradient(circle at 15% 80%, rgba(255,180,84,0.18), transparent 60%)',
    typeClass: 'font-sans',
    dropTypeClass: 'font-mono italic uppercase tracking-[0.15em] text-xs',
  },
  {
    id: 'luxury',
    name: 'Luxury Black',
    drop: 'NOIR-01 Heavy Crewneck',
    headline: 'Clean silhouette. Heavy presence.',
    description: 'Minimal marks, premium cut, deep matte black. For quiet confidence — no logos shouting.',
    cta: 'Reserve the release',
    accent: '#e8d9b0',
    accent2: '#ffffff',
    bgClass: 'from-[#0a0a0a] to-[#020202]',
    bgGradient:
      'radial-gradient(circle at 50% 0%, rgba(232,217,176,0.10), transparent 60%), linear-gradient(180deg, rgba(255,255,255,0.02), transparent 50%)',
    typeClass: 'font-sans',
    dropTypeClass: 'font-sans uppercase tracking-[0.35em] text-[10px]',
  },
  {
    id: 'cyber',
    name: 'Cyberpunk Neon',
    drop: 'NEON-2049 Tech Jacket',
    headline: 'Streetwear from the future district.',
    description: 'Reflective tape, glitch graphics, dark technical fabrics. Drop coded for the after-hours grid.',
    cta: 'Unlock the launch',
    accent: '#9b6bff',
    accent2: '#34e2ff',
    bgClass: 'from-[#0c0820] to-[#04020e]',
    bgGradient:
      'radial-gradient(circle at 20% 30%, rgba(155,107,255,0.22), transparent 55%), radial-gradient(circle at 85% 70%, rgba(52,226,255,0.22), transparent 55%)',
    typeClass: 'font-mono',
    dropTypeClass: 'font-mono uppercase tracking-[0.25em] text-xs',
  },
];

const MAILTO =
  'mailto:osabarca@gmail.com?subject=NEONWERKS%20Streetwear%20Launch%20Pack';

export default function InteractiveDropBuilder() {
  const { t } = useLang();
  const [selectedId, setSelectedId] = useState<DropStyle['id']>('night');
  const [hoveredId, setHoveredId] = useState<DropStyle['id'] | null>(null);
  const activeId = hoveredId ?? selectedId;
  const active = STYLES.find((s) => s.id === activeId) ?? STYLES[0];

  return (
    <section id="drop-builder" className="relative mx-auto max-w-7xl px-6 py-24">
      {/* ambient glow tinted by active style */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-32 -z-10 h-72 w-[42rem] -translate-x-1/2 rounded-full blur-[120px]"
        animate={{ backgroundColor: `${active.accent}25` }}
        transition={{ duration: 0.6, ease: EASE }}
      />

      <motion.header
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: EASE }}
        className="mx-auto max-w-3xl text-center"
      >
        <div className="inline-flex items-center gap-3">
          <span className="h-px w-8 bg-gradient-to-r from-neon-cyan to-neon-purple" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-neon-cyan">
            {t.dropBuilder.eyebrow}
          </span>
          <span className="h-px w-8 bg-gradient-to-r from-neon-purple to-neon-pink" />
        </div>
        <h2 className="mt-5 text-balance text-3xl font-extrabold tracking-tight sm:text-5xl">
          <span className="text-gradient">{t.dropBuilder.title}</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/55 sm:text-lg">
          {t.dropBuilder.subhead}
        </p>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]"
      >
        {/* style picker */}
        <div role="radiogroup" aria-label={t.dropBuilder.selectAria}>
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-white/40">
            {t.dropBuilder.pickerLabel}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {STYLES.map((s) => {
              const isSelected = selectedId === s.id;
              const isHot = activeId === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelectedId(s.id)}
                  onMouseEnter={() => setHoveredId(s.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onFocus={() => setHoveredId(s.id)}
                  onBlur={() => setHoveredId(null)}
                  style={{
                    borderColor: isHot ? s.accent : undefined,
                    boxShadow: isHot ? `0 0 0 1px ${s.accent}55, 0 18px 40px -18px ${s.accent}55` : undefined,
                  }}
                  className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                    isHot
                      ? 'border-white/20 bg-white/[0.05]'
                      : 'border-white/10 bg-white/[0.025] hover:bg-white/[0.04]'
                  }`}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-2xl transition-opacity duration-500"
                    style={{ background: s.accent, opacity: isHot ? 0.35 : 0.12 }}
                  />
                  <span className="relative z-10 flex items-center justify-between gap-3">
                    <span
                      className="h-7 w-7 shrink-0 rounded-lg border bg-ink-950"
                      style={{
                        borderColor: s.accent,
                        background: `linear-gradient(135deg, ${s.accent}, ${s.accent2})`,
                      }}
                    />
                    <span className="flex-1">
                      <span className="block text-sm font-bold text-white">{s.name}</span>
                      <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-widest text-white/45">
                        {s.drop}
                      </span>
                    </span>
                    <span
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
                        isSelected ? 'border-transparent' : 'border-white/25'
                      }`}
                      style={{ background: isSelected ? s.accent : 'transparent' }}
                    >
                      {isSelected && (
                        <svg viewBox="0 0 12 12" className="h-3 w-3 text-ink-950" aria-hidden>
                          <path d="M2.5 6.2 5 8.5l4.5-5.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                  </span>
                  {isSelected && (
                    <span className="sr-only"> — {t.dropBuilder.selectedHint}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* live preview */}
        <div>
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-white/40">
            {t.dropBuilder.previewLabel}
          </p>
          <div
            className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b ${active.bgClass} shadow-card`}
            aria-live="polite"
          >
            {/* mood layer that crossfades on switch */}
            <AnimatePresence mode="sync">
              <motion.div
                key={`bg-${active.id}`}
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ backgroundImage: active.bgGradient }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
              />
            </AnimatePresence>

            {/* fake browser bar so it reads as a launch page mockup */}
            <div className="relative z-10 flex items-center gap-2 border-b border-white/10 bg-black/30 px-4 py-2.5 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-white/20" />
              <span className="h-2 w-2 rounded-full bg-white/20" />
              <span className="h-2 w-2 rounded-full bg-white/20" />
              <div className="ml-3 flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-2.5 py-0.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: active.accent }} />
                <span className="font-mono text-[9px] uppercase tracking-widest text-white/45">
                  /{active.id}-drop
                </span>
              </div>
            </div>

            {/* preview content */}
            <div className="relative z-10 grid items-start gap-6 p-6 sm:grid-cols-[1.25fr_1fr] sm:p-8 lg:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`copy-${active.id}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className={active.typeClass}
                >
                  <p className={`${active.dropTypeClass}`} style={{ color: active.accent }}>
                    {active.drop}
                  </p>
                  <h3 className="mt-4 text-2xl font-extrabold leading-[1.05] text-white sm:text-4xl">
                    {active.headline}
                  </h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-white/65 sm:text-base">
                    {active.description}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <span
                      className="rounded-full px-5 py-2.5 text-sm font-bold text-ink-950"
                      style={{
                        background: `linear-gradient(90deg, ${active.accent}, ${active.accent2})`,
                        boxShadow: `0 14px 36px -12px ${active.accent}88`,
                      }}
                    >
                      {active.cta}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-white/35">
                      preview · not a live store
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* deliverables checklist (constant content; accent changes) */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/45">
                  {t.dropBuilder.deliverablesLabel}
                </p>
                <ul className="mt-3 space-y-2.5">
                  {t.dropBuilder.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-3 text-sm text-white/80">
                      <motion.span
                        aria-hidden
                        className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md"
                        animate={{ backgroundColor: active.accent }}
                        transition={{ duration: 0.4, ease: EASE }}
                      >
                        <svg viewBox="0 0 12 12" className="h-3 w-3 text-ink-950" aria-hidden>
                          <path d="M2.5 6.2 5 8.5l4.5-5.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </motion.span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* follow-up CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, ease: EASE }}
        className="mt-10 flex flex-col items-center gap-3 text-center"
      >
        <p className="text-base font-semibold text-white sm:text-lg">{t.dropBuilder.followupTitle}</p>
        <p className="max-w-md text-sm leading-relaxed text-white/55">{t.dropBuilder.followupBody}</p>
        <a
          href={MAILTO}
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple px-7 py-3 text-sm font-semibold text-ink-950 shadow-glow transition-transform hover:scale-[1.04]"
        >
          {t.dropBuilder.followupCta}
          <span aria-hidden>→</span>
        </a>
      </motion.div>
    </section>
  );
}
