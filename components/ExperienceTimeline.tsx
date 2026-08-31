'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Briefcase } from 'lucide-react';
import type { Bullet, Experience } from '@/lib/work';

/*
 * Experience as a traced route rather than a stack of cards: a line down the
 * left that fills as you scroll, a node per role that lights when it reaches
 * the read line, and a title that resolves out of scrambled characters the
 * first time it does.
 *
 * All of it is IntersectionObserver plus one rAF-throttled scroll handler —
 * no scroll library, and every effect degrades to plain static content under
 * prefers-reduced-motion.
 */

/*
 * Two browser-only facts, read once per mount and held stable. They cannot be
 * computed during render — the server has no window — and setting them from
 * an effect would cascade a second render on every node.
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

const SCRAMBLE = '!<>-_\\/[]{}—=+*^?#01';
const SCRAMBLE_MS = 45;
const SCRAMBLE_STEPS = 12;

/** Resolves `text` out of noise, a character at a time. */
function useDecrypt(text: string, active: boolean) {
  const [output, setOutput] = useState(text);
  const done = useRef(false);
  const reduced = useClientFlag(prefersReducedMotion);

  useEffect(() => {
    if (!active || done.current || reduced) return;

    done.current = true;
    let step = 0;
    const timer = setInterval(() => {
      step += 1;
      // Characters lock in left to right; everything past the front is noise.
      const settled = Math.floor((step / SCRAMBLE_STEPS) * text.length);
      setOutput(
        text
          .split('')
          .map((char, i) => {
            if (i < settled || char === ' ') return char;
            return SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
          })
          .join(''),
      );
      if (step >= SCRAMBLE_STEPS) {
        clearInterval(timer);
        setOutput(text);
      }
    }, SCRAMBLE_MS);

    return () => clearInterval(timer);
  }, [text, active, reduced]);

  return output;
}

function BulletList({ items }: { items: Bullet[] }) {
  return (
    <ul className="space-y-3 text-muted">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="text-accent mt-1 text-xs shrink-0">›</span>
          <span className="leading-relaxed">
            {typeof item === 'string' ? (
              item
            ) : (
              <>
                <strong className="text-body font-semibold">{item.lead}</strong> {item.text}
              </>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Node({ exp, index, isCurrent }: { exp: Experience; index: number; isCurrent: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);
  const observerless = useClientFlag(hasNoObserver);
  const active = seen || observerless;
  const title = useDecrypt(exp.title, active);

  useEffect(() => {
    const el = ref.current;
    if (!el || observerless) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setSeen(true);
        observer.disconnect();
      },
      { rootMargin: '0px 0px -25% 0px', threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [observerless]);

  return (
    <article
      ref={ref}
      className={`relative pl-10 md:pl-14 transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-30'}`}
    >
      {/* Node marker on the trace */}
      <span
        aria-hidden="true"
        className={`absolute left-0 top-1.5 flex items-center justify-center w-6 h-6 border text-[0.6rem] transition-colors duration-300 ${
          active ? 'border-accent text-accent bg-bg' : 'border-line text-muted bg-bg'
        }`}
      >
        {active ? '◆' : '◇'}
      </span>

      <div className="interactive-card rounded-none p-5 md:p-7 space-y-4">
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
          <h3 className={`text-xl font-bold ${active ? 'text-body' : 'text-muted'}`}>{title}</h3>
          <span className="text-xs uppercase tracking-wider shrink-0">
            <span className={isCurrent ? 'text-accent' : 'text-muted'}>
              [{isCurrent ? 'ACTIVE' : 'ARCHIVED'}]
            </span>{' '}
            <span className="text-muted">{exp.date}</span>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
          <span className="flex items-center gap-2 text-body">
            <Briefcase className="w-4 h-4 text-muted" />
            {exp.link ? (
              <a href={exp.link} target="_blank" rel="noopener noreferrer">
                {exp.company}
              </a>
            ) : (
              exp.company
            )}
          </span>
          <span className="hidden sm:inline text-line">•</span>
          <span className="text-xs text-muted">{exp.location}</span>
        </div>

        <BulletList items={exp.description.slice(0, 1)} />

        {exp.description.length > 1 && (
          <details className="border-t border-line pt-3">
            <summary className="text-xs text-muted hover:text-accent transition-colors select-none">
              {exp.description.length - 1} more
            </summary>
            <div className="pt-4">
              <BulletList items={exp.description.slice(1)} />
            </div>
          </details>
        )}
      </div>

      <span aria-hidden="true" className="absolute left-7 md:left-9 top-3 text-[0.6rem] text-muted hidden md:block">
        {String(index + 1).padStart(2, '0')}
      </span>
    </article>
  );
}

export default function ExperienceTimeline({ experiences }: { experiences: Experience[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(0);
  const reduced = useClientFlag(prefersReducedMotion);
  const progress = reduced ? 1 : scrolled;

  // Fills the trace line from 0 to 1 as the list crosses the middle of the
  // viewport. rAF-throttled so scrolling stays cheap.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || reduced) return;

    let queued = false;

    const measure = () => {
      queued = false;
      const rect = track.getBoundingClientRect();
      const line = window.innerHeight * 0.55;
      const value = (line - rect.top) / rect.height;
      setScrolled(Math.min(Math.max(value, 0), 1));
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
      {/* The trace: a dim rail with a lit section that grows as you read. */}
      <div aria-hidden="true" className="absolute left-3 top-2 bottom-2 w-px bg-line">
        <span
          className="absolute inset-x-0 top-0 bg-accent"
          style={{ height: `${progress * 100}%`, boxShadow: '0 0 8px rgba(0,255,156,0.6)' }}
        />
      </div>

      {experiences.map((exp, i) => (
        <Node key={exp.title + exp.date} exp={exp} index={i} isCurrent={exp.date.includes('Present')} />
      ))}

      <p aria-hidden="true" className="relative pl-10 md:pl-14 text-[0.65rem] text-muted">
        <span className="text-accent">◆</span> route traced · {experiences.length} nodes
      </p>
    </div>
  );
}
