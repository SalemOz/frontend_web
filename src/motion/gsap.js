// Único punto de entrada de GSAP: el resto de la app importa de aquí, nunca de 'gsap'.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Las fuentes web cambian el alto del texto al cargar: recalcular las posiciones de scroll.
// (El cambio de tamaño de la ventana ya lo recalcula ScrollTrigger solo.)
document.fonts?.ready.then(() => ScrollTrigger.refresh());

export { gsap, ScrollTrigger, useGSAP };
