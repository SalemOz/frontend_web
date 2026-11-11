import Hero from '../components/Hero.jsx';
import Categories from '../components/Categories.jsx';
import Favorites from '../components/Favorites.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Home() {
  const { addItem } = useCart();

  return (
    <>
      <Hero />
      <Categories />
      <Favorites onAdd={addItem} />
    </>
  );
}
