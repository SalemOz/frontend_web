import styles from './StatusChip.module.css';

/**
 * Píldora con el estado del local. `data-status` y `data-status-dot` quedan para
 * animarlos más adelante (GSAP).
 * `announce`: solo una instancia por página (la del Navbar) avisa a los lectores
 * de pantalla, y solo cuando cambia entre abierto y cerrado, no cada 30 s.
 */
export default function StatusChip({ status, announce = false, className }) {
  const state = status.isOpen ? 'open' : 'closed';

  return (
    <span className={`${styles.chip} ${styles[state]} ${className ?? ''}`} data-status={state}>
      <span className={styles.dot} data-status-dot aria-hidden="true" />
      <span>{status.label}</span>
      {announce && (
        <span className="visually-hidden" role="status">
          {status.isOpen ? 'El local está abierto.' : 'El local está cerrado.'}
        </span>
      )}
    </span>
  );
}
