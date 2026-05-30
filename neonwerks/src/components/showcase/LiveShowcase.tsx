import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import LaptopFrame from './LaptopFrame';
import LiveCanvas from './LiveCanvas';

export default function LiveShowcase() {
  return (
    <section id="showcase" className="relative mx-auto max-w-7xl px-6 py-24">
      <div className="mb-16 flex flex-col items-center">
        <SectionHeading
          eyebrow="Live Showcase"
          title="All Four Tools, One Surface"
          description="The complete pipeline rendered live — a fluid 3D object from Smoothie, dithered shapes from Astrodither, kinetic particle streams from the Simulator, and typography tuned by String Tune. Move your cursor over the screen to interact."
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50, rotateX: 8 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.9, ease: [0.21, 0.6, 0.35, 1] }}
        style={{ perspective: 1200 }}
        className="relative"
      >
        {/* ambient glow behind laptop */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[28rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-purple/15 blur-[120px]" />
        <LaptopFrame>
          <LiveCanvas />
        </LaptopFrame>
      </motion.div>

      {/* feature strip */}
      <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[
          ['Performance-first', 'rAF-driven loops & useRef mutation keep React out of the render path — steady 60 FPS.'],
          ['Fully responsive', 'Adaptive DPR, fluid grids and live-measured connectors from mobile to ultrawide.'],
          ['Production GLSL', 'Hand-written simplex noise, Bayer dithering and additive particle shaders — no placeholders.'],
        ].map(([title, body], i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="rounded-2xl glass p-6"
          >
            <div className="mb-3 h-1 w-10 rounded-full bg-gradient-to-r from-neon-cyan to-neon-pink" />
            <h4 className="text-base font-bold text-white">{title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-white/55">{body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
