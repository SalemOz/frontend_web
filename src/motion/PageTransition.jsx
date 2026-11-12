import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap, useGSAP } from './gsap.js';
import { useMotion } from './useMotion.js';
import { TransitionContext } from './transitionContext.js';
import { markCurtainActive, markCurtainDone } from './curtain.js';
import { curtainMaxWaitMs, duration, ease } from './tokens.js';
import styles from './PageTransition.module.css';

const BAR_COUNT = 8;
const BAR_SKEW = -8;
// Si algo sale mal (p. ej. un error al montar la página), la cortina se retira igual.
const WATCHDOG_MS = 4000;

const isModifiedClick = (event) =>
  event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

/** Enlace interno que cambia de página: lo único que la cortina intercepta. */
const internalPageLink = (event) => {
  if (event.defaultPrevented || isModifiedClick(event)) return null;
  const anchor = event.target.closest?.('a[href]');
  if (!anchor) return null;
  if ((anchor.target && anchor.target !== '_self') || anchor.hasAttribute('download')) return null;
  if (anchor.hasAttribute('data-no-transition')) return null;

  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return null;
  // Mismo pathname = cambio de query, ancla o panel: sin cortina.
  if (url.pathname === window.location.pathname) return null;
  return `${url.pathname}${url.search}${url.hash}`;
};

/** Espera a que la nueva página esté montada (con su h1), como máximo curtainMaxWaitMs. */
const waitForPage = (pathname) =>
  new Promise((resolve) => {
    const started = performance.now();
    const check = () => {
      const ready = window.location.pathname === pathname && document.querySelector('main h1');
      if (ready || performance.now() - started > curtainMaxWaitMs) resolve();
      else requestAnimationFrame(check);
    };
    requestAnimationFrame(check);
  });

/**
 * Cortina de parrilla entre páginas. Un solo manejador de clics delegado intercepta los
 * enlaces internos que cambian de pathname; las navegaciones hechas desde código usan
 * useTransitionNavigate() (transitionContext.js).
 */
export function PageTransition({ children }) {
  const navigate = useNavigate();
  const { reduced } = useMotion();
  const curtainRef = useRef(null);
  // go() se crea dentro de useGSAP (con contextSafe) y se guarda aquí.
  const goRef = useRef(null);

  useGSAP(
    (context, contextSafe) => {
      const curtain = curtainRef.current;
      const bars = gsap.utils.toArray('[data-curtain-bar]', curtain);
      const logo = curtain.querySelector('[data-curtain-logo]');
      const spread = { amount: duration.curtain / 3, from: 'start' };
      const barTime = duration.curtain - spread.amount;
      let busy = false;

      const finish = contextSafe(() => {
        gsap.set(curtain, { autoAlpha: 0, pointerEvents: 'none' });
        gsap.set(bars, { yPercent: -110, skewX: BAR_SKEW, willChange: 'auto' });
        gsap.set(logo, { opacity: 0, scale: 0.85 });
        busy = false;
        // Aviso para quien espera a que se retire (p. ej. la secuencia de Confirmación).
        markCurtainDone();
      });
      finish();

      // Retirada aparte (con contextSafe) porque corre después de un await.
      const uncover = contextSafe((watchdog) => {
        gsap
          .timeline({
            onComplete: () => {
              window.clearTimeout(watchdog);
              finish();
            },
          })
          .to(logo, { opacity: 0, duration: duration.fast })
          .to(bars, { yPercent: 110, duration: barTime, ease: ease.inOut, stagger: spread }, 0);
      });

      goRef.current = contextSafe((to, options) => {
        const target = new URL(to, window.location.href);
        if (reduced || target.pathname === window.location.pathname) {
          navigate(to, options);
          return;
        }
        // Clics repetidos durante la transición: se ignoran (no se encolan).
        if (busy) return;
        busy = true;
        markCurtainActive();
        let navigated = false;
        const navigateOnce = () => {
          if (navigated) return;
          navigated = true;
          navigate(to, options);
        };
        // Si la animación se detiene (p. ej. pestaña oculta a mitad), igual se navega
        // y se retira la cortina: nunca queda atascada ni se pierde el clic.
        const watchdog = window.setTimeout(() => {
          navigateOnce();
          finish();
        }, WATCHDOG_MS);

        const cover = gsap.timeline({
          onComplete: async () => {
            navigateOnce();
            // Layout hace scroll arriba y pone el foco en el h1 detrás de la cortina.
            await waitForPage(target.pathname);
            uncover(watchdog);
          },
        });
        cover
          .set(curtain, { autoAlpha: 1, pointerEvents: 'auto' })
          .set(bars, { willChange: 'transform' })
          .to(bars, { yPercent: 0, duration: barTime, ease: ease.inOut, stagger: spread })
          .to(logo, { opacity: 1, scale: 1, duration: duration.fast, ease: ease.pop }, '-=0.15');
      });
    },
    { scope: curtainRef, dependencies: [reduced, navigate], revertOnUpdate: true },
  );

  useEffect(() => {
    if (reduced) return undefined;
    // Fase de captura en document: corre antes que el onClick de <Link>/<NavLink>,
    // que respeta defaultPrevented y entonces no navega por su cuenta.
    const onClick = (event) => {
      const to = internalPageLink(event);
      if (!to) return;
      event.preventDefault();
      goRef.current?.(to);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [reduced]);

  // Lee la ref solo al llamarse (en un evento), nunca durante el render.
  const go = (to, options) => goRef.current?.(to, options);

  return (
    <TransitionContext.Provider value={go}>
      {children}
      <div ref={curtainRef} className={styles.curtain} aria-hidden="true">
        <div className={styles.bars}>
          {Array.from({ length: BAR_COUNT }, (_, index) => (
            <span
              key={index}
              className={styles.bar}
              style={{ left: `${(index * 100) / BAR_COUNT}%` }}
              data-curtain-bar
            />
          ))}
        </div>
        <img
          className={styles.logo}
          src="/brand/logo-delicias-192.png"
          alt=""
          width="96"
          height="96"
          data-curtain-logo
        />
      </div>
    </TransitionContext.Provider>
  );
}
