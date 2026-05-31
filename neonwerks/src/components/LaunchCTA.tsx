import { motion } from 'framer-motion';

export default function LaunchCTA() {
  return (
    <section id="launch" className="relative mx-auto max-w-7xl px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.21, 0.6, 0.35, 1] }}
        className="relative overflow-hidden rounded-[2rem] glass-strong px-6 py-16 text-center shadow-card sm:px-12 sm:py-20"
      >
        {/* animated gradient border glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-30" />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-neon-purple/25 blur-[120px]"
          animate={{ opacity: [0.5, 0.85, 0.5], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div
          className="pointer-events-none absolute inset-x-10 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #9b6bff, transparent)' }}
        />

        <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 font-mono text-xs uppercase tracking-[0.25em] text-white/70">
          <span className="h-2 w-2 animate-pulse rounded-full bg-neon-cyan" />
          Ready when you are
        </span>

        <h2 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
          <span className="text-white">Ready to build </span>
          <span className="text-gradient-brand">in motion?</span>
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg">
          Clone the pipeline, drop in your content, and ship an interactive 3D experience in an afternoon.
          Everything you saw above is in the repo — typed, modular and production-ready.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#showcase"
            className="rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple px-8 py-3.5 text-sm font-semibold text-ink-950 shadow-glow transition-transform hover:scale-[1.04]"
          >
            Launch App
          </a>
          <a
            href="#explanation"
            className="rounded-full border border-white/15 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/5"
          >
            How it works
          </a>
        </div>

        {/* trust / spec row */}
        <div className="mx-auto mt-12 flex max-w-2xl flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {[
            ['MIT', 'Open source'],
            ['0 cfg', 'Vercel-ready'],
            ['60 FPS', 'Target frame rate'],
            ['4', 'WebGL tools'],
          ].map(([n, l]) => (
            <div key={l} className="flex flex-col items-center">
              <span className="text-2xl font-extrabold text-white">{n}</span>
              <span className="mt-1 font-mono text-[10px] uppercase tracking-widest text-white/40">{l}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
