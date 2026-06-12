const VISITED_KEY = 'ps-visited';

export function runPreloader(reduced, onDone) {
  const el = document.getElementById('preloader');
  const unlock = () => document.documentElement.classList.remove('is-loading');

  if (!el) {
    unlock();
    onDone();
    return;
  }

  // Repeat visits skip the loader entirely.
  if (reduced || sessionStorage.getItem(VISITED_KEY)) {
    el.remove();
    unlock();
    onDone();
    return;
  }
  sessionStorage.setItem(VISITED_KEY, '1');

  const count = el.querySelector('.preloader-count');
  const DURATION = 1100;
  const start = performance.now();

  function tick(now) {
    const p = Math.min(1, (now - start) / DURATION);
    count.textContent = String(Math.floor(p * 100)).padStart(3, '0');
    if (p < 1) requestAnimationFrame(tick);
    else lift();
  }

  function lift() {
    el.style.transition = 'transform 0.65s cubic-bezier(0.76, 0, 0.24, 1)';
    el.style.transform = 'translateY(-100%)';
    el.addEventListener(
      'transitionend',
      () => {
        el.remove();
        unlock();
        onDone();
      },
      { once: true }
    );
  }

  requestAnimationFrame(tick);
}
