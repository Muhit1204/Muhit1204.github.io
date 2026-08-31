'use client';

import { useEffect, useRef, useState } from 'react';

/*
 * Text that resolves out of noise whenever it scrolls into view — every
 * pass, not just the first, so moving back up the page re-runs it.
 *
 * The scrambling characters are decoration and must never reach assistive
 * technology: this sits inside headings, and a screen reader landing
 * mid-animation would otherwise announce `!<>-_\` and re-announce it on
 * every scroll. So the real text is always present in an sr-only span and
 * the animating span is hidden from the accessibility tree.
 */

const NOISE = '!<>-_\\/[]{}—=+*^?#01ABCDEF';
const STEP_MS = 40;
const STEPS = 14;

export default function ScrambleText({
  text,
  className = '',
}: {
  text: string;
  className?: string;
}) {
  const [output, setOutput] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const run = () => {
      if (timer.current) clearInterval(timer.current);
      let step = 0;

      timer.current = setInterval(() => {
        step += 1;
        // Characters lock in left to right; everything ahead is still noise.
        const settled = Math.floor((step / STEPS) * text.length);
        setOutput(
          text
            .split('')
            .map((char, i) => (i < settled || char === ' ' ? char : NOISE[Math.floor(Math.random() * NOISE.length)]))
            .join(''),
        );

        if (step >= STEPS) {
          if (timer.current) clearInterval(timer.current);
          timer.current = null;
          setOutput(text);
        }
      }, STEP_MS);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) run();
      },
      // Re-arms once the element has fully left, so a small scroll jitter at
      // the boundary cannot retrigger it repeatedly.
      { threshold: 0.6 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timer.current) clearInterval(timer.current);
    };
  }, [text]);

  return (
    <span ref={ref} className={className}>
      {/* What a screen reader reads, and what search indexes: never noise. */}
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{output}</span>
    </span>
  );
}
