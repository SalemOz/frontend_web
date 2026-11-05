import ProductCard from './ProductCard.jsx';
import styles from './Combos.module.css';
import { products } from '../data/menu.js';

const comboProducts = products.filter((product) => product.categoryId === 'combos');

export default function Combos({ onAdd }) {
  return (
    <section className={styles.combosSection} id="combos">
      <div className="container">
        <div className={styles.combosHeading}>
          <div>
            {/* .eyebrow es global: lo comparte con Hero */}
            <span className="eyebrow">PARA COMPARTIR</span>
            <h2>
              COMBOS <em>ESPECIALES</em>
            </h2>
          </div>
          <p>Más sabor, más comida y todo lo que te gusta.</p>
        </div>

        {/* .product-grid es global: lo comparte con Favoritos */}
        <div className="product-grid">
          {comboProducts.map((combo) => (
            <ProductCard
              key={combo.id}
              product={combo}
              onAdd={onAdd}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
