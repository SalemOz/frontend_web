import { useEffect, useState } from 'react';
import { gsap } from './gsap.js';

const QUERIES = {
  reduced: '(prefers-reduced-motion: reduce)',
  desktop: '(min-width: 768px)',
  finePointer: '(pointer: fine)',
};

const readNow = () => ({
  reduced: window.matchMedia(QUERIES.reduced).matches,
  isDesktop: window.matchMedia(QUERIES.desktop).matches,
  finePointer: window.matchMedia(QUERIES.finePointer).matches,
});

/**
 * Preferencias de movimiento: { reduced, isDesktop, finePointer }.
 * El valor inicial se lee al montar (así la primera animación ya sabe si debe correr)
 * y se actualiza si cambian, con gsap.matchMedia().
 * Con reduced = true, ningún efecto anima: todo queda en su estado final.
 */
export function useMotion() {
  const [motion, setMotion] = useState(readNow);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      { reduced: QUERIES.reduced, desktop: QUERIES.desktop, finePointer: QUERIES.finePointer },
      ({ conditions }) => {
        setMotion({
          reduced: conditions.reduced,
          isDesktop: conditions.desktop,
          finePointer: conditions.finePointer,
        });
      },
    );
    return () => mm.revert();
  }, []);

  return motion;
}
