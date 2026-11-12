// Valores de movimiento compartidos: los componentes no usan números sueltos.

export const duration = {
  fast: 0.25,
  base: 0.5,
  slow: 0.9,
  // Cortina de parrilla: cubrir y retirar.
  curtain: 0.45,
};

export const ease = {
  out: 'power3.out',
  inOut: 'power3.inOut',
  pop: 'back.out(2)',
  elastic: 'elastic.out(1, 0.4)',
  linear: 'none',
};

export const distance = {
  // Desplazamiento de entrada del Hero (px).
  heroIn: 32,
  // Aparición al hacer scroll (px).
  reveal: 32,
  // Botón magnético: desplazamiento máximo y zona de atracción (px).
  magnetMax: 8,
  magnetZone: 80,
  // Tarjeta con inclinación: grados y elevación (px).
  tiltDeg: 3,
  tiltLift: 4,
};

export const stagger = {
  hero: 0.1,
  reveal: 0.08,
  curtain: 0.04,
};

export const embers = {
  desktop: 28,
  mobile: 10,
};

// Cinta: segundos por vuelta completa del texto.
export const marquee = {
  loop: 28,
};

// Cortina: si la nueva página tarda más que esto, se retira igual (ms).
export const curtainMaxWaitMs = 1500;

// Parallax del medio del Hero: fracción de la velocidad del scroll.
export const parallax = 0.2;

// ---------- Fase 5B: menú, panel, carrito y confirmación ----------

// Filtrado del menú con Flip (s): cambio de pestaña y escritura en la búsqueda.
export const flip = {
  move: 0.5,
  moveFast: 0.25,
  leave: 0.2,
  enterFrom: 0.92,
};

// Vuelo de la foto al carrito.
export const flight = {
  duration: 0.7,
  size: 56,
  endScale: 0.3,
  maxActive: 3,
};

// Rebote de los contadores del carrito.
export const bounce = {
  scale: 1.35,
};

// Panel de producto.
export const panel = {
  in: 0.55,
  out: 0.4,
  itemsDelay: 0.2,
  itemsStagger: 0.07,
  itemShift: 22,
  priceCount: 0.35,
  shake: 3,
};

// Carrito y confirmación.
export const cart = {
  lineShift: 40,
  lineStagger: 0.12,
  removeShift: 60,
  totalCount: 0.6,
};

export const confirmation = {
  circle: 0.5,
  check: 0.35,
  charStagger: 0.06,
  sparks: 24,
};
