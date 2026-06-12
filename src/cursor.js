const HOVER_TARGETS = 'a, button, .work-row';

export function initCursor() {
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let dotX = targetX;
  let dotY = targetY;
  let ringX = targetX;
  let ringY = targetY;
  let visible = false;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    if (!visible) {
      dotX = ringX = targetX;
      dotY = ringY = targetY;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
      visible = true;
    }
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
    visible = false;
  });

  let hovering = false;
  document.addEventListener('mouseover', (e) => {
    hovering = !!e.target.closest(HOVER_TARGETS);
  });

  let ringScale = 0.45;

  function frame() {
    dotX += (targetX - dotX) * 0.4;
    dotY += (targetY - dotY) * 0.4;
    ringX += (targetX - ringX) * 0.16;
    ringY += (targetY - ringY) * 0.16;
    ringScale += ((hovering ? 1 : 0.45) - ringScale) * 0.18;
    dot.style.transform = `translate(${dotX}px, ${dotY}px)`;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) scale(${ringScale})`;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
