import { useEffect, useRef, useState } from 'react';
import { formatPrice } from '../data/menu.js';
import ProductImage from './ProductImage.jsx';
import styles from './ProductCard.module.css';

const ADDED_FEEDBACK_MS = 1500;

export default function ProductCard({ product, categoryName, onAdd }) {
  const [justAdded, setJustAdded] = useState(false);
  const feedbackTimeout = useRef(null);

  useEffect(() => () => clearTimeout(feedbackTimeout.current), []);

  const handleAdd = () => {
    onAdd(product);
    setJustAdded(true);
    clearTimeout(feedbackTimeout.current);
    feedbackTimeout.current = setTimeout(() => setJustAdded(false), ADDED_FEEDBACK_MS);
  };

  return (
    <article className={styles.productCard} data-product-id={product.id}>
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
          className={`btn-primary ${styles.addButton} ${justAdded ? styles.added : ''}`}
          onClick={handleAdd}
          data-add-button
        >
          {/* El icono no se desmonta: UIkit le inyecta el SVG. */}
          <span uk-icon="icon: cart" aria-hidden="true" />
          <span aria-live="polite">
            {justAdded ? 'Agregado ✓' : 'Agregar al carrito'}
          </span>
        </button>
      </div>
    </article>
  );
}
