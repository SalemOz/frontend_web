import { useRef } from 'react';
import { gsap, useGSAP } from './gsap.js';
import { useMotion } from './useMotion.js';
import { duration, ease } from './tokens.js';
import styles from './RollingNumber.module.css';

/**
 * Número que "rueda" al cambiar: el viejo sale y el nuevo entra (yPercent).
 * El valor real va en un aria-live solo para lectores de pantalla; la parte
 * animada es aria-hidden. GSAP solo escribe en el nodo del valor viejo (React lo deja vacío).
 */
export default function RollingNumber({ value, className }) {
  const boxRef = useRef(null);
  const previousRef = useRef(null);
  const { reduced } = useMotion();

  useGSAP(
    () => {
      const previous = previousRef.current;
      previousRef.current = value;
      if (previous === null || previous === value || reduced) return;

      const box = boxRef.current;
      const oldDigit = box.querySelector('[data-roll-old]');
      const newDigit = box.querySelector('[data-roll-new]');
      oldDigit.textContent = String(previous);
      const direction = value > previous ? 1 : -1;
      const options = { duration: duration.fast + 0.05, ease: ease.out };

      gsap
        .timeline()
        .fromTo(oldDigit, { yPercent: 0, opacity: 1 }, { ...options, yPercent: -100 * direction, opacity: 0 }, 0)
        .fromTo(newDigit, { yPercent: 100 * direction, opacity: 0 }, { ...options, yPercent: 0, opacity: 1 }, 0);
    },
    { scope: boxRef, dependencies: [value, reduced] },
  );

  return (
    <span className={className}>
      <span className="visually-hidden" aria-live="polite">{value}</span>
      <span ref={boxRef} className={styles.box} aria-hidden="true">
        <span className={styles.old} data-roll-old />
        <span data-roll-new>{value}</span>
      </span>
    </span>
  );
}
