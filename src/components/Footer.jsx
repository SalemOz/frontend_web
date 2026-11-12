import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import SocialLinks from './SocialLinks.jsx';
import Icon from './Icon.jsx';
import { business } from '../data/business.js';
import { whatsappContactUrl } from '../utils/whatsapp.js';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        {/* .brand es global: lo comparte con Navbar */}
        <Link to="/" className="brand" aria-label="Delicias al Carbón, inicio">
          <img src="/brand/logo-delicias-192.png" alt="" width="96" height="96" loading="lazy" />
          <span>
            Delicias
            <strong>al Carbón</strong>
          </span>
        </Link>

        <div>
          <h2>Horario</h2>
          <p>{business.days}</p>
          <p>{business.hours.label}</p>
        </div>

        <div>
          <h2>Contacto</h2>
          <p>{business.address}</p>
          <a href={`tel:${business.phone.tel}`}>{business.phone.display}</a>
          <a
            href={whatsappContactUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Escríbenos por WhatsApp (se abre en una pestaña nueva)"
          >
            <Icon name="whatsapp" /> Escríbenos por WhatsApp
          </a>
          <SocialLinks />
        </div>
      </div>

      <div className={styles.copyright}>
        © {new Date().getFullYear()} {business.name}. Todos los derechos reservados.
      </div>
    </footer>
  );
}
