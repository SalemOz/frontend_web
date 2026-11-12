import { useRef } from 'react';
import { gsap, useGSAP } from '../motion/gsap.js';
import { useMotion } from '../motion/useMotion.js';
import { duration } from '../motion/tokens.js';
import styles from './StatusChip.module.css';

const PULSE_SCALE = 1.7;
const PULSE_OPACITY = 0.45;

/**
 * Píldora con el estado del local (data-status / data-status-dot para animarla).
 * `announce`: solo una instancia por página (la del Navbar) avisa a los lectores
 * de pantalla, y solo cuando cambia entre abierto y cerrado, no cada 30 s.
 */
export default function StatusChip({ status, announce = false, className }) {
  const state = status.isOpen ? 'open' : 'closed';
  const { reduced } = useMotion();
  const chipRef = useRef(null);

  // Abierto: el punto verde late suave. Cerrado o con "reducir movimiento": quieto.
  useGSAP(
    () => {
      if (!status.isOpen || reduced) return;
      gsap.to('[data-status-dot]', {
        scale: PULSE_SCALE,
        opacity: PULSE_OPACITY,
        duration: duration.slow,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    },
    { scope: chipRef, dependencies: [status.isOpen, reduced], revertOnUpdate: true },
  );

  return (
    <span ref={chipRef} className={`${styles.chip} ${styles[state]} ${className ?? ''}`} data-status={state}>
      <span className={styles.dot} data-status-dot aria-hidden="true" />
      <span>{status.label}</span>
      {announce && (
        <span className="visually-hidden" role="status">
          {status.isOpen ? 'El local está abierto.' : 'El local está cerrado.'}
        </span>
      )}
    </span>
  );
}
