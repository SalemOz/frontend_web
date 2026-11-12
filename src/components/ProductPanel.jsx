import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { formatPrice } from '../data/menu.js';
import { getProductGroups } from '../utils/product.js';
import ProductImage from './ProductImage.jsx';
import styles from './ProductPanel.module.css';

const MAX_NOTE_LENGTH = 120;
const MIN_QUANTITY = 1;
const MAX_QUANTITY = 20;
const TITLE_ID = 'product-panel-title';

// Un grupo obligatorio arranca con su opción por defecto, si la tiene.
const initialSelection = (groups) =>
  Object.fromEntries(
    groups.map((group) => [
      group.id,
      group.required && group.defaultOptionId ? [group.defaultOptionId] : [],
    ]),
  );

/**
 * Contenido del panel. Se monta con key={product.id}, así cada apertura
 * parte limpia: cantidad 1, sin nota y con los valores por defecto.
 */
function PanelContent({ product, onAdd, onRequestClose }) {
  const groups = getProductGroups(product);
  const [selection, setSelection] = useState(() => initialSelection(groups));
  const [note, setNote] = useState('');
  const [quantity, setQuantity] = useState(MIN_QUANTITY);

  const selectedOptions = groups.flatMap((group) =>
    group.options.filter((option) => selection[group.id].includes(option.id)),
  );
  const unitPrice = selectedOptions.reduce((sum, option) => sum + option.price, product.price);
  const missingGroup = groups.find(
    (group) => group.required && selection[group.id].length === 0,
  );

  const toggleOption = (group, optionId) => {
    setSelection((current) => {
      const chosen = current[group.id];
      let next = [optionId];
      if (group.type === 'multiple') {
        next = chosen.includes(optionId)
          ? chosen.filter((id) => id !== optionId)
          : [...chosen, optionId];
      }
      return { ...current, [group.id]: next };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (missingGroup) return;

    onAdd(
      product,
      selectedOptions.map(({ id, name, price }) => ({ id, name, price })),
      note,
      quantity,
    );
    onRequestClose();
  };

  return (
    <form className={styles.panel} onSubmit={handleSubmit}>
      <button
        type="button"
        className={styles.close}
        onClick={onRequestClose}
        aria-label="Cerrar"
      >
        <span aria-hidden="true">×</span>
      </button>

      <div className={styles.body}>
        <div data-panel-item="image">
          <ProductImage
            image={product.image}
            alt=""
            className={styles.image}
          />
        </div>

        <header className={styles.header} data-panel-item="title">
          <h2 id={TITLE_ID}>{product.name}</h2>
          <strong className={styles.basePrice}>{formatPrice(product.price)}</strong>
          <p>{product.description}</p>
          {product.ageRestricted ? (
            <span className={styles.ageRestricted}>Solo mayores de 18</span>
          ) : null}
        </header>

        {groups.map((group) => (
          <fieldset className={styles.group} key={group.id} data-panel-item="group">
            <legend>
              {group.name}
              <span className={styles.badge}>
                {group.required ? 'Obligatorio' : 'Opcional'}
              </span>
            </legend>
            {group.options.map((option) => (
              <label className={styles.option} key={option.id}>
                <input
                  type={group.type === 'multiple' ? 'checkbox' : 'radio'}
                  name={`${product.id}-${group.id}`}
                  value={option.id}
                  checked={selection[group.id].includes(option.id)}
                  onChange={() => toggleOption(group, option.id)}
                />
                <span className={styles.optionName}>{option.name}</span>
                {option.price > 0 && (
                  <span className={styles.optionPrice}>+{formatPrice(option.price)}</span>
                )}
              </label>
            ))}
          </fieldset>
        ))}

        <div className={styles.note} data-panel-item="note">
          <label htmlFor="product-panel-note">Nota para la cocina (opcional)</label>
          <input
            id="product-panel-note"
            type="text"
            maxLength={MAX_NOTE_LENGTH}
            autoComplete="off"
            placeholder="Sin cebolla, bien asada…"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
          <span className={styles.counter}>
            {note.length}/{MAX_NOTE_LENGTH}
          </span>
        </div>
      </div>

      <footer className={styles.footer} data-panel-item="footer">
        <div className={styles.quantity}>
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.max(MIN_QUANTITY, current - 1))}
            disabled={quantity === MIN_QUANTITY}
            aria-label="Quitar una unidad"
          >
            −
          </button>
          <output aria-live="polite" aria-label="Cantidad">{quantity}</output>
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.min(MAX_QUANTITY, current + 1))}
            disabled={quantity === MAX_QUANTITY}
            aria-label="Agregar una unidad"
          >
            +
          </button>
        </div>

        <button
          type="submit"
          className={`btn-primary ${styles.submit}`}
          disabled={Boolean(missingGroup)}
        >
          {missingGroup ? (
            `Elige: ${missingGroup.name}`
          ) : (
            <span>
              Agregar · <span data-price-total>{formatPrice(unitPrice * quantity)}</span>
            </span>
          )}
        </button>
      </footer>
    </form>
  );
}

/**
 * Panel para personalizar un producto antes de agregarlo.
 * Quien lo usa decide qué producto se muestra (product o null) y qué pasa al
 * cerrar (onClose); aquí vive el <dialog> y su cierre.
 */
export default function ProductPanel({ product, onAdd, onClose }) {
  const dialogRef = useRef(null);
  const lastProductId = useRef(null);

  // Único punto de cierre: aquí irá la animación de salida.
  const requestClose = () => {
    const dialog = dialogRef.current;
    if (!dialog?.open) return;

    dialog.close();
    document
      .querySelector(`[data-product-id="${lastProductId.current}"] [data-add-button]`)
      ?.focus();
    onClose();
  };

  // Atrás quita el producto de la URL sin pasar por los botones del panel.
  const closeWhenProductLeaves = useEffectEvent(requestClose);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!product) {
      closeWhenProductLeaves();
      return;
    }

    lastProductId.current = product.id;
    if (!dialog.open) dialog.showModal();
  }, [product]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={TITLE_ID}
      data-panel
      onCancel={(event) => {
        // Escape también pasa por requestClose.
        event.preventDefault();
        requestClose();
      }}
      onClick={(event) => {
        // Un clic en ::backdrop llega con el propio dialog como destino.
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      {product && (
        <PanelContent
          key={product.id}
          product={product}
          onAdd={onAdd}
          onRequestClose={requestClose}
        />
      )}
    </dialog>
  );
}
