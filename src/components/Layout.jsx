import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import PageBoundary from './PageBoundary.jsx';
import { PageTransition } from '../motion/PageTransition.jsx';
import ScrollProgress from './ScrollProgress.jsx';

export default function Layout() {
  const location = useLocation();
  const mainRef = useRef(null);
  const previousLocation = useRef(location);

  // Al cambiar de ruta: scroll arriba y foco en el título de la página.
  // Se usa location.key para cubrir también cambios de query (?categoria=...);
  // los anclas del mismo documento (#seccion) no crean una nueva location.
  useEffect(() => {
    const previous = previousLocation.current;
    if (previous.key === location.key) return;
    previousLocation.current = location;

    // Ni la búsqueda del menú (reescribe la URL en cada tecla) ni abrir o cerrar
    // el panel de producto (state.overlay) mueven el scroll o el foco.
    const samePage = previous.pathname === location.pathname;
    if (samePage && (location.state?.keepFocus || previous.state?.overlay)) return;

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    const main = mainRef.current;
    if (!main) return;

    const focusHeading = (heading) => {
      if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    };

    const heading = main.querySelector('h1');
    if (heading) {
      focusHeading(heading);
      return;
    }

    // La página aún se está descargando: foco en <main> y, cuando aparezca su
    // h1, pasa a él (salvo que la persona ya haya movido el foco).
    main.focus({ preventScroll: true });
    const observer = new MutationObserver(() => {
      const lateHeading = main.querySelector('h1');
      if (!lateHeading) return;
      observer.disconnect();
      if (document.activeElement === main) focusHeading(lateHeading);
    });
    observer.observe(main, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [location]);

  return (
    // PageTransition: cortina de parrilla al cambiar de página (ver src/motion).
    <PageTransition>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <ScrollProgress />
      <Navbar />
      <main ref={mainRef} id="contenido" tabIndex={-1}>
        {/* key: un error en una página no bloquea las demás al navegar. */}
        <PageBoundary key={location.pathname}>
          <Outlet />
        </PageBoundary>
      </main>
      <Footer />
    </PageTransition>
  );
}
