import { motion } from 'framer-motion';
import SectionHeading from './ui/SectionHeading';

const STEPS = [
  {
    n: '01',
    title: 'Compose',
    accent: '#34e2ff',
    body: 'Drop in the four WebGL modules as React components. Each one is self-contained, typed, and renders on its own canvas — no global setup, no boilerplate.',
  },
  {
    n: '02',
    title: 'Tune',
    accent: '#9b6bff',
    body: 'Drive every effect from live inputs. Typography tunes to the cursor, shaders dither in real time, the blob lerps toward the pointer, and particles react with a physical repulsion field.',
  },
  {
    n: '03',
    title: 'Ship',
    accent: '#ff5ed3',
    body: 'Animation loops run in requestAnimationFrame and mutate refs directly, so React never re-renders per frame. The result is a steady-60-FPS bundle that deploys as a static SPA.',
  },
];

const VALUE = [
  ['One source of truth', 'Tokens, gradients and motion curves are shared across every tool, so the whole pipeline reads as a single product — not four disconnected demos.'],
  ['Zero-rerender core', 'Pointer state and Three.js loops live in refs. React stays out of the hot path, which keeps interaction smooth even with 3,400 live particles.'],
  ['Hand-written GLSL', 'Real simplex noise, Bayer 4×4 ordered dithering and additive particle shaders — the actual math ships in the repo, ready to extend.'],
  ['Responsive by default', 'Adaptive device-pixel-ratio, fluid grids and DOM-measured connectors that re-route from ultrawide down to mobile.'],
];

export default function HowItWorks() {
  return (
    <section id="explanation" className="relative mx-auto max-w-7xl px-6 py-24">
      <div className="mb-16 flex flex-col items-center">
        <SectionHeading
          eyebrow="What is NEONWERKS"
          title="A pipeline, not a pile of demos"
          description="NEONWERKS turns four standalone WebGL experiments into one coherent production workflow. Compose the modules, tune them to live input, and ship a fluid, high-performance interactive site — all from typed, modular React."
        />
      </div>

      {/* numbered steps */}
      <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* connecting rail (desktop) */}
        <div className="pointer-events-none absolute left-0 right-0 top-[2.1rem] hidden h-px bg-gradient-to-r from-neon-cyan/40 via-neon-purple/40 to-neon-pink/40 md:block" />
        {STEPS.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: i * 0.12, ease: [0.21, 0.6, 0.35, 1] }}
            className="relative rounded-3xl glass p-7"
          >
            <span
              className="relative z-10 grid h-12 w-12 place-items-center rounded-2xl border bg-ink-950 font-mono text-base font-bold"
              style={{ borderColor: s.accent, color: s.accent, boxShadow: `0 0 24px -6px ${s.accent}` }}
            >
              {s.n}
            </span>
            <h3 className="mt-5 text-xl font-bold text-white">{s.title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-white/55">{s.body}</p>
          </motion.div>
        ))}
      </div>

      {/* value grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {VALUE.map(([title, body], i) => (
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
