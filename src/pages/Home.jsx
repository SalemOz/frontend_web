import Hero from '../components/Hero.jsx';
import Categories from '../components/Categories.jsx';
import Drinks from '../components/Drinks.jsx';
import Combos from '../components/Combos.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Home() {
  const { addItem } = useCart();

  return (
    <>
      <Hero />
      <Categories />
      <Drinks />
      <Combos onAdd={addItem} />
    </>
  );
}
