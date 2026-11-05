import { Link, useSearchParams } from 'react-router-dom';
import { categories, formatPrice, products } from '../data/menu.js';
import styles from './Menu.module.css';

const isValidCategory = (categoryId) =>
  categories.some((category) => category.id === categoryId);

export default function Menu() {
  const [searchParams] = useSearchParams();
  const requestedCategory = searchParams.get('categoria');
  const selectedCategory = isValidCategory(requestedCategory)
    ? requestedCategory
    : null;

  const visibleProducts = selectedCategory
    ? products.filter((product) => product.categoryId === selectedCategory)
    : products;

  const filterClassName = (categoryId) =>
    categoryId === selectedCategory ? styles.activeFilter : styles.filter;

  return (
    <section className={styles.page}>
      <div className="container">
        <span className="eyebrow">NUESTRA CARTA</span>
        <h1 className={styles.title}>Menú</h1>
        <p className={styles.intro}>
          Elige una categoría para ver sus productos. Los precios están en pesos
          colombianos.
        </p>

        <nav className={styles.filters} aria-label="Categorías del menú">
          <Link
            to="/menu"
            className={filterClassName(null)}
            aria-current={selectedCategory === null ? 'page' : undefined}
          >
            Todo
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/menu?categoria=${category.id}`}
              className={filterClassName(category.id)}
              aria-current={selectedCategory === category.id ? 'page' : undefined}
            >
              {category.name}
            </Link>
          ))}
        </nav>

        {visibleProducts.length === 0 ? (
          <p className={styles.empty}>
            Todavía no hay productos cargados en esta categoría.
          </p>
        ) : (
          <ul className={styles.list}>
            {visibleProducts.map((product) => (
              <li className={styles.item} key={product.id}>
                <div>
                  <h2 className={styles.itemName}>{product.name}</h2>
                  <p className={styles.itemDescription}>{product.description}</p>
                </div>
                <strong className={styles.itemPrice}>
                  {formatPrice(product.price)}
                </strong>
              </li>
            ))}
          </ul>
        )}

        <p className={styles.note}>
          Los adicionales y el armado completo del menú se agregan en la
          siguiente fase.
        </p>
      </div>
    </section>
  );
}
