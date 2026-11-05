import { Link } from 'react-router-dom';
import SectionHeading from './SectionHeading.jsx';
import styles from './Categories.module.css';
import { categories } from '../data/menu.js';

// Solo estas categorías se destacan en el inicio; el resto vive en /menu.
const featuredCategoryIds = ['hamburguesas', 'perros', 'salchipapas', 'fritos'];
const featuredCategories = categories.filter((category) =>
  featuredCategoryIds.includes(category.id),
);

export default function Categories() {
  return (
    <section className={styles.categoriesSection} id="menu">
      <div className="container">
        <SectionHeading
          eyebrow="NUESTRAS CATEGORÍAS"
          title="¿Qué se te antoja hoy?"
        />

        <div className={styles.categoryGrid}>
          {featuredCategories.map((category) => (
            <Link
              className={styles.categoryCard}
              to={`/menu?categoria=${category.id}`}
              key={category.id}
            >
              <img src={category.image} alt={category.name} />
              <div className={styles.categoryInfo}>
                <span className={styles.categoryIcon}>{category.icon}</span>
                <div>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </div>
                <span className={styles.roundArrow}>↗</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
