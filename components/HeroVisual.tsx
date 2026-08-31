'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import SatelliteOrbitDiagram from '@/components/SatelliteOrbitDiagram';

/*
 * Decides what the hero shows. The three.js globe is ~150 KB gzipped, so it
 * only loads where it earns that: a wide viewport, no reduced-motion
 * preference. Everywhere else the existing SVG diagram stands in, and it is
 * also what renders first while the globe chunk is still in flight.
 */
const LeoGlobe = dynamic(() => import('@/components/LeoGlobe'), {
  ssr: false,
  loading: () => <SatelliteOrbitDiagram />,
});

const WIDE = '(min-width: 768px)';
const REDUCED = '(prefers-reduced-motion: reduce)';

export default function HeroVisual() {
  const [use3d, setUse3d] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia(WIDE);
    const reduced = window.matchMedia(REDUCED);

    const sync = () => setUse3d(wide.matches && !reduced.matches);
    sync();

    wide.addEventListener('change', sync);
    reduced.addEventListener('change', sync);
    return () => {
      wide.removeEventListener('change', sync);
      reduced.removeEventListener('change', sync);
    };
  }, []);

  return use3d ? <LeoGlobe /> : <SatelliteOrbitDiagram />;
}
