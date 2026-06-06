import type { MouseEvent } from 'react';

const FORM_ID = 'streetwear-brief';
const FIRST_FIELD_SELECTOR =
  'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled])';

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function focusFirstUsefulField(target: HTMLElement) {
  const field = target.querySelector<HTMLElement>(FIRST_FIELD_SELECTOR);
  if (!field) return;
  window.setTimeout(() => field.focus({ preventScroll: true }), 120);
}

function highlightForm(target: HTMLElement) {
  target.classList.remove('contact-warp-locked');
  void target.offsetWidth;
  target.classList.add('contact-warp-locked');
  window.setTimeout(() => target.classList.remove('contact-warp-locked'), 1800);
}

function scrollToForm() {
  const target = document.getElementById(FORM_ID);
  if (!target) return;

  target.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  });
  highlightForm(target);
  focusFirstUsefulField(target);
}

export function triggerContactWarp(event?: MouseEvent<HTMLElement>) {
  if (typeof window === 'undefined') return;
  const target = document.getElementById(FORM_ID);
  if (!target) return;

  event?.preventDefault();

  if (prefersReducedMotion()) {
    scrollToForm();
    return;
  }

  window.dispatchEvent(new CustomEvent('neon-contact-warp'));
  window.setTimeout(scrollToForm, 520);
}
