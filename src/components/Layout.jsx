import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import PageBoundary from './PageBoundary.jsx';

export default function Layout() {
  const location = useLocation();
  const mainRef = useRef(null);
  const previousLocation = useRef(location);

  // Al cambiar de ruta: scroll arriba y foco en el título de la página.
  // Se usa location.key para cubrir también cambios de query (?categoria=...);
  // los anclas del mismo documento (#contacto) no crean una nueva location.
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
    const heading = main?.querySelector('h1');
    const target = heading ?? main;
    if (!target) return;

    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
    }

    target.focus({ preventScroll: true });
  }, [location]);

  return (
    <>
      <Navbar />
      <main ref={mainRef} tabIndex={-1}>
        {/* key: un error en una página no bloquea las demás al navegar. */}
        <PageBoundary key={location.pathname}>
          <Outlet />
        </PageBoundary>
      </main>
      <Footer />
    </>
  );
}
