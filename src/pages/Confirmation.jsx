import { useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { formatPrice } from '../data/menu.js';
import { business } from '../data/business.js';
import { readLastOrder } from '../utils/order.js';
import { whatsappOrderUrl } from '../utils/whatsapp.js';
import Icon from '../components/Icon.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { gsap, useGSAP } from '../motion/gsap.js';
import { useMotion } from '../motion/useMotion.js';
import { afterCurtain } from '../motion/curtain.js';
import { confirmation, duration, ease } from '../motion/tokens.js';
import styles from './Confirmation.module.css';

// Chispas solo la primera vez que se ve este pedido (no al recargar ni al volver).
const CELEBRATED_KEY = 'delicias.pedidoCelebrado.v1';
const SPARK_DISTANCE = [50, 110];
const ENTER_SHIFT = 16;
const SEND_BEAT = 1.06;

const shouldCelebrate = (orderId) => {
  try {
    if (window.sessionStorage.getItem(CELEBRATED_KEY) === orderId) return false;
    window.sessionStorage.setItem(CELEBRATED_KEY, orderId);
    return true;
  } catch {
    return false;
  }
};

/** Chispas que salen del visto y se apagan. Las crea y las quita GSAP (aria-hidden). */
const sparkBurst = (container) => {
  const sparks = Array.from({ length: confirmation.sparks }, () => {
    const spark = document.createElement('i');
    spark.className = styles.spark;
    container.append(spark);
    return spark;
  });
  return gsap
    .timeline({ onComplete: () => sparks.forEach((spark) => spark.remove()) })
    .fromTo(
      sparks,
      { x: 0, y: 0, scale: 1, opacity: 1 },
      {
        x: (index) => Math.cos((index / sparks.length) * Math.PI * 2) * gsap.utils.random(...SPARK_DISTANCE),
        y: (index) => Math.sin((index / sparks.length) * Math.PI * 2) * gsap.utils.random(...SPARK_DISTANCE),
        scale: 0.2,
        opacity: 0,
        duration: duration.slow,
        ease: ease.out,
      },
    );
};

export default function Confirmation() {
  const [order] = useState(readLastOrder);
  useDocumentTitle('Envía tu pedido');
  const { reduced } = useMotion();
  const pageRef = useRef(null);
  const celebrateRef = useRef(null);

  // Secuencia al llegar (cuando la cortina ya se retiró). Todo es visual: el contenido
  // está en el DOM y es accesible desde el principio; solo cambia opacity/transform.
  useGSAP(
    () => {
      if (!order || reduced) return undefined;
      if (celebrateRef.current === null) celebrateRef.current = shouldCelebrate(order.id);
      const q = gsap.utils.selector(pageRef);
      const [circle] = q('[data-check-circle]');
      const [mark] = q('[data-check-mark]');
      const reveal = q('[data-confirm-reveal]');
      const chars = q('[data-order-char]');
      const send = q('[data-confirm-send]');

      [circle, mark].forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });
      gsap.set([...reveal, ...send], { opacity: 0, y: ENTER_SHIFT });
      gsap.set(chars, { opacity: 0, y: ENTER_SHIFT / 2 });

      const timeline = gsap
        .timeline({ paused: true, defaults: { ease: ease.out } })
        .to(circle, { strokeDashoffset: 0, duration: confirmation.circle })
        .to(mark, { strokeDashoffset: 0, duration: confirmation.check })
        .add(() => {
          if (celebrateRef.current) sparkBurst(q('[data-sparks]')[0]);
        })
        .to(reveal[0], { opacity: 1, y: 0, duration: duration.base }, '-=0.1')
        .to(chars, { opacity: 1, y: 0, duration: duration.fast, stagger: confirmation.charStagger, ease: ease.pop }, '-=0.2')
        .to(reveal.slice(1), { opacity: 1, y: 0, duration: duration.base, stagger: 0.08 }, '-=0.2')
        .to(send, { opacity: 1, y: 0, duration: duration.base }, '-=0.2')
        // Un latido, una sola vez, para llamar la atención sobre el envío.
        .to(send, { scale: SEND_BEAT, duration: 0.18, yoyo: true, repeat: 1, ease: ease.inOut });

      return afterCurtain(() => timeline.play());
    },
    { scope: pageRef, dependencies: [reduced] },
  );

  // Sin pedido guardado no hay nada que enviar: de vuelta al menú.
  if (!order) return <Navigate to="/menu" replace />;

  const { customer } = order;
  const isDelivery = order.deliveryType !== 'local';

  return (
    <section ref={pageRef} className={styles.page}>
      <div className="container">
        <div className={styles.badge} aria-hidden="true">
          <svg viewBox="0 0 60 60" width="64" height="64">
            <circle data-check-circle cx="30" cy="30" r="26" />
            <path data-check-mark d="M18 31 l8 8 l16 -17" />
          </svg>
          <div className={styles.sparks} data-sparks />
        </div>

        <h1 className="page-title" data-confirm-reveal>Envía tu pedido</h1>
        <p className={styles.lead} data-confirm-reveal>
          Tu pedido está listo. Toca el botón para abrir WhatsApp con el mensaje
          ya escrito y envíalo: así le llega a {business.name}.
        </p>

        <div className={styles.summary} data-confirm-reveal>
          <div className={styles.summaryHeader}>
            <span>Pedido</span>
            {/* El número completo para lectores de pantalla; las letras animadas, aria-hidden. */}
            <strong className={styles.orderId}>
              <span className="visually-hidden">{order.id}</span>
              <span aria-hidden="true">
                {[...order.id].map((char, index) => (
                  <span key={index} className={styles.char} data-order-char>
                    {char}
                  </span>
                ))}
              </span>
            </strong>
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
          data-confirm-send
        >
          <Icon name="whatsapp" /> Enviar por WhatsApp
        </a>
        <p className={styles.note} data-confirm-reveal>
          ¿No se abre WhatsApp? Escríbenos o llámanos al{' '}
          <a href={`tel:${business.phone.tel}`}>{business.phone.display}</a>.
        </p>

        <Link to="/menu" className={styles.back} data-confirm-reveal>
          <Icon name="arrow-left" /> Volver al menú
        </Link>
      </div>
    </section>
  );
}
