import { useRef } from 'react';
import { useTransitionNavigate } from '../motion/transitionContext.js';
import { gsap, ScrollTrigger, useGSAP } from '../motion/gsap.js';
import { useMotion } from '../motion/useMotion.js';
import { distance, duration, ease, stagger } from '../motion/tokens.js';
import Hero from '../components/Hero.jsx';
import Marquee from '../components/Marquee.jsx';
import Categories from '../components/Categories.jsx';
import Favorites from '../components/Favorites.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAddedFeedback } from '../hooks/useAddedFeedback.js';
import { getProductGroups } from '../utils/product.js';
import { notify } from '../lib/uikit.js';

// Títulos de sección y tarjetas de categorías (data-reveal) y tarjetas de Recomendados.
const REVEAL_TARGETS = '[data-reveal], #favoritos [data-product-id]';

export default function Home() {
  const { addItem } = useCart();
  const navigate = useTransitionNavigate();
  const [addedId, markAdded] = useAddedFeedback();
  const { reduced } = useMotion();
  const pageRef = useRef(null);

  // Aparición al bajar, una sola vez por elemento, a ~85 % del alto de la ventana.
  // Se ocultan con gsap.set antes del primer pintado; con "reducir movimiento" no se tocan.
  useGSAP(
    () => {
      if (reduced) return;
      const targets = gsap.utils.toArray(REVEAL_TARGETS, pageRef.current);
      // transition: none mientras anima (las tarjetas traen transition: transform en CSS);
      // al terminar se borran los estilos en línea para que vuelva su hover de CSS.
      gsap.set(targets, { opacity: 0, y: distance.reveal, transition: 'none' });
      ScrollTrigger.batch(targets, {
        start: 'top 85%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: duration.base,
            ease: ease.out,
            stagger: stagger.reveal,
            overwrite: true,
            clearProps: 'opacity,transform,transition',
          }),
      });
    },
    { scope: pageRef, dependencies: [reduced] },
  );

  // El panel de personalización vive en el Menú: los productos con opciones se abren allí.
  const selectProduct = (product) => {
    if (getProductGroups(product).length > 0) {
      navigate(`/menu?producto=${product.id}`);
      return;
    }

    addItem(product);
    markAdded(product.id);
    notify(`Agregado: ${product.name} ×1`);
  };

  return (
    <div ref={pageRef}>
      <Hero />
      <Marquee />
      <Categories />
      <Favorites addedId={addedId} onSelect={selectProduct} />
    </div>
  );
}
