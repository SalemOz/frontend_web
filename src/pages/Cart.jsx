import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../data/menu.js';
import { business } from '../data/business.js';
import ProductImage from '../components/ProductImage.jsx';
import { createOrder, saveLastOrder } from '../utils/order.js';
import { validateCheckout } from '../utils/checkout.js';
import Icon from '../components/Icon.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import styles from './Cart.module.css';

export default function Cart() {
  const { items, count, subtotal, increase, decrease, remove, clear } = useCart();
  const navigate = useNavigate();
  useDocumentTitle('Carrito');
  const [deliveryType, setDeliveryType] = useState('domicilio');
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
  });

  const deliveryFee = deliveryType === 'domicilio' ? business.deliveryFee : 0;
  const total = subtotal + deliveryFee;

  const [saveFailed, setSaveFailed] = useState(false);
  const [errors, setErrors] = useState({});
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const isPickup = deliveryType === 'local';

  const updateField = (field) => (event) => {
    setCustomer({ ...customer, [field]: event.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  };

  const fieldProps = (field) => ({
    id: `checkout-${field}`,
    value: customer[field],
    onChange: updateField(field),
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': errors[field] ? `checkout-${field}-error` : undefined,
  });

  const fieldError = (field) =>
    errors[field] && (
      <span id={`checkout-${field}-error`} className={styles.fieldError}>
        {errors[field]}
      </span>
    );

  const handleCheckout = (event) => {
    event.preventDefault();
    const nextErrors = validateCheckout(customer, deliveryType);
    const firstInvalid = ['name', 'phone', 'address'].find((field) => nextErrors[field]);
    setErrors(nextErrors);
    if (firstInvalid) {
      document.getElementById(`checkout-${firstInvalid}`)?.focus();
      return;
    }

    const order = createOrder(items, isPickup ? { ...customer, address: '' } : customer, deliveryFee);
    const saved = saveLastOrder(order);
    setSaveFailed(!saved);
    if (!saved) return;

    clear();
    navigate('/confirmacion');
  };

  return (
    <section className={styles.page}>
      <div className="container">
        <span className="eyebrow">TU PEDIDO</span>
        <h1 className="page-title">Carrito</h1>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <Icon name="cart" ratio={2} className={styles.emptyIcon} />
            <h2>Tu carrito está esperando algo delicioso</h2>
            <p>Explora la carta y agrega tus favoritos para empezar el pedido.</p>
            <Link to="/menu" className="btn-primary">
              Ver el menú <Icon name="arrow-right" />
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.layout}>
            <div>
              <div className={styles.listHeader}>
                <h2>Tu selección</h2>
                <span>{count} {count === 1 ? 'producto' : 'productos'}</span>
              </div>
            <ul className={styles.list}>
              {items.map((line) => (
                <li className={styles.line} key={line.lineId}>
                  <ProductImage
                    image={line.image}
                    alt=""
                    label={line.categoryName}
                    className={styles.productImage}
                  />

                  <div className={styles.lineInfo}>
                    <h3 className={styles.lineName}>{line.name}</h3>

                    {line.options.length > 0 && (
                      <p className={styles.lineDetail}>
                        {line.options.map((option) => option.name).join(' · ')}
                      </p>
                    )}

                    {line.note !== '' && (
                      <p className={styles.lineDetail}>Nota: {line.note}</p>
                    )}

                    <p className={styles.unitPrice}>{formatPrice(line.unitPrice)} c/u</p>

                    <div className={styles.qtyControls}>
                      <button
                        type="button"
                        onClick={() => decrease(line.lineId)}
                        aria-label={`Quitar uno de ${line.name}`}
                      >
                        −
                      </button>
                      <span className={styles.qty} aria-live="polite">{line.qty}</span>
                      <button
                        type="button"
                        onClick={() => increase(line.lineId)}
                        aria-label={`Agregar uno de ${line.name}`}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className={styles.remove}
                        onClick={() => remove(line.lineId)}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>

                  <strong className={styles.lineTotal}>
                    {formatPrice(line.unitPrice * line.qty)}
                  </strong>
                </li>
              ))}
            </ul>
            <Link to="/menu" className={styles.continueLink}>
              <Icon name="arrow-left" /> Seguir agregando
            </Link>

              <form id="checkout-form" noValidate onSubmit={handleCheckout}>
              <section className={styles.formCard}>
                <h2 id="cart-delivery-title">¿Cómo lo quieres?</h2>
                <div className={styles.choiceGrid} role="radiogroup" aria-labelledby="cart-delivery-title">
                  <label className={deliveryType === 'domicilio' ? styles.selectedChoice : styles.choice}>
                    <input
                      type="radio"
                      name="entrega"
                      value="domicilio"
                      checked={deliveryType === 'domicilio'}
                      onChange={() => setDeliveryType('domicilio')}
                    />
                    Domicilio
                  </label>
                  <label className={deliveryType === 'local' ? styles.selectedChoice : styles.choice}>
                    <input
                      type="radio"
                      name="entrega"
                      value="local"
                      checked={deliveryType === 'local'}
                      onChange={() => setDeliveryType('local')}
                    />
                    Recoger en el local
                  </label>
                </div>
                <div className={styles.fields}>
                  <label>Nombre
                    <input autoComplete="name" required {...fieldProps('name')} />
                    {fieldError('name')}
                  </label>
                  <label>Teléfono
                    <input type="tel" inputMode="tel" autoComplete="tel" required {...fieldProps('phone')} />
                    {fieldError('phone')}
                  </label>
                  {!isPickup && (
                    <label className={styles.fullField}>Dirección y barrio
                      <input autoComplete="street-address" required {...fieldProps('address')} />
                      {fieldError('address')}
                    </label>
                  )}
                  <label className={styles.fullField}>
                    {isPickup ? 'Notas para tu pedido (opcional)' : 'Indicaciones para el domiciliario (opcional)'}
                    <input autoComplete="off" placeholder={isPickup ? 'Paso a las 8:00 p. m.…' : 'Casa esquinera, timbre dañado…'} {...fieldProps('notes')} />
                  </label>
                </div>
              </section>

              <section className={styles.formCard}>
                <h2 id="cart-payment-title">Método de pago</h2>
                <div className={styles.choiceList} role="radiogroup" aria-labelledby="cart-payment-title">
                  <label className={paymentMethod === 'efectivo' ? styles.selectedChoice : styles.choice}>
                    <input type="radio" name="pago" value="efectivo" checked={paymentMethod === 'efectivo'} onChange={() => setPaymentMethod('efectivo')} />
                    Efectivo al recibir
                  </label>
                  <label className={paymentMethod === 'transferencia' ? styles.selectedChoice : styles.choice}>
                    <input type="radio" name="pago" value="transferencia" checked={paymentMethod === 'transferencia'} onChange={() => setPaymentMethod('transferencia')} />
                    Transferencia / medio de pago
                  </label>
                </div>
                <p className={styles.formNote}>Pago de demostración: no se envían datos a ninguna pasarela.</p>
              </section>
              </form>
            </div>

            <aside className={styles.summary} aria-label="Resumen del pedido">
              <span className="eyebrow">RESUMEN</span>
              <h2>Tu pedido</h2>
              <div className={styles.summaryRow}>
                <span>Productos</span>
                <strong>{count}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Domicilio</span>
                <strong>{deliveryFee > 0 ? formatPrice(deliveryFee) : 'No aplica'}</strong>
              </div>
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Total</span>
                <strong>{formatPrice(total)}</strong>
              </div>
              <button
                type="submit"
                form="checkout-form"
                className={`btn-primary ${styles.checkout}`}
              >
                Finalizar pedido <Icon name="arrow-right" />
              </button>
              {Object.values(errors).some(Boolean) && (
                <p className={styles.error} role="alert">
                  Faltan datos de entrega. Revisa los campos marcados.
                </p>
              )}
              {saveFailed && (
                <p className={styles.error} role="alert">
                  No pudimos guardar tu pedido en este navegador. Revisa que no
                  estés en una ventana privada e inténtalo de nuevo.
                </p>
              )}
              {isConfirmingClear ? (
                <div className={styles.clearConfirm} role="group" aria-label="Confirmar vaciar carrito">
                  <span>¿Quitar todos los productos?</span>
                  <button type="button" className={styles.clearYes} onClick={clear}>
                    Sí, vaciar
                  </button>
                  <button type="button" className={styles.clear} onClick={() => setIsConfirmingClear(false)} autoFocus>
                    Cancelar
                  </button>
                </div>
              ) : (
                <button type="button" className={styles.clear} onClick={() => setIsConfirmingClear(true)}>
                  Vaciar carrito
                </button>
              )}
            </aside>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
