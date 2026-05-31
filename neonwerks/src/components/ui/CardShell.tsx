import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useLang } from '../../i18n';

interface Props {
  index: string;
  title: string;
  concept: string;
  accent: string; // hex
  tags: string[];
  children: ReactNode; // the interactive simulation canvas
}

/**
 * Glassmorphism shell shared by every pipeline tool card. The interactive
 * simulation is passed as children and rendered inside a clipped viewport.
 */
export default function CardShell({ index, title, concept, accent, tags, children }: Props) {
  const { t } = useLang();
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.21, 0.6, 0.35, 1] }}
      whileHover={{ y: -6 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl glass-strong shadow-card"
      style={{ ['--accent' as string]: accent }}
    >
      {/* top accent line */}
      <div
        className="absolute inset-x-6 top-0 h-px opacity-80"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />
      {/* ambient glow that intensifies on hover */}
      <div
        className="pointer-events-none absolute -bottom-16 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
        style={{ background: accent }}
      />

      <div className="relative z-10 flex items-start justify-between gap-3 p-6 pb-4">
        <div className="flex items-center gap-3">
          <span
            className="grid h-11 w-11 place-items-center rounded-xl border bg-ink-950/60 font-mono text-sm font-bold"
            style={{ borderColor: accent, color: accent }}
          >
            {index}
          </span>
          <div>
            <h3 className="text-lg font-bold leading-tight text-white">{title}</h3>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: accent }}>
              {concept}
            </p>
          </div>
        </div>
      </div>

      {/* interactive viewport */}
      <div className="relative mx-5 mb-4 flex-1 overflow-hidden rounded-2xl border border-white/5 bg-ink-950/50">
        {children}
        <div className="pointer-events-none absolute bottom-2 right-3 font-mono text-[10px] uppercase tracking-widest text-white/30">
          {t.pipeline.liveTag}
        </div>
      </div>

      <div className="relative z-10 flex flex-wrap gap-2 px-6 pb-6">
        {tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/70"
          >
            {t}
          </span>
        ))}
      </div>
    </motion.article>
  );
}
