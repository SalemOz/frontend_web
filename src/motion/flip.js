// Flip solo lo usa el Menú: se registra aquí para que viaje en su chunk (carga diferida).
import { Flip } from 'gsap/Flip';
import { gsap } from './gsap.js';

gsap.registerPlugin(Flip);

export { Flip };
