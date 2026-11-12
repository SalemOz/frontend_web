import styles from './ProductImage.module.css';

/**
 * Foto de un producto o, mientras no haya fotos reales, un relleno con el
 * logo del local. El alto lo define quien lo usa (className).
 */
export default function ProductImage({ image, alt = '', className }) {
  return (
    <span className={`${styles.frame} ${className ?? ''}`}>
      {image ? (
        <img className={styles.image} src={image} alt={alt} loading="lazy" decoding="async" />
      ) : (
        <span className={styles.placeholder} aria-hidden="true">
          <img src="/brand/logo-delicias-192.png" alt="" loading="lazy" decoding="async" />
        </span>
      )}
    </span>
  );
}
