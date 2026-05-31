import { motion } from 'framer-motion';
import SectionHeading from './ui/SectionHeading';

const STEPS = [
  {
    n: '01',
    title: 'Design',
    accent: '#34e2ff',
    body: 'We start with your brand and story, then shape a visual system — type, color, 3D and motion that all belong to the same world.',
  },
  {
    n: '02',
    title: 'Animate',
    accent: '#9b6bff',
    body: 'Every element comes alive and reacts to the visitor: type tunes to the cursor, textures shift, 3D follows the pointer and particles respond on contact.',
  },
  {
    n: '03',
    title: 'Ship',
    accent: '#ff5ed3',
    body: 'You get a fast, responsive site engineered to stay smooth at 60 FPS — production-ready code that deploys anywhere, no platform lock-in.',
  },
];

const VALUE = [
  ['One coherent experience', 'Type, color, motion and 3D share a single design system, so the whole site reads as one premium experience — not a pile of disconnected effects.'],
  ['Built for 60 FPS', 'The motion runs close to the metal, so interactions stay fluid even with thousands of live particles moving on screen.'],
  ['Custom visual craft', 'Real custom shaders and motion built for your brand — not a recycled template or an off-the-shelf animation pack.'],
  ['Sharp on every screen', 'Looks crisp and runs well everywhere, from ultrawide displays down to phones, with layouts that adapt automatically.'],
];

export default function HowItWorks() {
  return (
    <section id="explanation" className="relative mx-auto max-w-7xl px-6 py-24">
      <div className="mb-16 flex flex-col items-center">
        <SectionHeading
          eyebrow="What is NEONWERKS"
          title="A motion studio, not just another website"
          description="NEONWERKS is a custom visual pipeline for premium interactive websites. We design the look, animate it around your visitor, and ship a fast, polished site — so your product feels as considered as it actually is."
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
