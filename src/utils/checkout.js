// Teléfonos de Colombia: fijo de 7 dígitos o celular de 10 (se ignoran espacios, guiones y +57).
const MIN_PHONE_DIGITS = 7;
const MAX_PHONE_DIGITS = 12;

const countDigits = (value) => value.replace(/\D/g, '').length;

/**
 * Revisa los datos de entrega antes de finalizar el pedido.
 * @param {{ name: string, phone: string, address: string }} customer
 * @param {'domicilio' | 'local'} deliveryType
 * @returns {Record<string, string>} mensajes por campo; vacío si todo está bien
 */
export const validateCheckout = (customer, deliveryType) => {
  const errors = {};
  const phoneDigits = countDigits(customer.phone);

  if (customer.name.trim() === '') {
    errors.name = 'Escribe tu nombre para saber a quién entregar.';
  }

  if (phoneDigits === 0) {
    errors.phone = 'Escribe un teléfono para avisarte de tu pedido.';
  } else if (phoneDigits < MIN_PHONE_DIGITS || phoneDigits > MAX_PHONE_DIGITS) {
    errors.phone = 'Revisa el número: debe tener 7 dígitos (fijo) o 10 (celular).';
  }

  if (deliveryType === 'domicilio' && customer.address.trim() === '') {
    errors.address = 'Escribe la dirección y el barrio para llevarte el pedido.';
  }

  return errors;
};
