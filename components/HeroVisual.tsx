'use client';

import dynamic from 'next/dynamic';
import { useContext, useEffect, useState } from 'react';
import StaticOrbitDiagram from '@/components/StaticOrbitDiagram';
import { InDesktopContext, useDesktop } from '@/components/desktop/DesktopProvider';

/*
 * Decides what the hero shows. The three.js globe is ~150 KB gzipped, so it
 * only loads where it earns that: a wide viewport, no reduced-motion
 * preference. Everywhere else the existing SVG diagram stands in, and it is
 * also what renders first while the globe chunk is still in flight.
 */
const LeoGlobe = dynamic(() => import('@/components/LeoGlobe'), {
  ssr: false,
  loading: () => <StaticOrbitDiagram />,
});

const WIDE = '(min-width: 1024px) and (hover: hover) and (pointer: fine)';
const REDUCED = '(prefers-reduced-motion: reduce)';

export default function HeroVisual() {
  const [use3d, setUse3d] = useState(false);
  const managed = useContext(InDesktopContext);
  const desktop = useDesktop();
  const visible = !managed || Boolean(desktop?.isOpen('globe'));

  useEffect(() => {
    const wide = window.matchMedia(WIDE);
    const reduced = window.matchMedia(REDUCED);

    const sync = () => setUse3d(window.self === window.top && wide.matches && !reduced.matches);
    sync();

    wide.addEventListener('change', sync);
    reduced.addEventListener('change', sync);
    return () => {
      wide.removeEventListener('change', sync);
      reduced.removeEventListener('change', sync);
    };
  }, []);

  return use3d && visible ? <LeoGlobe /> : <StaticOrbitDiagram />;
}
