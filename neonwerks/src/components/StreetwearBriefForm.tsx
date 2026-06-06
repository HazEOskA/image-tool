import { FormEvent, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

const CONTACT_EMAIL = 'osabarca@gmail.com';
const SUBJECT = 'NEONWERKS Streetwear Launch Pack';

const productTypes = ['Hoodie', 'T-shirt', 'Cap', 'Full drop', 'Merch', 'Other'];
const styleDirections = ['Night Mode', 'Graffiti Drop', 'Luxury Black', 'Cyberpunk Neon', 'Custom'];
const budgetRanges = ['€149 Starter Drop', '€399 Pro Launch', '€799+ Launch Max', 'Not sure yet'];

const pricing = [
  {
    name: 'Starter Drop',
    price: 'from €149',
    items: ['one-page landing', '3 product visuals', 'mobile-first CTA'],
  },
  {
    name: 'Pro Launch',
    price: 'from €399',
    items: ['landing page', '6-10 visuals', 'social promo assets', 'countdown / OG preview'],
  },
  {
    name: 'Launch Max',
    price: 'from €799+',
    items: ['full visual launch pack', 'vertical promo concept', 'launch copy', '2 revision rounds'],
  },
];

type BriefState = {
  brandName: string;
  productType: string;
  launchDate: string;
  styleDirection: string;
  budgetRange: string;
  contact: string;
  notes: string;
};

const initialState: BriefState = {
  brandName: '',
  productType: productTypes[0],
  launchDate: '',
  styleDirection: styleDirections[0],
  budgetRange: budgetRanges[0],
  contact: '',
  notes: '',
};

function buildBody(form: BriefState) {
  return [
    `Brand name: ${form.brandName}`,
    `Product type: ${form.productType}`,
    `Launch date: ${form.launchDate}`,
    `Style direction: ${form.styleDirection}`,
    `Budget range: ${form.budgetRange}`,
    `Contact: ${form.contact}`,
    `Notes: ${form.notes}`,
  ].join('\n');
}

function buildMailto(form: BriefState) {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(buildBody(form))}`;
}

export default function StreetwearBriefForm() {
  const [form, setForm] = useState<BriefState>(initialState);
  const mailto = useMemo(() => buildMailto(form), [form]);

  const update = (field: keyof BriefState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.location.href = buildMailto(form);
  };

  return (
    <section id="contact" className="relative mx-auto max-w-7xl px-6 py-24">
      <div className="pointer-events-none absolute inset-x-6 top-8 h-px bg-gradient-to-r from-transparent via-neon-cyan/70 to-transparent" />
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 font-mono text-xs uppercase tracking-[0.22em] text-white/70">
            <span className="h-2 w-2 rounded-full bg-neon-cyan shadow-[0_0_18px_rgba(52,226,255,0.9)]" />
            Destination locked
          </span>
          <h2 className="mt-6 max-w-2xl text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            Want this for your clothing brand?
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
            Send your product, style direction, and launch date. We'll turn it into a visual
            landing page and promo pack.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {pricing.map((card) => (
              <article key={card.name} className="relative overflow-hidden rounded-2xl glass p-5">
                <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-neon-purple to-transparent" />
                <h3 className="text-base font-bold text-white">{card.name}</h3>
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-neon-cyan">{card.price}</p>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-white/58">
                  {card.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neon-pink" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-white/45">
            Starter pricing is for lean launch pages. Full custom motion sites are quoted separately.
          </p>
          <p className="mt-4 rounded-2xl border border-neon-cyan/20 bg-neon-cyan/[0.04] px-4 py-3 text-sm font-semibold leading-relaxed text-white/72">
            No fake store. No template look. We reply with next steps and a clear price.
          </p>
        </div>

        <form
          id="streetwear-brief"
          action={`mailto:${CONTACT_EMAIL}`}
          method="post"
          encType="text/plain"
          onSubmit={onSubmit}
          className="contact-brief-form relative scroll-mt-28 overflow-hidden rounded-[1.5rem] glass-strong p-5 shadow-card sm:p-7"
        >
          <input type="hidden" name="subject" value={SUBJECT} />
          <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-neon-purple/20 blur-[90px]" />
          <div className="relative grid gap-4 sm:grid-cols-2">
            <Field label="Brand name">
              <input
                name="Brand name"
                value={form.brandName}
                onChange={(e) => update('brandName', e.target.value)}
                className="brief-input"
                autoComplete="organization"
              />
            </Field>
            <Field label="Product type">
              <select
                name="Product type"
                value={form.productType}
                onChange={(e) => update('productType', e.target.value)}
                className="brief-input"
              >
                {productTypes.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>
            <Field label="Launch date">
              <input
                name="Launch date"
                type="date"
                value={form.launchDate}
                onChange={(e) => update('launchDate', e.target.value)}
                className="brief-input"
              />
            </Field>
            <Field label="Style direction">
              <select
                name="Style direction"
                value={form.styleDirection}
                onChange={(e) => update('styleDirection', e.target.value)}
                className="brief-input"
              >
                {styleDirections.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>
            <Field label="Budget range">
              <select
                name="Budget range"
                value={form.budgetRange}
                onChange={(e) => update('budgetRange', e.target.value)}
                className="brief-input"
              >
                {budgetRanges.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>
            <Field label="Contact email / Instagram">
              <input
                name="Contact"
                value={form.contact}
                onChange={(e) => update('contact', e.target.value)}
                className="brief-input"
                autoComplete="email"
              />
            </Field>
            <Field label="Project notes" wide>
              <textarea
                name="Notes"
                value={form.notes}
                onChange={(e) => update('notes', e.target.value)}
                className="brief-input min-h-32 resize-y"
              />
            </Field>
          </div>

          <div className="relative mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              className="rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple px-7 py-3 text-sm font-semibold text-ink-950 shadow-glow transition-transform hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:ring-offset-2 focus:ring-offset-ink-950"
            >
              Build my drop
            </button>
            <a
              href={mailto}
              className="text-sm font-semibold text-white/58 transition-colors hover:text-white"
            >
              Email directly
            </a>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  wide = false,
  children,
}: {
  label: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <label className={`block ${wide ? 'sm:col-span-2' : ''}`}>
      <span className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-white/45">
        {label}
      </span>
      {children}
    </label>
  );
}
