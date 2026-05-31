import { motion } from 'framer-motion';
import { useLang } from '../i18n';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.21, 0.6, 0.35, 1] } },
};

export default function Hero() {
  const { t } = useLang();
  return (
    <section id="top" className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-28">
      {/* animated aura */}
      <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-40" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-neon-purple/20 blur-[120px]"
        animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div variants={container} initial="hidden" animate="show" className="flex max-w-4xl flex-col items-center text-center">
        <motion.span
          variants={item}
          className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 font-mono text-xs uppercase tracking-[0.25em] text-white/70"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-neon-pink" />
          {t.hero.badge}
        </motion.span>

        <motion.h1 variants={item} className="text-balance text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">
          <span className="text-white">{t.hero.titleA}</span>
          <span className="text-gradient-brand">{t.hero.titleB}</span>
          <br />
          <span className="text-white">{t.hero.titleC}</span>
        </motion.h1>

        <motion.p variants={item} className="mt-6 max-w-2xl text-lg leading-relaxed text-white/55">
          {t.hero.subhead}
        </motion.p>

        <motion.div variants={item} className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#showcase"
            className="rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple px-7 py-3 text-sm font-semibold text-ink-950 shadow-glow transition-transform hover:scale-[1.04]"
          >
            {t.hero.ctaPrimary}
          </a>
          <a
            href="#builds"
            className="rounded-full border border-white/15 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/5"
          >
            {t.hero.ctaSecondary}
          </a>
        </motion.div>

        <motion.div variants={item} className="mt-14 grid grid-cols-3 gap-10">
          {t.hero.stats.map(([n, l]) => (
            <div key={l} className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-white">{n}</span>
              <span className="mt-1 font-mono text-[11px] uppercase tracking-widest text-white/40">{l}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        aria-hidden
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 flex flex-col items-center gap-2 text-white/40"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest">{t.hero.scroll}</span>
        <span className="h-8 w-5 rounded-full border border-white/20 p-1">
          <span className="block h-1.5 w-full rounded-full bg-white/50" />
        </span>
      </motion.div>
    </section>
  );
}
