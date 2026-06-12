import { createFluidSim } from './vendor-fluid.js';

// ————— Tune the signature element here — slow, smoky, elegant —————
export const FLUID_CONFIG = {
  PALETTE: ['#6d28d9', '#2563eb', '#06b6d4'],
  BRIGHTNESS: 0.1,   // dye intensity for cursor trails (vendor default 0.15)
  SPLAT_BOOST: 6,    // multiplier for idle/programmatic splats (vendor default 10)
  SPLAT_RADIUS: 0.16,
  SPLAT_FORCE: 3500,
  DENSITY_DISSIPATION: 1.3,
  VELOCITY_DISSIPATION: 0.85,
  CURL: 18,
  BLOOM: true,
  BLOOM_INTENSITY: 0.22,
  BLOOM_THRESHOLD: 0.85,
  AUTO_SPLAT_INTERVAL: [4000, 6000],
};

export function shouldFallback() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  if (navigator.deviceMemory && navigator.deviceMemory <= 4) return true;
  const probe = document.createElement('canvas');
  if (!probe.getContext('webgl2')) return true;
  return false;
}

export function initFluid(canvas) {
  const small = window.innerWidth < 768;

  const sim = createFluidSim(canvas, {
    palette: FLUID_CONFIG.PALETTE,
    brightness: FLUID_CONFIG.BRIGHTNESS,
    splatBoost: FLUID_CONFIG.SPLAT_BOOST,
    config: {
      SIM_RESOLUTION: small ? 64 : 128,
      DYE_RESOLUTION: small ? 512 : 1024,
      SPLAT_RADIUS: FLUID_CONFIG.SPLAT_RADIUS,
      SPLAT_FORCE: FLUID_CONFIG.SPLAT_FORCE,
      DENSITY_DISSIPATION: FLUID_CONFIG.DENSITY_DISSIPATION,
      VELOCITY_DISSIPATION: FLUID_CONFIG.VELOCITY_DISSIPATION,
      CURL: FLUID_CONFIG.CURL,
      BLOOM: FLUID_CONFIG.BLOOM,
      BLOOM_INTENSITY: FLUID_CONFIG.BLOOM_INTENSITY,
      BLOOM_THRESHOLD: FLUID_CONFIG.BLOOM_THRESHOLD,
      SUNRAYS: true,
      SUNRAYS_WEIGHT: 0.6,
      COLOR_UPDATE_SPEED: 5,
      BACK_COLOR: { r: 10, g: 10, b: 10 },
      SHADING: true,
    },
  });

  // Idle life: 1–2 gentle splats every 4–6s so the page breathes without input.
  let idleTimer = null;

  function scheduleIdleSplats() {
    const [min, max] = FLUID_CONFIG.AUTO_SPLAT_INTERVAL;
    idleTimer = setTimeout(() => {
      const count = Math.random() < 0.5 ? 1 : 2;
      for (let i = 0; i < count; i++) {
        sim.splatAtClient(
          window.innerWidth * (0.1 + 0.8 * Math.random()),
          window.innerHeight * (0.1 + 0.8 * Math.random())
        );
      }
      scheduleIdleSplats();
    }, min + Math.random() * (max - min));
  }
  scheduleIdleSplats();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      sim.pause();
      clearTimeout(idleTimer);
    } else {
      sim.resume();
      scheduleIdleSplats();
    }
  });

  return sim;
}
