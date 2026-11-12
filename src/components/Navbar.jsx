import { useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import Icon from './Icon.jsx';
import StatusChip from './StatusChip.jsx';
import { useBusinessStatus } from '../hooks/useBusinessStatus.js';
import { whatsappContactUrl } from '../utils/whatsapp.js';
import styles from './Navbar.module.css';

const linkClassName = ({ isActive }) => (isActive ? styles.active : undefined);

export default function Navbar() {
  const { count } = useCart();
  const status = useBusinessStatus();
  const navRef = useRef(null);

  // Publica el alto real del navbar para lo que se pega debajo (pestañas del menú, resumen).
  useEffect(() => {
    const nav = navRef.current;
    const publishHeight = () => {
      document.documentElement.style.setProperty('--navbar-height', `${nav.offsetHeight}px`);
    };
    publishHeight();
    const observer = new ResizeObserver(publishHeight);
    observer.observe(nav);
    return () => observer.disconnect();
  }, []);

  return (
    <nav ref={navRef} className={styles.navbar} aria-label="Navegación principal">
      {/* .brand es global: lo comparte con Footer */}
      <Link to="/" className="brand" aria-label="Delicias al Carbón, inicio">
        <img src="/brand/logo-delicias-192.png" alt="" width="44" height="44" />
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
        <a
          href={whatsappContactUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contacto por WhatsApp (se abre en una pestaña nueva)"
        >
          Contacto
        </a>
      </div>

      {/* Escritorio: estado junto al carrito. Hasta 900 px el estado baja a una franja propia. */}
      <div className={styles.actions}>
        <div className={styles.statusSlot}>
          <StatusChip status={status} announce />
        </div>
        <Link
          to="/carrito"
          className={styles.cartLink}
          aria-label="Ir al carrito de compras"
        >
          <Icon name="cart" ratio={1.3} />
          <span className={styles.cartCount} aria-live="polite">{count}</span>
        </Link>
      </div>
    </nav>
  );
}
