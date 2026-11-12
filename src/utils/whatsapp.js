import { business } from '../data/business.js';
import { formatPrice } from '../data/menu.js';

const DELIVERY_LABELS = { domicilio: 'Domicilio', local: 'Recoger en el local' };
const PAYMENT_LABELS = { efectivo: 'Efectivo al recibir', transferencia: 'Transferencia' };

const itemLines = (item) => {
  const lines = [`• ${item.qty} × ${item.name} — ${formatPrice(item.lineTotal)}`];
  if (item.options.length > 0) {
    lines.push(`   ${item.options.map((option) => option.name).join(', ')}`);
  }
  if (item.note) lines.push(`   Nota: ${item.note}`);
  return lines;
};

/**
 * Texto del pedido tal como le llega al local por WhatsApp.
 * @param {object} order pedido creado con createOrder
 * @returns {string}
 */
export const buildOrderMessage = (order) => {
  const { customer } = order;
  const isDelivery = order.deliveryType === 'domicilio';

  const lines = [
    `Hola, ${business.name}. Quiero hacer este pedido:`,
    '',
    `*Pedido ${order.id}*`,
    ...order.items.flatMap(itemLines),
    '',
    `Subtotal: ${formatPrice(order.subtotal)}`,
    ...(order.deliveryFee > 0 ? [`Domicilio: ${formatPrice(order.deliveryFee)}`] : []),
    `*Total: ${formatPrice(order.total)}*`,
    '',
    `Entrega: ${DELIVERY_LABELS[order.deliveryType] ?? 'Por confirmar'}`,
    ...(isDelivery && customer.address ? [`Dirección: ${customer.address}`] : []),
    ...(customer.notes ? [`${isDelivery ? 'Indicaciones' : 'Notas'}: ${customer.notes}`] : []),
    `Nombre: ${customer.name}`,
    `Teléfono: ${customer.phone}`,
    `Pago: ${PAYMENT_LABELS[order.paymentMethod] ?? 'Por confirmar'}`,
  ];

  return lines.join('\n');
};

/** Enlace que abre el chat del local con el pedido ya escrito. */
export const whatsappOrderUrl = (order) =>
  `https://wa.me/${business.phone.whatsapp}?text=${encodeURIComponent(buildOrderMessage(order))}`;
