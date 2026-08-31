'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { AnimatePresence, motion } from 'motion/react';

const SESSION_KEY = 'boot-sequence-played';

type Step =
  | { kind: 'cmd'; text: string }
  | { kind: 'out'; text: string; tone?: 'muted' | 'accent' | 'warn' };

// Reflects the actual work rather than a generic scaffold boot.
const STEPS: Step[] = [
  { kind: 'cmd', text: 'whoami' },
  { kind: 'out', text: 'md-muntasir-hossain' },
  { kind: 'out', text: 'Doctor of Engineering, Electrical & Computer Engineering', tone: 'muted' },
  { kind: 'out', text: 'Lamar University — Center for Data Analytics and Cybersecurity', tone: 'muted' },
  { kind: 'cmd', text: 'cat research/focus.txt' },
  { kind: 'out', text: 'satellite communication — maritime LEO broadband, deep space relays' },
  { kind: 'out', text: 'network security — LEO threat surface, ICS/SCADA, MITRE ATT&CK' },
  { kind: 'out', text: 'machine learning — predictive analytics, agentic LLM systems' },
  { kind: 'cmd', text: 'systemctl status portfolio' },
  { kind: 'out', text: '● portfolio.service — research portfolio', tone: 'muted' },
  { kind: 'out', text: '   Active: active (running)', tone: 'accent' },
];

const CHAR_MS = 26;
const OUTPUT_MS = 130;
const HOLD_MS = 650;

const TONE_CLASS: Record<string, string> = {
  muted: 'text-muted',
  accent: 'text-accent',
  warn: 'text-warn',
};

/*
 * Whether the animation should run at all depends on two browser-only facts:
 * the motion preference and the session guard.
 */
function computeShouldPlay(): boolean {
  // A typing animation is exactly the pattern reduced-motion asks us to drop,
  // so it is skipped outright rather than shortened.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;

  try {
    return sessionStorage.getItem(SESSION_KEY) !== '1';
  } catch {
    // Private browsing or blocked storage — play it.
    return true;
  }
}

/** Never changes after first paint, so there is nothing to subscribe to. */
const subscribe = () => () => {};

export default function BootSequence() {
  /*
   * Answered once per mount and then held: dismissal writes the session key,
   * and a snapshot that re-read it would yank the overlay out mid-fade.
   */
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
  const skipRef = useRef<HTMLButtonElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const dismiss = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setDismissed(true);
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // Private browsing or blocked storage — the animation simply replays.
    }
  }, []);

  // Drives the sequence one step at a time; commands type, output appears.
  useEffect(() => {
    if (!visible) return;

    if (step >= STEPS.length) {
      const t = setTimeout(dismiss, HOLD_MS);
      timers.current.push(t);
      return () => clearTimeout(t);
    }

    const current = STEPS[step];

    if (current.kind === 'out') {
      const t = setTimeout(() => setStep((s) => s + 1), OUTPUT_MS);
      timers.current.push(t);
      return () => clearTimeout(t);
    }

    if (typed.length < current.text.length) {
      const t = setTimeout(() => setTyped(current.text.slice(0, typed.length + 1)), CHAR_MS);
      timers.current.push(t);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setTyped('');
      setStep((s) => s + 1);
    }, OUTPUT_MS);
    timers.current.push(t);
    return () => clearTimeout(t);
  }, [visible, step, typed, dismiss]);

  useEffect(() => {
    if (!visible) return;
    skipRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, dismiss]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const rendered = STEPS.slice(0, step);
  const active = step < STEPS.length ? STEPS[step] : null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] bg-bg flex items-center justify-center px-4"
        >
          <div className="w-full max-w-2xl font-mono text-sm md:text-base leading-relaxed">
            {/* Decorative: the same information is on the page underneath. */}
            <div aria-hidden="true" className="space-y-1">
              {rendered.map((line, i) =>
                line.kind === 'cmd' ? (
                  <p key={i} className="text-body">
                    <span className="text-accent">$ </span>
                    {line.text}
                  </p>
                ) : (
                  <p key={i} className={TONE_CLASS[line.tone ?? ''] ?? 'text-body'}>
                    {line.text}
                  </p>
                ),
              )}

              {active?.kind === 'cmd' && (
                <p className="text-body">
                  <span className="text-accent">$ </span>
                  {typed}
                  <span className="term-cursor" />
                </p>
              )}
            </div>

            <button
              ref={skipRef}
              type="button"
              onClick={dismiss}
              className="mt-8 rounded-md border border-line px-4 py-2 text-xs uppercase tracking-widest text-muted transition-colors hover:border-accent-dim hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Skip animation
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
