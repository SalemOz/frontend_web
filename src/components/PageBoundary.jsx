import { Component, Suspense } from 'react';

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

const loading = (
  <p className="container page-status" role="status">
    Cargando…
  </p>
);

/** Estados de carga y error de las páginas que se cargan bajo demanda. */
export default function PageBoundary({ children }) {
  return (
    <PageErrorBoundary>
      <Suspense fallback={loading}>{children}</Suspense>
    </PageErrorBoundary>
  );
}
