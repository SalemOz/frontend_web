import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero.jsx';
import Categories from '../components/Categories.jsx';
import Favorites from '../components/Favorites.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAddedFeedback } from '../hooks/useAddedFeedback.js';
import { getProductGroups } from '../utils/product.js';
import { notify } from '../lib/uikit.js';

export default function Home() {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [addedId, markAdded] = useAddedFeedback();

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
    <>
      <Hero />
      <Categories />
      <Favorites addedId={addedId} onSelect={selectProduct} />
    </>
  );
}
