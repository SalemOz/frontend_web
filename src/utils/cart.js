// Utilidades puras del carrito: identificadores de línea, precios y validación
// de lo que se guarda en localStorage. Todos los cálculos son con enteros (COP).

export const CART_STORAGE_KEY = 'delicias.cart.v1';

const isNonNegativeInteger = (value) => Number.isInteger(value) && value >= 0;
const isPositiveInteger = (value) => Number.isInteger(value) && value > 0;

/**
 * Deja solo las opciones con la forma esperada: { id, name, price }.
 */
export const normalizeOptions = (options) => {
  if (!Array.isArray(options)) return [];

  return options
    .filter(
      (option) =>
        option &&
        typeof option.id === 'string' &&
        option.id !== '' &&
        typeof option.name === 'string' &&
        isNonNegativeInteger(option.price),
    )
    .map(({ id, name, price }) => ({ id, name, price }));
};

export const calculateUnitPrice = (basePrice, options = []) => {
  const base = isNonNegativeInteger(basePrice) ? basePrice : 0;
  return normalizeOptions(options).reduce((sum, option) => sum + option.price, base);
};

/**
 * Dos líneas son la misma solo si coinciden producto, adicionales (sin importar
 * su orden) y nota.
 */
export const createLineId = (productId, options = [], note = '') => {
  const optionIds = normalizeOptions(options)
    .map((option) => option.id)
    .sort()
    .join('+');
  const normalizedNote = typeof note === 'string' ? note.trim() : '';

  return `${productId}|${optionIds}|${normalizedNote}`;
};

export const calculateSubtotal = (items) =>
  items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);

export const calculateCount = (items) =>
  items.reduce((sum, item) => sum + item.qty, 0);

/**
 * Convierte una línea guardada en una línea válida del carrito.
 * Devuelve null si no tiene la forma esperada.
 */
const sanitizeLine = (line) => {
  if (!line || typeof line !== 'object') return null;

  const { productId, name, unitPrice, qty, options, note, image, categoryName } = line;

  if (typeof productId !== 'string' || productId === '') return null;
  if (typeof name !== 'string' || name === '') return null;
  if (!isNonNegativeInteger(unitPrice)) return null;
  if (!isPositiveInteger(qty)) return null;
  if (options !== undefined && !Array.isArray(options)) return null;

  const safeOptions = normalizeOptions(options);

  return {
    lineId: createLineId(productId, safeOptions, note),
    productId,
    name,
    unitPrice,
    qty,
    options: safeOptions,
    note: typeof note === 'string' ? note.trim() : '',
    image: typeof image === 'string' ? image : '',
    categoryName: typeof categoryName === 'string' ? categoryName : '',
  };
};

/**
 * Lee el JSON guardado y devuelve un carrito válido (o vacío si algo no encaja).
 */
export const parseStoredCart = (raw, validProductIds) => {
  if (typeof raw !== 'string' || raw === '') return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const lines = new Map();

    parsed.forEach((entry) => {
      const line = sanitizeLine(entry);
      if (!line) return;
      if (validProductIds instanceof Set && !validProductIds.has(line.productId)) return;

      const existing = lines.get(line.lineId);
      lines.set(
        line.lineId,
        existing ? { ...existing, qty: existing.qty + line.qty } : line,
      );
    });

    return [...lines.values()];
  } catch {
    return [];
  }
};
