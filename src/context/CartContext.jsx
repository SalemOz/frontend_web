import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  CART_STORAGE_KEY,
  calculateCount,
  calculateSubtotal,
  calculateUnitPrice,
  createLineId,
  normalizeOptions,
  parseStoredCart,
} from '../utils/cart.js';
import { categories, products } from '../data/menu.js';

const CartContext = createContext(null);
const validProductIds = new Set(products.map((product) => product.id));
const categoryNames = new Map(categories.map((category) => [category.id, category.name]));

const readInitialItems = () => {
  try {
    return parseStoredCart(
      window.localStorage.getItem(CART_STORAGE_KEY),
      validProductIds,
    );
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(readInitialItems);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Sin localStorage disponible el carrito sigue funcionando en memoria.
    }
  }, [items]);

  /**
   * @param {object} product producto de src/data/menu.js
   * @param {Array<{id: string, name: string, price: number}>} options adicionales elegidos
   * @param {string} note nota libre para la cocina
   */
  const addItem = useCallback((product, options = [], note = '') => {
    const selectedOptions = normalizeOptions(options);
    const lineId = createLineId(product.id, selectedOptions, note);
    const cleanNote = typeof note === 'string' ? note.trim() : '';

    setItems((current) => {
      const existing = current.find((line) => line.lineId === lineId);

      if (existing) {
        return current.map((line) =>
          line.lineId === lineId ? { ...line, qty: line.qty + 1 } : line,
        );
      }

      return [
        ...current,
        {
          lineId,
          productId: product.id,
          name: product.name,
          unitPrice: calculateUnitPrice(product.price, selectedOptions),
          qty: 1,
          options: selectedOptions,
          note: cleanNote,
          image: product.image ?? '',
          categoryName: categoryNames.get(product.categoryId) ?? '',
        },
      ];
    });
  }, []);

  const increase = useCallback((lineId) => {
    setItems((current) =>
      current.map((line) =>
        line.lineId === lineId ? { ...line, qty: line.qty + 1 } : line,
      ),
    );
  }, []);

  const decrease = useCallback((lineId) => {
    setItems((current) =>
      current.flatMap((line) => {
        if (line.lineId !== lineId) return [line];
        return line.qty > 1 ? [{ ...line, qty: line.qty - 1 }] : [];
      }),
    );
  }, []);

  const remove = useCallback((lineId) => {
    setItems((current) => current.filter((line) => line.lineId !== lineId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => calculateCount(items), [items]);
  const subtotal = useMemo(() => calculateSubtotal(items), [items]);

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      addItem,
      increase,
      decrease,
      remove,
      clear,
    }),
    [items, count, subtotal, addItem, increase, decrease, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }

  return context;
}
