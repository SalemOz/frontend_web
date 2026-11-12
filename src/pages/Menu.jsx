import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { categories, products } from '../data/menu.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import ProductCard from '../components/ProductCard.jsx';
import MiniCart from '../components/MiniCart.jsx';
import ProductPanel from '../components/ProductPanel.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAddedFeedback } from '../hooks/useAddedFeedback.js';
import { getProductGroups } from '../utils/product.js';
import { notify } from '../lib/uikit.js';
import { gsap, useGSAP } from '../motion/gsap.js';
import { Flip } from '../motion/flip.js';
import { useMotion } from '../motion/useMotion.js';
import { revealOnScroll } from '../motion/reveal.js';
import { cancelFlights, flyToCart } from '../motion/cartFlight.js';
import { ease, flip, stagger } from '../motion/tokens.js';
import styles from './Menu.module.css';

// Sin tildes ni mayúsculas: "clasica" encuentra "Clásica".
const normalizeText = (text) =>
  text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

const searchIndex = products.map((product) => ({
  product,
  text: normalizeText(`${product.name} ${product.description}`),
}));

/** Productos visibles: la búsqueda manda sobre la categoría. */
const visibleFor = (categoryId, normalizedQuery) => {
  if (normalizedQuery !== '') {
    return searchIndex
      .filter((entry) => entry.text.includes(normalizedQuery))
      .map((entry) => entry.product);
  }
  if (categoryId) return products.filter((product) => product.categoryId === categoryId);
  return products;
};

// Flip: tarjetas (por su nodo) y la píldora de la pestaña activa (por data-flip-id).
const FLIP_TARGETS = '[data-product-id], [data-flip-id="tab-pill"]';
const MENU_SEEN_KEY = 'delicias.menuVisto.v1';
// Si la salida de las tarjetas no termina (pestaña oculta, error), se filtra igual (ms).
const LEAVE_FALLBACK_MS = 400;

const firstMenuVisit = () => {
  try {
    if (window.sessionStorage.getItem(MENU_SEEN_KEY)) return false;
    window.sessionStorage.setItem(MENU_SEEN_KEY, '1');
    return true;
  } catch {
    return false;
  }
};

const isPlainClick = (event) =>
  event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

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

  const visibleProducts = visibleFor(selectedCategory?.id, normalizedQuery);
  const groups = groupByCategory(visibleProducts);
  const resultCount = visibleProducts.length;

  let searchStatus = '';
  if (isSearching && resultCount === 0) {
    searchStatus = `No encontramos «${searchText}». Prueba con otra palabra o mira todas las categorías.`;
  } else if (isSearching) {
    searchStatus = `${resultCount} ${resultCount === 1 ? 'resultado' : 'resultados'} para «${searchText}»`;
  }

  // Estado de Flip guardado justo antes de un cambio de filtro hecho por la persona.
  // Lo consume el useGSAP de abajo tras el render; Atrás o una URL directa no lo guardan.
  const pendingFlipRef = useRef(null);
  const activeFlipRef = useRef(null);
  const contentRef = useRef(null);
  const pageRef = useRef(null);
  const leaveRef = useRef(null);
  const { reduced } = useMotion();

  const captureFlip = (fast) => {
    if (reduced || !contentRef.current) return;
    // Si había un Flip a medias, se termina al instante (sin estados a medias).
    activeFlipRef.current?.progress(1).kill();
    pendingFlipRef.current = {
      state: Flip.getState(gsap.utils.toArray(FLIP_TARGETS, pageRef.current)),
      fast,
    };
  };

  const updateQuery = (value) => {
    captureFlip(true);
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
    captureFlip(true);
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
      notify(`Agregado: ${product.name} ×1`);
      flyToCart({
        from: contentRef.current?.querySelector(`[data-product-id="${product.id}"] img`),
        image: product.image,
      });
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
    notify(`Agregado: ${product.name} ×${quantity}`);
    // Sale de la foto del panel (el clon va en la capa superior, encima del <dialog>).
    flyToCart({
      from: document.querySelector('[data-panel] [data-panel-item="image"]'),
      image: product.image,
    });
  };

  // Pestañas: las tarjetas que se van se desvanecen (0,2 s) antes de cambiar el filtro;
  // luego se guarda el estado de Flip y se navega. Corre antes del onClick de <Link>,
  // que respeta preventDefault. Sin animación: el <Link> navega como siempre.
  const handleTabClick = (event) => {
    if (reduced || !isPlainClick(event)) return;
    const link = event.target.closest('a[href]');
    if (!link) return;
    const url = new URL(link.href);
    const nextCategory = url.searchParams.get('categoria');
    if (nextCategory === (selectedCategory?.id ?? null)) return;
    event.preventDefault();

    // Un clic anterior a medias se cancela y sus tarjetas vuelven a verse.
    const previous = leaveRef.current;
    if (previous) {
      window.clearTimeout(previous.fallback);
      previous.tween?.kill();
      gsap.set(previous.leaving, { clearProps: 'opacity,transform' });
    }

    const nextIds = new Set(
      visibleFor(nextCategory, normalizeText(url.searchParams.get('q') ?? '')).map(
        (product) => product.id,
      ),
    );
    const leaving = gsap.utils
      .toArray('[data-product-id]', contentRef.current)
      .filter((card) => !nextIds.has(card.dataset.productId));

    let done = false;
    const commit = () => {
      if (done) return;
      done = true;
      window.clearTimeout(entry.fallback);
      leaveRef.current = null;
      captureFlip(false);
      navigate(`${url.pathname}${url.search}`);
    };
    // Si la animación no termina (pestaña oculta, error), se navega igual.
    const entry = { leaving, fallback: window.setTimeout(commit, LEAVE_FALLBACK_MS) };
    leaveRef.current = entry;
    if (leaving.length === 0) {
      commit();
      return;
    }
    entry.tween = gsap.to(leaving, {
      opacity: 0,
      scale: flip.enterFrom,
      duration: flip.leave,
      ease: ease.out,
      onComplete: commit,
    });
  };

  const filterKey = `${selectedCategory?.id ?? ''}|${normalizedQuery}`;

  // Tras el render: las tarjetas que siguen se reacomodan con Flip y las nuevas entran.
  useGSAP(
    () => {
      const pending = pendingFlipRef.current;
      pendingFlipRef.current = null;
      if (!pending || reduced) return;
      const moveTime = pending.fast ? flip.moveFast : flip.move;
      const targets = gsap.utils.toArray(FLIP_TARGETS, pageRef.current);
      // Sin la transición CSS de transform de las tarjetas: frenaría a Flip.
      gsap.set(targets, { transition: 'none' });
      activeFlipRef.current = Flip.from(pending.state, {
        targets,
        duration: moveTime,
        ease: ease.inOut,
        simple: true,
        prune: true,
        onEnter: (entering) =>
          gsap.fromTo(
            entering,
            { opacity: 0, scale: flip.enterFrom },
            { opacity: 1, scale: 1, duration: moveTime, ease: ease.out, stagger: stagger.reveal / 2 },
          ),
        onComplete: () => gsap.set(targets, { clearProps: 'transition,opacity,transform' }),
      });
    },
    { scope: pageRef, dependencies: [filterKey] },
  );

  // Primera vez en la sesión: las tarjetas entran con la aparición de la 5A.
  // El ref guarda la decisión para este montaje (el modo estricto corre el efecto dos veces).
  const entranceRef = useRef(null);
  useGSAP(
    () => {
      if (reduced) return undefined;
      if (entranceRef.current === null) entranceRef.current = firstMenuVisit();
      if (entranceRef.current) {
        revealOnScroll(gsap.utils.toArray('[data-product-id]', contentRef.current));
      }
      return cancelFlights;
    },
    { scope: pageRef, dependencies: [reduced] },
  );

  useDocumentTitle(selectedCategory?.name ?? 'Menú');

  useEffect(() => {
    tabsRef.current
      ?.querySelector('[aria-current="page"]')
      ?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, [selectedCategory]);

  const productGrid = (items) => (
    <div className="product-grid">
      {items.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
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
        {/* Fondo naranja de la pestaña activa: Flip lo desliza de una a otra. */}
        {isActive && <span className={styles.pill} data-flip-id="tab-pill" aria-hidden="true" />}
        {category?.name ?? 'Todo'}
      </Link>
    );
  };

  return (
    <section ref={pageRef} className={styles.page}>
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
          onClickCapture={handleTabClick}
        >
          {tab(null)}
          {categories.map(tab)}
        </nav>
      </div>

      <div ref={contentRef} className={`container ${styles.content}`}>
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
                ? productGrid(items)
                : subcategories.map((subcategory) => (
                    <section className={styles.subcategory} key={subcategory}>
                      <h3>{subcategory}</h3>
                      {productGrid(
                        items.filter((product) => product.subcategory === subcategory))}
                    </section>
                  ))}
            </section>
          );
        })}
      </div>

      <MiniCart />

      <ProductPanel
        product={panelProduct}
        onAdd={addFromPanel}
        onClose={closePanel}
      />
    </section>
  );
}
