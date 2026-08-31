'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/*
 * Scroll reveal with no animation library: one IntersectionObserver adds a
 * class, and the whole transition is two CSS properties in globals.css.
 * Reduced-motion is handled there too, so this component does not need to
 * know about it. Elements start visible if the observer never runs.
 */
export default function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No observer support: show the content rather than hiding it forever.
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add('is-visible');
        // One-shot: re-animating on every pass is noise, not polish.
        observer.disconnect();
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}
