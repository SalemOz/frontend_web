# 02 · /impeccable audit

Alcance: todo `src/` y las rutas `/`, `/menu` (con panel `?producto=`), `/carrito`, `/confirmacion` y 404.
Base: `main` @ 1dbab9a. Método: lectura completa del código, `impeccable detect` (ver `01-detect.md`),
medición de contraste con la fórmula WCAG, inspección en navegador a 320 / 390 / 768 / 1280 px y
recorrido con teclado real (Tab / Shift+Tab / Enter / Escape).

## Puntuación

| # | Dimensión | Antes | Después | Hallazgo clave (antes) |
|---|-----------|:----:|:----:|------------------------|
| 1 | Accesibilidad | 1 | 3 | "Recomendados de la casa" invisible (1,1:1); sin "saltar al contenido"; foco de radios casi invisible (punteado #333 de UIkit) |
| 2 | Rendimiento | 1 | 3 | CSS de UIkit 285 kB y JS 502 kB por 6 iconos; video de 8,7 MB en autoplay también en móvil |
| 3 | Theming / tokens | 2 | 3 | Colores y radios repetidos sin token; títulos tomaban fuente, peso y color del reset de UIkit |
| 4 | Responsive | 2 | 4 | Navbar móvil desordenado; objetivos táctiles de 27 px en el carrito |
| 5 | Integridad de implementación | 2 | 3 | Archivo e Inter no se cargan; dependencia completa (UIkit) para 6 iconos |
| **Total** | | **8/20 (Pobre)** | **16/20 (Bueno)** | |

## Veredicto de integridad

**Pasa, con reservas.** El sistema es coherente y propio del producto (carbón, naranja sobre negro, crema
como superficie de contraste, tarjetas de producto con precio fuerte). Las reservas, verificadas:
la tipografía de marca (Archivo/Inter) no se carga en ningún sitio, y hasta esta rama los títulos
dependían del reset de UIkit (system-ui, peso 400, #333) en vez de decisiones propias.

## Hallazgos por severidad

### P0 · Bloqueante
- **Título "Recomendados de la casa" invisible.** `Favorites.jsx` no pasaba `light` a `SectionHeading`: h2 #171717 sobre #101010 = 1,1:1. → corregido (97edc82).

### P1 · Mayor (WCAG AA o tarea difícil)
- **Sin mecanismo para saltar el navbar** (WCAG 2.4.1, nivel A). `Layout.jsx`. → corregido (b8396c8).
- **Carrito, Confirmación y 404 con el título de Inicio** (WCAG 2.4.2). → corregido con `useDocumentTitle` (b8396c8).
- **Foco poco visible fuera de `a`/`button`:** UIkit ponía `:focus-visible { outline: 2px dotted #333 }` → radios del carrito sin foco visible sobre fondo oscuro (WCAG 2.4.7). → corregido (00cf6b1).
- **Bordes de campos de texto a 1,4:1** (#333 sobre #171717; WCAG 1.4.11 pide 3:1). → `--border-control` 3,6:1 (00cf6b1).
- **Objetivos táctiles de 27 px** en +/−/Quitar del carrito, 37 px en el botón de tarjeta, 40 px en redes, 18 px de alto en enlaces del footer. → 44 px (00cf6b1).
- **Peso inicial:** CSS 285,5 kB y JS 501,9 kB solo por UIkit (se usaban 6 iconos). → SVG propios (5d2c1ca).
- **Video del Hero de 8,7 MB con autoplay en todos los dispositivos** y sin respetar "reducir movimiento". → solo ≥768 px sin reducir movimiento ni ahorro de datos (68e5d85).
- **Pantalla en blanco al cargar o al fallar una página** (`<Suspense fallback={null}>`, sin error boundary). → `PageBoundary` (931e2df).

### P2 · Menor
- Orden de encabezados: footer con h3 sin h2 previo; nombres de línea del carrito en h2 bajo otro h2. → corregido (97edc82).
- Texto funcional a 10 px ("Solo mayores de 18", descripciones de categoría y botón de tarjeta en móvil). → 11 px (00cf6b1).
- `saveLastOrder` podía fallar en silencio: el botón "Finalizar pedido" no hacía nada. → aviso `role=alert` (29112d1).
- Grupos de radios sin nombre accesible (Entrega, Pago). → `radiogroup` + `aria-labelledby` (29112d1).
- Foco tras navegar a una página aún no descargada quedaba en `<main>`. → pasa al h1 al aparecer (b8396c8).
- Resumen del carrito pegado a `top: 92px` fijo, no al alto real del navbar. → `var(--navbar-height)` (670d432).
- Títulos de página con pesos distintos (Menú 800; Carrito/Confirmación/404 400). → `.page-title` común (f709784).
- **Pendiente:** "Ver carrito" del mini carrito está al final del DOM: ~50 Tab desde el inicio del Menú.
- **Pendiente:** Archivo e Inter no se cargan (ni `@font-face` ni enlace a fuentes).

### P3 · Pulido
- Reset global de movimiento a 0,01 ms (Impeccable lo marca porque anula feedback útil). Revisar al entrar GSAP.
- Placeholders con rayas diagonales (`repeating-linear-gradient`): señal genérica, válida mientras no haya fotos.

## Patrones sistémicos
- **Dependencia de un reset ajeno.** Tipografía de títulos, márgenes y foco venían de UIkit, no del proyecto. Ahora viven en `global.css` y se pueden cambiar a propósito.
- **Valores sueltos repetidos.** #c8c4be, #17110a, 30px de radio, #333/#292929 aparecían en 8 archivos. Ahora son tokens; los espaciados siguen sueltos (pendiente).
- **Estados "felices" solamente.** Carga, error de red y error de guardado no tenían mensaje. Cubiertos los tres.

## Lo que funciona
- `<dialog>` nativo para el panel: atrapa el foco, Escape cierra y el foco vuelve al botón de origen (verificado con teclado).
- Navegación SPA con foco al h1 y `scroll-padding` que descuenta el navbar medido.
- Contraste del texto principal muy holgado: crema 16,8:1, gris 9,6:1, naranja 8,0:1 sobre negro.
- Cero desbordes horizontales a 320 px ya en el estado inicial.

## Acciones recomendadas (siguientes)
1. **[P2] `/impeccable typeset`**: cargar Archivo (títulos) e Inter (texto) con `font-display: swap` y subset latino.
2. **[P2] `/impeccable adapt`**: llevar "Ver carrito" antes de la rejilla en el orden de foco o añadir un atajo; revisar la pila de elementos pegajosos a 320 px.
3. **[P2] `/impeccable harden`**: decidir si nombre/teléfono/dirección son obligatorios y, si sí, validación con mensajes asociados.
4. **[P3] `/impeccable polish`**: tokens de espaciado y repaso final.
