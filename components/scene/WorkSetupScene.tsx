'use client';

import { useEffect, useRef, useState } from 'react';
import { createScene, type SceneView } from '@/components/scene/createScene';
import type { ClockReading } from '@/lib/clock';

export default function WorkSetupScene({ onFailure }: { onFailure: () => void }) {
  const host = useRef<HTMLDivElement>(null);
  const scene = useRef<ReturnType<typeof createScene> | null>(null);
  const [view, setView] = useState<SceneView>('desk');
  const [moving, setMoving] = useState(false);
  const [clock, setClock] = useState<ClockReading | null>(null);
  const back = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!host.current) return;
    try {
      scene.current = createScene(host.current, (next, inMotion) => { setView(next); setMoving(inMotion); }, onFailure, setClock);
    } catch { onFailure(); }
    return () => { scene.current?.dispose(); scene.current = null; };
  }, [onFailure]);

  return (
    <>
      <div ref={host} className="absolute inset-0" data-scene-view={view} data-scene-moving={moving} />
      <p className="sr-only">Satellite communications and cybersecurity research desk with a dish model, CubeSat, RF receiver, network switch, annotated papers, and everyday desk clutter.</p>
      {clock && <p className="sr-only">Workstation local clock: <time dateTime={clock.dateTime}>{clock.time} {clock.zone}</time></p>}
      <nav aria-label="Desk view" className="absolute bottom-5 inset-x-0 flex items-center justify-center gap-2 z-10">
        <button
          type="button"
          ref={back}
          className="btn !px-5 !py-3"
          onClick={() => { scene.current?.setView(view === 'desk' ? 'monitor' : 'desk'); back.current?.focus(); }}
          disabled={moving}
        >
          {moving ? 'Moving…' : view === 'desk' ? 'Use the monitor' : 'Back to desk'}
        </button>
        <span className="sr-only" role="status">{moving ? 'Changing view' : view === 'desk' ? 'Desk view. Select the monitor to use the portfolio.' : 'Monitor ready. The portfolio is interactive.'}</span>
      </nav>
    </>
  );
}
