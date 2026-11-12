import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap, ScrollTrigger, useGSAP } from '../motion/gsap.js';
import { useMotion } from '../motion/useMotion.js';
import { ease } from '../motion/tokens.js';
import styles from './ScrollProgress.module.css';

const SCRUB_SMOOTHING = 0.3;
const REFRESH_DELAY_S = 0.15;

/**
 * Línea naranja de 3 px arriba que crece con el scroll de la página (decorativa).
 * Con "reducir movimiento" no se muestra.
 */
export default function ScrollProgress() {
  const { pathname } = useLocation();
  const { reduced } = useMotion();
  const barRef = useRef(null);

  useGSAP(
    () => {
      if (reduced) return undefined;
      gsap.fromTo(
        barRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: ease.linear,
          scrollTrigger: { start: 0, end: 'max', scrub: SCRUB_SMOOTHING },
        },
      );

      // Las páginas cambian de alto después de montar (carga perezosa, filtros del menú):
      // recalcular todas las posiciones de scroll, agrupando cambios seguidos.
      const refresh = gsap.delayedCall(REFRESH_DELAY_S, () => ScrollTrigger.refresh()).pause();
      const observer = new ResizeObserver(() => refresh.restart(true));
      observer.observe(document.body);
      return () => observer.disconnect();
    },
    { dependencies: [reduced, pathname], revertOnUpdate: true },
  );

  if (reduced) return null;
  return <div ref={barRef} className={styles.bar} aria-hidden="true" />;
}
