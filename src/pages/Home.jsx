import { useRef } from 'react';
import { useTransitionNavigate } from '../motion/transitionContext.js';
import { gsap, useGSAP } from '../motion/gsap.js';
import { useMotion } from '../motion/useMotion.js';
import { revealOnScroll } from '../motion/reveal.js';
import { cancelFlights, flyToCart } from '../motion/cartFlight.js';
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

  // Aparición al bajar (src/motion/reveal.js); con "reducir movimiento" no se tocan.
  useGSAP(
    () => {
      if (reduced) return undefined;
      revealOnScroll(gsap.utils.toArray(REVEAL_TARGETS, pageRef.current));
      return cancelFlights;
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
    // El carrito ya está actualizado; el vuelo es solo visual.
    flyToCart({
      from: pageRef.current?.querySelector(`[data-product-id="${product.id}"] img`),
      image: product.image,
    });
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
