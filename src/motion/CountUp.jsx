import { useRef } from 'react';
import { useGSAP } from './gsap.js';
import { useMotion } from './useMotion.js';
import { countTo, setCount } from './countUp.js';
import { isFlying } from './cartFlight.js';
import { flight } from './tokens.js';

/**
 * Número que cuenta hasta su nuevo valor (precios, totales).
 * React pinta el valor real en un texto solo para lectores de pantalla; GSAP anima
 * una copia aria-hidden. Así nunca tocan el mismo nodo y se anuncia solo el final.
 * `waitForFlight`: si hay una foto volando al carrito, empieza a contar cuando llega.
 */
export default function CountUp({ value, format, duration, waitForFlight = false, className }) {
  const visualRef = useRef(null);
  const { reduced } = useMotion();

  useGSAP(
    () => {
      if (reduced) {
        setCount(visualRef.current, value, format);
        return;
      }
      const delay = waitForFlight && isFlying() ? flight.duration : 0;
      countTo(visualRef.current, value, { format, duration, delay });
    },
    { dependencies: [value, reduced] },
  );

  return (
    <span className={className}>
      <span className="visually-hidden">{format(value)}</span>
      <span ref={visualRef} aria-hidden="true" />
    </span>
  );
}
