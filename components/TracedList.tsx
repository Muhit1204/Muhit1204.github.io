'use client';

import { Children, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';

/*
 * The traced-route treatment, generalised out of the experience timeline: a
 * rail down the left whose lit section grows as you scroll, and a node per
 * item that goes from ◇ to ◆ when it reaches the read line.
 *
 * Children are wrapped rather than rendered from data, so a server component
 * can build the cards and hand them over untouched.
 */

const subscribe = () => () => {};

function useClientFlag(compute: () => boolean) {
  const cache = useRef<boolean | null>(null);
  const get = useCallback(() => {
    if (cache.current === null) cache.current = compute();
    return cache.current;
  }, [compute]);
  return useSyncExternalStore(subscribe, get, () => false);
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasNoObserver = () => typeof IntersectionObserver === 'undefined';

function TracedNode({ index, children }: { index: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const observerless = useClientFlag(hasNoObserver);
  const active = seen || observerless;

  useEffect(() => {
    const el = ref.current;
    if (!el || observerless) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setSeen(true);
        observer.disconnect();
      },
      { rootMargin: '0px 0px -20% 0px', threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [observerless]);

  return (
    <div
      ref={ref}
      className={`relative pl-8 sm:pl-10 md:pl-14 transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-30'}`}
    >
      <span
        aria-hidden="true"
        className={`absolute left-0 top-1.5 flex items-center justify-center w-6 h-6 border text-[0.6rem] transition-colors duration-300 ${
          active ? 'border-accent text-accent bg-bg' : 'border-line text-muted bg-bg'
        }`}
      >
        {active ? '◆' : '◇'}
      </span>
      <span aria-hidden="true" className="absolute left-7 md:left-9 top-3 text-[0.6rem] text-muted hidden md:block">
        {String(index + 1).padStart(2, '0')}
      </span>
      {children}
    </div>
  );
}

export default function TracedList({
  children,
  footer,
}: {
  children: ReactNode;
  footer?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(0);
  const reduced = useClientFlag(prefersReducedMotion);
  const progress = reduced ? 1 : scrolled;
  const items = Children.toArray(children);

  // Fills the rail as the list crosses the read line. rAF-throttled so
  // scrolling stays cheap no matter how many lists are on the page.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || reduced) return;

    let queued = false;

    const measure = () => {
      queued = false;
      const rect = track.getBoundingClientRect();
      const line = window.innerHeight * 0.55;
      setScrolled(Math.min(Math.max((line - rect.top) / rect.height, 0), 1));
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduced]);

  return (
    <div ref={trackRef} className="relative space-y-6">
      <div aria-hidden="true" className="absolute left-3 top-2 bottom-2 w-px bg-line">
        <span
          className="absolute inset-x-0 top-0 bg-accent"
          style={{ height: `${progress * 100}%`, boxShadow: '0 0 8px rgba(0,255,156,0.6)' }}
        />
      </div>

      {items.map((child, i) => (
        <TracedNode key={i} index={i}>
          {child}
        </TracedNode>
      ))}

      {footer && (
        <p aria-hidden="true" className="relative pl-8 sm:pl-10 md:pl-14 text-[0.65rem] text-muted">
          <span className="text-accent">◆</span> {footer}
        </p>
      )}
    </div>
  );
}
