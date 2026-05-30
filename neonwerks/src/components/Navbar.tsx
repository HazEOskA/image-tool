import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const LINKS = [
  { label: 'Process', href: '#process' },
  { label: 'Tools', href: '#tools' },
  { label: 'Live Demo', href: '#showcase' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.21, 0.6, 0.35, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={`flex w-full max-w-6xl items-center justify-between rounded-2xl px-5 py-3 transition-all duration-300 ${
          scrolled ? 'glass-strong shadow-card' : 'border border-transparent'
        }`}
      >
        {/* Logo */}
        <a href="#top" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-neon-cyan via-neon-purple to-neon-pink">
            <span className="h-3 w-3 rounded-full bg-ink-950" />
          </span>
          <span className="text-sm font-extrabold tracking-[0.22em] text-white">NEONWERKS</span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#showcase"
            className="rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple px-5 py-2 text-sm font-semibold text-ink-950 shadow-glow transition-transform hover:scale-105"
          >
            Launch App
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle navigation"
          onClick={() => setOpen((o) => !o)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 md:hidden"
        >
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-5 bg-white transition ${open ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-5 bg-white transition ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-5 bg-white transition ${open ? '-translate-y-2 -rotate-45' : ''}`} />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-20 w-[calc(100%-2rem)] max-w-6xl rounded-2xl glass-strong p-4 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-white/75 hover:bg-white/5"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#showcase"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-purple px-3 py-2.5 text-center text-sm font-semibold text-ink-950"
            >
              Launch App
            </a>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
