import SectionHeading from './SectionHeading.jsx';
import ProductCard from './ProductCard.jsx';
import styles from './Favorites.module.css';
import { categories, products } from '../data/menu.js';

const recommendedProductIds = [
  'hamb-clasica',
  'salchipapa-sencilla',
  'perro-americano',
  'choripapa-de-la-casa',
];

const categoryNames = new Map(categories.map((category) => [category.id, category.name]));
const recommendedProducts = recommendedProductIds
  .map((id) => products.find((product) => product.id === id))
  .filter(Boolean);

export default function Favorites({ onAdd }) {
  return (
    <section className={styles.favoritesSection} id="favoritos">
      <div className="container">
        <SectionHeading
          eyebrow="SELECCIÓN DE LA CASA"
          title="Recomendados de la casa"
        />
        {/* .product-grid vive en global.css. */}
        <div className="product-grid">
          {recommendedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryName={categoryNames.get(product.categoryId)}
              onAdd={onAdd}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
