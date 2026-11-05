import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import styles from './Navbar.module.css';

const linkClassName = ({ isActive }) => (isActive ? styles.active : undefined);

export default function Navbar() {
  const { count } = useCart();
  const location = useLocation();
  const isCombosRoute =
    location.pathname === '/menu' &&
    new URLSearchParams(location.search).get('categoria') === 'combos';

  // "Menú" y "Combos" comparten ruta: solo uno queda marcado como activo.
  const menuClassName = ({ isActive }) =>
    isActive && !isCombosRoute ? styles.active : undefined;
  const combosClassName = ({ isActive }) =>
    isActive && isCombosRoute ? styles.active : undefined;

  return (
    <nav className={styles.navbar} aria-label="Navegación principal">
      {/* .brand y .brand-icon son globales: los comparte con Footer */}
      <Link to="/" className="brand" aria-label="Burger Zone, inicio">
        <span className="brand-icon">B</span>
        <span>
          Burger
          <strong>Zone</strong>
        </span>
      </Link>

      <div className={styles.navLinks}>
        <NavLink to="/" end className={linkClassName}>
          Inicio
        </NavLink>
        <NavLink
          to="/menu"
          end
          className={menuClassName}
          aria-current={isCombosRoute ? 'false' : 'page'}
        >
          Menú
        </NavLink>
        {/* En /menu sin filtro el activo es "Menú", no "Combos". */}
        <NavLink
          to="/menu?categoria=combos"
          className={combosClassName}
          aria-current={isCombosRoute ? 'page' : 'false'}
        >
          Combos
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
