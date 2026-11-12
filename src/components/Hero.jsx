import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import StatusChip from './StatusChip.jsx';
import { useBusinessStatus } from '../hooks/useBusinessStatus.js';
import { gsap, ScrollTrigger, useGSAP } from '../motion/gsap.js';
import { useMotion } from '../motion/useMotion.js';
import { distance, duration, ease, embers, parallax, stagger } from '../motion/tokens.js';
import styles from './Hero.module.css';

// El video pesa 8,7 MB: solo se reproduce en pantallas medianas o grandes, sin
// "reducir movimiento" ni ahorro de datos. En el resto queda el póster.
const VIDEO_QUERY = '(min-width: 768px) and (prefers-reduced-motion: no-preference)';
// shortcut: se decide al montar; girar o redimensionar no lo reevalúa hasta volver a Inicio.
const shouldPlayVideo = () =>
  window.matchMedia(VIDEO_QUERY).matches && !navigator.connection?.saveData;

const POSTER_URL =
  'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=1280&q=75';

const TITLE = 'Sabor al carbón, sin esperas.';

/** Brasas que suben desde abajo con desvío lateral y se apagan, en bucle. */
const animateEmbers = (hero, particles) => {
  const height = hero.offsetHeight;
  return particles.map((particle) => {
    const rise = gsap.utils.random(height * 0.45, height * 0.95);
    const life = gsap.utils.random(2.6, 5.2);
    gsap.set(particle, {
      left: `${gsap.utils.random(2, 98)}%`,
      scale: gsap.utils.random(0.5, 1.3),
    });
    return gsap
      .timeline({ repeat: -1, delay: gsap.utils.random(0, 4) })
      .fromTo(
        particle,
        { y: 0, x: 0, opacity: 0 },
        { y: -rise, x: gsap.utils.random(-45, 45), duration: life, ease: ease.linear },
      )
      .to(particle, { opacity: gsap.utils.random(0.55, 0.95), duration: life * 0.2 }, 0)
      .to(particle, { opacity: 0, duration: life * 0.4 }, life * 0.6);
  });
};

/** Pausa las brasas fuera de pantalla y con la pestaña oculta. Devuelve la limpieza. */
const pauseWhenHidden = (hero, timelines) => {
  let onScreen = true;
  const sync = () => {
    const play = onScreen && document.visibilityState === 'visible';
    timelines.forEach((timeline) => (play ? timeline.resume() : timeline.pause()));
  };
  ScrollTrigger.create({
    trigger: hero,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => {
      onScreen = self.isActive;
      sync();
    },
  });
  document.addEventListener('visibilitychange', sync);
  return () => document.removeEventListener('visibilitychange', sync);
};

export default function Hero() {
  const [playVideo] = useState(shouldPlayVideo);
  const status = useBusinessStatus();
  const { reduced, isDesktop, finePointer } = useMotion();
  const heroRef = useRef(null);
  const emberCount = reduced ? 0 : isDesktop ? embers.desktop : embers.mobile;

  // Entrada escalonada: eyebrow, palabras del título, párrafo, botón y estado.
  // Se ocultan con gsap.set antes del primer pintado (useGSAP corre como layout effect),
  // así que sin JS o con "reducir movimiento" todo queda visible desde el inicio.
  useGSAP(
    () => {
      if (reduced) return;
      const q = gsap.utils.selector(heroRef);
      const sequence = [q('[data-hero="eyebrow"]'), q('[data-hero-word]'), q('[data-hero="lead"]'), q('[data-hero="cta"]'), q('[data-hero="status"]')];
      const targets = sequence.flat();

      gsap.set(targets, { opacity: 0, y: distance.heroIn, willChange: 'transform, opacity' });
      gsap
        .timeline({
          defaults: { duration: duration.slow, ease: ease.out },
          onComplete: () => gsap.set(targets, { willChange: 'auto' }),
        })
        .to(sequence[0], { opacity: 1, y: 0 })
        .to(sequence[1], { opacity: 1, y: 0, stagger: stagger.hero }, '-=0.6')
        // "carbón" se enciende un instante al aparecer.
        .fromTo(q('[data-hero-glow]'), { opacity: 0 }, { opacity: 1, duration: duration.fast, yoyo: true, repeat: 1, ease: ease.inOut }, '-=0.35')
        .to(sequence[2], { opacity: 1, y: 0 }, '-=0.5')
        .to(sequence[3], { opacity: 1, y: 0, ease: ease.pop }, '-=0.6')
        .to(sequence[4], { opacity: 1, y: 0 }, '-=0.6');
    },
    { scope: heroRef, dependencies: [reduced] },
  );

  // Brasas (decorativas) y parallax del video/póster en escritorio.
  useGSAP(
    () => {
      if (reduced) return undefined;
      const hero = heroRef.current;
      const timelines = animateEmbers(hero, gsap.utils.toArray('[data-ember]', hero));
      const stopVisibility = pauseWhenHidden(hero, timelines);

      if (isDesktop) {
        gsap.to('[data-hero-media]', {
          y: () => hero.offsetHeight * parallax,
          ease: ease.linear,
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
        });
      }
      return stopVisibility;
    },
    { scope: heroRef, dependencies: [reduced, isDesktop, emberCount], revertOnUpdate: true },
  );

  // Botón magnético: con mouse y sin "reducir movimiento". El foco con teclado no se toca.
  useGSAP(
    (context, contextSafe) => {
      if (reduced || !finePointer) return undefined;
      const hero = heroRef.current;
      const button = hero.querySelector('[data-hero="cta"]');
      const moveX = gsap.quickTo(button, 'x', { duration: duration.fast, ease: ease.out });
      const moveY = gsap.quickTo(button, 'y', { duration: duration.fast, ease: ease.out });
      let attracted = false;

      const onMove = contextSafe((event) => {
        const box = button.getBoundingClientRect();
        const dx = event.clientX - (box.left + box.width / 2);
        const dy = event.clientY - (box.top + box.height / 2);
        const near =
          Math.abs(dx) < box.width / 2 + distance.magnetZone &&
          Math.abs(dy) < box.height / 2 + distance.magnetZone;

        if (near) {
          attracted = true;
          const pull = (delta, half) =>
            gsap.utils.clamp(-distance.magnetMax, distance.magnetMax, (delta / (half + distance.magnetZone)) * distance.magnetMax);
          moveX(pull(dx, box.width / 2));
          moveY(pull(dy, box.height / 2));
        } else if (attracted) {
          attracted = false;
          gsap.to(button, { x: 0, y: 0, duration: duration.slow, ease: ease.elastic });
        }
      });
      const onLeave = contextSafe(() => {
        attracted = false;
        gsap.to(button, { x: 0, y: 0, duration: duration.slow, ease: ease.elastic });
      });

      hero.addEventListener('pointermove', onMove);
      hero.addEventListener('pointerleave', onLeave);
      return () => {
        hero.removeEventListener('pointermove', onMove);
        hero.removeEventListener('pointerleave', onLeave);
      };
    },
    { scope: heroRef, dependencies: [reduced, finePointer], revertOnUpdate: true },
  );

  return (
    <section ref={heroRef} className={styles.hero} id="inicio">
      <video
        className={styles.heroVideo}
        data-hero-media
        autoPlay={playVideo}
        muted
        loop
        playsInline
        preload={playVideo ? 'metadata' : 'none'}
        poster={POSTER_URL}
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="/videos/hero-burger.mp4" type="video/mp4" />
      </video>

      <div className={styles.embers} aria-hidden="true">
        {Array.from({ length: emberCount }, (_, index) => (
          <i key={index} className={styles.ember} data-ember />
        ))}
      </div>

      <div className={styles.heroContent}>
        <div data-hero="status">
          <StatusChip status={status} className={styles.heroChip} />
        </div>
        <span className="eyebrow" data-hero="eyebrow">HECHO AL CARBÓN</span>
        {/* Palabras separadas para animarlas; el lector de pantalla lee el título entero. */}
        <h1 aria-label={TITLE}>
          <span aria-hidden="true">
            <span className={styles.word} data-hero-word>Sabor</span>{' '}
            <span className={styles.word} data-hero-word>al</span>{' '}
            <span className={styles.word} data-hero-word>
              <em>
                carbón
                <span className={styles.glow} data-hero-glow>carbón</span>
              </em>
              ,
            </span>{' '}
            <span className={styles.word} data-hero-word>sin</span>{' '}
            <span className={styles.word} data-hero-word>esperas.</span>
          </span>
        </h1>
        <p data-hero="lead">
          Hamburguesas, perros, salchipapas, patacolos y platos a la parrilla.
          Elige, personaliza y pide en menos de un minuto.
        </p>
        <Link to="/menu" className="btn-primary" data-hero="cta">
          EXPLORAR MENÚ <Icon name="arrow-right" />
        </Link>
      </div>
    </section>
  );
}
