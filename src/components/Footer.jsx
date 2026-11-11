import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import SocialLinks from './SocialLinks.jsx';
import { business } from '../data/business.js';

export default function Footer() {
  return (
    <footer className={styles.footer} id="contacto">
      <div className={`container ${styles.footerGrid}`}>
        {/* .brand y .brand-icon son globales: los comparte con Navbar */}
        <Link to="/" className="brand" aria-label="Delicias al Carbón, inicio">
          <span className="brand-icon">D</span>
          <span>
            Delicias
            <strong>al Carbón</strong>
          </span>
        </Link>

        <div>
          <h3>Enlaces</h3>
          <Link to="/">Inicio</Link>
          <Link to="/menu">Menú</Link>
          <Link to="/menu?categoria=bebidas">Bebidas</Link>
        </div>

        <div>
          <h3>Horario</h3>
          <p>{business.days}</p>
          <p>{business.hours.label}</p>
        </div>

        <div>
          <h3>Contacto</h3>
          <p>{business.address}</p>
          <a href={`tel:${business.phone.tel}`}>{business.phone.display}</a>
          <p>@deliciasalcarbon.com</p>
          <SocialLinks />
        </div>
      </div>

      <div className={styles.copyright}>
        © {new Date().getFullYear()} {business.name}. Todos los derechos reservados.
      </div>
    </footer>
  );
}
