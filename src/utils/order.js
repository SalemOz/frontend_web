// Pedido de demostración: se genera y se guarda en el navegador.
// No se envía nada a ningún servidor ni a una pasarela de pago.

export const LAST_ORDER_STORAGE_KEY = 'delicias.lastOrder.v1';

// Sin caracteres que se confundan al leerlos (0/O, 1/I).
const ORDER_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const ORDER_CODE_LENGTH = 6;

const createOrderNumber = () => {
  const bytes = new Uint8Array(ORDER_CODE_LENGTH);

  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }

  const code = Array.from(
    bytes,
    (byte) => ORDER_CODE_ALPHABET[byte % ORDER_CODE_ALPHABET.length],
  ).join('');

  return `DC-${code}`;
};

const toText = (value) => (typeof value === 'string' ? value.trim() : '');

const normalizeCustomer = (customer = {}) => ({
  name: toText(customer.name),
  phone: toText(customer.phone),
  address: toText(customer.address),
  notes: toText(customer.notes),
});

const normalizeItem = (item) => {
  const unitPrice = Number.isInteger(item.unitPrice) ? item.unitPrice : 0;
  const qty = Number.isInteger(item.qty) && item.qty > 0 ? item.qty : 0;

  return {
    lineId: item.lineId,
    productId: item.productId,
    name: item.name,
    unitPrice,
    qty,
    options: Array.isArray(item.options) ? item.options : [],
    note: toText(item.note),
    image: typeof item.image === 'string' ? item.image : '',
    lineTotal: unitPrice * qty,
  };
};

/**
 * Construye el objeto del pedido a partir de las líneas del carrito.
 * @param {Array} items líneas del carrito
 * @param {object} customer datos de entrega (opcionales por ahora)
 */
export const createOrder = (items, customer = {}) => {
  const orderItems = Array.isArray(items) ? items.map(normalizeItem) : [];

  return {
    id: createOrderNumber(),
    createdAt: new Date().toISOString(),
    items: orderItems,
    subtotal: orderItems.reduce((sum, item) => sum + item.lineTotal, 0),
    count: orderItems.reduce((sum, item) => sum + item.qty, 0),
    customer: normalizeCustomer(customer),
  };
};

export const saveLastOrder = (order) => {
  try {
    window.sessionStorage.setItem(LAST_ORDER_STORAGE_KEY, JSON.stringify(order));
    return true;
  } catch {
    return false;
  }
};

/**
 * Devuelve el último pedido guardado o null si falta o no tiene la forma esperada.
 */
export const readLastOrder = () => {
  try {
    const raw = window.sessionStorage.getItem(LAST_ORDER_STORAGE_KEY);
    if (!raw) return null;

    const order = JSON.parse(raw);

    if (!order || typeof order !== 'object') return null;
    if (typeof order.id !== 'string' || order.id === '') return null;
    if (!Array.isArray(order.items) || order.items.length === 0) return null;
    if (!Number.isInteger(order.subtotal) || order.subtotal < 0) return null;

    return {
      ...order,
      count: Number.isInteger(order.count)
        ? order.count
        : order.items.reduce(
            (sum, item) => sum + (Number.isInteger(item?.qty) ? item.qty : 0),
            0,
          ),
    };
  } catch {
    return null;
  }
};
