import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { categories, products } from '../data/menu.js';
import { business } from '../data/business.js';
import ProductCard from '../components/ProductCard.jsx';
import MiniCart from '../components/MiniCart.jsx';
import ProductPanel from '../components/ProductPanel.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAddedFeedback } from '../hooks/useAddedFeedback.js';
import { getProductGroups } from '../utils/product.js';
import styles from './Menu.module.css';

// Sin tildes ni mayúsculas: "clasica" encuentra "Clásica".
const normalizeText = (text) =>
  text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

const searchIndex = products.map((product) => ({
  product,
  text: normalizeText(`${product.name} ${product.description}`),
}));

const groupByCategory = (items) =>
  categories
    .map((category) => ({
      category,
      items: items.filter((product) => product.categoryId === category.id),
    }))
    .filter((group) => group.items.length > 0);

const subcategoriesOf = (items) => [
  ...new Set(items.map((product) => product.subcategory).filter(Boolean)),
];

const menuHref = (categoryId, query) => {
  const params = new URLSearchParams();
  if (categoryId) params.set('categoria', categoryId);
  if (query) params.set('q', query);
  const search = params.toString();
  return search ? `/menu?${search}` : '/menu';
};

// Layout no mueve el scroll ni el foco cuando la navegación trae este estado.
const KEEP_FOCUS = { replace: true, state: { keepFocus: true } };

// overlay: la entrada del historial es el panel abierto sobre la misma página.
// openedHere distingue el panel abierto con un clic del que llega por enlace directo.
const PANEL_STATE = { keepFocus: true, overlay: true, openedHere: true };

export default function Menu() {
  const { addItem } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [addedId, markAdded] = useAddedFeedback();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabsRef = useRef(null);
  const searchInputRef = useRef(null);

  const selectedCategory =
    categories.find((category) => category.id === searchParams.get('categoria')) ?? null;
  const urlQuery = searchParams.get('q') ?? '';

  // El input manda; la URL es su copia. Solo se adopta el ?q= de la URL cuando
  // el cambio viene de fuera (un enlace, Atrás), no de lo que se está escribiendo.
  const [query, setQuery] = useState(urlQuery);
  const [seenUrlQuery, setSeenUrlQuery] = useState(urlQuery);
  if (urlQuery !== seenUrlQuery) {
    setSeenUrlQuery(urlQuery);
    if (!location.state?.keepFocus) setQuery(urlQuery);
  }

  const searchText = query.trim();
  const normalizedQuery = normalizeText(query);
  const isSearching = normalizedQuery !== '';

  let visibleProducts = products;
  if (isSearching) {
    visibleProducts = searchIndex
      .filter((entry) => entry.text.includes(normalizedQuery))
      .map((entry) => entry.product);
  } else if (selectedCategory) {
    visibleProducts = products.filter(
      (product) => product.categoryId === selectedCategory.id,
    );
  }
  const groups = groupByCategory(visibleProducts);
  const resultCount = visibleProducts.length;

  let searchStatus = '';
  if (isSearching && resultCount === 0) {
    searchStatus = `No encontramos «${searchText}». Prueba con otra palabra o mira todas las categorías.`;
  } else if (isSearching) {
    searchStatus = `${resultCount} ${resultCount === 1 ? 'resultado' : 'resultados'} para «${searchText}»`;
  }

  const updateQuery = (value) => {
    setQuery(value);
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (value.trim()) next.set('q', value);
      else next.delete('q');
      return next;
    }, KEEP_FOCUS);
  };

  const clearSearch = () => {
    updateQuery('');
    searchInputRef.current?.focus();
  };

  const showWholeMenu = () => {
    setQuery('');
    setSearchParams({}, KEEP_FOCUS);
    searchInputRef.current?.focus();
  };

  // Un ?producto= que no exista se ignora.
  const panelProduct =
    products.find((product) => product.id === searchParams.get('producto')) ?? null;

  const selectProduct = (product) => {
    if (getProductGroups(product).length === 0) {
      addItem(product);
      markAdded(product.id);
      return;
    }

    const next = new URLSearchParams(searchParams);
    next.set('producto', product.id);
    setSearchParams(next, { state: PANEL_STATE });
  };

  const closePanel = () => {
    if (!searchParams.has('producto')) return;

    // Abierto desde esta página: Atrás devuelve a la URL anterior.
    if (location.state?.openedHere) {
      navigate(-1);
      return;
    }

    // Enlace directo: no hay entrada anterior a la que volver.
    const next = new URLSearchParams(searchParams);
    next.delete('producto');
    setSearchParams(next, KEEP_FOCUS);
  };

  const addFromPanel = (product, options, note, quantity) => {
    addItem(product, options, note, quantity);
    markAdded(product.id);
  };

  useEffect(() => {
    const originalTitle = document.title;
    return () => {
      document.title = originalTitle;
    };
  }, []);

  const pageName = selectedCategory?.name ?? 'Menú';
  useEffect(() => {
    document.title = `${pageName} | ${business.name}`;
  }, [pageName]);

  useEffect(() => {
    tabsRef.current
      ?.querySelector('[aria-current="page"]')
      ?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, [selectedCategory]);

  const productGrid = (items, categoryName) => (
    <div className="product-grid">
      {items.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          categoryName={categoryName}
          isAdded={addedId === product.id}
          onSelect={selectProduct}
        />
      ))}
    </div>
  );

  const tab = (category) => {
    const isActive = (category?.id ?? null) === (selectedCategory?.id ?? null);
    return (
      <Link
        key={category?.id ?? 'todo'}
        to={menuHref(category?.id, urlQuery)}
        className={isActive ? styles.activeTab : styles.tab}
        aria-current={isActive ? 'page' : undefined}
      >
        {category?.name ?? 'Todo'}
      </Link>
    );
  };

  return (
    <section className={styles.page}>
      <div className="container">
        <span className="eyebrow">NUESTRA CARTA</span>
        <h1 className="page-title">Menú</h1>
        <p className={styles.intro}>
          Elige una categoría o busca un producto. Los precios están en pesos
          colombianos.
        </p>

        <form
          className={styles.search}
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <label htmlFor="menu-search" className="visually-hidden">
            Buscar en el menú
          </label>
          <input
            id="menu-search"
            ref={searchInputRef}
            type="search"
            placeholder="Buscar en el menú"
            autoComplete="off"
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
          />
          {query !== '' && (
            <button
              type="button"
              className={styles.clearSearch}
              onClick={clearSearch}
              aria-label="Borrar búsqueda"
            >
              <span aria-hidden="true">×</span>
            </button>
          )}
        </form>
      </div>

      <div className={styles.tabsBar}>
        <nav
          ref={tabsRef}
          className={`container ${styles.tabs}`}
          aria-label="Categorías del menú"
        >
          {tab(null)}
          {categories.map(tab)}
        </nav>
      </div>

      <div className={`container ${styles.content}`}>
        <p className={styles.searchStatus} role="status" aria-live="polite">
          {searchStatus}
        </p>

        {isSearching && resultCount === 0 && (
          <button type="button" className="btn-primary" onClick={showWholeMenu}>
            Ver todo el menú
          </button>
        )}

        {groups.map(({ category, items }) => {
          const subcategories = subcategoriesOf(items);
          const titleId = `cat-${category.id}-title`;

          return (
            <section
              key={category.id}
              id={`cat-${category.id}`}
              className={styles.category}
              aria-labelledby={titleId}
              data-category-id={category.id}
            >
              <header className={styles.categoryHeader}>
                <h2 id={titleId}>{category.name}</h2>
                <p>{category.description}</p>
              </header>

              {subcategories.length === 0
                ? productGrid(items, category.name)
                : subcategories.map((subcategory) => (
                    <section className={styles.subcategory} key={subcategory}>
                      <h3>{subcategory}</h3>
                      {productGrid(
                        items.filter((product) => product.subcategory === subcategory),
                        category.name,
                      )}
                    </section>
                  ))}
            </section>
          );
        })}
      </div>

      <MiniCart />

      <ProductPanel
        product={panelProduct}
        categoryName={
          categories.find((category) => category.id === panelProduct?.categoryId)?.name
        }
        onAdd={addFromPanel}
        onClose={closePanel}
      />
    </section>
  );
}
