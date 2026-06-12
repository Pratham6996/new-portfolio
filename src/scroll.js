import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export function initScroll(sim) {
  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Anchor links route through Lenis so they glide instead of jumping.
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      const target = href === '#top' ? 0 : document.querySelector(href);
      if (target === null) return;
      e.preventDefault();
      lenis.scrollTo(target);
    });
  });

  // Bookend choreography: the fluid is loud at the hero, recedes to a
  // murmur through the middle, and returns at full strength for contact.
  if (sim) {
    gsap.fromTo(
      sim.canvas,
      { opacity: 1 },
      {
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: '#work', start: 'top 85%', end: 'top 30%', scrub: true },
      }
    );
    gsap.fromTo(
      sim.canvas,
      { opacity: 0.25 },
      {
        opacity: 1,
        ease: 'none',
        immediateRender: false,
        scrollTrigger: { trigger: '#contact', start: 'top 85%', end: 'top 30%', scrub: true },
      }
    );
  }

  return lenis;
}
