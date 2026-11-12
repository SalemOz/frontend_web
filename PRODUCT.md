# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

Web móvil primero: casi todo el uso es desde el celular.

## Users

Vecinos de Yaguará (Huila) que piden domicilio a su casa, de noche (el local abre de 5:00 p. m. a 11:00 p. m.), desde el celular. Conocen el local y la comida; quieren elegir, personalizar y pedir rápido.

Recoger en el local existe como opción, pero no es el caso principal.

## Product Purpose

Que un cliente arme su pedido (carta real, opciones, notas) y se lo mande al local por WhatsApp ya escrito, sin tener que dictarlo por llamada o escribirlo a mano.

Estado: es del negocio real, pero por ahora es una demo para mostrársela al dueño. Éxito = que el dueño la quiera usar.

## Positioning

La carta real de un asadero de pueblo (patacolos, choripapas, jugo de chulupa, "en pan o plátano") con pedido directo al WhatsApp del local, sin intermediarios ni apps de domicilios.

## Operating Context

- El pedido termina en WhatsApp: se abre un chat con el número del local y el pedido prellenado; el cliente lo envía. (Hoy la confirmación es una simulación: falta conectar este paso.)
- Domicilio con tarifa fija de $2.000 COP. Pago en efectivo o transferencia, al recibir.
- Horario: todos los días, 17:00–23:00 (America/Bogota).
- Datos del negocio en `src/data/business.js`; carta en `src/data/`.

## Capabilities and Constraints

- React + Vite, CSS Modules, variables en `src/styles/global.css`. Sin backend: carrito y último pedido en `localStorage` (`delicias.cart.v1`, `delicias.lastOrder.v1`).
- Precios enteros en COP, formateados con `formatPrice`. Ids de producto estables.
- 42 productos en 7 categorías; algunos con restricción de edad (+18).
- Pendiente de decidir: tiempo estimado de entrega, zona de cobertura del domicilio, pedido mínimo.

## Brand Commitments

- Nombre: "Delicias al Carbón". Logo con llamas en `public/brand/`.
- Voz: cercana, en español de Colombia, sin tecnicismos ("¿Qué se te antoja hoy?").
- La carta (nombres, precios, descripciones) es la del negocio: no se inventan ni reescriben productos.

## Evidence on Hand

- Carta completa real con precios.
- Logo en `public/brand/`.
- **No hay fotos de los productos ni del local.** No usar fotos de bancos de imágenes haciéndolas pasar por comida del local; no inventar reseñas, cifras de ventas ni "los más pedidos".

## Product Principles

1. El celular es la pantalla principal: todo se debe poder hacer con el pulgar.
2. Del antojo al WhatsApp en menos de un minuto.
3. Nunca dejar mandar un pedido que el local no pueda cumplir (sin dirección, sin teléfono).
4. La carta real manda: fidelidad a los productos y precios del negocio.

## Accessibility & Inclusion

Público general de pueblo, de todas las edades: textos legibles en celulares de gama media y baja, objetivos táctiles de al menos 44px, contraste AA, funcionar en conexiones lentas.
