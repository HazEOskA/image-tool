import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import LaptopFrame from './LaptopFrame';
import LiveCanvas from './LiveCanvas';
import { useLang } from '../../i18n';

export default function LiveShowcase() {
  const { t } = useLang();
  return (
    <section id="showcase" className="relative mx-auto max-w-7xl px-6 py-24">
      <div className="mb-16 flex flex-col items-center">
        <SectionHeading
          eyebrow={t.showcase.eyebrow}
          title={t.showcase.title}
          description={t.showcase.description}
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
        {t.showcase.features.map(([title, body], i) => (
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
