import { motion } from 'framer-motion';
import WildStyleText from './WildStyleText';

interface Props {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export default function SectionHeading({ eyebrow, title, description, align = 'center' }: Props) {
  const isCenter = align === 'center';
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.21, 0.6, 0.35, 1] }}
      className={`flex flex-col gap-4 ${isCenter ? 'items-center text-center' : 'items-start text-left'}`}
    >
      <div className="flex items-center gap-3">
        <span className="h-px w-8 bg-gradient-to-r from-neon-cyan to-neon-purple" />
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-neon-cyan">{eyebrow}</span>
      </div>
      <h2 className="max-w-5xl">
        <WildStyleText text={title} size="section" />
      </h2>
      {description && (
        <p className={`max-w-2xl text-base leading-relaxed text-white/55 ${isCenter ? '' : 'text-left'}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
