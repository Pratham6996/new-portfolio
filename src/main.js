import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import './styles/main.css';

import { shouldFallback, initFluid } from './fluid/fluid.js';
import { runPreloader } from './preloader.js';
import { initScroll } from './scroll.js';
import { initReveals, revealHero } from './reveal.js';
import { initCursor } from './cursor.js';
import { initWorkRows } from './work.js';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.getElementById('fluid');

let sim = null;
if (shouldFallback()) {
  canvas.remove();
  document.body.classList.add('fluid-fallback');
} else {
  sim = initFluid(canvas);
}

// Nav gains its blur only after the hero is gone.
const header = document.querySelector('.site-header');
const hero = document.getElementById('hero');
window.addEventListener(
  'scroll',
  () => header.classList.toggle('scrolled', window.scrollY > hero.offsetHeight - 96),
  { passive: true }
);

initCursor();

if (!reduced) {
  initScroll(sim);
  initReveals();
}

// Work rows: click to expand details, hover nudges the title (CSS)
// and fires a splat at the cursor.
initWorkRows(sim);

runPreloader(reduced, () => {
  if (sim) sim.burst(3);
  if (!reduced) revealHero();
});
