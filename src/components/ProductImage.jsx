import { useState } from 'react';
import styles from './ProductImage.module.css';

// Tamaño real de las fotos (public/productos, 800×800): reserva el espacio y evita saltos.
const PHOTO_SIZE = 800;

/**
 * Foto de un producto o, si no hay foto (o no carga), un relleno con el logo del local.
 * El alto lo define quien lo usa (className).
 * `priority`: para las fotos de la primera pantalla (sin carga diferida).
 */
export default function ProductImage({ image, alt = '', className, priority = false }) {
  // Se recuerda qué URL falló: si cambia la foto, se vuelve a intentar sola.
  const [failedSrc, setFailedSrc] = useState(null);
  const showPhoto = Boolean(image) && failedSrc !== image;

  return (
    <span className={`${styles.frame} ${className ?? ''}`}>
      {showPhoto ? (
        <img
          className={styles.image}
          src={image}
          alt={alt}
          width={PHOTO_SIZE}
          height={PHOTO_SIZE}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onError={() => setFailedSrc(image)}
        />
      ) : (
        <span className={styles.placeholder} aria-hidden="true">
          <img src="/brand/logo-delicias-192.png" alt="" loading="lazy" decoding="async" />
        </span>
      )}
    </span>
  );
}
