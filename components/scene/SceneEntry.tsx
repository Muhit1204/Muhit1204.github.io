'use client';

import { useCallback, useEffect, useState, type ComponentType } from 'react';
import Link from 'next/link';
import { desktopDestination, SCENE_SIZE_QUERY } from '@/lib/scene-routing';

type SceneComponent = ComponentType<{ onFailure: () => void }>;

export default function SceneEntry() {
  const [Scene, setScene] = useState<SceneComponent | null>(null);
  const fallback = useCallback(() => { window.location.replace(desktopDestination(window.location.hash)); }, []);

  useEffect(() => {
    let cancelled = false;
    const size = window.matchMedia(SCENE_SIZE_QUERY);
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const check = () => {
      if (!size.matches || motion.matches || window.self !== window.top || desktopDestination(window.location.hash) !== '/desktop') {
        fallback();
        return false;
      }
      return true;
    };
    if (check()) {
      void import('@/components/scene/WorkSetupScene').then((module) => {
        if (!cancelled) setScene(() => module.default);
      }).catch(() => { if (!cancelled) fallback(); });
    }
    size.addEventListener('change', check);
    motion.addEventListener('change', check);
    window.addEventListener('hashchange', check);
    return () => {
      cancelled = true;
      size.removeEventListener('change', check);
      motion.removeEventListener('change', check);
      window.removeEventListener('hashchange', check);
    };
  }, [fallback]);

  return (
    <main className="fixed inset-0 overflow-hidden [background:var(--scene-bg)]">
      {!Scene && <div className="absolute inset-0 grid place-items-center"><p className="font-mono text-sm [color:var(--scene-print)]" role="status">Opening the desk…</p></div>}
      {Scene && <Scene onFailure={fallback} />}
      <header className="absolute top-5 inset-x-6 flex items-center justify-between gap-4 z-20 pointer-events-none">
        <div className="window px-4 py-2 pointer-events-auto">
          <h1 className="font-bold text-sm">Md Muntasir Hossain</h1>
          <p className="font-mono text-[0.7rem] text-body mt-1">Satellite communications + Cybersecurity</p>
        </div>
        <Link href="/desktop" prefetch={false} className="btn !px-4 !py-3 pointer-events-auto">Skip 3D / Open desktop</Link>
      </header>
      <noscript><p className="absolute inset-x-6 top-28 well">The complete portfolio is available on the <Link href="/desktop" prefetch={false} className="text-accent underline">HTML desktop</Link>.</p></noscript>
    </main>
  );
}
