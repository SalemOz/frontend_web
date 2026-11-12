import { gsap } from './gsap.js';
import { interpolate } from './math.js';
import { duration as durations, ease } from './tokens.js';

// Por elemento: la animación en curso y el número que se ve ahora.
const tweens = new WeakMap();
const shown = new WeakMap();

/** Pone el valor final al instante (sin animación). */
export const setCount = (el, to, format) => {
  tweens.get(el)?.kill();
  shown.set(el, to);
  el.textContent = format(to);
};

/**
 * Cuenta desde el número que se ve hasta `to`. Si llega otro valor a mitad,
 * sigue desde donde iba y termina siempre en el valor final exacto.
 */
export const countTo = (el, to, { format, duration = durations.base, delay = 0 }) => {
  const from = shown.has(el) ? shown.get(el) : to;
  if (from === to) {
    setCount(el, to, format);
    return;
  }
  tweens.get(el)?.kill();
  const state = { progress: 0 };
  tweens.set(
    el,
    gsap.to(state, {
      progress: 1,
      duration,
      delay,
      ease: ease.out,
      onUpdate: () => {
        const value = interpolate(from, to, state.progress);
        shown.set(el, value);
        el.textContent = format(value);
      },
      onComplete: () => setCount(el, to, format),
    }),
  );
};
