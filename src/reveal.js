import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Wrap each word in a masked span pair so lines can rise out of
// an overflow-hidden wrapper. Recurses so <em> children survive.
function wrapWords(node) {
  [...node.childNodes].forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      child.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(' '));
        } else {
          const w = document.createElement('span');
          w.className = 'w';
          const wi = document.createElement('span');
          wi.className = 'wi';
          wi.textContent = part;
          w.appendChild(wi);
          frag.appendChild(w);
        }
      });
      child.replaceWith(frag);
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      wrapWords(child);
    }
  });
}

export function initReveals() {
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    wrapWords(el);
    const inners = el.querySelectorAll('.wi');
    gsap.set(inners, { yPercent: 110 });

    // Hero copy waits for the preloader; revealHero() fires it.
    if (el.closest('#hero')) return;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: true,
      onEnter: () =>
        gsap.to(inners, { yPercent: 0, duration: 1, stagger: 0.08, ease: 'power3.out' }),
    });
  });

  document.querySelectorAll('main section').forEach((section) => {
    const els = section.querySelectorAll('[data-rise]');
    if (!els.length) return;
    gsap.set(els, { y: 24, autoAlpha: 0 });
    ScrollTrigger.create({
      trigger: els[0],
      start: 'top 85%',
      once: true,
      onEnter: () =>
        gsap.to(els, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.1, ease: 'power3.out' }),
    });
  });
}

export function revealHero() {
  const inners = document.querySelectorAll('#hero .wi');
  if (inners.length) {
    gsap.to(inners, { yPercent: 0, duration: 1.1, stagger: 0.08, ease: 'power3.out' });
  }
  gsap.fromTo(
    '.scroll-cue',
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 1.2, delay: 0.9, ease: 'power2.out' }
  );
}
