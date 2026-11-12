// Único punto de entrada de UIkit en la app (ver README, "UIkit en este proyecto").
// Todo se carga con import() dinámico la primera vez que se usa, así que el bundle
// inicial no crece. Para quitar UIkit: borrar src/lib/uikit*, sus llamadas y las dependencias.

const NOTIFY_TIMEOUT_MS = 2500;
const LIVE_REGION_ID = 'uikit-notify-status';
// UIkit reutiliza un contenedor con este atributo (y lo borra cuando se vacía).
const CONTAINER_ATTR = 'data-uk-notification-container';

let stylesPromise = null;
let uikitPromise = null;

/** Solo el CSS mínimo (spinner, notificación, flex): unos 10 kB. */
export const loadUIkitStyles = () => {
  stylesPromise ??= import('./uikit-lite.less').catch((error) => {
    stylesPromise = null;
    throw error;
  });
  return stylesPromise;
};

/** Librería + CSS. Devuelve UIkit; si la carga falla, rechaza y se puede reintentar. */
export const initUIkit = () => {
  uikitPromise ??= Promise.all([import('uikit'), loadUIkitStyles()])
    .then(([module]) => module.default)
    .catch((error) => {
      uikitPromise = null;
      throw error;
    });
  return uikitPromise;
};

const escapeHtml = (text) =>
  String(text).replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

// UIkit marca cada aviso con role="alert" (interrumpe al lector de pantalla).
// En su lugar: el contenedor visual queda aria-hidden y una región role="status"
// propia, que nunca se borra, lo anuncia de forma educada y sin mover el foco.
const announce = (message) => {
  let region = document.getElementById(LIVE_REGION_ID);
  if (!region) {
    region = document.createElement('div');
    region.id = LIVE_REGION_ID;
    region.className = 'visually-hidden';
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    document.body.append(region);
  }
  // Vaciar y volver a escribir: así se anuncia aunque el texto se repita.
  region.textContent = '';
  window.setTimeout(() => {
    region.textContent = message;
  }, 100);
};

const ensureHiddenContainer = () => {
  const selector = `.uk-notification-bottom-center[${CONTAINER_ATTR}]`;
  if (document.querySelector(selector)) return;
  const container = document.createElement('div');
  container.className = 'uk-notification uk-notification-bottom-center';
  container.setAttribute(CONTAINER_ATTR, '');
  container.setAttribute('aria-hidden', 'true');
  document.body.append(container);
};

/**
 * Aviso breve abajo al centro. Nunca rompe el flujo: si UIkit no carga, no hace nada.
 * @param {string} message texto plano (se escapa antes de dárselo a UIkit)
 */
export const notify = async (message) => {
  try {
    const UIkit = await initUIkit();
    ensureHiddenContainer();
    UIkit.notification({
      message: escapeHtml(message),
      pos: 'bottom-center',
      timeout: NOTIFY_TIMEOUT_MS,
    });
    announce(message);
  } catch {
    // Sin red o sin UIkit: el "Agregado ✓" de la tarjeta y del panel ya da la confirmación.
  }
};
