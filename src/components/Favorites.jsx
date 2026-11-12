import { useRef } from 'react';
import SectionHeading from './SectionHeading.jsx';
import ProductCard from './ProductCard.jsx';
import styles from './Favorites.module.css';
import { products } from '../data/menu.js';
import { gsap, useGSAP } from '../motion/gsap.js';
import { useMotion } from '../motion/useMotion.js';
import { distance, duration, ease } from '../motion/tokens.js';

const recommendedProductIds = [
  'hamb-clasica',
  'salchipapa-sencilla',
  'perro-americano',
  'choripapa-de-la-casa',
];

const recommendedProducts = recommendedProductIds
  .map((id) => products.find((product) => product.id === id))
  .filter(Boolean);

/** Inclina la tarjeta hacia el cursor y la eleva. Devuelve la limpieza de eventos. */
const tiltCard = (card, contextSafe) => {
  // La perspectiva y la transición (solo del borde) vienen de Favorites.module.css.
  const options = { duration: duration.fast, ease: ease.out };
  const rotateX = gsap.quickTo(card, 'rotationX', options);
  const rotateY = gsap.quickTo(card, 'rotationY', options);
  const lift = gsap.quickTo(card, 'y', options);

  const onMove = contextSafe((event) => {
    const box = card.getBoundingClientRect();
    // -0,5 … 0,5 según dónde esté el cursor dentro de la tarjeta.
    const px = (event.clientX - box.left) / box.width - 0.5;
    const py = (event.clientY - box.top) / box.height - 0.5;
    rotateY(px * 2 * distance.tiltDeg);
    rotateX(-py * 2 * distance.tiltDeg);
    lift(-distance.tiltLift);
  });
  const onLeave = contextSafe(() => {
    rotateX(0);
    rotateY(0);
    lift(0);
  });

  card.addEventListener('pointermove', onMove);
  card.addEventListener('pointerleave', onLeave);
  return () => {
    card.removeEventListener('pointermove', onMove);
    card.removeEventListener('pointerleave', onLeave);
  };
};

export default function Favorites({ addedId, onSelect }) {
  const { reduced, isDesktop, finePointer } = useMotion();
  const sectionRef = useRef(null);

  // Solo en escritorio con mouse y sin "reducir movimiento"; solo transform.
  useGSAP(
    (context, contextSafe) => {
      if (reduced || !isDesktop || !finePointer) return undefined;
      const cleanups = gsap.utils
        .toArray('[data-product-id]', sectionRef.current)
        .map((card) => tiltCard(card, contextSafe));
      return () => cleanups.forEach((cleanup) => cleanup());
    },
    { scope: sectionRef, dependencies: [reduced, isDesktop, finePointer], revertOnUpdate: true },
  );

  return (
    <section ref={sectionRef} className={styles.favoritesSection} id="favoritos">
      <div className="container">
        <SectionHeading
          eyebrow="SELECCIÓN DE LA CASA"
          title="Recomendados de la casa"
          light
        />
        {/* .product-grid vive en global.css. */}
        <div className="product-grid">
          {recommendedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isAdded={addedId === product.id}
              onSelect={onSelect}
              imagePriority
            />
          ))}
        </div>
      </div>
    </section>
  );
}
