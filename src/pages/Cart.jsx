import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../data/menu.js';
import { business } from '../data/business.js';
import ProductImage from '../components/ProductImage.jsx';
import { createOrder, saveLastOrder } from '../utils/order.js';
import Icon from '../components/Icon.jsx';
import styles from './Cart.module.css';

export default function Cart() {
  const { items, count, subtotal, increase, decrease, remove, clear } = useCart();
  const navigate = useNavigate();
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

  const handleCheckout = () => {
    const order = createOrder(items, customer, deliveryFee);
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
        <h1 className={styles.title}>Carrito</h1>

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
            <ol className={styles.steps} aria-label="Progreso del pedido">
              <li className={styles.currentStep}><span>1</span> Carrito</li>
              <li><span>2</span> Datos y entrega</li>
              <li><span>3</span> Confirmación</li>
            </ol>

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
                    <input autoComplete="name" value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} />
                  </label>
                  <label>Teléfono
                    <input type="tel" autoComplete="tel" value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} />
                  </label>
                  <label className={styles.fullField}>Dirección y barrio
                    <input autoComplete="street-address" value={customer.address} onChange={(event) => setCustomer({ ...customer, address: event.target.value })} />
                  </label>
                  <label className={styles.fullField}>Notas para tu pedido (opcional)
                    <input autoComplete="off" placeholder="Sin cebolla, timbre dañado…" value={customer.notes} onChange={(event) => setCustomer({ ...customer, notes: event.target.value })} />
                  </label>
                </div>
              </section>

              <section className={styles.formCard}>
                <h2 id="cart-payment-title">Método de pago</h2>
                <div className={styles.choiceList} role="radiogroup" aria-labelledby="cart-payment-title">
                  <label className={paymentMethod === 'efectivo' ? styles.selectedChoice : styles.choice}>
                    <input type="radio" name="pago" checked={paymentMethod === 'efectivo'} onChange={() => setPaymentMethod('efectivo')} />
                    Efectivo al recibir
                  </label>
                  <label className={paymentMethod === 'transferencia' ? styles.selectedChoice : styles.choice}>
                    <input type="radio" name="pago" checked={paymentMethod === 'transferencia'} onChange={() => setPaymentMethod('transferencia')} />
                    Transferencia / medio de pago
                  </label>
                </div>
                <p className={styles.formNote}>Pago de demostración: no se envían datos a ninguna pasarela.</p>
              </section>
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
                type="button"
                className={`btn-primary ${styles.checkout}`}
                onClick={handleCheckout}
              >
                Finalizar pedido <Icon name="arrow-right" />
              </button>
              {saveFailed && (
                <p className={styles.error} role="alert">
                  No pudimos guardar tu pedido en este navegador. Revisa que no
                  estés en una ventana privada e inténtalo de nuevo.
                </p>
              )}
              <button type="button" className={styles.clear} onClick={clear}>
                Vaciar carrito
              </button>
              <p className={styles.nextStep}>
                Confirmarás los detalles de tu pedido en el siguiente paso.
              </p>
            </aside>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
