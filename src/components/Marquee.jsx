import { useRef } from 'react';
import { gsap, useGSAP } from '../motion/gsap.js';
import { useMotion } from '../motion/useMotion.js';
import { duration, ease, marquee } from '../motion/tokens.js';
import styles from './Marquee.module.css';

const TEXT = 'HAMBURGUESAS • PERROS CALIENTES • SALCHIPAPAS • PATACOLOS • COMIDA MEXICANA • BEBIDAS •';

/**
 * Cinta naranja entre el Hero y las categorías. Es decorativa (repite las categorías
 * que vienen justo debajo), por eso toda la franja es aria-hidden.
 * Bucle continuo: dos copias iguales y el riel se desplaza la mitad de su ancho.
 */
export default function Marquee() {
  const { reduced } = useMotion();
  const stripRef = useRef(null);

  useGSAP(
    (context, contextSafe) => {
      if (reduced) return undefined;
      const strip = stripRef.current;
      const loop = gsap.to('[data-marquee-track]', {
        xPercent: -50,
        duration: marquee.loop,
        ease: ease.linear,
        repeat: -1,
      });

      // Al pasar el mouse, frena suave hasta detenerse; al salir, retoma.
      const slowTo = (scale) => gsap.to(loop, { timeScale: scale, duration: duration.base, ease: ease.out });
      const onEnter = contextSafe(() => slowTo(0));
      const onLeave = contextSafe(() => slowTo(1));
      strip.addEventListener('pointerenter', onEnter);
      strip.addEventListener('pointerleave', onLeave);
      return () => {
        strip.removeEventListener('pointerenter', onEnter);
        strip.removeEventListener('pointerleave', onLeave);
      };
    },
    { scope: stripRef, dependencies: [reduced], revertOnUpdate: true },
  );

  // Con "reducir movimiento": una sola copia, quieta.
  const copies = reduced ? 1 : 2;

  return (
    <div ref={stripRef} className={styles.strip} aria-hidden="true">
      <div className={styles.track} data-marquee-track>
        {Array.from({ length: copies }, (_, index) => (
          <span key={index} className={styles.copy}>
            {TEXT} {TEXT}{' '}
          </span>
        ))}
      </div>
    </div>
  );
}
