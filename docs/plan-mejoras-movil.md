# Plan de mejoras · versión móvil

Origen: crítica de diseño con `/impeccable critique` (2026-11-11). Nota: 24/40.
Cada fase = una rama + un PR, como las fases anteriores. Verificar siempre a 375px.

## Fase 0 · Ordenar herramientas (sin código)
- Dejar una sola skill de diseño al mando: `impeccable`.
- Desactivar plugins que se pisan (ver resumen en el chat).
- Ejecutar `/impeccable init` → crea `PRODUCT.md` (quién es el local, público, tono).

## Fase 1 · Carrito que no deje pedir mal (P0) — `/impeccable harden`
- `<form>` con `required`: nombre y teléfono siempre; dirección solo si es domicilio.
- Ocultar dirección al elegir "Recoger en el local". `inputMode="tel"` en teléfono.
- Errores por campo, en texto, junto al campo.
- Confirmar "Vaciar carrito" (o permitir deshacer).
- Quitar el indicador de 3 pasos o hacerlo real; `value` en los radios de pago.

## Fase 2 · Tipografía (P1) — `/impeccable typeset`
- Cargar de verdad la fuente (hoy no se carga ninguna): Archivo variable vía
  `@fontsource-variable/archivo` (se sirve desde tu propio sitio, sin Google).
- Nada de texto de 11px: mínimo 14px nombres, 13px descripciones, 16px en inputs
  (si no, el iPhone hace zoom al tocar el campo).
- Pesos que existan (máx. 900, no 950).

## Fase 3 · Ergonomía móvil (P1) — `/impeccable adapt`
- Barra inferior fija en el carrito: "Total $X · Finalizar pedido".
- Navbar de una sola fila en móvil (hoy ocupan 167px entre navbar y pestañas).
- Hover solo en `@media (hover: hover)` para que no quede "pegado" al tocar.
- Menú en lista de 1 columna (foto a la derecha) en vez de cuadrícula de 2.

## Fase 4 · Fotos (P0, depende de ti) — `/impeccable bolder`
- Necesito fotos reales: mínimo 1 por categoría (7), ideal 1 por producto.
- Mientras tanto: relleno con marca (logo/brasa), no "HAMBURGUESAS" repetido.
- Reemplazar la hamburguesa de Unsplash del héroe por una foto del local.

## Fase 5 · Cierre del pedido (P2) — `/impeccable delight` + `clarify`
- Confirmación con productos, tipo de entrega, dirección y tiempo estimado.
- Botón "Enviar pedido por WhatsApp" con el mensaje prellenado.
- Texto correcto según domicilio/recoger. Indicador "Abierto ahora".

## Final — `/impeccable polish` y luego `/impeccable critique` otra vez.
