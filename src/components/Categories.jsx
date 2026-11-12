import { Link } from 'react-router-dom';
import SectionHeading from './SectionHeading.jsx';
import styles from './Categories.module.css';
import { categories } from '../data/menu.js';
import ProductImage from './ProductImage.jsx';

export default function Categories() {
  return (
    <section className={styles.categoriesSection} id="menu">
      <div className="container">
        <SectionHeading
          title="¿Qué se te antoja hoy?"
        />

        <div className={styles.categoryGrid}>
          {categories.map((category) => (
            <Link
              className={styles.categoryCard}
              data-reveal
              to={`/menu?categoria=${category.id}`}
              key={category.id}
            >
              <ProductImage
                image={category.image}
                alt={category.name}
                className={styles.categoryImage}
              />
              <div className={styles.categoryInfo}>
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
