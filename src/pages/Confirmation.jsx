import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { formatPrice } from '../data/menu.js';
import { readLastOrder } from '../utils/order.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import styles from './Confirmation.module.css';

const formatOrderDate = (createdAt) => {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleString('es-CO', {
    dateStyle: 'long',
    timeStyle: 'short',
  });
};

export default function Confirmation() {
  const [order] = useState(readLastOrder);
  useDocumentTitle('Confirmación');

  // Sin pedido guardado no hay nada que confirmar: de vuelta al menú.
  if (!order) return <Navigate to="/menu" replace />;

  const createdAt = formatOrderDate(order.createdAt);

  return (
    <section className={styles.page}>
      <div className="container">
        <span className="eyebrow">PEDIDO RECIBIDO</span>
        <h1 className="page-title">Confirmación</h1>
        <p className={styles.lead}>
          ¡Gracias por tu pedido! Guarda el número para reclamarlo en el local.
        </p>

        <dl className={styles.summary}>
          <div className={styles.summaryRow}>
            <dt>Número de pedido</dt>
            <dd className={styles.orderId}>{order.id}</dd>
          </div>
          {createdAt && (
            <div className={styles.summaryRow}>
              <dt>Fecha</dt>
              <dd>{createdAt}</dd>
            </div>
          )}
          <div className={styles.summaryRow}>
            <dt>Productos</dt>
            <dd>{order.count}</dd>
          </div>
          <div className={styles.summaryRow}>
            <dt>Total</dt>
            <dd className={styles.total}>{formatPrice(order.total ?? order.subtotal)}</dd>
          </div>
        </dl>

        <p className={styles.note}>
          Este pedido es una simulación: todavía no se envía a ningún sistema de
          pago ni de domicilios.
        </p>

        <Link to="/menu" className="btn-primary">Volver al menú</Link>
      </div>
    </section>
  );
}
