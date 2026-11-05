import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import styles from './Navbar.module.css';

const linkClassName = ({ isActive }) => (isActive ? styles.active : undefined);

export default function Navbar() {
  const { count } = useCart();
  return (
    <nav className={styles.navbar} aria-label="Navegación principal">
      {/* .brand y .brand-icon son globales: los comparte con Footer */}
      <Link to="/" className="brand" aria-label="Delicias al Carbón, inicio">
        <span className="brand-icon">D</span>
        <span>
          Delicias
          <strong>al Carbón</strong>
        </span>
      </Link>

      <div className={styles.navLinks}>
        <NavLink to="/" end className={linkClassName}>
          Inicio
        </NavLink>
        <NavLink
          to="/menu"
          end
          className={linkClassName}
        >
          Menú
        </NavLink>
        <a href="#contacto">Contacto</a>
      </div>

      <Link
        to="/carrito"
        className={styles.cartLink}
        aria-label="Ir al carrito de compras"
      >
        <span uk-icon="icon: cart; ratio: 1.3" aria-hidden="true"></span>
        <span className={styles.cartCount} aria-live="polite">{count}</span>
      </Link>
    </nav>
  );
}
