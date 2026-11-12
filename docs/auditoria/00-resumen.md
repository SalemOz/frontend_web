# 00 · Resumen de la auditoría de interfaz

Rama `chore/auditoria-ui` desde `main` @ 1dbab9a (Fase 3 ya mergeada). Fecha: 2026-11-11.
Detalle en `01-detect.md` (detector), `02-audit.md` (técnica) y `03-critique.md` (diseño/UX).
Todo lo que aparece aquí se comprobó en el código y en el navegador (320 / 390 / 768 / 1280 px y teclado).

## Commits

| Commit | Qué |
|--------|-----|
| 5d2c1ca | perf: reemplaza UIkit por SVG propios |
| 97edc82 | fix(a11y): título de Recomendados visible y orden de encabezados |
| 00cf6b1 | fix(a11y): foco visible, contraste de campos, texto mínimo y objetivos de 44 px |
| 670d432 | fix(responsive): navbar móvil ordenado y pegajosos alineados al navbar |
| 29112d1 | fix(forms): error visible al no poder guardar el pedido y campos con autocompletar |
| 68e5d85 | perf(hero): el video de 8,7 MB solo se reproduce en pantallas ≥768 px |
| f709784 | refactor(css): título de página común, títulos en 800 y tokens de color/radio |
| 931e2df | fix(estados): mensaje de carga y de error al abrir una página |
| b8396c8 | fix(a11y): enlace para saltar al contenido, título por página y foco en el h1 |

El rótulo "Sabor en cada bocado" se quita aparte en `fix/hero-sin-rotulo` (493dcae); esa rama mergea
sin conflictos con esta y con ambas el detector ya no marca contraste bajo en el Hero.

## Peso antes / después (`npm run build`)

| Recurso | Antes | Después |
|---------|------:|--------:|
| CSS principal (`index-*.css`) | 285,47 kB (gzip 32,18) | 5,68 kB (gzip 2,01) |
| JS principal (`index-*.js`) | 501,92 kB (gzip 162,91) | 284,71 kB (gzip 90,73) |
| Aviso de Vite "chunk > 500 kB" | Sí | No |
| Video del Hero en móvil | 8,7 MB (autoplay) | 0 (solo póster) |
| Póster del Hero | 333 kB (1800 px, q90) | 167 kB (1280 px, q75) |
| Dependencias | react, react-dom, react-router-dom, uikit | sin `uikit` |

## Contraste AA de los pares principales

| Par | Ratio | AA |
|-----|------:|:--:|
| Crema #f6f0e5 sobre negro #101010 | 16,78:1 | ✓ |
| Gris `--muted` #bcb8b1 sobre negro #101010 | 9,63:1 | ✓ |
| Gris `--muted` sobre tarjeta #171717 | 9,07:1 | ✓ |
| Gris `--text-soft` #c8c4be sobre tarjeta #171717 | 10,33:1 | ✓ |
| Naranja #ff891e sobre negro #101010 | 8,02:1 | ✓ |
| Naranja sobre tarjeta #171717 | 7,55:1 | ✓ |
| Texto de botón `--on-orange` #17110a sobre naranja | 7,89:1 | ✓ |
| Texto #171717 sobre crema #f6f0e5 (sección categorías) | 15,81:1 | ✓ |
| Footer #c8c4be sobre #080808 / copyright #aaa sobre #080808 | 11,54 / 8,62:1 | ✓ |
| Hero: párrafo #e4e0d9 sobre degradado #090909 | 15,14:1 | ✓ |
| `--error` #ff8a7a sobre resumen #181716 | 7,82:1 | ✓ |
| Borde de campo `--border-control` #7a6f63 sobre #171717 / #101010 (no texto, pide 3:1) | 3,66 / 3,88:1 | ✓ |
| **Naranja #ff891e sobre crema #f6f0e5** | **2,09:1** | ✗ |

Naranja sobre crema no se usa para texto en ninguna pantalla (el único caso era un antetítulo vacío en
Categorías, eliminado en 97edc82). Si algún día hace falta texto naranja sobre crema: #a3510b da 4,95:1.
Antes de esta rama fallaban: "Recomendados de la casa" (#171717 sobre #101010, 1,1:1) y los bordes de
campos (#333 sobre #171717, 1,42:1).

## Hallazgos

### Crítico
| # | Archivo | Qué pasaba | Arreglo | Estado |
|---|---------|------------|---------|--------|
| C1 | `src/components/Favorites.jsx` | Título "Recomendados de la casa" #171717 sobre #101010 (1,1:1): invisible | Variante `light` de `SectionHeading` | ✅ 97edc82 |

### Alto
| # | Archivo | Qué pasaba | Arreglo | Estado |
|---|---------|------------|---------|--------|
| A1 | `src/main.jsx`, 5 componentes | UIkit completo (285 kB CSS + ~219 kB JS) para 6 iconos; además fijaba fuente, peso 400 y color de los títulos y un foco punteado #333 | `Icon.jsx` con los 6 SVG; reset necesario copiado a `global.css`; paridad verificada con diff de estilos computados | ✅ 5d2c1ca |
| A2 | `src/components/Layout.jsx` | Sin "saltar al contenido" (WCAG 2.4.1, nivel A) | Enlace oculto hasta recibir foco | ✅ b8396c8 |
| A3 | `Cart.jsx`, `Confirmation.jsx`, `NotFound.jsx` | Título de pestaña de Inicio en todas (WCAG 2.4.2) | `useDocumentTitle` | ✅ b8396c8 |
| A4 | `src/styles/global.css` | Foco de radios/casillas con el punteado #333 de UIkit: invisible en oscuro | `:focus-visible` naranja global | ✅ 00cf6b1 |
| A5 | `Menu.module.css`, `ProductPanel.module.css`, `Cart.module.css` | Borde de campos 1,42:1 (WCAG 1.4.11) | Token `--border-control` (3,66:1) | ✅ 00cf6b1 |
| A6 | `Cart.module.css` y otros | Objetivos de 27 px (+/−/Quitar), 37 px (botón de tarjeta), 40 px (redes), 18 px de alto (enlaces del footer) | 44 px | ✅ 00cf6b1 |
| A7 | `src/components/Hero.jsx` | Video de 8,7 MB en autoplay en móvil y con "reducir movimiento" | Solo ≥768 px, sin reducir movimiento ni ahorro de datos; si no, póster | ✅ 68e5d85 |
| A8 | `src/components/Layout.jsx` | `<Suspense fallback={null}>` y sin error boundary: `<main>` vacío al cargar y app en blanco si falla un chunk | `PageBoundary` con "Cargando…" y "No pudimos cargar esta página · Reintentar" | ✅ 931e2df |

### Medio
| # | Archivo | Qué pasaba | Arreglo | Estado |
|---|---------|------------|---------|--------|
| M1 | `Navbar.module.css` | En móvil los enlaces caían a una segunda fila pegados a la izquierda, a 12 px | Segunda fila repartida a lo ancho, separador, 14 px, 44 px de alto | ✅ 670d432 |
| M2 | `Footer.jsx`, `Cart.jsx` | Encabezados fuera de orden (h3 sin h2; h2 dentro de h2) | h2 en el footer, h3 en líneas del carrito | ✅ 97edc82 |
| M3 | `Cart.jsx` | Si `saveLastOrder` fallaba, "Finalizar pedido" no hacía nada | Aviso `role=alert`, el carrito se conserva | ✅ 29112d1 |
| M4 | `Cart.jsx` | Radios de Entrega y Pago sin nombre de grupo; campos sin `autocomplete` | `radiogroup` + `aria-labelledby`; `name`/`tel`/`street-address` | ✅ 29112d1 |
| M5 | `ProductCard`, `Categories`, `ProductPanel` | Texto funcional a 10 px | 11 px | ✅ 00cf6b1 |
| M6 | 4 páginas | Cuatro `.title` duplicados y pesos distintos (Menú 800, resto 400) | `.page-title` global; h1–h3 en 800 y crema | ✅ f709784 |
| M7 | 8 archivos CSS | #c8c4be, #17110a, radio 30 px, #333, #292929 repetidos | Tokens `--text-soft`, `--on-orange`, `--radius-pill`, `--line`, `--line-subtle` | ✅ f709784 |
| M8 | `Layout.jsx` | Al navegar a una página aún no descargada el foco quedaba en `<main>` | Pasa al h1 cuando aparece | ✅ b8396c8 |
| M9 | `Cart.module.css` | Resumen pegado a `top: 92px` fijo | `var(--navbar-height)` | ✅ 670d432 |
| M10 | `MiniCart.module.css` | "Ver carrito" en dos líneas a 320 px | `white-space: nowrap` | ✅ 670d432 |
| M11 | `index.html`, `global.css` | **Archivo e Inter no se cargan**: hoy los títulos usan la fuente del sistema y el texto Inter solo si está instalada | Cargar ambas (self-host o Google Fonts) con `font-display: swap` | ⏳ Pendiente: cambia la tipografía visible en todo el sitio y añade una petición externa o archivos de fuente; necesita tu visto bueno. `--font-display` ya apunta a Archivo |
| M12 | `Cart.jsx`, `utils/order.js` | Nombre, teléfono y dirección no son obligatorios | Validación con mensaje asociado y foco al primer error | ⏳ Pendiente: `order.js` dice "opcionales por ahora" (decisión de producto) |
| M13 | `Menu.jsx` | "Ver carrito" del mini carrito está al final del DOM: ~50 Tab desde el inicio del Menú | Mover el mini carrito antes de la rejilla en el DOM o un atajo | ⏳ Pendiente: cambia la maqueta pegajosa; el carrito del navbar es la alternativa |
| M14 | `Cart.jsx`, `Confirmation.jsx` | "Confirmarás los detalles… en el siguiente paso" (no hay tal paso); "reclamarlo en el local" también con domicilio; indicador de 3 pasos con 2 en la misma pantalla | Textos según entrega/recogida; 2 pasos | ⏳ Pendiente: textos de negocio |
| M15 | `Hero.jsx` | En escritorio el video en bucle no tiene botón de pausa (WCAG 2.2.2) | Botón pausar/reanudar | ⏳ Pendiente: es UI nueva; ya se respeta "reducir movimiento" |
| M16 | Menú en 320 px | Navbar + pestañas + mini carrito ocupan ~1/3 de la pantalla | Ocultar la fila de enlaces al hacer scroll o fundirla con las pestañas | ⏳ Pendiente: rediseño de navegación |

### Bajo
| # | Archivo | Qué pasa | Estado |
|---|---------|----------|--------|
| B1 | Varios | Antetítulos en mayúsculas sobre cada título (Impeccable: `kicker-above-heading`, `hero-eyebrow-chip`) | ⏳ Pendiente: forma parte de la identidad actual; decisión tuya |
| B2 | `global.css` | `prefers-reduced-motion` anula toda transición a 0,01 ms | ⏳ Revisar al introducir GSAP |
| B3 | `ProductImage.module.css` | Placeholders con rayas diagonales | ⏳ Se van con las fotos reales |
| B4 | `Cart.jsx` | "Vaciar carrito" sin confirmar ni deshacer | ⏳ Pendiente: cambia el comportamiento |
| B5 | `Navbar.jsx` | El contador del carrito muestra "0" con el carrito vacío | ⏳ Pendiente |
| B6 | `Hero.jsx` | Póster servido desde Unsplash (dependencia externa) | ⏳ Pendiente: guardarlo en `public/` necesita un conversor de imágenes que no hay en el equipo |
| B7 | `global.css` | Los espaciados siguen siendo valores sueltos (no hay escala de tokens) | ⏳ Pendiente: refactor amplio; mejor junto con la entrada de GSAP |

## Comprobaciones finales
- `npm run lint` y `npm run build`: pasan, sin el aviso de chunk > 500 kB.
- `npx impeccable detect src`: 0 hallazgos (salida 0). Ojo: el aviso `overused-font` de Inter ya no sale
  porque la fuente se declara vía `--font-body`, no porque cambiara; Inter se mantiene por ser de marca. En vivo quedan solo `kicker-above-heading` / `hero-eyebrow-chip` (B1) y el contraste del rótulo del Hero, que desaparece con `fix/hero-sin-rotulo`. Ningún Crítico/Alto abierto.
- Sin desbordes horizontales en Inicio, Menú (+ panel), Carrito y Confirmación a 320, 390, 768 y 1280 px.
- Teclado: Inicio → Explorar menú → agregar (Enter) → Personalizar (panel: foco atrapado, Escape cierra y devuelve el foco) → Ver carrito → Finalizar pedido → Confirmación. Sin trampas de foco; foco naranja visible en todo el recorrido.
- Error de página probado deteniendo el servidor y navegando a `/menu`; error de guardado probado forzando un fallo de `localStorage.setItem`.

## Cómo probarlo
```bash
git checkout chore/auditoria-ui
npm install   # quita uikit de node_modules
npm run dev
```
1. Tab al cargar cualquier página → aparece "Saltar al contenido".
2. Inicio: el título "Recomendados de la casa" se lee; en el inspector a 390 px no se descarga `hero-burger.mp4`.
3. Móvil (390 px): navbar en dos filas ordenadas; en el carrito los +/− son de 44 px.
4. DevTools → Network → Offline y entrar a una página no visitada → mensaje "No pudimos cargar esta página".
5. `npm run build` y comparar el tamaño de `index-*.css` / `index-*.js` con la tabla de arriba.
