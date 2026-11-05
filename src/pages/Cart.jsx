import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../data/menu.js';
import styles from './Cart.module.css';

export default function Cart() {
  const { items, subtotal, increase, decrease, remove, clear } = useCart();

  return (
    <section className={styles.page}>
      <div className="container">
        <span className="eyebrow">TU PEDIDO</span>
        <h1 className={styles.title}>Carrito</h1>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <p>Tu carrito está vacío. ¡Agrega algo rico!</p>
            <Link to="/menu" className="btn-primary">Ver el menú</Link>
          </div>
        ) : (
          <>
            <ul className={styles.list}>
              {items.map((line) => (
                <li className={styles.line} key={line.lineId}>
                  {line.image ? <img src={line.image} alt="" /> : null}

                  <div className={styles.lineInfo}>
                    <h2 className={styles.lineName}>{line.name}</h2>

                    {line.options.length > 0 && (
                      <p className={styles.lineDetail}>
                        Adicionales: {line.options.map((option) => option.name).join(', ')}
                      </p>
                    )}

                    {line.note !== '' && (
                      <p className={styles.lineDetail}>Nota: {line.note}</p>
                    )}

                    <p className={styles.unitPrice}>{formatPrice(line.unitPrice)} c/u</p>

                    <div className={styles.qtyControls}>
                      <button
                        type="button"
                        onClick={() => decrease(line.lineId)}
                        aria-label={`Quitar uno de ${line.name}`}
                      >
                        −
                      </button>
                      <span className={styles.qty} aria-live="polite">{line.qty}</span>
                      <button
                        type="button"
                        onClick={() => increase(line.lineId)}
                        aria-label={`Agregar uno de ${line.name}`}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className={styles.remove}
                        onClick={() => remove(line.lineId)}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>

                  <strong className={styles.lineTotal}>
                    {formatPrice(line.unitPrice * line.qty)}
                  </strong>
                </li>
              ))}
            </ul>

            <div className={styles.footer}>
              <div className={styles.total}>
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <button
                type="button"
                className={styles.clear}
                onClick={clear}
              >
                Vaciar carrito
              </button>
            </div>

            <p className={styles.nextStep}>
              Los datos de entrega y la confirmación del pedido se agregan en la
              siguiente fase.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
