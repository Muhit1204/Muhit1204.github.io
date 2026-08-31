'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { AnimatePresence, motion } from 'motion/react';

/*
 * A machine coming up: firmware, kernel, services, login, session handoff.
 * It deliberately takes a few seconds — the point is the feeling of watching
 * something start, not a splash screen. Skippable at any moment, and it never
 * blocks the page, which renders underneath from first paint.
 */

type Line =
  | { kind: 'cmd'; text: string }
  | { kind: 'raw'; text: string; tone?: Tone }
  | { kind: 'svc'; text: string; ms: number; status?: 'ok' | 'warn' }
  | { kind: 'bar'; text: string }
  | { kind: 'gap' };

type Tone = 'muted' | 'accent' | 'warn' | 'danger';

const LINES: Line[] = [
  { kind: 'raw', text: 'ORBITAL BIOS v4.11 — Lamar/CDAC reference platform', tone: 'muted' },
  { kind: 'raw', text: 'CPU: 16 core  MEM: 128 GB unified  GPU: GB10', tone: 'muted' },
  { kind: 'raw', text: 'Detecting boot device ... nvme0n1', tone: 'muted' },
  { kind: 'gap' },
  { kind: 'raw', text: 'Loading kernel modules', tone: 'accent' },
  { kind: 'svc', text: 'mount /research', ms: 41 },
  { kind: 'svc', text: 'load module dtn.ko (delay tolerant networking)', ms: 118 },
  { kind: 'svc', text: 'load module leo_link.ko', ms: 63 },
  { kind: 'svc', text: 'load module ns3_sim.ko', ms: 204 },
  { kind: 'gap' },
  { kind: 'raw', text: 'Starting services', tone: 'accent' },
  { kind: 'svc', text: 'telemetry-ingest.service', ms: 87 },
  { kind: 'svc', text: 'throughput-forecast.service', ms: 156 },
  { kind: 'svc', text: 'threat-monitor.service  [MITRE ATT&CK for ICS]', ms: 92 },
  { kind: 'svc', text: 'ground-station.service  [Port of Beaumont]', ms: 311 },
  { kind: 'svc', text: 'link integrity check', ms: 240, status: 'warn' },
  { kind: 'gap' },
  { kind: 'bar', text: 'Synchronising constellation ephemeris' },
  { kind: 'gap' },
  { kind: 'raw', text: 'portfolio login: ', tone: 'muted' },
  { kind: 'cmd', text: 'muntasir' },
  { kind: 'raw', text: 'Authenticating ... key accepted', tone: 'accent' },
  { kind: 'gap' },
  { kind: 'raw', text: 'Last login: today from 127.0.0.1', tone: 'muted' },
  { kind: 'raw', text: 'Md Muntasir Hossain — Doctor of Engineering, ECE', tone: 'accent' },
  { kind: 'raw', text: 'Satellite communication · network security · applied ML', tone: 'muted' },
  { kind: 'gap' },
  { kind: 'cmd', text: './portfolio --start' },
];

const CHAR_MS = 32;
const LINE_MS = 90;
const BAR_STEPS = 24;
const BAR_MS = 34;
const HOLD_MS = 520;

const TONE_CLASS: Record<Tone, string> = {
  muted: 'text-muted',
  accent: 'text-accent',
  warn: 'text-warn',
  danger: 'text-danger',
};

/*
 * The boot plays on every load by design — it is the front door. The only
 * thing that suppresses it is the visitor's motion preference: a typing
 * animation is exactly the pattern reduced-motion asks us to drop, so it is
 * skipped outright rather than shortened.
 */
function computeShouldPlay(): boolean {
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Never changes after first paint, so there is nothing to subscribe to. */
const subscribe = () => () => {};

export default function BootSequence() {
  /* Answered once per mount so the snapshot stays stable across renders. */
  const shouldPlayRef = useRef<boolean | null>(null);
  const getShouldPlay = useCallback(() => {
    if (shouldPlayRef.current === null) shouldPlayRef.current = computeShouldPlay();
    return shouldPlayRef.current;
  }, []);

  // False on the server and on the first client render, so the page below
  // always paints before the overlay is considered.
  const shouldPlay = useSyncExternalStore(subscribe, getShouldPlay, () => false);
  const [dismissed, setDismissed] = useState(false);
  const visible = shouldPlay && !dismissed;

  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState('');
  const [bar, setBar] = useState(0);
  const skipRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setDismissed(true);
  }, []);

  // Drives the sequence: commands type out, service lines land whole, the
  // progress bar fills a step at a time.
  useEffect(() => {
    if (!visible) return;

    const schedule = (fn: () => void, ms: number) => {
      timer.current = setTimeout(fn, ms);
    };

    if (step >= LINES.length) {
      schedule(dismiss, HOLD_MS);
      return () => {
        if (timer.current) clearTimeout(timer.current);
      };
    }

    const line = LINES[step];

    if (line.kind === 'cmd') {
      if (typed.length < line.text.length) {
        schedule(() => setTyped(line.text.slice(0, typed.length + 1)), CHAR_MS);
      } else {
        schedule(() => {
          setTyped('');
          setStep((s) => s + 1);
        }, LINE_MS * 3);
      }
    } else if (line.kind === 'bar') {
      if (bar < BAR_STEPS) {
        schedule(() => setBar((b) => b + 1), BAR_MS);
      } else {
        schedule(() => setStep((s) => s + 1), LINE_MS * 2);
      }
    } else {
      // Service lines pay their own stated cost, so the boot has real rhythm
      // instead of a metronome.
      const delay = line.kind === 'svc' ? Math.min(line.ms, 260) : LINE_MS;
      schedule(() => setStep((s) => s + 1), delay);
    }

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [visible, step, typed, bar, dismiss]);

  useEffect(() => {
    if (!visible) return;
    skipRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') dismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, dismiss]);

  // Keep the newest line in view once the log outgrows the viewport.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [step, bar]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const rendered = LINES.slice(0, step);
  const active = step < LINES.length ? LINES[step] : null;
  const progress = Math.round((step / LINES.length) * 100);

  const renderLine = (line: Line, key: number, barFill = BAR_STEPS) => {
    switch (line.kind) {
      case 'gap':
        return <div key={key} className="h-3" />;
      case 'cmd':
        return (
          <p key={key} className="text-body">
            <span className="text-accent">muntasir@portfolio</span>
            <span className="text-muted">:~$ </span>
            {line.text}
          </p>
        );
      case 'svc':
        return (
          <p key={key} className="flex gap-3 text-muted">
            <span className={line.status === 'warn' ? 'text-warn' : 'text-accent'}>
              [{line.status === 'warn' ? 'WARN' : ' OK '}]
            </span>
            <span className="flex-1 truncate">{line.text}</span>
            <span className="hidden sm:inline tabular-nums">{line.ms}ms</span>
          </p>
        );
      case 'bar':
        return (
          <p key={key} className="text-muted">
            {line.text}{' '}
            <span className="text-accent">
              [{'█'.repeat(barFill)}
              {'·'.repeat(BAR_STEPS - barFill)}]
            </span>{' '}
            <span className="tabular-nums">{Math.round((barFill / BAR_STEPS) * 100)}%</span>
          </p>
        );
      default:
        return (
          <p key={key} className={TONE_CLASS[line.tone ?? 'muted']}>
            {line.text}
          </p>
        );
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] bg-bg flex flex-col"
        >
          <div ref={scrollRef} className="flex-1 overflow-hidden px-4 py-6 md:px-10 md:py-10">
            {/* Decorative: everything here is on the page underneath. */}
            <div aria-hidden="true" className="max-w-3xl mx-auto text-xs md:text-sm leading-relaxed space-y-0.5">
              {rendered.map((line, i) => renderLine(line, i))}

              {active?.kind === 'cmd' && (
                <p className="text-body">
                  <span className="text-accent">muntasir@portfolio</span>
                  <span className="text-muted">:~$ </span>
                  {typed}
                  <span className="term-cursor" />
                </p>
              )}
              {active?.kind === 'bar' && renderLine(active, -1, bar)}
            </div>
          </div>

          {/* Fixed footer so the skip control never scrolls away. */}
          <div className="border-t border-line px-4 py-3 md:px-10 flex items-center gap-4 text-xs">
            <span aria-hidden="true" className="text-muted tabular-nums hidden sm:inline">
              boot {progress}%
            </span>
            <div aria-hidden="true" className="flex-1 h-px bg-line relative overflow-hidden">
              <span
                className="absolute inset-y-0 left-0 bg-accent transition-[width] duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
            <button
              ref={skipRef}
              type="button"
              onClick={dismiss}
              className="border border-line px-3 py-1.5 uppercase tracking-widest text-muted transition-colors hover:border-accent-dim hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Skip <span className="hidden sm:inline">— esc</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
