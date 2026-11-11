import { Link, useSearchParams } from 'react-router-dom';
import { categories, products } from '../data/menu.js';
import ProductCard from '../components/ProductCard.jsx';
import { useCart } from '../context/CartContext.jsx';
import styles from './Menu.module.css';

const isValidCategory = (categoryId) =>
  categories.some((category) => category.id === categoryId);

export default function Menu() {
  const { addItem } = useCart();
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

  const selectedCategoryName = categories.find(
    (category) => category.id === selectedCategory,
  )?.name;

  const productGrid = (items) => (
    <div className="product-grid">
      {items.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          categoryName={categories.find((category) => category.id === product.categoryId)?.name}
          onAdd={addItem}
        />
      ))}
    </div>
  );

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
          <div className={styles.products}>
            {selectedCategoryName ? (
              <h2 className={styles.categoryTitle}>{selectedCategoryName}</h2>
            ) : null}
            {selectedCategory === 'papas' ? (
              ['Salchipapas', 'Choripapas'].map((subcategory) => {
                const subcategoryProducts = visibleProducts.filter(
                  (product) => product.subcategory === subcategory,
                );

                return (
                  <section className={styles.subcategory} key={subcategory}>
                    <h3>{subcategory}</h3>
                    {productGrid(subcategoryProducts)}
                  </section>
                );
              })
            ) : productGrid(visibleProducts)}
          </div>
        )}

        <p className={styles.note}>
          Los adicionales y el armado completo del menú se agregan en la
          siguiente fase.
        </p>
      </div>
    </section>
  );
}
