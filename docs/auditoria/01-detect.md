# 01 · impeccable detect

Fecha: 2026-11-11 · base: `main` @ 1dbab9a (antes de las correcciones; incluye aún el rótulo del Hero, quitado en `fix/hero-sin-rotulo`).

## `npx impeccable detect src` (solo regex)

```

42 files scanned with regex matching only (.css, .js, .jsx).
Rules that need a parsed page (tiny-text, low-contrast and other element rules) did not run on them; findings are an undercount, not a clean bill of health.
For the full check, scan the running dev server (npx impeccable detect http://localhost:PORT) or a static site's built .html.

C:\Users\sebas\web_project\src\styles\global.css
  line 11: [overused-font] font-family: Inter
    → Inter, Roboto, Fraunces, Geist, Plus Jakarta Sans, and Space Grotesk are used on so many sites they no longer feel distinctive. Each new wave of AI-generated UIs converges on the same handful of faces. Choose a face that gives your interface personality.

1 anti-pattern found.
```

## `npx impeccable detect http://localhost:5173/<ruta>` (página renderizada)

Nota: `/confirmacion` sin pedido previo redirige a `/menu`, por eso repite sus hallazgos.

```
=== /

http://localhost:5173/
  [hero-eyebrow-chip] eyebrow chip (tracked-caps) "HECHO AL CARBÓN" above h1 "Sabor al carbón, sin esperas."
    → A tiny uppercase letter-spaced label sitting immediately above an oversized hero headline — or the same shape rendered as a pill chip — is now the default AI SaaS hero. Drop the eyebrow, integrate the kicker into the headline, or run it as a navigation breadcrumb instead.
  [low-contrast] 1.1:1 (need 3:1) — text #171717 on #101010
    → Text does not meet WCAG AA contrast requirements (4.5:1 for body, 3:1 for large text). Increase the contrast between text and background.
  [kicker-above-heading] kicker "SELECCIÓN DE LA CASA" above h2 "Recomendados de la casa"
    → A tiny tracked uppercase or small-caps label sitting as its own block directly above a heading is banned outright, repeated or not. Generated kickers never earn their place: the heading carries its own weight. Delete the label and let the heading speak; if the words matter, work them into the heading or the body.
  [low-contrast] pixel contrast 2.2:1 median 2.2:1 (need 3:1) on unread layer "Sabor en cada"
    → Text does not meet WCAG AA contrast requirements (4.5:1 for body, 3:1 for large text). Increase the contrast between text and background.

4 anti-patterns found.

── Advisory (not counted as failures) ──

http://localhost:5173/
  [straggler] "minuto." alone on the last of 3 lines (14% of the measure)
    → The last line of this paragraph holds one word, which leaves a hole under the block. Set text-wrap: pretty on body copy (Chrome, Safari) to pull a word down beside it. Where a browser ignores it, edit the last sentence or bind the last two words with a no-break space. Keep it if the break is intended.
  [repeating-stripes-gradient] repeating-gradient decorative stripes
    → Repeating-gradient stripes used as surface decoration are a recurring generated-UI signature. Reach for a deliberate texture or leave the surface plain.
  [low-contrast] pixel contrast 2.8:1 median 2.8:1 (need 3:1) on unread layer "bocado"
    → Text does not meet WCAG AA contrast requirements (4.5:1 for body, 3:1 for large text). Increase the contrast between text and background.

3 advisory notes. Suppress with --no-advisory.
=== /menu

http://localhost:5173/menu
  [undersized-ui-text] 10px functional text "Solo mayores de 18" (below 11px floor)
    → Interactive and content-bearing UI text (links, buttons, nav items, labels, table cells, meta rows, timecodes) below 11px is a legibility failure, not a style choice. WCAG sets no absolute pixel floor, but functional text under 11px is a defensible quality bar: it fails on high-DPI and small viewports and it degrades tap and read targets. The 11px floor holds even inside a footer; only non-interactive legal smallprint gets the softer 10px floor. Being ON the DESIGN.md size ramp does not exempt a value here: adding 8px to the ramp launders the token but not the legibility problem, and that is exactly the escape hatch this rule closes. Exempts sup/sub, visually-hidden (sr-only) text, and code/terminal contexts. Decorative letterspaced micro-labels are still functional and stay in scope.
  [undersized-ui-text] 10px functional text "Solo mayores de 18" (below 11px floor)
    → Interactive and content-bearing UI text (links, buttons, nav items, labels, table cells, meta rows, timecodes) below 11px is a legibility failure, not a style choice. WCAG sets no absolute pixel floor, but functional text under 11px is a defensible quality bar: it fails on high-DPI and small viewports and it degrades tap and read targets. The 11px floor holds even inside a footer; only non-interactive legal smallprint gets the softer 10px floor. Being ON the DESIGN.md size ramp does not exempt a value here: adding 8px to the ramp launders the token but not the legibility problem, and that is exactly the escape hatch this rule closes. Exempts sup/sub, visually-hidden (sr-only) text, and code/terminal contexts. Decorative letterspaced micro-labels are still functional and stay in scope.
  [kicker-above-heading] kicker "NUESTRA CARTA" above h1 "Menú"
    → A tiny tracked uppercase or small-caps label sitting as its own block directly above a heading is banned outright, repeated or not. Generated kickers never earn their place: the heading carries its own weight. Delete the label and let the heading speak; if the words matter, work them into the heading or the body.

3 anti-patterns found.

── Advisory (not counted as failures) ──

http://localhost:5173/menu
  [straggler] "colombianos." alone on the last of 2 lines (20% of the measure)
    → The last line of this paragraph holds one word, which leaves a hole under the block. Set text-wrap: pretty on body copy (Chrome, Safari) to pull a word down beside it. Where a browser ignores it, edit the last sentence or bind the last two words with a no-break space. Keep it if the break is intended.
  [straggler] "casa." alone on the last of 3 lines (11% of the measure)
    → The last line of this paragraph holds one word, which leaves a hole under the block. Set text-wrap: pretty on body copy (Chrome, Safari) to pull a word down beside it. Where a browser ignores it, edit the last sentence or bind the last two words with a no-break space. Keep it if the break is intended.
  [straggler] "tierno." alone on the last of 2 lines (16% of the measure)
    → The last line of this paragraph holds one word, which leaves a hole under the block. Set text-wrap: pretty on body copy (Chrome, Safari) to pull a word down beside it. Where a browser ignores it, edit the last sentence or bind the last two words with a no-break space. Keep it if the break is intended.
  [straggler] "melada." alone on the last of 2 lines (20% of the measure)
    → The last line of this paragraph holds one word, which leaves a hole under the block. Set text-wrap: pretty on body copy (Chrome, Safari) to pull a word down beside it. Where a browser ignores it, edit the last sentence or bind the last two words with a no-break space. Keep it if the break is intended.
  [repeating-stripes-gradient] repeating-gradient decorative stripes
    → Repeating-gradient stripes used as surface decoration are a recurring generated-UI signature. Reach for a deliberate texture or leave the surface plain.

5 advisory notes. Suppress with --no-advisory.
=== /carrito

http://localhost:5173/carrito
  [kicker-above-heading] kicker "TU PEDIDO" above h1 "Carrito"
    → A tiny tracked uppercase or small-caps label sitting as its own block directly above a heading is banned outright, repeated or not. Generated kickers never earn their place: the heading carries its own weight. Delete the label and let the heading speak; if the words matter, work them into the heading or the body.

1 anti-pattern found.

── Advisory (not counted as failures) ──

http://localhost:5173/carrito
  [unbalanced-heading] last of 2 lines is 29% as wide as the line above
    → This heading wraps with its last line far shorter than the line above, often one word alone. Set text-wrap: balance on headings so the lines come out near even, or rewrite it to fit. Keep it if the break carries weight on purpose.
  [straggler] "pedido." alone on the last of 2 lines (14% of the measure)
    → The last line of this paragraph holds one word, which leaves a hole under the block. Set text-wrap: pretty on body copy (Chrome, Safari) to pull a word down beside it. Where a browser ignores it, edit the last sentence or bind the last two words with a no-break space. Keep it if the break is intended.

2 advisory notes. Suppress with --no-advisory.
=== /confirmacion

http://localhost:5173/confirmacion
  [undersized-ui-text] 10px functional text "Solo mayores de 18" (below 11px floor)
    → Interactive and content-bearing UI text (links, buttons, nav items, labels, table cells, meta rows, timecodes) below 11px is a legibility failure, not a style choice. WCAG sets no absolute pixel floor, but functional text under 11px is a defensible quality bar: it fails on high-DPI and small viewports and it degrades tap and read targets. The 11px floor holds even inside a footer; only non-interactive legal smallprint gets the softer 10px floor. Being ON the DESIGN.md size ramp does not exempt a value here: adding 8px to the ramp launders the token but not the legibility problem, and that is exactly the escape hatch this rule closes. Exempts sup/sub, visually-hidden (sr-only) text, and code/terminal contexts. Decorative letterspaced micro-labels are still functional and stay in scope.
  [undersized-ui-text] 10px functional text "Solo mayores de 18" (below 11px floor)
    → Interactive and content-bearing UI text (links, buttons, nav items, labels, table cells, meta rows, timecodes) below 11px is a legibility failure, not a style choice. WCAG sets no absolute pixel floor, but functional text under 11px is a defensible quality bar: it fails on high-DPI and small viewports and it degrades tap and read targets. The 11px floor holds even inside a footer; only non-interactive legal smallprint gets the softer 10px floor. Being ON the DESIGN.md size ramp does not exempt a value here: adding 8px to the ramp launders the token but not the legibility problem, and that is exactly the escape hatch this rule closes. Exempts sup/sub, visually-hidden (sr-only) text, and code/terminal contexts. Decorative letterspaced micro-labels are still functional and stay in scope.
  [kicker-above-heading] kicker "NUESTRA CARTA" above h1 "Menú"
    → A tiny tracked uppercase or small-caps label sitting as its own block directly above a heading is banned outright, repeated or not. Generated kickers never earn their place: the heading carries its own weight. Delete the label and let the heading speak; if the words matter, work them into the heading or the body.

3 anti-patterns found.

── Advisory (not counted as failures) ──

http://localhost:5173/confirmacion
  [straggler] "colombianos." alone on the last of 2 lines (20% of the measure)
    → The last line of this paragraph holds one word, which leaves a hole under the block. Set text-wrap: pretty on body copy (Chrome, Safari) to pull a word down beside it. Where a browser ignores it, edit the last sentence or bind the last two words with a no-break space. Keep it if the break is intended.
  [straggler] "casa." alone on the last of 3 lines (11% of the measure)
    → The last line of this paragraph holds one word, which leaves a hole under the block. Set text-wrap: pretty on body copy (Chrome, Safari) to pull a word down beside it. Where a browser ignores it, edit the last sentence or bind the last two words with a no-break space. Keep it if the break is intended.
  [straggler] "tierno." alone on the last of 2 lines (16% of the measure)
    → The last line of this paragraph holds one word, which leaves a hole under the block. Set text-wrap: pretty on body copy (Chrome, Safari) to pull a word down beside it. Where a browser ignores it, edit the last sentence or bind the last two words with a no-break space. Keep it if the break is intended.
  [straggler] "melada." alone on the last of 2 lines (20% of the measure)
    → The last line of this paragraph holds one word, which leaves a hole under the block. Set text-wrap: pretty on body copy (Chrome, Safari) to pull a word down beside it. Where a browser ignores it, edit the last sentence or bind the last two words with a no-break space. Keep it if the break is intended.
  [repeating-stripes-gradient] repeating-gradient decorative stripes
    → Repeating-gradient stripes used as surface decoration are a recurring generated-UI signature. Reach for a deliberate texture or leave the surface plain.

5 advisory notes. Suppress with --no-advisory.
```
