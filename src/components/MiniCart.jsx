import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../data/menu.js';
import styles from './MiniCart.module.css';

/**
 * Resumen del carrito pegado al borde inferior mientras se recorre el menú.
 * Muestra el subtotal de productos: el domicilio depende de la entrega.
 */
export default function MiniCart() {
  const { count, subtotal } = useCart();

  if (count === 0) return null;

  return (
    <aside
      className={styles.miniCart}
      aria-label="Resumen del carrito"
      data-cart-target="bar"
    >
      <p className={styles.summary} aria-live="polite" aria-atomic="true">
        <span data-cart-target="count">{count}</span>{' '}
        {count === 1 ? 'producto' : 'productos'} ·{' '}
        <strong>{formatPrice(subtotal)}</strong>
      </p>
      <Link to="/carrito" className={`btn-primary ${styles.link}`}>
        Ver carrito
      </Link>
    </aside>
  );
}
