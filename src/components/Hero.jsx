import { Link } from 'react-router-dom';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero} id="inicio">
      <video
        className={styles.heroVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=1800&q=90"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="/videos/hero-burger.mp4" type="video/mp4" />
      </video>
      <div className={styles.heroContent}>
        <span className="eyebrow">HECHO AL CARBÓN</span>
        <h1>
          Sabor al <em>carbón</em>, sin esperas.
        </h1>
        <p>
          Hamburguesas, perros, salchipapas, patacolos y platos a la parrilla.
          Elige, personaliza y pide en menos de un minuto.
        </p>
        <Link to="/menu" className="btn-primary">
          EXPLORAR MENÚ <span uk-icon="arrow-right"></span>
        </Link>
      </div>
    </section>
  );
}
