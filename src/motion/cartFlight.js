import { gsap } from './gsap.js';
import { flightVector } from './math.js';
import { bounce, duration, ease, flight } from './tokens.js';

const LOGO = '/brand/logo-delicias-192.png';
const REDUCED = '(prefers-reduced-motion: reduce)';

// Clones en vuelo, con su animación: para limpiarlos al salir de la página.
const active = new Map();

const isVisible = (el) => {
  if (!el) return false;
  const box = el.getBoundingClientRect();
  return box.width > 0 && box.bottom > 0 && box.top < window.innerHeight;
};

// Destino: el contador del mini carrito si se ve; si no, el carrito del Navbar.
const pickTarget = () => {
  const mini = document.querySelector('[data-cart-target="count"]');
  return isVisible(mini) ? mini : document.querySelector('[data-cart-target="nav"]');
};

/** Rebote de los contadores del carrito (Navbar y mini carrito). */
export const bounceCounters = () => {
  gsap.utils.toArray('[data-cart-target="count"], [data-cart-target="nav-count"]').forEach((el) => {
    gsap
      .timeline()
      .to(el, { scale: bounce.scale, duration: duration.fast / 2, ease: ease.out })
      .to(el, { scale: 1, duration: duration.fast, ease: ease.pop });
  });
};

// popover="manual" pone el clon en la capa superior: encima del <dialog> del panel.
const createClone = (src, startX, startY) => {
  const clone = document.createElement('img');
  clone.src = src;
  clone.alt = '';
  clone.setAttribute('aria-hidden', 'true');
  clone.dataset.fly = '';
  Object.assign(clone.style, {
    position: 'fixed',
    left: `${startX - flight.size / 2}px`,
    top: `${startY - flight.size / 2}px`,
    width: `${flight.size}px`,
    height: `${flight.size}px`,
    margin: '0',
    padding: '0',
    border: '2px solid #ff891e',
    borderRadius: '12px',
    objectFit: 'cover',
    background: '#141210',
    pointerEvents: 'none',
    overflow: 'visible',
    zIndex: '1000',
  });
  if (typeof clone.showPopover === 'function') clone.setAttribute('popover', 'manual');
  document.body.append(clone);
  clone.showPopover?.();
  return clone;
};

const removeClone = (clone) => {
  const timeline = active.get(clone);
  // Primero se saca del registro: kill() dispara onInterrupt, que vuelve a llamar aquí.
  if (!active.delete(clone)) return;
  timeline.kill();
  clone.remove();
};

/**
 * Vuela la foto del producto (o el logo) desde `from` hasta el carrito.
 * Solo visual: el carrito ya está actualizado. Sin vuelo con "reducir movimiento",
 * sin origen o con 3 vuelos en curso.
 */
export const flyToCart = ({ from, image }) => {
  if (window.matchMedia(REDUCED).matches || !from || active.size >= flight.maxActive) return;
  const target = pickTarget();
  if (!target) return;

  const { startX, startY, dx, dy } = flightVector(from.getBoundingClientRect(), target.getBoundingClientRect());
  const clone = createClone(image || LOGO, startX, startY);
  const options = { duration: flight.duration };

  // Arco: x con power1.inOut e y con power2.in, a la vez.
  const timeline = gsap
    .timeline({
      onComplete: () => {
        removeClone(clone);
        bounceCounters();
      },
      onInterrupt: () => removeClone(clone),
    })
    .to(clone, { ...options, x: dx, ease: 'power1.inOut' }, 0)
    .to(clone, { ...options, y: dy, ease: 'power2.in' }, 0)
    .to(clone, { ...options, scale: flight.endScale, ease: ease.inOut }, 0);
  active.set(clone, timeline);
};

/** Quita los clones en vuelo (al desmontar la página). */
export const cancelFlights = () => {
  [...active.keys()].forEach(removeClone);
};

/** ¿Hay un vuelo en curso? (el mini carrito espera su llegada para contar). */
export const isFlying = () => active.size > 0;
