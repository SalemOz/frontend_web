import { Component, Suspense, useEffect, useState } from 'react';
import { loadUIkitStyles } from '../lib/uikit.js';

/**
 * Atrapa errores al cargar o pintar una página (p. ej. un chunk que no llega
 * por falta de red) y ofrece recargar en vez de dejar el <main> vacío.
 */
class PageErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Error al mostrar la página', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="container page-status" role="alert">
        <h1 className="page-title">No pudimos cargar esta página</h1>
        <p>Revisa tu conexión e inténtalo de nuevo. Tu carrito sigue guardado.</p>
        <button type="button" className="btn-primary" onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    );
  }
}

// El spinner solo aparece si la carga tarda: en cargas rápidas (lo normal) no parpadea
// ni pide el CSS de UIkit. Se pinta el SVG que genera UIkit, con su clase uk-spinner,
// para no cargar la librería JS solo por esto.
const SPINNER_DELAY_MS = 300;

function Loading() {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowSpinner(true);
      loadUIkitStyles().catch(() => {});
    }, SPINNER_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <p className="container page-status" role="status">
      {showSpinner && (
        <span className="uk-spinner" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 30 30">
            <circle fill="none" stroke="currentColor" cx="15" cy="15" r="14" />
          </svg>
        </span>
      )}{' '}
      Cargando…
    </p>
  );
}

/** Estados de carga y error de las páginas que se cargan bajo demanda. */
export default function PageBoundary({ children }) {
  return (
    <PageErrorBoundary>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </PageErrorBoundary>
  );
}
