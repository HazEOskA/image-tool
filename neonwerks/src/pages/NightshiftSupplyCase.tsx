import { useEffect, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Link } from '../router';

const EASE = [0.21, 0.6, 0.35, 1] as const;
const NEON_EMAIL = 'osabarca@gmail.com';

function mailto(subject: string, body: string) {
  return `mailto:${NEON_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/* ---------- small shared primitives ---------- */

function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-8 bg-gradient-to-r from-neon-cyan to-neon-purple" />
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-neon-cyan">{children}</span>
    </div>
  );
}

/* Stylized hoodie silhouette — stands in for product photography. */
function Hoodie({ accent = '#34e2ff', back = false }: { accent?: string; back?: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" fill="none" aria-hidden>
      <defs>
        <linearGradient id={`hg-${accent}-${back}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#15161f" />
          <stop offset="1" stopColor="#0a0a0f" />
        </linearGradient>
      </defs>
      <g stroke={accent} strokeWidth="1.6" strokeLinejoin="round" fill={`url(#hg-${accent}-${back})`}>
        {/* hood */}
        <path d="M70 38 q30 -20 60 0 l-6 22 q-24 -14 -48 0 z" opacity="0.95" />
        {/* body */}
        <path d="M58 56 q42 22 84 0 l20 16 -16 26 -10 -6 4 64 q-46 12 -80 0 l4 -64 -10 6 -16 -26 z" />
        {/* pocket / back print frame */}
        {back ? (
          <rect x="78" y="96" width="44" height="48" rx="3" opacity="0.9" strokeDasharray="3 3" />
        ) : (
          <path d="M76 120 h48 v22 q-24 8 -48 0 z" opacity="0.7" />
        )}
        {/* neckline */}
        <path d="M82 58 q18 12 36 0" strokeWidth="1.2" opacity="0.7" />
      </g>
      {/* front identity mark / back statement */}
      {back ? (
        <text x="100" y="124" textAnchor="middle" className="fill-white" fontSize="7" fontFamily="monospace" letterSpacing="1.5">
          NIGHTSHIFT
        </text>
      ) : (
        <circle cx="100" cy="76" r="3.4" fill={accent} />
      )}
    </svg>
  );
}

/* ---------- page ---------- */

export default function NightshiftSupplyCase() {
  useEffect(() => {
    const prev = document.title;
    document.title = 'NIGHTSHIFT SUPPLY · NS-01 — a NEONWERKS case';
    window.scrollTo(0, 0);
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950 text-white">
      {/* concept-demo ribbon */}
      <div className="relative z-30 flex items-center justify-center gap-2 bg-gradient-to-r from-neon-purple/25 via-neon-pink/20 to-neon-cyan/25 px-4 py-2 text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/80 sm:text-[11px]">
          Concept demo by NEONWERKS · NIGHTSHIFT SUPPLY is a fictional brand · not a real store
        </span>
      </div>

      <CaseHeader />

      <main>
        <HeroSection />
        <ProductIntro />
        <VisualSystem />
        <DropDetails />
        <WhyItHits />
        <BrandMood />
        <ProductSpecs />
        <NeonwerksOffer />
        <Faq />
      </main>

      <CaseFooter />
    </div>
  );
}

/* ---------- header ---------- */

function CaseHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-ink-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-md border border-white/15 bg-ink-900">
            <span className="h-2.5 w-2.5 rounded-sm bg-gradient-to-br from-neon-cyan to-neon-pink" />
          </span>
          <span className="text-sm font-extrabold tracking-[0.22em] text-white">NIGHTSHIFT SUPPLY</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#offer" className="hidden text-sm font-medium text-white/60 transition-colors hover:text-white sm:inline">
            Launch pack
          </a>
          <Link
            to="/"
            className="rounded-full border border-white/15 px-4 py-1.5 text-xs font-semibold text-white/80 transition-colors hover:bg-white/5"
          >
            ← NEONWERKS
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ---------- 1. hero ---------- */

function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden px-6 pb-24 pt-20 sm:pt-28">
      <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-30" />
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-neon-cyan/10 blur-[120px]" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-white/70">
            <span className="h-2 w-2 animate-pulse rounded-full bg-neon-pink" />
            Limited First Drop · EU Shipping
          </div>
          <h1 className="mt-6 text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-7xl">
            Built for the
            <br />
            <span className="text-gradient-brand">night shift.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">
            A heavyweight hoodie made for late work, cold exits, and low-key presence. Clean silhouette.
            Heavy fabric. No mass-market energy.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#drop"
              className="rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple px-7 py-3 text-sm font-semibold text-ink-950 shadow-glow transition-transform hover:scale-[1.04]"
            >
              Pre-order the drop
            </a>
            <a
              href="#product"
              className="rounded-full border border-white/15 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/5"
            >
              View the hoodie
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-0 rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent" />
            <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-neon-purple/15 blur-3xl" />
            <div className="absolute inset-6">
              <Hoodie accent="#34e2ff" />
            </div>
            <div className="absolute bottom-4 left-5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
              NS-01 · Heavy Hoodie
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 2. product intro ---------- */

function ProductIntro() {
  const bullets = [
    'Heavyweight cotton blend',
    'Oversized street fit',
    'Minimal front identity mark',
    'Large back statement print',
    'Limited first release',
    'Designed for everyday wear',
  ];
  return (
    <section id="product" className="relative mx-auto max-w-6xl px-6 py-24">
      <div className="grid items-start gap-12 lg:grid-cols-2">
        <Reveal>
          <Label>NS-01 Heavy Hoodie</Label>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
            A clean streetwear piece with after-hours weight.
          </h2>
          <p className="mt-5 leading-relaxed text-white/60">
            The NS-01 Heavy Hoodie is designed for people who move when the city slows down. Heavy cotton
            feel, oversized street fit, and a minimal graphic system built around quiet confidence.
          </p>
          <p className="mt-4 leading-relaxed text-white/60">
            No loud branding. No cheap template energy. Just a strong piece made to carry the mood.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {bullets.map((b) => (
              <li key={b} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-neon-cyan to-neon-pink" />
                <span className="text-sm text-white/80">{b}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 3. visual system ---------- */

function VisualSystem() {
  const frames = [
    { title: 'Hero product frame', accent: '#34e2ff', back: false },
    { title: 'Back print showcase', accent: '#ff5ed3', back: true },
    { title: 'Fabric and fit detail', accent: '#9b6bff', back: false },
    { title: 'Social launch poster', accent: '#4f8bff', back: true },
  ];
  return (
    <section id="visual" className="relative mx-auto max-w-6xl px-6 py-24">
      <div className="pointer-events-none absolute right-0 top-1/3 -z-10 h-72 w-72 rounded-full bg-neon-pink/10 blur-[120px]" />
      <Reveal className="max-w-2xl">
        <Label>Neonwerks Visual System</Label>
        <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Product visuals that feel like a campaign, not a catalog.
        </h2>
        <p className="mt-5 leading-relaxed text-white/60">
          The drop is presented through a cinematic visual system: dark product shots, neon edge lighting,
          motion-ready assets, and launch graphics built for social platforms.
        </p>
        <p className="mt-4 leading-relaxed text-white/60">
          This is how a small clothing drop can look like a real brand from day one.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {frames.map((f, i) => (
          <Reveal key={f.title} delay={(i % 4) * 0.07}>
            <figure className="group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-900">
              <div className="relative aspect-[3/4]">
                <div
                  className="pointer-events-none absolute -inset-8 opacity-40 blur-2xl transition-opacity duration-500 group-hover:opacity-70"
                  style={{ background: `radial-gradient(circle, ${f.accent}55, transparent 60%)` }}
                />
                <div className="absolute inset-6">
                  <Hoodie accent={f.accent} back={f.back} />
                </div>
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl"
                  style={{ boxShadow: `inset 0 0 40px -12px ${f.accent}` }}
                />
              </div>
              <figcaption className="flex items-center justify-between border-t border-white/10 px-4 py-3">
                <span className="text-sm font-semibold text-white/85">{f.title}</span>
                <span className="font-mono text-[10px] text-white/35">0{i + 1}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- 4. drop details ---------- */

function DropDetails() {
  const rows = [
    ['Product', 'NS-01 Heavy Hoodie'],
    ['Release', 'First limited drop'],
    ['Price', '€89'],
    ['Sizes', 'S / M / L / XL'],
    ['Fit', 'Oversized'],
    ['Color', 'Black / Off-white print'],
    ['Shipping', 'EU'],
    ['Quantity', '100 pieces'],
  ];
  return (
    <section id="drop" className="relative mx-auto max-w-6xl px-6 py-24">
      <div className="overflow-hidden rounded-3xl glass-strong p-8 shadow-card sm:p-12">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              First release. Limited quantity. <span className="text-gradient-brand">No restock promise.</span>
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-white/60">
              One hundred pieces in the first NS-01 run. When the drop is gone, it is gone — there is no
              guaranteed restock.
            </p>
            <a
              href="#offer"
              className="mt-8 inline-flex rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple px-7 py-3 text-sm font-semibold text-ink-950 shadow-glow transition-transform hover:scale-[1.04]"
            >
              Get launch access
            </a>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-white/35">
              Demo button · scrolls to the NEONWERKS launch pack
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <dl className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-ink-950/50">
              {rows.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between px-5 py-3.5">
                  <dt className="font-mono text-[11px] uppercase tracking-widest text-white/40">{k}</dt>
                  <dd className="text-sm font-semibold text-white/90">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- 5. why it hits ---------- */

function WhyItHits() {
  const cards = [
    { t: 'Heavy feel', d: 'Dense cotton hand-feel that sits with weight, not a thin throwaway layer.', a: '#34e2ff' },
    { t: 'Oversized cut', d: 'A relaxed street silhouette that drapes clean without looking sloppy.', a: '#9b6bff' },
    { t: 'Clean brutal look', d: 'Minimal marks, hard lines, zero noise — confidence over decoration.', a: '#ff5ed3' },
    { t: 'Limited energy', d: 'A small first run that stays rare instead of flooding every feed.', a: '#4f8bff' },
  ];
  return (
    <section id="why" className="relative mx-auto max-w-6xl px-6 py-24">
      <Reveal className="max-w-2xl">
        <Label>Why it hits</Label>
        <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">Four reasons it lands.</h2>
      </Reveal>
      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <Reveal key={c.t} delay={(i % 4) * 0.07}>
            <div className="group relative h-full overflow-hidden rounded-2xl glass p-6">
              <div
                className="pointer-events-none absolute -bottom-16 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full opacity-30 blur-3xl transition-opacity duration-500 group-hover:opacity-60"
                style={{ background: c.a }}
              />
              <span className="font-mono text-2xl font-extrabold" style={{ color: c.a }}>
                0{i + 1}
              </span>
              <h3 className="mt-4 text-lg font-bold text-white">{c.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{c.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- 6. brand mood ---------- */

function BrandMood() {
  return (
    <section id="mood" className="relative mx-auto max-w-5xl px-6 py-24 text-center">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-80 w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-purple/12 blur-[120px]" />
      <Reveal>
        <h2 className="mx-auto max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          For builders, creators, workers, and <span className="text-gradient-brand">after-hours people.</span>
        </h2>
        <p className="mx-auto mt-7 max-w-2xl leading-relaxed text-white/60">
          NIGHTSHIFT SUPPLY is for people who build after work, create after midnight, and move through the
          city with purpose.
        </p>
        <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-white/60">
          It is streetwear for the quiet grind — the late commute, the studio session, the night shift, the
          cold walk home, the next idea that will not let you sleep.
        </p>
        <blockquote className="mx-auto mt-10 max-w-xl border-l-2 border-neon-cyan pl-5 text-left text-xl font-semibold italic text-white/85 sm:text-2xl">
          “Not made for everyone. Made for the ones still moving.”
        </blockquote>
      </Reveal>
    </section>
  );
}

/* ---------- 7. product specs ---------- */

function ProductSpecs() {
  const specs = [
    ['Material', 'Heavy cotton blend'],
    ['Fit', 'Oversized street fit'],
    ['Print', 'Front chest mark + back graphic'],
    ['Ribbing', 'Cuffs and hem'],
    ['Season', 'All-year layering piece'],
    ['Care', 'Wash cold, inside out'],
  ];
  return (
    <section id="specs" className="relative mx-auto max-w-6xl px-6 py-24">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <Label>Product specs</Label>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">The build sheet.</h2>
          <div className="mt-8 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6">
            <p className="text-sm font-bold text-white">Fit note</p>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              For a cleaner fit, choose your regular size. For a heavier street silhouette, size up.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
            {specs.map(([k, v]) => (
              <div key={k} className="bg-ink-950 px-5 py-5">
                <dt className="font-mono text-[11px] uppercase tracking-widest text-neon-cyan">{k}</dt>
                <dd className="mt-1.5 text-sm font-semibold text-white/90">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 8. neonwerks offer ---------- */

function NeonwerksOffer() {
  const tiers = [
    { name: 'Starter Launch', price: 'From €149', points: ['1-page launch site', 'Core product visuals', 'Mobile-first build'], accent: '#34e2ff', featured: false },
    { name: 'Pro Launch', price: 'From €399', points: ['Multi-section landing', 'Motion + visual system', 'Social launch assets'], accent: '#9b6bff', featured: true },
    { name: 'Launch Max', price: 'From €799', points: ['Full cinematic build', 'Custom 3D / shader work', 'Campaign asset kit'], accent: '#ff5ed3', featured: false },
  ];
  return (
    <section id="offer" className="relative mx-auto max-w-6xl px-6 py-24">
      <div className="pointer-events-none absolute left-0 top-0 -z-10 h-72 w-72 rounded-full bg-neon-cyan/10 blur-[120px]" />
      <Reveal className="max-w-2xl">
        <Label>Powered by Neonwerks</Label>
        <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Want a launch page like this for your brand?
        </h2>
        <p className="mt-5 leading-relaxed text-white/60">
          Neonwerks turns clothing drops, product launches, and small brand ideas into cinematic landing
          pages with visuals, motion, copy, and social-ready launch assets.
        </p>
        <p className="mt-4 font-semibold leading-relaxed text-white/75">
          You send the product. We build the launch experience.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {tiers.map((tier, i) => (
          <Reveal key={tier.name} delay={(i % 3) * 0.08}>
            <div
              className={`relative flex h-full flex-col rounded-2xl p-7 ${
                tier.featured ? 'glass-strong shadow-card' : 'glass'
              }`}
              style={tier.featured ? { borderColor: `${tier.accent}66` } : undefined}
            >
              {tier.featured && (
                <span className="absolute -top-3 left-7 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-ink-950">
                  Most popular
                </span>
              )}
              <div className="h-1 w-10 rounded-full" style={{ background: tier.accent }} />
              <h3 className="mt-4 text-lg font-bold text-white">{tier.name}</h3>
              <p className="mt-1 text-2xl font-extrabold" style={{ color: tier.accent }}>
                {tier.price}
              </p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {tier.points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm text-white/65">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: tier.accent }} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href={mailto('NEONWERKS — Build my launch page', "Hi NEONWERKS,\n\nI'd like a launch page for my brand.\n\nBrand:\nProduct / drop:\nTimeline:\nBudget tier (Starter / Pro / Launch Max):\n\nThanks!")}
            className="rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple px-8 py-3.5 text-sm font-semibold text-ink-950 shadow-glow transition-transform hover:scale-[1.04]"
          >
            Build my launch page
          </a>
          <a
            href={mailto('NEONWERKS — Product details', 'Hi NEONWERKS,\n\nHere are my product details:\n\nBrand:\nProduct:\nLink / images:\nWhat I need:\n\nThanks!')}
            className="rounded-full border border-white/15 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/5"
          >
            Send product details
          </a>
        </div>
        <div className="mt-6 flex justify-center">
          <Link
            to="/#drop-builder"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition-colors hover:text-white"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan" />
            Try the interactive drop builder
            <span aria-hidden className="text-neon-cyan transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- 9. faq ---------- */

function Faq() {
  const items = [
    {
      q: 'When does the drop open?',
      a: 'This page is a NEONWERKS concept demo, so there is no live sale date. On a real build, the drop date and a launch-access signup would be wired in here.',
    },
    {
      q: 'Will this hoodie restock?',
      a: 'The concept is a limited first run of 100 pieces with no restock promise — part of the “limited energy” positioning. A real store could add a restock waitlist.',
    },
    {
      q: 'Where do you ship?',
      a: 'The fictional NIGHTSHIFT SUPPLY drop is positioned for EU shipping. Shipping regions are fully configurable on a production build.',
    },
    {
      q: 'How does the hoodie fit?',
      a: 'It is designed as an oversized street fit. For a cleaner look choose your regular size; for a heavier silhouette, size up.',
    },
    {
      q: 'Is this a real product?',
      a: 'No. NIGHTSHIFT SUPPLY and the NS-01 Heavy Hoodie are a NEONWERKS demo concept that shows how a clothing drop can be turned into a cinematic landing page. The product is not for sale.',
    },
  ];
  return (
    <section id="faq" className="relative mx-auto max-w-3xl px-6 py-24">
      <Reveal className="text-center">
        <Label>
          <span className="mx-auto">FAQ</span>
        </Label>
        <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">Questions, answered.</h2>
      </Reveal>
      <div className="mt-10 space-y-3">
        {items.map((it, i) => (
          <Reveal key={it.q} delay={(i % 5) * 0.05}>
            <details className="group rounded-2xl border border-white/10 bg-white/[0.025] px-5 open:bg-white/[0.04]">
              <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-left text-base font-semibold text-white/90 [&::-webkit-details-marker]:hidden">
                {it.q}
                <span className="ml-4 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/15 text-white/60 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="pb-5 text-sm leading-relaxed text-white/55">{it.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- footer ---------- */

function CaseFooter() {
  return (
    <footer className="border-t border-white/10 px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
        <div>
          <p className="text-sm font-extrabold tracking-[0.2em] text-white">NIGHTSHIFT SUPPLY</p>
          <p className="mt-1 font-mono text-[11px] text-white/40">NS-01 Heavy Hoodie · concept drop</p>
        </div>
        <p className="max-w-sm font-mono text-[11px] leading-relaxed text-white/40">
          A NEONWERKS case study. Fictional brand built to demonstrate cinematic launch pages, visuals and
          motion for real clothing drops.
        </p>
        <Link
          to="/"
          className="rounded-full border border-white/15 px-5 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/5"
        >
          ← Back to NEONWERKS
        </Link>
      </div>
    </footer>
  );
}
