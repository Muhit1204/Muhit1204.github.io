'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import styles from './InteractiveNetworkMap.module.css';

export type CityPoint = Readonly<{ x: number; y: number }>;
export type CityDestination = Readonly<{
  id: 'publications' | 'projects' | 'experience' | 'contact' | 'education';
  label: string;
  href: string;
  xPercent: number;
  yPercent: number;
}>;
export type CityRoadSafeCorridor = Readonly<{ id: string; polygon: readonly CityPoint[] }>;
export type CityTrafficRoute = Readonly<{
  id: string;
  corridorId: string;
  from: CityPoint;
  to: CityPoint;
  sprite: string;
  width: number;
  height: number;
  footprint: Readonly<{ width: number; height: number }>;
  durationSeconds: number;
  delaySeconds: number;
  desktopOnly: boolean;
}>;

export const CITY_DESTINATIONS: readonly CityDestination[] = [
  { id: 'publications', label: 'Publications', href: '/publications', xPercent: 25, yPercent: 34 },
  { id: 'projects', label: 'Research Projects', href: '/projects', xPercent: 48, yPercent: 40 },
  { id: 'experience', label: 'Experience', href: '/experience', xPercent: 66, yPercent: 34 },
  { id: 'contact', label: 'Contact', href: '/contact', xPercent: 82, yPercent: 47 },
  { id: 'education', label: 'Education', href: '/education', xPercent: 27, yPercent: 72 },
];

function makeCorridor(id: string, start: CityPoint, end: CityPoint, halfWidth: number, endPadding = 150): CityRoadSafeCorridor {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy);
  const ux = dx / length;
  const uy = dy / length;
  const nx = -uy * halfWidth;
  const ny = ux * halfWidth;
  const startX = start.x - ux * endPadding;
  const startY = start.y - uy * endPadding;
  const endX = end.x + ux * endPadding;
  const endY = end.y + uy * endPadding;
  return {
    id,
    polygon: [
      { x: startX + nx, y: startY + ny },
      { x: endX + nx, y: endY + ny },
      { x: endX - nx, y: endY - ny },
      { x: startX - nx, y: startY - ny },
    ],
  };
}

export const CITY_ROAD_SAFE_CORRIDORS: readonly CityRoadSafeCorridor[] = [
  makeCorridor('west-road', { x: -140, y: 650 }, { x: 1000, y: 900 }, 70),
  makeCorridor('foreground-southwest', { x: 520, y: 1490 }, { x: 1480, y: 1110 }, 72),
  makeCorridor('upper-right-perimeter', { x: 1620, y: 865 }, { x: 2710, y: 810 }, 60),
  makeCorridor('lower-right-perimeter', { x: 1500, y: 1530 }, { x: 2350, y: 1240 }, 72),
];

const TERRACOTTA_SE = '/city/v3/car-se-terracotta.webp';
const SAGE_NW = '/city/v3/car-nw-sage.webp';
const GOLD_NE = '/city/v3/car-ne-gold.webp';
const IVORY_SW = '/city/v3/car-sw-ivory-van.webp';

export const CITY_TRAFFIC_ROUTES: readonly CityTrafficRoute[] = [
  { id: 'west-road-se', corridorId: 'west-road', from: { x: -140, y: 650 }, to: { x: 1000, y: 900 }, sprite: TERRACOTTA_SE, width: 104, height: 59, footprint: { width: 72, height: 42 }, durationSeconds: 19, delaySeconds: -3, desktopOnly: false },
  { id: 'west-road-nw', corridorId: 'west-road', from: { x: 1000, y: 900 }, to: { x: -140, y: 650 }, sprite: SAGE_NW, width: 104, height: 59, footprint: { width: 72, height: 42 }, durationSeconds: 23, delaySeconds: -14, desktopOnly: true },
  { id: 'foreground-southwest-ne', corridorId: 'foreground-southwest', from: { x: 520, y: 1490 }, to: { x: 1480, y: 1110 }, sprite: GOLD_NE, width: 104, height: 59, footprint: { width: 72, height: 42 }, durationSeconds: 22, delaySeconds: -7, desktopOnly: true },
  { id: 'foreground-southwest-sw', corridorId: 'foreground-southwest', from: { x: 1480, y: 1110 }, to: { x: 520, y: 1490 }, sprite: IVORY_SW, width: 112, height: 63, footprint: { width: 80, height: 46 }, durationSeconds: 27, delaySeconds: -20, desktopOnly: true },
  { id: 'upper-right-ne', corridorId: 'upper-right-perimeter', from: { x: 1620, y: 865 }, to: { x: 2710, y: 810 }, sprite: GOLD_NE, width: 102, height: 58, footprint: { width: 72, height: 42 }, durationSeconds: 24, delaySeconds: -11, desktopOnly: true },
  { id: 'upper-right-sw', corridorId: 'upper-right-perimeter', from: { x: 2710, y: 810 }, to: { x: 1620, y: 865 }, sprite: IVORY_SW, width: 110, height: 62, footprint: { width: 80, height: 46 }, durationSeconds: 29, delaySeconds: -24, desktopOnly: true },
  { id: 'lower-right-ne', corridorId: 'lower-right-perimeter', from: { x: 1500, y: 1530 }, to: { x: 2350, y: 1240 }, sprite: GOLD_NE, width: 102, height: 58, footprint: { width: 72, height: 42 }, durationSeconds: 21, delaySeconds: -16, desktopOnly: true },
  { id: 'lower-right-sw', corridorId: 'lower-right-perimeter', from: { x: 2350, y: 1240 }, to: { x: 1500, y: 1530 }, sprite: IVORY_SW, width: 110, height: 62, footprint: { width: 80, height: 46 }, durationSeconds: 26, delaySeconds: -8, desktopOnly: true },
];
export default function InteractiveNetworkMap() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef<SVGSVGElement>(null);
  const [motionReady, setMotionReady] = useState(false);
  const [motionPlaying, setMotionPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [desktopViewport, setDesktopViewport] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const syncViewport = () => setDesktopViewport(mediaQuery.matches);
    mediaQuery.addEventListener('change', syncViewport);
    syncViewport();
    return () => mediaQuery.removeEventListener('change', syncViewport);
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || motionReady) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setMotionReady(true);
      observer.disconnect();
    }, { rootMargin: '240px 0px', threshold: 0.01 });
    observer.observe(scene);
    return () => observer.disconnect();
  }, [motionReady]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!motionReady || !scene) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isOnScreen = false;
    const syncMotionState = () => {
      const prefersReduction = mediaQuery.matches;
      setReducedMotion(prefersReduction);
      setMotionPlaying(isOnScreen && !document.hidden && !prefersReduction);
    };
    const observer = new IntersectionObserver(([entry]) => {
      isOnScreen = entry.isIntersecting;
      syncMotionState();
    }, { rootMargin: '120px 0px', threshold: 0.05 });
    observer.observe(scene);
    document.addEventListener('visibilitychange', syncMotionState);
    mediaQuery.addEventListener('change', syncMotionState);
    syncMotionState();
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncMotionState);
      mediaQuery.removeEventListener('change', syncMotionState);
    };
  }, [motionReady]);

  useEffect(() => {
    const layer = motionRef.current;
    if (!layer) return;
    if (motionPlaying) layer.unpauseAnimations?.();
    else layer.pauseAnimations?.();
  }, [motionPlaying, motionReady]);

  return (
    <section id="interactive-city" className={styles.shell} aria-label="Interactive portfolio city">
      <p id="city-mobile-guidance" className={styles.mobileGuidance}>Swipe to explore. For the full immersive city experience, visit on desktop.</p>
      <div className={styles.panorama} tabIndex={0} aria-label="Scrollable interactive city panorama" aria-describedby="city-mobile-guidance">
        <div ref={sceneRef} className={`${styles.stage} ${motionPlaying ? '' : styles.motionPaused}`}>
          <picture>
            <source type="image/avif" sizes="(min-width: 768px) min(1440px, calc(100vw - 24px)), 820px" srcSet="/city/v3/city-base-768.avif 768w, /city/v3/city-base-1280.avif 1280w, /city/v3/city-base-1920.avif 1920w, /city/v3/city-base-2560.avif 2560w" />
            <source type="image/webp" sizes="(min-width: 768px) min(1440px, calc(100vw - 24px)), 820px" srcSet="/city/v3/city-base-768.webp 768w, /city/v3/city-base-1280.webp 1280w, /city/v3/city-base-1920.webp 1920w, /city/v3/city-base-2560.webp 2560w" />
            <img src="/city/v3/city-base-1280.webp" alt="An illustrated waterfront portfolio city with dedicated buildings for publications, research projects, experience, contact, education, and a future gallery" width={2560} height={1440} loading="lazy" decoding="async" className={styles.baseImage} />
          </picture>

          {motionReady && !reducedMotion ? (
            <svg ref={motionRef} className={styles.motionLayer} viewBox="0 0 2560 1440" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
              {desktopViewport ? <g className={styles.windowGlow}><image href="/city/v3/window-glow.webp" x="0" y="0" width="2560" height="1440" /></g> : null}
              {CITY_TRAFFIC_ROUTES.filter((route) => desktopViewport || !route.desktopOnly).map((route) => (
                <g key={route.id} data-route-id={route.id} className={route.desktopOnly ? styles.desktopOnly : undefined}>
                  <image href={route.sprite} x={-route.width / 2} y={-route.height / 2} width={route.width} height={route.height} preserveAspectRatio="xMidYMid meet" />
                  <animateMotion dur={`${route.durationSeconds}s`} begin={`${route.delaySeconds}s`} path={`M ${route.from.x} ${route.from.y} L ${route.to.x} ${route.to.y}`} repeatCount="indefinite" />
                </g>
              ))}
              <g><image href="/city/v3/satellite.webp" x="-179" y="112" width="128" height="67" /><animateMotion dur="34s" begin="-9s" path="M 0 0 L 3050 90" repeatCount="indefinite" /></g>
              {desktopViewport ? <g className={styles.desktopOnly} opacity="0.72"><image href="/city/v3/satellite.webp" x="-231" y="260" width="110" height="58" /><animateMotion dur="47s" begin="-27s" path="M 0 0 L 3150 -135" repeatCount="indefinite" /></g> : null}
              <g className={styles.dish}>
                <image href="/city/v3/dish-head.webp" x="1162" y="350" width="132" height="121" />
                <animateTransform attributeName="transform" type="rotate" values="-4 1228 471; 5 1228 471; -4 1228 471" dur="9s" repeatCount="indefinite" />
              </g>
              <g className={styles.smokePrimary}>
                <image href="/city/v3/cafe-smoke.webp" x="1902" y="360" width="138" height="207" />
                <animateTransform attributeName="transform" type="translate" values="0 58; 6 -88" dur="7.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;0.82;0.62;0" keyTimes="0;0.2;0.62;1" dur="7.2s" repeatCount="indefinite" />
              </g>
              {desktopViewport ? <g className={styles.smokeSecondary}>
                <image href="/city/v3/cafe-smoke.webp" x="1920" y="389" width="104" height="156" />
                <animateTransform attributeName="transform" type="translate" values="0 42; -8 -72" dur="7.2s" begin="-3.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;0.62;0.44;0" keyTimes="0;0.2;0.62;1" dur="7.2s" begin="-3.6s" repeatCount="indefinite" />
              </g> : null}
            </svg>
          ) : null}

          <nav className={styles.destinationLayer} aria-label="City destinations">
            {CITY_DESTINATIONS.map((destination) => (
              <Link key={destination.id} href={destination.href} prefetch={false} className={styles.destination} style={{ left: `${destination.xPercent}%`, top: `${destination.yPercent}%` }}>
                {destination.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
