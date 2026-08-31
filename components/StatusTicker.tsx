'use client';

import { useEffect, useRef, useState } from 'react';

/*
 * A link log that never stops. It is set dressing, not data — but the events
 * it prints are the real ones from the research: handoffs, rain fade, DTN
 * bundle custody, ICS advisory hits. Hidden from assistive tech and from
 * small screens, where the space belongs to the content.
 */

type Level = 'ok' | 'info' | 'warn' | 'err';
type Event = { level: Level; text: string };

const EVENTS: Event[] = [
  { level: 'ok', text: 'link acquired  LEO-{n}  el {el}°' },
  { level: 'info', text: 'handoff  LEO-{n} → LEO-{m}' },
  { level: 'ok', text: 'throughput {tp} Mbps  rtt {rtt} ms' },
  { level: 'warn', text: 'rain fade  margin -{db} dB' },
  { level: 'info', text: 'dtn bundle custody accepted  #{id}' },
  { level: 'ok', text: 'forecast horizon 15m  mae {mae}' },
  { level: 'warn', text: 'jitter above threshold  {rtt} ms' },
  { level: 'err', text: 'signal lost  reacquiring' },
  { level: 'info', text: 'ephemeris sync  {n} sats tracked' },
  { level: 'warn', text: 'ics advisory matched  ATT&CK T0{tid}' },
  { level: 'ok', text: 'integrity check passed' },
  { level: 'info', text: 'ground station  port of beaumont  nominal' },
  { level: 'err', text: 'spoofing heuristic tripped  quarantined' },
  { level: 'ok', text: 'custody transfer complete  {id}' },
];

const LEVEL_CLASS: Record<Level, string> = {
  ok: 'text-accent',
  info: 'text-muted',
  warn: 'text-warn',
  err: 'text-danger',
};

const LEVEL_TAG: Record<Level, string> = {
  ok: ' OK ',
  info: 'INFO',
  warn: 'WARN',
  err: 'FAIL',
};

const MAX_LINES = 9;
const TICK_MS = 1400;

const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];
const between = (lo: number, hi: number) => Math.floor(lo + Math.random() * (hi - lo));

function render(event: Event) {
  const a = between(1, 18);
  let b = between(1, 18);
  if (b === a) b = a === 18 ? 1 : a + 1;

  return event.text
    .replace('{n}', String(a).padStart(2, '0'))
    .replace('{m}', String(b).padStart(2, '0'))
    .replace('{el}', String(between(12, 84)))
    .replace('{tp}', String(between(46, 210)))
    .replace('{rtt}', String(between(28, 140)))
    .replace('{db}', String(between(2, 11)))
    .replace('{id}', between(4096, 65535).toString(16).toUpperCase())
    .replace('{mae}', (Math.random() * 0.4 + 0.1).toFixed(3))
    .replace('{tid}', String(between(800, 899)));
}

type Line = { key: number; level: Level; text: string; stamp: string };

export default function StatusTicker() {
  const [lines, setLines] = useState<Line[]>([]);
  const counter = useRef(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (!document.hidden) {
        const event = pick(EVENTS);
        counter.current += 1;
        const elapsed = counter.current * 3;
        const stamp = `T+${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;

        setLines((current) => [
          ...current.slice(-(MAX_LINES - 1)),
          { key: counter.current, level: event.level, text: render(event), stamp },
        ]);
      }
      // Uneven cadence — a real log does not arrive on a metronome.
      timer = setTimeout(tick, TICK_MS + between(-500, 900));
    };

    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, []);

  if (lines.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="hidden xl:block fixed left-4 bottom-4 z-30 w-64 pointer-events-none text-[0.62rem] leading-relaxed"
    >
      <p className="text-accent/70 mb-1 tracking-widest">SAT-LINK MONITOR</p>
      <div className="space-y-0.5">
        {lines.map((line, i) => (
          <p
            key={line.key}
            className={`${LEVEL_CLASS[line.level]} truncate transition-opacity duration-500`}
            // Older lines fade toward the top of the stack.
            style={{ opacity: 0.25 + (i / Math.max(lines.length - 1, 1)) * 0.6 }}
          >
            <span className="opacity-60">{line.stamp} </span>
            <span>[{LEVEL_TAG[line.level]}] </span>
            {line.text}
          </p>
        ))}
      </div>
    </div>
  );
}
