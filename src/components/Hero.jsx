import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import styles from './Hero.module.css';

// El video pesa 8,7 MB: solo se reproduce en pantallas medianas o grandes, sin
// "reducir movimiento" ni ahorro de datos. En el resto queda el póster.
const VIDEO_QUERY = '(min-width: 768px) and (prefers-reduced-motion: no-preference)';
// shortcut: se decide al montar; girar o redimensionar no lo reevalúa hasta volver a Inicio.
const shouldPlayVideo = () =>
  window.matchMedia(VIDEO_QUERY).matches && !navigator.connection?.saveData;

const POSTER_URL =
  'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=1280&q=75';

export default function Hero() {
  const [playVideo] = useState(shouldPlayVideo);

  return (
    <section className={styles.hero} id="inicio">
      <video
        className={styles.heroVideo}
        autoPlay={playVideo}
        muted
        loop
        playsInline
        preload={playVideo ? 'metadata' : 'none'}
        poster={POSTER_URL}
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
          EXPLORAR MENÚ <Icon name="arrow-right" />
        </Link>
      </div>

      <div className={styles.heroBadge}>
        <span>★</span>
        Sabor en cada
        <strong>bocado</strong>
      </div>
    </section>
  );
}
