# 03 · /impeccable critique — `/`, `/menu`, `/carrito`, `/confirmacion`

⚠️ DEGRADED: single-context (la evaluación B —detector— ya se había ejecutado en esta misma sesión antes de
la crítica, así que la revisión de diseño no fue independiente de sus resultados; no se usaron subagentes).

Modo de la superficie: **Operate** (pedir comida desde el celular, rápido). Inicio tiene algo de Persuade.
Evaluado sobre el estado inicial (`main` @ 1dbab9a) en 1280 y 390 px; las notas "→" indican qué ya se
corrigió en `chore/auditoria-ui`.

## Puntuación de salud (Nielsen)

| # | Heurística | Nota | Problema clave |
|---|-----------|:---:|----------------|
| 1 | Visibilidad del estado | 3 | Buen feedback "Agregado ✓", contador del carrito y mini carrito; faltaba estado de carga y de error de página (→ corregido) |
| 2 | Lenguaje del mundo real | 3 | Copys cercanos ("Tu carrito está esperando algo delicioso"); "Transferencia / medio de pago" es ambiguo |
| 3 | Control y libertad | 2 | "Vaciar carrito" borra todo sin confirmar ni deshacer; Atrás cierra el panel (bien) |
| 4 | Consistencia y estándares | 2 | Títulos de página con pesos distintos (→ corregido); el indicador "1 Carrito · 2 Datos y entrega · 3 Confirmación" muestra el paso 2 en la misma pantalla que el 1 |
| 5 | Prevención de errores | 2 | Se puede finalizar sin nombre, teléfono ni dirección (decisión "opcionales por ahora") |
| 6 | Reconocer antes que recordar | 3 | Opciones del producto visibles en el carrito (`En plátano · Porción de papa`) |
| 7 | Flexibilidad y eficiencia | 2 | Búsqueda y pestañas bien; por teclado, "Ver carrito" queda a ~50 Tab |
| 8 | Estética y minimalismo | 3 | Jerarquía clara en tarjetas (nombre → descripción → precio naranja → botón); el antetítulo en mayúsculas sobre cada h1 se repite en todas las pantallas |
| 9 | Recuperación de errores | 2 | El fallo al guardar el pedido no decía nada (→ corregido); búsqueda sin resultados sí ofrece salida |
| 10 | Ayuda y documentación | n/a | Flujo de 3 pasos sin necesidad de ayuda dedicada; horario y teléfono están en el footer |
| **Total** | | **22/36** | **Aceptable** |

## Especificidad del diseño

**Evaluación:** se siente de este negocio, no de una plantilla. El negro de carbón con naranja de brasa,
la palabra *carbón* en cursiva naranja del Hero, la sección crema "¿Qué se te antoja hoy?" que corta el
oscuro y el precio en naranja 900 crean una identidad reconocible. Lo genérico: el antetítulo pequeño en
mayúsculas espaciadas sobre cada título ("NUESTRA CARTA", "TU PEDIDO", "PEDIDO RECIBIDO", "SELECCIÓN DE LA
CASA") se repite como fórmula, y los placeholders de rayas diagonales delatan que aún no hay fotos.

**Escaneo determinista:** `hero-eyebrow-chip` (1), `kicker-above-heading` (3), `low-contrast` (2: el título
invisible de Recomendados —corregido— y el rótulo "Sabor en cada bocado", que se quita en
`fix/hero-sin-rotulo`), `undersized-ui-text` (10 px, corregido), `overused-font` (Inter: es la fuente de
marca, se mantiene). Coinciden con la revisión manual salvo `overused-font`, que aquí es falso positivo por
decisión de marca.

## Impresión general

La carta funciona: se encuentra un producto rápido, se personaliza en un panel claro y el carrito muestra
lo que se pidió. El mayor punto débil está al final del embudo: el carrito pide datos que no exige, anuncia
un "siguiente paso" que no existe y la confirmación habla de "reclamarlo en el local" aunque se haya elegido
domicilio. La mayor oportunidad es cerrar ese final con la misma claridad que tiene el Menú.

## Lo que funciona
1. **Panel de producto.** Hoja inferior en móvil, lateral en escritorio; obligatorio/opcional marcado; el botón dice el precio total ("Agregar · $ 10.000") o qué falta ("Elige: Pan o plátano").
2. **Mini carrito pegajoso** con subtotal: confirma cada agregado sin sacar a la persona del Menú.
3. **Precio como ancla visual** en tarjetas, líneas y resumen: naranja, peso 900, siempre en el mismo lugar.

## Problemas prioritarios

- **[P1] Final del pedido incoherente.** "Confirmarás los detalles de tu pedido en el siguiente paso" (`Cart.jsx`) es falso: el siguiente paso ya es el pedido creado. La confirmación dice "Guarda el número para reclamarlo en el local" también para domicilio. *Por qué:* es el momento de más ansiedad (pagar, esperar comida) y el texto contradice lo que pasó. *Arreglo:* que el texto de confirmación dependa de entrega/recogida y quitar o reescribir la frase del resumen. *Comando:* `/impeccable clarify`. **Pendiente: son textos de negocio.**
- **[P1] Datos de entrega opcionales.** Sin teléfono ni dirección un domicilio no se puede entregar. *Arreglo:* obligatorios nombre y teléfono (y dirección si es domicilio), con mensaje junto al campo y foco al primero inválido. *Comando:* `/impeccable harden`. **Pendiente: `order.js` documenta "opcionales por ahora".**
- **[P2] Indicador de pasos engañoso.** "2 Datos y entrega" está en la misma pantalla que "1 Carrito" y nunca se marca como actual. *Arreglo:* dos pasos ("Tu pedido" → "Confirmación") o marcar el 2 cuando la persona llega al formulario. *Comando:* `/impeccable clarify`.
- **[P2] Pila de elementos pegajosos en móvil.** A 320 px el navbar (106 px), las pestañas (61 px) y el mini carrito (~70 px) ocupan un tercio de la pantalla. *Arreglo:* ocultar la fila de enlaces del navbar al hacer scroll en el Menú o fundir pestañas y navbar. *Comando:* `/impeccable adapt`.
- **[P2] "Vaciar carrito" sin red de seguridad.** Un toque borra todo. *Arreglo:* "Deshacer" durante unos segundos o confirmación. *Comando:* `/impeccable harden`.

## Señales por persona

- **Camila, pide desde el celular en la calle (proyecto):** con 4G lento, el Hero bajaba 8,7 MB de video antes de ver la carta (→ corregido); en el carrito los +/− de 27 px se fallaban con el pulgar (→ 44 px).
- **Jordan (primera vez):** el indicador de pasos le hace esperar una pantalla de "Datos y entrega" que no llega; después de "Finalizar" no sabe si el local ya recibió el pedido (la nota de simulación lo aclara solo a medias).
- **Sam (teclado / lector de pantalla):** sin "saltar al contenido" (→ corregido); el título "Recomendados de la casa" no se veía (→ corregido); llegar a "Ver carrito" cuesta ~50 Tab (pendiente).

## Observaciones menores
- El contador del carrito del navbar muestra "0" con el carrito vacío: ruido visual.
- "@deliciasalcarbon.com" en el footer parece un dominio y no un usuario de red social.
- En la tarjeta, toda la superficie abre el panel pero solo el botón es enfocable: correcto para teclado, pero el cursor de mano en toda la tarjeta y el hover del borde podrían anunciarlo mejor en táctil.

## Preguntas para decidir
1. ¿Nombre, teléfono y dirección pasan a ser obligatorios? (Sí, con validación · Solo teléfono · Siguen opcionales)
2. ¿Los textos del final (resumen y confirmación) se pueden ajustar según domicilio/recogida? (Sí · Solo confirmación · No por ahora)
3. ¿El antetítulo en mayúsculas sobre cada título es parte de la identidad o se puede quitar en Menú/Carrito/Confirmación? (Se queda · Solo en Inicio · Quitar)

> Nota: Impeccable pide hacer estas preguntas de forma interactiva al terminar la crítica; aquí quedan por
> escrito porque el encargo era auditar, corregir lo seguro y dejar lo de negocio como pendiente.
