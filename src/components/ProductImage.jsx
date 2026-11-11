import styles from './ProductImage.module.css';

/**
 * Foto de un producto o recuadro de relleno con el nombre de su categoría
 * mientras no haya fotos reales. El alto lo define quien lo usa (className).
 */
export default function ProductImage({ image, alt = '', label = 'Producto', className }) {
  return (
    <span className={`${styles.frame} ${className ?? ''}`}>
      {image ? (
        <img className={styles.image} src={image} alt={alt} />
      ) : (
        <span className={styles.placeholder} aria-hidden="true">
          {label}
        </span>
      )}
    </span>
  );
}
