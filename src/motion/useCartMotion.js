import { useRef } from 'react';
import { gsap, useGSAP } from './gsap.js';
import { useMotion } from './useMotion.js';
import { cart, duration, ease, panel } from './tokens.js';

// Si la salida de una línea no termina (pestaña oculta, error), se quita igual (ms).
const REMOVE_FALLBACK_MS = 900;
const SUMMARY_SHIFT = 40;
const ERROR_SHIFT = -6;
const LINE_BOUNCE = 1.12;

/**
 * Movimiento del carrito. Todo es visual: el estado cambia al instante salvo al quitar
 * una línea, que se anima y luego llama a onRemove (con respaldo por tiempo).
 * Devuelve { removeLine, bounceLine }, seguras de llamar desde eventos.
 */
export function useCartMotion(scopeRef, { isEmpty, isPickup, isOpen, errorsVersion }) {
  const { reduced } = useMotion();
  const actionsRef = useRef(null);
  const hadItemsRef = useRef(!isEmpty);
  const firstPickupRef = useRef(true);

  // Entrada al abrir la página: líneas en cascada desde la izquierda y el resumen desde abajo.
  useGSAP(
    (context, contextSafe) => {
      actionsRef.current = {
        removeLine: contextSafe((line, onRemove) => {
          if (reduced || !line || line.dataset.removing) {
            onRemove();
            return;
          }
          line.dataset.removing = 'true';
          let done = false;
          const finish = () => {
            if (done) return;
            done = true;
            window.clearTimeout(fallback);
            onRemove();
          };
          const fallback = window.setTimeout(finish, REMOVE_FALLBACK_MS);
          const gap = parseFloat(getComputedStyle(line.parentElement).rowGap) || 0;
          // Sale a la derecha y, ya invisible, colapsa su alto (única excepción de layout:
          // es la salida del elemento) para que las demás suban sin salto.
          gsap
            .timeline({ onComplete: finish })
            .to(line, { x: cart.removeShift, opacity: 0, duration: duration.fast + 0.05, ease: ease.out })
            .to(line, {
              height: 0,
              paddingTop: 0,
              paddingBottom: 0,
              borderWidth: 0,
              marginBottom: -gap,
              duration: duration.fast,
              ease: ease.inOut,
            });
        }),
        bounceLine: contextSafe((line) => {
          if (reduced || !line) return;
          gsap
            .timeline()
            .to(line.querySelector('[data-line-total]'), { scale: LINE_BOUNCE, duration: 0.12, ease: ease.out })
            .to(line.querySelector('[data-line-total]'), { scale: 1, duration: duration.fast, ease: ease.pop });
          gsap.fromTo(
            line.querySelector('[data-line-flash]'),
            { opacity: 0 },
            { opacity: 1, duration: 0.12, yoyo: true, repeat: 1, ease: ease.inOut },
          );
        }),
      };

      if (reduced || isEmpty) return;
      const q = gsap.utils.selector(scopeRef);
      gsap.fromTo(
        q('[data-cart-line]'),
        { x: -cart.lineShift, opacity: 0 },
        { x: 0, opacity: 1, duration: duration.base, ease: ease.out, stagger: cart.lineStagger, clearProps: 'transform,opacity' },
      );
      gsap.fromTo(
        q('[data-cart-summary]'),
        { y: SUMMARY_SHIFT, opacity: 0 },
        { y: 0, opacity: 1, duration: duration.slow, ease: ease.out, delay: 0.1, clearProps: 'transform,opacity' },
      );
    },
    { scope: scopeRef, dependencies: [reduced] },
  );

  // Al quitar la última línea (o vaciar), el estado vacío entra con su animación.
  useGSAP(
    () => {
      const hadItems = hadItemsRef.current;
      hadItemsRef.current = !isEmpty;
      if (!isEmpty || !hadItems || reduced) return;
      gsap.fromTo(
        gsap.utils.selector(scopeRef)('[data-cart-empty]'),
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: duration.slow, ease: ease.out, clearProps: 'transform,opacity' },
      );
    },
    { scope: scopeRef, dependencies: [isEmpty] },
  );

  // Domicilio ↔ Recoger: el renglón del domicilio se expande o colapsa con fundido.
  useGSAP(
    () => {
      const rows = gsap.utils.selector(scopeRef)('[data-delivery-row]');
      const first = firstPickupRef.current;
      firstPickupRef.current = false;
      if (rows.length === 0) return;
      if (reduced || first) {
        gsap.set(rows, { display: isPickup ? 'none' : '', clearProps: isPickup ? '' : 'height,opacity' });
        return;
      }
      if (isPickup) {
        gsap.to(rows, {
          height: 0,
          opacity: 0,
          duration: duration.fast,
          ease: ease.inOut,
          onComplete: () => gsap.set(rows, { display: 'none' }),
        });
      } else {
        gsap.set(rows, { display: '' });
        gsap.fromTo(
          rows,
          { height: 0, opacity: 0 },
          { height: 'auto', opacity: 1, duration: duration.fast, ease: ease.out, clearProps: 'height,opacity' },
        );
      }
    },
    { scope: scopeRef, dependencies: [isPickup, isEmpty] },
  );

  // Errores de validación: sacudida corta del campo y el mensaje entra desde arriba.
  // El foco y el role="alert" los maneja Cart.jsx como siempre.
  useGSAP(
    () => {
      if (errorsVersion === 0 || reduced) return;
      const q = gsap.utils.selector(scopeRef);
      gsap.fromTo(
        q('input[aria-invalid="true"]'),
        { x: 0 },
        { x: panel.shake + 1, duration: 0.05, repeat: 5, yoyo: true, ease: ease.inOut, clearProps: 'transform' },
      );
      gsap.fromTo(
        q('[data-field-error]'),
        { y: ERROR_SHIFT, opacity: 0 },
        { y: 0, opacity: 1, duration: duration.fast, ease: ease.out, clearProps: 'transform,opacity' },
      );
    },
    { scope: scopeRef, dependencies: [errorsVersion] },
  );

  // Aviso de local cerrado: entra con opacidad y desplazamiento (el botón no anima).
  useGSAP(
    () => {
      if (isOpen || reduced) return;
      gsap.fromTo(
        gsap.utils.selector(scopeRef)('[data-closed-notice]'),
        { y: ERROR_SHIFT * 2, opacity: 0 },
        { y: 0, opacity: 1, duration: duration.base, ease: ease.out, clearProps: 'transform,opacity' },
      );
    },
    { scope: scopeRef, dependencies: [isOpen] },
  );

  return {
    removeLine: (line, onRemove) => {
      if (actionsRef.current) actionsRef.current.removeLine(line, onRemove);
      else onRemove();
    },
    bounceLine: (line) => actionsRef.current?.bounceLine(line),
  };
}
