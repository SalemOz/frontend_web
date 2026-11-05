import { formatPrice } from '../data/menu.js';
import ProductImage from './ProductImage.jsx';
import styles from './ProductCard.module.css';

export default function ProductCard({ product, categoryName, onAdd }) {
  return (
    <article className={styles.productCard}>
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
          className={`btn-primary ${styles.addButton}`}
          onClick={() => onAdd(product)}
        >
          <span uk-icon="icon: cart" /> Agregar al carrito
        </button>
      </div>
    </article>
  );
}
