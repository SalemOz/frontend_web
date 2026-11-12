import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import styles from './NotFound.module.css';

export default function NotFound() {
  useDocumentTitle('Página no encontrada');
  return (
    <section className={styles.page}>
      <div className="container">
        <span className="eyebrow">ERROR 404</span>
        <h1 className="page-title">Página no encontrada</h1>
        <p className={styles.message}>
          La dirección que buscas no existe o cambió de lugar.
        </p>
        <Link to="/" className="btn-primary">Volver al inicio</Link>
      </div>
    </section>
  );
}
