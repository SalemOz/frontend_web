import { formatPrice } from '../data/menu.js';
import { getProductGroups } from '../utils/product.js';
import ProductImage from './ProductImage.jsx';
import styles from './ProductCard.module.css';

/**
 * onSelect(product) lo decide quien la usa: abrir el panel si el producto
 * tiene opciones, o agregarlo directo si no.
 */
export default function ProductCard({ product, categoryName, isAdded = false, onSelect }) {
  const isCustomizable = getProductGroups(product).length > 0;
  const handleSelect = () => onSelect(product);

  let buttonLabel = isCustomizable ? 'Personalizar' : 'Agregar al carrito';
  if (isAdded) buttonLabel = 'Agregado ✓';

  return (
    // En los personalizables toda la tarjeta abre el panel; el clic del botón
    // burbujea hasta aquí, así que el botón sigue siendo el único control de teclado.
    <article
      className={`${styles.productCard} ${isCustomizable ? styles.clickable : ''}`}
      data-product-id={product.id}
      onClick={isCustomizable ? handleSelect : undefined}
    >
      <ProductImage
        image={product.image}
        alt={product.name}
        label={categoryName}
        className={styles.productImage}
      />
      <div className={styles.productInfo}>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        {product.ageRestricted ? (
          <span className={styles.ageRestricted}>Solo mayores de 18</span>
        ) : null}
        <strong className={styles.price}>{formatPrice(product.price)}</strong>
        <button
          type="button"
          className={`btn-primary ${styles.addButton} ${isAdded ? styles.added : ''}`}
          onClick={isCustomizable ? undefined : handleSelect}
          data-add-button
        >
          {/* El icono no se desmonta: UIkit le inyecta el SVG. */}
          <span uk-icon="icon: cart" aria-hidden="true" />
          <span aria-live="polite">{buttonLabel}</span>
        </button>
      </div>
    </article>
  );
}
