import { motion } from 'framer-motion';
import SectionHeading from './ui/SectionHeading';
import { useLang } from '../i18n';

const STEP_ACCENTS = ['#34e2ff', '#9b6bff', '#ff5ed3'];

export default function HowItWorks() {
  const { t } = useLang();
  return (
    <section id="explanation" className="relative mx-auto max-w-7xl px-6 py-24">
      <div className="mb-16 flex flex-col items-center">
        <SectionHeading
          eyebrow={t.overview.eyebrow}
          title={t.overview.title}
          description={t.overview.description}
        />
      </div>

      {/* numbered steps */}
      <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* connecting rail (desktop) */}
        <div className="pointer-events-none absolute left-0 right-0 top-[2.1rem] hidden h-px bg-gradient-to-r from-neon-cyan/40 via-neon-purple/40 to-neon-pink/40 md:block" />
        {t.overview.steps.map((s, i) => {
          const accent = STEP_ACCENTS[i] ?? '#9b6bff';
          const n = String(i + 1).padStart(2, '0');
          return (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.12, ease: [0.21, 0.6, 0.35, 1] }}
              className="relative rounded-3xl glass p-7"
            >
              <span
                className="relative z-10 grid h-12 w-12 place-items-center rounded-2xl border bg-ink-950 font-mono text-base font-bold"
                style={{ borderColor: accent, color: accent, boxShadow: `0 0 24px -6px ${accent}` }}
              >
                {n}
              </span>
              <h3 className="mt-5 text-xl font-bold text-white">{s.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-white/55">{s.body}</p>
            </motion.div>
          );
        })}
      </div>

      {/* value grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {t.overview.values.map(([title, body], i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
            className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-6"
          >
            <span className="mt-1 h-fit rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 p-2">
              <span className="block h-2 w-2 rounded-full bg-gradient-to-r from-neon-cyan to-neon-pink" />
            </span>
            <div>
              <h4 className="text-base font-bold text-white">{title}</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-white/55">{body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
