import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { formatPrice } from '../data/menu.js';
import { business } from '../data/business.js';
import { readLastOrder } from '../utils/order.js';
import { whatsappOrderUrl } from '../utils/whatsapp.js';
import Icon from '../components/Icon.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import styles from './Confirmation.module.css';

export default function Confirmation() {
  const [order] = useState(readLastOrder);
  useDocumentTitle('Envía tu pedido');

  // Sin pedido guardado no hay nada que enviar: de vuelta al menú.
  if (!order) return <Navigate to="/menu" replace />;

  const { customer } = order;
  const isDelivery = order.deliveryType !== 'local';

  return (
    <section className={styles.page}>
      <div className="container">
        <h1 className="page-title">Envía tu pedido</h1>
        <p className={styles.lead}>
          Tu pedido está listo. Toca el botón para abrir WhatsApp con el mensaje
          ya escrito y envíalo: así le llega a {business.name}.
        </p>

        <div className={styles.summary}>
          <div className={styles.summaryHeader}>
            <span>Pedido</span>
            <strong className={styles.orderId}>{order.id}</strong>
          </div>

          <ul className={styles.items}>
            {order.items.map((item) => (
              <li key={item.lineId}>
                <span>
                  {item.qty} × {item.name}
                  {item.options.length > 0 && (
                    <small>{item.options.map((option) => option.name).join(' · ')}</small>
                  )}
                </span>
                <strong>{formatPrice(item.lineTotal)}</strong>
              </li>
            ))}
          </ul>

          <dl className={styles.details}>
            {order.deliveryFee > 0 && (
              <div>
                <dt>Domicilio</dt>
                <dd>{formatPrice(order.deliveryFee)}</dd>
              </div>
            )}
            <div className={styles.total}>
              <dt>Total</dt>
              <dd>{formatPrice(order.total)}</dd>
            </div>
            <div>
              <dt>Entrega</dt>
              <dd>{isDelivery ? customer.address || 'Domicilio' : 'Recoger en el local'}</dd>
            </div>
            <div>
              <dt>A nombre de</dt>
              <dd>{customer.name}</dd>
            </div>
          </dl>
        </div>

        <a
          href={whatsappOrderUrl(order)}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn-primary ${styles.send}`}
        >
          <Icon name="whatsapp" /> Enviar por WhatsApp
        </a>
        <p className={styles.note}>
          ¿No se abre WhatsApp? Escríbenos o llámanos al{' '}
          <a href={`tel:${business.phone.tel}`}>{business.phone.display}</a>.
        </p>

        <Link to="/menu" className={styles.back}>
          <Icon name="arrow-left" /> Volver al menú
        </Link>
      </div>
    </section>
  );
}
