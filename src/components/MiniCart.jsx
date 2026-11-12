import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../data/menu.js';
import CountUp from '../motion/CountUp.jsx';
import styles from './MiniCart.module.css';

/**
 * Resumen del carrito pegado al borde inferior mientras se recorre el menú.
 * Muestra el subtotal de productos: el domicilio depende de la entrega.
 * El total cuenta hasta el nuevo valor cuando llega la foto que vuela al carrito;
 * el aria-live anuncia solo el valor final (ver CountUp).
 */
export default function MiniCart() {
  const { count, subtotal } = useCart();

  if (count === 0) return null;

  return (
    // uk-flex*: utilidades de UIkit (src/lib/uikit-lite.less) con los mismos valores que
    // .miniCart; el CSS Module las cubre mientras el CSS de UIkit no se ha cargado.
    <aside
      className={`${styles.miniCart} uk-flex uk-flex-middle uk-flex-between`}
      aria-label="Resumen del carrito"
      data-cart-target="bar"
    >
      <p className={styles.summary} aria-live="polite" aria-atomic="true">
        <span className={styles.count} data-cart-target="count">{count}</span>{' '}
        {count === 1 ? 'producto' : 'productos'} ·{' '}
        <strong>
          <CountUp value={subtotal} format={formatPrice} waitForFlight />
        </strong>
      </p>
      <Link to="/carrito" className={`btn-primary ${styles.link}`}>
        Ver carrito
      </Link>
    </aside>
  );
}
