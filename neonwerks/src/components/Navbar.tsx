import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLang } from '../i18n';
import type { Lang } from '../content/copy';
import { triggerContactWarp } from '../utils/contactWarp';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLang();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: t.nav.overview, href: '#explanation' },
    { label: t.nav.builds, href: '#builds' },
    { label: t.nav.tools, href: '#tools' },
    { label: t.nav.demo, href: '#showcase' },
  ];

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
        <div className="hidden items-center gap-5 md:flex lg:gap-7">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
          <LangToggle lang={lang} setLang={setLang} ariaLabel={t.nav.toggleAria} />
          <a
            href="#streetwear-brief"
            onClick={triggerContactWarp}
            className="rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple px-5 py-2 text-sm font-semibold text-ink-950 shadow-glow transition-transform hover:scale-105"
          >
            Contact
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
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-white/75 hover:bg-white/5"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 flex items-center justify-between rounded-lg border border-white/10 px-3 py-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-white/45">
                {t.nav.toggleAria}
              </span>
              <LangToggle lang={lang} setLang={setLang} ariaLabel={t.nav.toggleAria} />
            </div>
            <a
              href="#streetwear-brief"
              onClick={(event) => {
                setOpen(false);
                triggerContactWarp(event);
              }}
              className="mt-1 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-purple px-3 py-2.5 text-center text-sm font-semibold text-ink-950"
            >
              Contact
            </a>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}

/* Compact EN | PL pill. Active language pops in white; inactive sits muted. */
function LangToggle({
  lang,
  setLang,
  ariaLabel,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  ariaLabel: string;
}) {
  const base =
    'h-7 rounded-full px-2.5 font-mono text-[11px] font-bold tracking-wider transition-colors';
  const active = 'bg-white text-ink-950';
  const idle = 'text-white/55 hover:text-white';
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-0.5"
    >
      <button
        type="button"
        aria-pressed={lang === 'en'}
        onClick={() => setLang('en')}
        className={`${base} ${lang === 'en' ? active : idle}`}
      >
        EN
      </button>
      <button
        type="button"
        aria-pressed={lang === 'pl'}
        onClick={() => setLang('pl')}
        className={`${base} ${lang === 'pl' ? active : idle}`}
      >
        PL
      </button>
    </div>
  );
}
