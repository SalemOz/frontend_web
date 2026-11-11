import { Suspense, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

export default function Layout() {
  const location = useLocation();
  const mainRef = useRef(null);
  const previousLocationKey = useRef(location.key);

  // Al cambiar de ruta: scroll arriba y foco en el título de la página.
  // Se usa location.key para cubrir también cambios de query (?categoria=...);
  // los anclas del mismo documento (#contacto) no crean una nueva location.
  useEffect(() => {
    if (previousLocationKey.current === location.key) return;
    previousLocationKey.current = location.key;

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    const main = mainRef.current;
    const heading = main?.querySelector('h1');
    const target = heading ?? main;
    if (!target) return;

    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
    }

    target.focus({ preventScroll: true });
  }, [location.key]);

  return (
    <>
      <Navbar />
      <main ref={mainRef} tabIndex={-1}>
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
