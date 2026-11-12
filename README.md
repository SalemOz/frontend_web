# Delicias al Carbón

Web de pedidos del asadero Delicias al Carbón (Yaguará, Huila). React + Vite.

## Comandos

- `npm run dev`: servidor de desarrollo.
- `npm run build`: compilación de producción.
- `npm run lint`: ESLint.
- `npm test`: pruebas con el runner de Node (`node --test`), sin dependencias extra.

## Simular el estado del local (abierto / cerrado)

El estado se calcula con la hora de Colombia (`src/utils/businessStatus.js`) y se
actualiza cada 30 s. Para demos se puede forzar desde la URL:

- `?estado=abierto`: simula las 7:30 p. m. (chip verde, carrito habilitado).
- `?estado=cerrado`: simula las 3:00 p. m. (chip rojo, aviso en el carrito y botón de envío bloqueado).
- `?estado=real`: vuelve a la hora real.

La simulación se guarda en `sessionStorage` (clave `delicias.estadoSimulado.v1`), así que
se mantiene al navegar dentro de la web y se pierde al cerrar la pestaña.
Ejemplo: `http://localhost:5173/?estado=cerrado`.

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
You can also try [the experimental native React Compiler support in plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler) by using `compiler: true` in the plugin options instead of using the Babel plugin.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## UIkit en este proyecto

La entrega exige UIkit, así que se usa de forma **mínima y aislada**. La auditoría lo había
quitado porque su CSS completo (285 kB) pisaba fuentes y pesos de títulos; ahora solo entra
lo necesario y nunca en el bundle inicial.

**Dónde se usa**

- `UIkit.notification`: aviso "Agregado: <producto> ×<cantidad>" abajo al centro, por encima
  del mini carrito, durante 2,5 s. Se llama con `notify()` en `src/pages/Menu.jsx` (agregar
  directo y desde el panel) y en `src/pages/Home.jsx` (Recomendados).
- `uk-spinner`: junto a "Cargando…" en `src/components/PageBoundary.jsx`, solo si la página
  tarda más de 300 ms en cargar.
- `uk-flex uk-flex-middle uk-flex-between`: en la fila de `src/components/MiniCart.jsx`
  (mismos valores que su CSS Module, así que el aspecto no cambia).

**Por qué está aislado**

- `src/lib/uikit.js` es el único archivo que importa UIkit, con `import()` dinámico: la
  librería (~150 kB, ~52 kB gzip) se descarga con la primera notificación, no al abrir la web.
  Si no carga, `notify()` no hace nada y el "Agregado ✓" de siempre sigue funcionando.
- `src/lib/uikit-lite.less` compila solo `notification`, `spinner` y `flex` (sin `base`,
  `heading`, `text` ni tema): unos 6 kB de CSS, todo con selectores `.uk-*`.
- Accesibilidad: el aviso visual de UIkit (que usa `role="alert"`) queda `aria-hidden` y una
  región propia `role="status"` lo anuncia de forma educada, sin mover el foco.

**Cómo quitarlo**

1. Borrar `src/lib/uikit.js` y `src/lib/uikit-lite.less`.
2. Quitar el import y las llamadas a `notify(...)` en `src/pages/Menu.jsx` y `src/pages/Home.jsx`.
3. En `src/components/PageBoundary.jsx`, quitar `loadUIkitStyles` y el `<span className="uk-spinner">`.
4. En `src/components/MiniCart.jsx`, quitar las clases `uk-flex uk-flex-middle uk-flex-between`.
5. `npm uninstall uikit less`.
