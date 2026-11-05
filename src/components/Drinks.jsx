import SectionHeading from './SectionHeading.jsx';
import styles from './Drinks.module.css';
import { products } from '../data/menu.js';

const drinkProducts = products.filter((product) => product.categoryId === 'bebidas');

export default function Drinks() {
  return (
    <section className={styles.drinksSection} id="bebidas">
      <div className="container">
        <SectionHeading
          eyebrow="BEBIDAS REFRESCANTES"
          title="Para acompañar tu comida"
          light
        />
        <div className={styles.drinksGrid}>
          {drinkProducts.map((drink) => (
            <article className={styles.drinkCard} key={drink.id}>
              <img src={drink.image} alt={drink.name} />
              <div className={styles.drinkInfo}>
                <span className={styles.drinkIcon}>✳</span>
                <div>
                  <h3>{drink.name}</h3>
                  <p>{drink.description}</p>
                </div>
              </div>
            </article>
          ))}

          <div className={styles.drinkPromo}>
            <span>EL COMPLEMENTO</span>
            <h3>PERFECTO PARA TU COMIDA</h3>
            <p>Encuentra tu bebida favorita</p>
          </div>
        </div>
      </div>
    </section>
  );
}
