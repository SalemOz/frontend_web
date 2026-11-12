import { gsap, ScrollTrigger } from './gsap.js';
import { distance, duration, ease, stagger } from './tokens.js';

/**
 * Aparición al bajar (5A), una vez por elemento, a ~85 % del alto de la ventana.
 * Llamar dentro de useGSAP (antes del primer pintado) y nunca con "reducir movimiento".
 * transition: none mientras anima (las tarjetas traen transition: transform en CSS);
 * al terminar se borran los estilos en línea para que vuelva su hover de CSS.
 */
export const revealOnScroll = (targets) => {
  if (targets.length === 0) return;
  gsap.set(targets, { opacity: 0, y: distance.reveal, transition: 'none' });
  ScrollTrigger.batch(targets, {
    start: 'top 85%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: duration.base,
        ease: ease.out,
        stagger: stagger.reveal,
        overwrite: true,
        clearProps: 'opacity,transform,transition',
      }),
  });
};
