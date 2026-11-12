// Señal de la cortina de páginas (PageTransition): activa / retirada.
const ACTIVE_ATTR = 'data-curtain';
const DONE_EVENT = 'curtain:done';
// Si por algo no llega el aviso, no se espera más que esto (ms).
const MAX_WAIT_MS = 2500;

export const markCurtainActive = () => {
  document.documentElement.setAttribute(ACTIVE_ATTR, 'on');
};

export const markCurtainDone = () => {
  if (!document.documentElement.hasAttribute(ACTIVE_ATTR)) return;
  document.documentElement.removeAttribute(ACTIVE_ATTR);
  window.dispatchEvent(new Event(DONE_EVENT));
};

/**
 * Llama a `callback` cuando la cortina ya se retiró (al instante si no hay cortina).
 * Devuelve la limpieza (para el return de useGSAP/useEffect).
 */
export const afterCurtain = (callback) => {
  if (!document.documentElement.hasAttribute(ACTIVE_ATTR)) {
    callback();
    return () => {};
  }
  let called = false;
  const run = () => {
    if (called) return;
    called = true;
    window.removeEventListener(DONE_EVENT, run);
    window.clearTimeout(timer);
    callback();
  };
  window.addEventListener(DONE_EVENT, run);
  const timer = window.setTimeout(run, MAX_WAIT_MS);
  return () => {
    called = true;
    window.removeEventListener(DONE_EVENT, run);
    window.clearTimeout(timer);
  };
};
