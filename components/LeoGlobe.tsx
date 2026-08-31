'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/*
 * A LEO constellation over the Gulf Coast: wireframe Earth, three orbital
 * shells, and a ground station at the Port of Beaumont that holds a link to
 * whichever satellite is overhead — dropping to a red dashed line during a
 * handoff, which is the failure mode the research is actually about.
 *
 * Rendered only where it earns its weight: HeroVisual keeps the SVG diagram
 * for small screens and for prefers-reduced-motion, and loads this lazily.
 */

const ACCENT = 0x00ff9c;
const DANGER = 0xff4438;
const LINE = 0x1c2a20;
const MUTED = 0x4a6b56;

const EARTH_RADIUS = 1;
const ORBIT_RADIUS = 1.42;

// Port of Beaumont, Texas.
const GROUND_LAT = 30.08;
const GROUND_LON = -94.13;

/** Latitude/longitude in degrees to a point on a sphere of the given radius. */
function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

type Shell = { inclination: number; phase: number; speed: number; count: number };

const SHELLS: Shell[] = [
  { inclination: 0.9, phase: 0, speed: 0.22, count: 6 },
  { inclination: -0.6, phase: 1.9, speed: 0.28, count: 5 },
  { inclination: 0.35, phase: 3.4, speed: 0.18, count: 6 },
];

export default function LeoGlobe() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<{ linked: boolean; id: string }>({
    linked: true,
    id: 'LEO-01',
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 1.1, 4.1);
    camera.lookAt(0, 0, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      // No WebGL (old browser, blocked GPU) — leave the container empty and
      // let the caller's fallback stand.
      return;
    }
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    /* The globe itself: a wireframe shell over a barely-there solid, so it
       reads as a diagram rather than a photograph. */
    const world = new THREE.Group();
    scene.add(world);

    const globeGeometry = new THREE.IcosahedronGeometry(EARTH_RADIUS, 3);
    world.add(
      new THREE.Mesh(
        globeGeometry,
        new THREE.MeshBasicMaterial({ color: 0x081109, transparent: true, opacity: 0.85 }),
      ),
    );
    world.add(
      new THREE.LineSegments(
        new THREE.WireframeGeometry(globeGeometry),
        new THREE.LineBasicMaterial({ color: LINE, transparent: true, opacity: 0.85 }),
      ),
    );

    // Latitude rings, thinning toward the poles.
    for (let lat = -60; lat <= 60; lat += 30) {
      const r = EARTH_RADIUS * Math.cos((lat * Math.PI) / 180);
      const points = Array.from({ length: 65 }, (_, i) => {
        const a = (i / 64) * Math.PI * 2;
        return new THREE.Vector3(
          Math.cos(a) * r,
          EARTH_RADIUS * Math.sin((lat * Math.PI) / 180),
          Math.sin(a) * r,
        );
      });
      world.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(points),
          new THREE.LineBasicMaterial({ color: MUTED, transparent: true, opacity: 0.22 }),
        ),
      );
    }

    // Ground station at the Port of Beaumont.
    const groundPosition = latLonToVector3(GROUND_LAT, GROUND_LON, EARTH_RADIUS);
    const groundMarker = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 12, 12),
      new THREE.MeshBasicMaterial({ color: ACCENT }),
    );
    groundMarker.position.copy(groundPosition);
    world.add(groundMarker);

    const groundHalo = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 12, 12),
      new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.25 }),
    );
    groundHalo.position.copy(groundPosition);
    world.add(groundHalo);

    /* Orbital shells. Each is a tilted circle; satellites ride it at a fixed
       angular rate, which is enough to make handoffs happen on their own. */
    type Satellite = { mesh: THREE.Mesh; shell: Shell; offset: number };
    const satellites: Satellite[] = [];

    SHELLS.forEach((shell) => {
      const points = Array.from({ length: 129 }, (_, i) => {
        const a = (i / 128) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(a) * ORBIT_RADIUS, 0, Math.sin(a) * ORBIT_RADIUS);
      });
      const orbit = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.16 }),
      );
      orbit.rotation.x = shell.inclination;
      orbit.rotation.y = shell.phase;
      world.add(orbit);

      for (let i = 0; i < shell.count; i += 1) {
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.028, 8, 8),
          new THREE.MeshBasicMaterial({ color: ACCENT }),
        );
        world.add(mesh);
        satellites.push({ mesh, shell, offset: (i / shell.count) * Math.PI * 2 });
      }
    });

    // The active link, redrawn each frame between ground station and satellite.
    const linkGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]);
    const linkMaterial = new THREE.LineBasicMaterial({ color: ACCENT, transparent: true });
    const link = new THREE.Line(linkGeometry, linkMaterial);
    world.add(link);

    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      if (clientWidth === 0 || clientHeight === 0) return;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    const clock = new THREE.Clock();

    /* Pause when scrolled away or the tab is hidden — an idle GPU loop behind
       a hidden hero is pure battery cost. */
    let running = true;
    const visibility = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting && !document.hidden;
        if (running) clock.getDelta();
      },
      { threshold: 0 },
    );
    visibility.observe(mount);

    const onVisibilityChange = () => {
      running = !document.hidden;
      if (running) clock.getDelta();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    let elapsed = 0;
    let frame = 0;
    let activeIndex = -1;
    let handoffUntil = 0;
    const worldPosition = new THREE.Vector3();
    const groundWorld = new THREE.Vector3();
    const orbitPosition = new THREE.Vector3();
    const orbitRotation = new THREE.Euler();
    const linkPoints = [new THREE.Vector3(), new THREE.Vector3()];

    const animate = () => {
      frame = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (!running) return;
      elapsed += delta;

      world.rotation.y += delta * 0.06;

      // Advance every satellite along its inclined circle.
      satellites.forEach(({ mesh, shell, offset }) => {
        const angle = offset + elapsed * shell.speed;
        orbitPosition.set(Math.cos(angle) * ORBIT_RADIUS, 0, Math.sin(angle) * ORBIT_RADIUS);
        orbitRotation.set(shell.inclination, shell.phase, 0);
        mesh.position.copy(orbitPosition.applyEuler(orbitRotation));
      });

      // Link to whichever satellite is closest to the ground station and on
      // its side of the planet.
      groundMarker.getWorldPosition(groundWorld);
      let best = -1;
      let bestDistance = Infinity;
      satellites.forEach((satellite, i) => {
        satellite.mesh.getWorldPosition(worldPosition);
        if (worldPosition.dot(groundWorld) <= 0) return;
        const distance = worldPosition.distanceTo(groundWorld);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = i;
        }
      });

      if (best !== activeIndex) {
        // Switching satellites is a handoff — the link degrades briefly.
        if (activeIndex !== -1 && best !== -1) handoffUntil = elapsed + 0.7;
        activeIndex = best;
        setStatus({
          linked: best !== -1,
          id: best === -1 ? '—' : `LEO-${String(best + 1).padStart(2, '0')}`,
        });
      }

      const handoff = elapsed < handoffUntil;
      if (activeIndex === -1) {
        link.visible = false;
      } else {
        link.visible = true;
        satellites[activeIndex].mesh.getWorldPosition(worldPosition);
        linkPoints[0].copy(groundWorld);
        linkPoints[1].copy(worldPosition);
        linkGeometry.setFromPoints(linkPoints);
        linkMaterial.color.setHex(handoff ? DANGER : ACCENT);
        linkMaterial.opacity = handoff ? 0.5 + Math.sin(elapsed * 30) * 0.3 : 0.85;
      }

      groundHalo.scale.setScalar(1 + Math.sin(elapsed * 2) * 0.25);

      satellites.forEach((satellite, i) => {
        const material = satellite.mesh.material as THREE.MeshBasicMaterial;
        material.color.setHex(i === activeIndex && handoff ? DANGER : ACCENT);
        material.opacity = i === activeIndex ? 1 : 0.55;
        material.transparent = true;
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibility.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      // Three keeps GPU handles until asked; leaking them across route changes
      // is how a page ends up with a dozen live contexts.
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.LineSegments) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) material.forEach((m) => m.dispose());
          else material.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className="relative w-full h-64 md:h-[26rem] bg-bg">
      <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />

      {/* The same state in text, for anyone who cannot see the canvas. */}
      <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur border border-line rounded-none px-3 py-2 text-xs font-mono">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-muted">Status:</span>
          {status.linked ? (
            <span className="text-accent flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-accent" /> Connected
            </span>
          ) : (
            <span className="text-danger flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-danger animate-pulse" /> Acquiring
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted">Active Sat:</span>
          <span className="text-body font-medium">{status.id}</span>
        </div>
      </div>

      <p className="absolute bottom-3 right-4 font-mono text-[0.65rem] text-muted">
        LEO constellation · ground station: Port of Beaumont
      </p>
    </div>
  );
}
