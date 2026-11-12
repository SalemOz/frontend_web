// Cálculos puros del movimiento (sin DOM ni GSAP): se prueban con node --test.

/** Valor entero entre from y to según el progreso (0…1, recortado). */
export const interpolate = (from, to, progress) => {
  const clamped = Math.min(Math.max(progress, 0), 1);
  return Math.round(from + (to - from) * clamped);
};

const center = (rect) => ({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });

/**
 * Trayectoria del vuelo al carrito: punto de salida (centro del origen) y
 * desplazamiento hasta el centro del destino.
 * @param {{ left: number, top: number, width: number, height: number }} from
 * @param {{ left: number, top: number, width: number, height: number }} to
 */
export const flightVector = (from, to) => {
  const start = center(from);
  const end = center(to);
  return { startX: start.x, startY: start.y, dx: end.x - start.x, dy: end.y - start.y };
};
