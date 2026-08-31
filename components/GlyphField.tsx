'use client';

import { useEffect, useRef } from 'react';

/*
 * A sparse field of dim glyphs drifting behind the page — the ambient
 * "there is a system running here" layer. Canvas rather than DOM: a few
 * hundred characters as elements would be a few hundred nodes to lay out.
 *
 * Cost control: it repaints at 30fps, not 60, and pauses with the tab.
 */

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\|+×÷◇◆○●□■△▽<>[]{}·:;=~^*';
const DENSITY = 1 / 8000; // glyphs per square pixel
const FPS = 30;

type Glyph = {
  x: number;
  y: number;
  char: string;
  alpha: number;
  drift: number;
  /** Frames until this glyph swaps to a different character. */
  ttl: number;
};

export default function GlyphField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let width = 0;
    let height = 0;
    let glyphs: Glyph[] = [];
    const ratio = Math.min(window.devicePixelRatio, 2);

    const randomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

    const build = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.font = '13px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
      context.textBaseline = 'top';

      const count = Math.round(width * height * DENSITY);
      glyphs = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        char: randomChar(),
        alpha: 0.06 + Math.random() * 0.26,
        drift: 0.25 + Math.random() * 0.75,
        ttl: Math.floor(Math.random() * 45) + 8,
      }));
    };

    build();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 200);
    };
    window.addEventListener('resize', onResize);

    let running = !document.hidden;
    const onVisibility = () => {
      running = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibility);

    let frame = 0;
    let last = 0;
    const interval = 1000 / FPS;

    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      if (!running || now - last < interval) return;
      last = now;

      context.clearRect(0, 0, width, height);

      for (const glyph of glyphs) {
        glyph.y -= glyph.drift;
        if (glyph.y < -16) {
          glyph.y = height + 16;
          glyph.x = Math.random() * width;
        }

        glyph.ttl -= 1;
        if (glyph.ttl <= 0) {
          glyph.char = randomChar();
          glyph.ttl = Math.floor(Math.random() * 45) + 8;
        }

        context.fillStyle = `rgba(0, 255, 156, ${glyph.alpha})`;
        context.fillText(glyph.char, glyph.x, glyph.y);
      }
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-[-1] pointer-events-none opacity-60"
    />
  );
}
