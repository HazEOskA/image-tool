import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';

/**
 * Contact / inquiry section. No backend — submitting builds a mailto: with the
 * form contents and opens the visitor's mail client. We never fake a successful
 * server submission.
 *
 * English-first (same approach as the case page); the PL toggle is unaffected.
 */

const CONTACT_EMAIL = 'osabarca@gmail.com';
const EASE = [0.21, 0.6, 0.35, 1] as const;

const PROJECT_TYPES = [
  'Landing page',
  'AI tool',
  'Product demo',
  'Streetwear / merch drop',
  'Portfolio / personal brand',
  'Other',
];
const BUDGETS = ['Under €250', '€250–€500', '€500–€1000', '€1000+'];

const fieldClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/35 outline-none transition-colors focus:border-neon-cyan/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-neon-cyan/30';
const labelClass = 'mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-white/45';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    projectType: PROJECT_TYPES[0],
    budget: BUDGETS[1],
    message: '',
    preferred: 'Email',
  });
  const [opened, setOpened] = useState(false);

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const subject = `New project brief — ${form.projectType}`;
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Project type: ${form.projectType}`,
      `Budget: ${form.budget}`,
      `Preferred contact: ${form.preferred}`,
      '',
      'Project description:',
      form.message,
    ].join('\n');
    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href; // opens the visitor's mail client; no backend
    setOpened(true);
  };

  return (
    <section id="contact" className="relative mx-auto max-w-6xl px-6 py-24">
      {/* ambient glow, matches the neon system */}
      <div className="pointer-events-none absolute left-1/2 top-24 -z-10 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-neon-cyan/10 blur-[120px]" />

      <motion.header
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: EASE }}
        className="max-w-2xl"
      >
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-gradient-to-r from-neon-cyan to-neon-purple" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-neon-cyan">Contact</span>
        </div>
        <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-5xl">
          <span className="text-gradient">Tell me what you want to build</span>
        </h2>
        <p className="mt-5 text-base leading-relaxed text-white/55 sm:text-lg">
          Send a short brief for a landing page, AI tool, product demo, streetwear drop, or custom visual
          system.
        </p>
      </motion.header>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: EASE }}
          onSubmit={handleSubmit}
          className="rounded-3xl glass-strong p-6 shadow-card sm:p-8"
          noValidate={false}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="c-name" className={labelClass}>Name</label>
              <input
                id="c-name"
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Your name"
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="c-email" className={labelClass}>Email</label>
              <input
                id="c-email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="you@brand.com"
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="c-type" className={labelClass}>Project type</label>
              <select
                id="c-type"
                value={form.projectType}
                onChange={(e) => update('projectType', e.target.value)}
                className={fieldClass}
              >
                {PROJECT_TYPES.map((p) => (
                  <option key={p} value={p} className="bg-ink-900 text-white">{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="c-budget" className={labelClass}>Budget range</label>
              <select
                id="c-budget"
                value={form.budget}
                onChange={(e) => update('budget', e.target.value)}
                className={fieldClass}
              >
                {BUDGETS.map((b) => (
                  <option key={b} value={b} className="bg-ink-900 text-white">{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="c-message" className={labelClass}>Message / project description</label>
            <textarea
              id="c-message"
              required
              rows={5}
              value={form.message}
              onChange={(e) => update('message', e.target.value)}
              placeholder="What are you building, and what do you need?"
              className={`${fieldClass} resize-y`}
            />
          </div>

          <div className="mt-5">
            <span className={labelClass}>Preferred contact</span>
            <div className="flex flex-wrap gap-2">
              {['Email', 'Phone / WhatsApp'].map((opt) => {
                const selected = form.preferred === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => update('preferred', opt)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                      selected
                        ? 'border-transparent bg-gradient-to-r from-neon-cyan to-neon-purple text-ink-950'
                        : 'border-white/15 text-white/70 hover:bg-white/5'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple px-7 py-3.5 text-sm font-semibold text-ink-950 shadow-glow transition-transform hover:scale-[1.02] sm:w-auto"
          >
            Send the brief
            <span aria-hidden>→</span>
          </button>

          <p className="mt-3 text-xs text-white/45" role="status" aria-live="polite">
            {opened
              ? 'Your email app should have opened with the brief ready to send. If not, email me directly below.'
              : 'No account needed — this opens your email app with the brief pre-filled.'}
          </p>
        </motion.form>

        {/* contact cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
          className="flex flex-col gap-4"
        >
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Project inquiry — Neonwerks')}`}
            className="group rounded-2xl glass p-5 transition-colors hover:bg-white/[0.05]"
          >
            <span className="font-mono text-[11px] uppercase tracking-widest text-neon-cyan">Email</span>
            <p className="mt-1.5 text-sm font-semibold text-white">{CONTACT_EMAIL}</p>
            <p className="mt-0.5 text-xs text-white/45">Fastest way to reach me.</p>
          </a>

          <div className="rounded-2xl glass p-5">
            <span className="font-mono text-[11px] uppercase tracking-widest text-neon-purple">Phone / WhatsApp</span>
            <p className="mt-1.5 text-sm font-semibold text-white/80">Available on request</p>
            <p className="mt-0.5 text-xs text-white/45">Ask by email and I'll share a number.</p>
          </div>

          <div className="rounded-2xl glass p-5">
            <span className="font-mono text-[11px] uppercase tracking-widest text-neon-pink">Portfolio</span>
            <p className="mt-1.5 text-sm font-semibold text-white/80">Coming soon</p>
            <p className="mt-0.5 text-xs text-white/45">Selected work available on request.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
