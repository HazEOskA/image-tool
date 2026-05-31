import { motion } from 'framer-motion';
import SectionHeading from './ui/SectionHeading';
import { useLang } from '../i18n';

/* Minimal inline icon set — no new dependency. */
const I = {
  rocket: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 3.5c3.5 0 6 2.5 6 6L12 18l-3.5 3.5L7 20l3.5-3.5L3.5 9.5c0-3.5 2.5-6 6-6 2 0 3.5 1 5 2.5 1.5-1.5 3-2.5 5-2.5z" />
      <circle cx="15" cy="9" r="1.6" />
      <path d="M5.5 18.5c-1 1-1 2.5-1 3.5 1 0 2.5 0 3.5-1" />
    </svg>
  ),
  cursor: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l6 16 2.5-6.5L19 11z" />
      <path d="M13 13l6 6" />
    </svg>
  ),
  spark: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
      <path d="M19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8z" />
    </svg>
  ),
  hex: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="M12 8l4 2.3v3.4L12 16l-4-2.3v-3.4z" />
    </svg>
  ),
  wave: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0" />
      <circle cx="6" cy="18" r="1.4" />
      <circle cx="18" cy="6" r="1.4" />
    </svg>
  ),
};

/* Design tokens — kept out of the copy file because they're not translatable. */
const BUILD_VISUALS = [
  { accent: '#34e2ff', icon: I.rocket },
  { accent: '#4f8bff', icon: I.cursor },
  { accent: '#9b6bff', icon: I.spark },
  { accent: '#c66bff', icon: I.hex },
  { accent: '#ff5ed3', icon: I.wave },
];

export default function Builds() {
  const { t } = useLang();
  return (
    <section id="builds" className="relative mx-auto max-w-7xl px-6 py-24">
      <div className="mb-14 flex flex-col items-center">
        <SectionHeading
          eyebrow={t.builds.eyebrow}
          title={t.builds.title}
          description={t.builds.description}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {t.builds.items.map((b, i) => {
          const v = BUILD_VISUALS[i] ?? BUILD_VISUALS[0];
          return (
            <motion.article
              key={b.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.21, 0.6, 0.35, 1] }}
              whileHover={{ y: -4 }}
              className="group relative flex flex-col overflow-hidden rounded-2xl glass p-6 shadow-card"
              style={{ ['--accent' as string]: v.accent }}
            >
              <div
                className="pointer-events-none absolute inset-x-6 top-0 h-px opacity-70"
                style={{ background: `linear-gradient(90deg, transparent, ${v.accent}, transparent)` }}
              />
              <div
                className="pointer-events-none absolute -bottom-20 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full opacity-30 blur-3xl transition-opacity duration-500 group-hover:opacity-60"
                style={{ background: v.accent }}
              />

              <div className="relative z-10 flex items-start gap-3">
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border bg-ink-950/60"
                  style={{ borderColor: v.accent, color: v.accent }}
                >
                  <span className="block h-5 w-5">{v.icon}</span>
                </span>
                <h3 className="pt-1.5 text-base font-bold text-white sm:text-lg">{b.title}</h3>
              </div>

              <p className="relative z-10 mt-3 text-sm leading-relaxed text-white/55">{b.body}</p>
            </motion.article>
          );
        })}
      </div>

      <div className="mt-12 flex justify-center">
        <a
          href="#tools"
          className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.035] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/[0.07]"
        >
          {t.builds.cta}
          <span
            aria-hidden
            className="inline-block translate-x-0 text-neon-cyan transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </a>
      </div>
    </section>
  );
}
