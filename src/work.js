import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initWorkRows(sim) {
  let refreshTimer = null;

  document.querySelectorAll('.work-row').forEach((row) => {
    const btn = row.querySelector('.work-toggle');
    if (!btn) return;

    // The whole row toggles; the button inside the title carries
    // keyboard focus and aria state. Button clicks bubble up here.
    row.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      const open = row.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));

      // Expansion shifts everything below — let ScrollTrigger re-measure
      // once the height transition has settled.
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 600);
    });

    if (sim) {
      row.addEventListener('mouseenter', (e) => {
        sim.splatAtClient(e.clientX, e.clientY, 400 * (Math.random() - 0.5), 300);
      });
    }
  });
}
