import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { formatPrice } from '../data/menu.js';
import { getProductGroups } from '../utils/product.js';
import ProductImage from './ProductImage.jsx';
import CountUp from '../motion/CountUp.jsx';
import { gsap, useGSAP } from '../motion/gsap.js';
import { useMotion } from '../motion/useMotion.js';
import { duration, ease, panel } from '../motion/tokens.js';
import styles from './ProductPanel.module.css';

const MAX_NOTE_LENGTH = 120;
const MIN_QUANTITY = 1;
const MAX_QUANTITY = 20;
const TITLE_ID = 'product-panel-title';
const MOBILE_SHEET = '(max-width: 639px)';
// Si la salida no termina (pestaña oculta, error), el panel se cierra igual (ms).
const CLOSE_FALLBACK_MS = panel.out * 1000 + 300;

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
  const { reduced } = useMotion();
  const formRef = useRef(null);
  const { contextSafe } = useGSAP({ scope: formRef });

  const selectedOptions = groups.flatMap((group) =>
    group.options.filter((option) => selection[group.id].includes(option.id)),
  );
  const unitPrice = selectedOptions.reduce((sum, option) => sum + option.price, product.price);
  const missingGroup = groups.find(
    (group) => group.required && selection[group.id].length === 0,
  );

  // Destello de la fila marcada: solo opacity/scale de un borde propio (data-option-flash).
  const flashOption = contextSafe((label) => {
    if (reduced) return;
    gsap.fromTo(
      label.querySelector('[data-option-flash]'),
      { opacity: 0.9, scale: 1 },
      { opacity: 0, scale: 1.04, duration: duration.fast, ease: ease.out },
    );
  });

  // Sacudida corta de "Obligatorio" si se intenta agregar sin elegir.
  const shakeBadge = contextSafe((form, groupId) => {
    const badge = form.querySelector(`[data-required-badge="${groupId}"]`);
    if (!badge || reduced) return;
    gsap.fromTo(
      badge,
      { x: 0 },
      { x: panel.shake, duration: 0.05, repeat: 5, yoyo: true, ease: ease.inOut, clearProps: 'transform' },
    );
  });

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
    if (missingGroup) {
      shakeBadge(event.currentTarget, missingGroup.id);
      event.currentTarget.querySelector(`[name="${product.id}-${missingGroup.id}"]`)?.focus();
      return;
    }

    onAdd(
      product,
      selectedOptions.map(({ id, name, price }) => ({ id, name, price })),
      note,
      quantity,
    );
    onRequestClose();
  };

  return (
    <form ref={formRef} className={styles.panel} onSubmit={handleSubmit}>
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
              <span className={styles.badge} data-required-badge={group.required ? group.id : undefined}>
                {group.required ? 'Obligatorio' : 'Opcional'}
              </span>
            </legend>
            {group.options.map((option) => (
              <label className={styles.option} key={option.id}>
                <span className={styles.flash} data-option-flash aria-hidden="true" />
                <input
                  type={group.type === 'multiple' ? 'checkbox' : 'radio'}
                  name={`${product.id}-${group.id}`}
                  value={option.id}
                  checked={selection[group.id].includes(option.id)}
                  onChange={(event) => {
                    toggleOption(group, option.id);
                    flashOption(event.currentTarget.closest('label'));
                  }}
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

        {/* aria-disabled (no disabled): así el clic llega y "Obligatorio" puede sacudirse. */}
        <button
          type="submit"
          className={`btn-primary ${styles.submit}`}
          aria-disabled={missingGroup ? true : undefined}
        >
          {missingGroup ? (
            `Elige: ${missingGroup.name}`
          ) : (
            <span>
              Agregar ·{' '}
              <span data-price-total>
                <CountUp value={unitPrice * quantity} format={formatPrice} duration={panel.priceCount} />
              </span>
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
 * cerrar (onClose); aquí vive el <dialog>, su entrada y su salida animadas.
 */
export default function ProductPanel({ product, onAdd, onClose }) {
  const dialogRef = useRef(null);
  const lastProductId = useRef(null);
  // Salida en curso: { cancel }. Mientras dura, el contenido sigue a la vista.
  const closingRef = useRef(null);
  // enter/exit se crean dentro de useGSAP (contextSafe) y se guardan aquí.
  const motionRef = useRef(null);
  const { reduced } = useMotion();

  // El producto mostrado sobrevive a la salida animada (product ya es null).
  const [shownProduct, setShownProduct] = useState(product);
  if (product && product !== shownProduct) setShownProduct(product);

  useGSAP(
    (context, contextSafe) => {
      const dialog = dialogRef.current;
      const axis = () => (window.matchMedia(MOBILE_SHEET).matches ? 'yPercent' : 'xPercent');

      motionRef.current = {
        enter: contextSafe(() => {
          if (reduced) return;
          // Escritorio: desde la derecha. Móvil: desde abajo. Luego los bloques en cascada.
          gsap.fromTo(dialog, { [axis()]: 100 }, { xPercent: 0, yPercent: 0, duration: panel.in, ease: ease.out });
          gsap.fromTo(
            dialog.querySelectorAll('[data-panel-item]'),
            { opacity: 0, y: panel.itemShift },
            {
              opacity: 1,
              y: 0,
              duration: duration.base,
              ease: ease.out,
              delay: panel.itemsDelay,
              stagger: panel.itemsStagger,
              clearProps: 'opacity,transform',
            },
          );
        }),
        exit: contextSafe((onDone) =>
          gsap.to(dialog, { [axis()]: 100, duration: panel.out, ease: 'power3.in', onComplete: onDone }),
        ),
        reset: contextSafe(() => {
          gsap.killTweensOf(dialog);
          gsap.set(dialog, { clearProps: 'transform' });
        }),
      };
    },
    { scope: dialogRef, dependencies: [reduced] },
  );

  // Único punto de cierre (×, Escape, clic en el fondo, Atrás, agregar).
  // El estado (URL) cambia al instante; la animación solo retrasa el close() visual.
  const requestClose = () => {
    const dialog = dialogRef.current;
    if (!dialog?.open || closingRef.current) return;

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(fallback);
      closingRef.current = null;
      dialog.removeAttribute('data-closing');
      motionRef.current?.reset();
      dialog.close();
      setShownProduct(null);
      document
        .querySelector(`[data-product-id="${lastProductId.current}"] [data-add-button]`)
        ?.focus();
    };
    const fallback = window.setTimeout(finish, CLOSE_FALLBACK_MS);
    closingRef.current = {
      cancel: () => {
        finished = true;
        window.clearTimeout(fallback);
        closingRef.current = null;
        dialog.removeAttribute('data-closing');
        motionRef.current?.reset();
      },
    };

    if (reduced || !motionRef.current) {
      finish();
    } else {
      // data-closing: el ::backdrop se desvanece con CSS (GSAP no puede animarlo).
      dialog.setAttribute('data-closing', '');
      motionRef.current.exit(finish);
    }
    onClose();
  };

  // Atrás quita el producto de la URL sin pasar por los botones del panel.
  const closeWhenProductLeaves = useEffectEvent(requestClose);
  const openPanel = useEffectEvent((nextProduct) => {
    const dialog = dialogRef.current;
    lastProductId.current = nextProduct.id;
    // Se vuelve a abrir mientras salía: se cancela la salida, sin estados a medias.
    if (closingRef.current) closingRef.current.cancel();
    if (!dialog.open) {
      dialog.showModal();
      motionRef.current?.enter();
    }
  });

  useEffect(() => {
    if (!product) {
      closeWhenProductLeaves();
      return;
    }
    openPanel(product);
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
      {shownProduct && (
        <PanelContent
          key={shownProduct.id}
          product={shownProduct}
          onAdd={onAdd}
          onRequestClose={requestClose}
        />
      )}
    </dialog>
  );
}
