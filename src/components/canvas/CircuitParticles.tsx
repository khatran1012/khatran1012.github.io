import { useEffect, useRef, useState } from 'react';
import { BOARD_HEIGHT, BOARD_WIDTH, MODULE_LIGHTS, MODULE_POSITIONS } from './systemModuleLayout';

const SOURCES = [
  { id: 'core', dx: 0, dy: 0 },
  { id: 'frontend', dx: -266, dy: -178 },
  { id: 'backend', dx: 275, dy: -218 },
  { id: 'infra', dx: -244, dy: 104 },
  { id: 'data', dx: 254, dy: 150 },
] as const;

const BENDS = [
  { x: 361, y: 261, dx: 1, color: MODULE_LIGHTS.frontend },
  { x: 639, y: 261, dx: -1, color: MODULE_LIGHTS.backend },
  { x: 358, y: 578, dx: 1, color: MODULE_LIGHTS.infra },
  { x: 642, y: 578, dx: -1, color: MODULE_LIGHTS.data },
];

export function CircuitParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let seed = 1713;
    const random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const particles = SOURCES.flatMap(source => Array.from({ length: 75 }, () => ({
      source,
      offset: random(),
      speed: .12 + random() * .32,
      spread: (random() - .5) * 92,
      phase: random() * Math.PI * 2,
      radius: .65 + random() ** 2 * 2.3,
      white: random() > .68,
    })));
    const dust = Array.from({ length: 94 }, () => ({
      x: random() * BOARD_WIDTH, y: random() * BOARD_HEIGHT,
      radius: .45 + random() * 1.1, phase: random() * Math.PI * 2,
    }));

    let visible = false;
    let frame = 0;
    let lastFrame = 0;
    let elapsed = 0;

    const paint = () => {
      ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
      for (const { x, y, radius, phase } of dust) {
        ctx.globalAlpha = .21 + .16 * Math.cos(phase + elapsed * .8);
        ctx.fillStyle = '#cfedff';
        ctx.fillRect(x, y + 3 * Math.sin(phase + elapsed * .5), radius, radius);
      }
      for (const { source, offset, speed: rate, spread, phase, radius, white } of particles) {
        const t = (offset + elapsed * rate) % 1;
        const anchor = MODULE_POSITIONS[source.id];
        const baseX = anchor.x * BOARD_WIDTH / 100;
        const baseY = anchor.y * BOARD_HEIGHT / 100;
        const angle = phase + elapsed * (1.5 + rate * 5);
        const core = source.id === 'core';
        const heat = source.id === 'backend' || source.id === 'infra';
        const x = baseX + (core
          ? (55 + 150 * offset) * Math.cos(angle)
          : source.dx * t + spread * (.5 + t) + Math.sin(angle) * t * 24);
        const y = baseY + (core
          ? (31 + 76 * offset) * Math.sin(angle) + spread * .26
          : 49 + source.dy * t - (heat ? 109 : 33) * Math.sin(t * Math.PI) + Math.cos(angle) * spread * .29);
        const alpha = Math.sin(Math.PI * t) * (.68 + .28 * Math.sin(angle));
        ctx.fillStyle = MODULE_LIGHTS[source.id];
        ctx.globalAlpha = alpha * .21;
        ctx.beginPath();
        ctx.arc(x, y, radius * 2.5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = Math.min(1, alpha);
        ctx.fillStyle = white ? '#fff9ed' : MODULE_LIGHTS[source.id];
        ctx.fillRect(x, y, heat ? radius * .76 : radius, heat ? radius * 1.75 : radius);
      }
      BENDS.forEach(({ x, y, dx, color }, bend) => {
        const phase = (elapsed * .58 + bend * .23 + .13) % 1;
        if (phase > .4) return;
        for (let i = 0; i < 9; i++) {
          const t = phase * (1.8 + i * .08);
          ctx.globalAlpha = (1 - phase / .4) * (.45 + (i % 3) * .25);
          ctx.fillStyle = i % 3 ? color : '#fff';
          ctx.fillRect(x + dx * t * (5 + i * 4), y - t * (50 - i * 6), 1 + (i % 3) * .45, 1.4);
        }
      });
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      ctx.setTransform(canvas.width / BOARD_WIDTH, 0, 0, canvas.height / BOARD_HEIGHT, 0, 0);
      paint();
    };

    const tick = (now: number) => {
      if (!lastFrame) lastFrame = now;
      const delta = now - lastFrame;
      if (delta >= 30) {
        elapsed += Math.min(delta, 68) / 1000;
        lastFrame = now;
        paint();
      }
      frame = requestAnimationFrame(tick);
    };

    const sync = () => {
      cancelAnimationFrame(frame);
      lastFrame = 0;
      if (visible && !document.hidden && !motion.matches) frame = requestAnimationFrame(tick);
      else if (motion.matches) { elapsed = 0; paint(); }
    };
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      canvas.closest('.cyber-exhibit')?.classList.toggle('is-offscreen', !visible);
      sync();
    });
    intersection.observe(canvas);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    motion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    resize();

    return () => {
      cancelAnimationFrame(frame);
      intersection.disconnect();
      resizeObserver.disconnect();
      motion.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      canvas.closest('.cyber-exhibit')?.classList.remove('is-offscreen');
      ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
    };
  }, [mounted]);

  return mounted
    ? <canvas ref={canvasRef} className="cyber-particles" aria-hidden="true" />
    : null;
}
