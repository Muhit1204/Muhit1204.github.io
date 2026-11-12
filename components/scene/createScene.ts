import * as THREE from 'three';
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import { buildSetup, SCREEN, countSceneTriangles } from '@/components/scene/buildSetup';
import { createClockTexture, createSurfaceTextures, createResearchTextures } from '@/components/scene/sceneTextures';
import type { ClockReading } from '@/lib/clock';

export type SceneView = 'desk' | 'monitor';

export function createScene(host: HTMLDivElement, onView: (view: SceneView, moving: boolean) => void, onFailure: () => void, onClock?: (reading: ClockReading) => void) {
  const style = getComputedStyle(document.documentElement);
  const setup = buildSetup((token) => style.getPropertyValue(token).trim());
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
  } catch (error) {
    setup.dispose();
    throw error;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  let surfaces: ReturnType<typeof createSurfaceTextures> | undefined;
  let clock: ReturnType<typeof createClockTexture>;
  let researchTextures: ReturnType<typeof createResearchTextures> | undefined;
  try {
    const palette = (token: string) => style.getPropertyValue(token).trim();
    surfaces = createSurfaceTextures(palette);
    clock = createClockTexture(palette);
    researchTextures = createResearchTextures(palette);
  } catch (error) {
    surfaces?.dispose();
    researchTextures?.dispose();
    setup.dispose(); renderer.dispose(); renderer.forceContextLoss();
    throw error;
  }
  for (const material of [setup.materials.metal, setup.materials.edge, setup.materials.housing, setup.materials.rust]) {
    material.map = surfaces.metal;
    material.needsUpdate = true;
  }
  setup.materials.floor.map = surfaces.floor;
  setup.materials.floor.needsUpdate = true;
  setup.clockMaterial.map = clock.map;
  setup.clockMaterial.needsUpdate = true;
  setup.researchSurfaces.forEach(({ id, material }) => {
    material.map = researchTextures!.maps[id];
    material.needsUpdate = true;
  });
  const glowMaterial = new THREE.SpriteMaterial({ map: surfaces.glow, transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
  setup.glowPoints.forEach(position => {
    const glow = new THREE.Sprite(glowMaterial);
    glow.position.copy(position).add(new THREE.Vector3(0, -0.04, 0.1));
    glow.scale.set(3.4, 1.25, 1);
    setup.scene.add(glow);
  });
  host.dataset.sceneTriangles = String(countSceneTriangles(setup.scene));
  host.dataset.researchProps = setup.scene.userData.researchProps.join(',');
  renderer.domElement.setAttribute('aria-hidden', 'true');
  Object.assign(renderer.domElement.style, { position: 'absolute', inset: '0' });
  host.appendChild(renderer.domElement);
  const css = new CSS3DRenderer();
  Object.assign(css.domElement.style, { position: 'absolute', inset: '0', pointerEvents: 'none' });
  host.appendChild(css.domElement);
  const htmlScene = new THREE.Scene();
  const screen = document.createElement('div');
  screen.style.width = `${SCREEN.pixelsWide}px`;
  screen.style.height = `${SCREEN.pixelsHigh}px`;
  const iframe = document.createElement('iframe');
  iframe.src = '/desktop';
  iframe.title = 'Interactive portfolio desktop';
  iframe.width = String(SCREEN.pixelsWide);
  iframe.height = String(SCREEN.pixelsHigh);
  iframe.referrerPolicy = 'same-origin';
  Object.assign(iframe.style, { display: 'block', border: '0', width: '100%', height: '100%' });
  screen.appendChild(iframe);
  const htmlScreen = new CSS3DObject(screen);
  htmlScreen.position.set(...SCREEN.center);
  htmlScreen.scale.setScalar(SCREEN.width / SCREEN.pixelsWide);
  htmlScene.add(htmlScreen);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  const deskTarget = new THREE.Vector3(0, 2.45, 0);
  const deskPosition = () => {
    const tangent = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const distance = Math.max(6.3 / (2 * tangent), 10.5 / (2 * tangent * camera.aspect)) * 1.08;
    return deskTarget.clone().add(new THREE.Vector3(2.7, 1.9, 9.0).normalize().multiplyScalar(distance));
  };
  const center = new THREE.Vector3(...SCREEN.center);
  camera.position.copy(deskPosition());
  const lookAt = deskTarget.clone();
  let view: SceneView = 'desk';
  let frame = 0;
  let moving = false;
  let disposed = false;

  const interact = (active: boolean) => {
    screen.style.pointerEvents = active ? 'auto' : 'none';
    iframe.style.pointerEvents = active ? 'auto' : 'none';
    iframe.tabIndex = active ? 0 : -1;
    iframe.inert = !active;
  };
  interact(false);
  const draw = () => {
    camera.lookAt(lookAt);
    camera.updateMatrixWorld();
    renderer.render(setup.scene, camera);
    css.render(htmlScene, camera);
  };
  const monitorPosition = () => {
    const width = Math.max(1, host.clientWidth - 96);
    const height = Math.max(1, host.clientHeight - 170);
    const tangent = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const distance = Math.max(SCREEN.height / (2 * tangent) * host.clientHeight / height, SCREEN.width / (2 * tangent * camera.aspect) * host.clientWidth / width);
    return center.clone().add(new THREE.Vector3(0, 0, distance));
  };
  const setView = (next: SceneView, animate = true) => {
    cancelAnimationFrame(frame);
    view = next;
    interact(false);
    const from = camera.position.clone();
    const fromTarget = lookAt.clone();
    const to = next === 'monitor' ? monitorPosition() : deskPosition();
    const toTarget = next === 'monitor' ? center : deskTarget;
    const start = performance.now();
    moving = animate;
    onView(view, moving);
    const update = (now: number) => {
      if (disposed) return;
      const progress = animate ? Math.min((now - start) / 900, 1) : 1;
      const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
      camera.position.lerpVectors(from, to, eased);
      lookAt.lerpVectors(fromTarget, toTarget, eased);
      draw();
      if (progress < 1) frame = requestAnimationFrame(update);
      else {
        moving = false;
        interact(view === 'monitor');
        onView(view, false);
        if (view === 'monitor' && animate) iframe.focus();
      }
    };
    frame = requestAnimationFrame(update);
  };
  const resize = () => {
    if (!host.clientWidth || !host.clientHeight) return;
    renderer.setSize(host.clientWidth, host.clientHeight);
    css.setSize(host.clientWidth, host.clientHeight);
    camera.aspect = host.clientWidth / host.clientHeight;
    camera.updateProjectionMatrix();
    setView(view, false);
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();

  let clockTimer: ReturnType<typeof setTimeout>;
  const tick = () => {
    clearTimeout(clockTimer);
    if (disposed || document.hidden) return;
    const reading = clock.update(new Date());
    host.dataset.clockTime = reading.time;
    host.dataset.clockZone = reading.zone;
    onClock?.(reading);
    draw();
    // Align with wall-clock seconds; never increment a potentially drifting counter.
    clockTimer = setTimeout(tick, 1000 - Date.now() % 1000);
  };
  document.addEventListener('visibilitychange', tick);
  tick();

  const ray = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const hitsMonitor = (event: PointerEvent) => {
    const bounds = renderer.domElement.getBoundingClientRect();
    pointer.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1);
    ray.setFromCamera(pointer, camera);
    return ray.intersectObject(setup.monitor, false).length > 0;
  };
  const click = (event: PointerEvent) => {
    if (event.button === 0 && view === 'desk' && !moving && hitsMonitor(event)) setView('monitor');
  };
  const hover = (event: PointerEvent) => {
    renderer.domElement.style.cursor = view === 'desk' && hitsMonitor(event) ? 'zoom-in' : 'default';
  };
  const contextLost = (event: Event) => { event.preventDefault(); onFailure(); };
  renderer.domElement.addEventListener('pointerup', click);
  renderer.domElement.addEventListener('pointermove', hover);
  renderer.domElement.addEventListener('webglcontextlost', contextLost);

  return {
    setView,
    dispose() {
      disposed = true;
      clearTimeout(clockTimer);
      document.removeEventListener('visibilitychange', tick);
      cancelAnimationFrame(frame);
      observer.disconnect();
      renderer.domElement.removeEventListener('pointerup', click);
      renderer.domElement.removeEventListener('pointermove', hover);
      renderer.domElement.removeEventListener('webglcontextlost', contextLost);
      iframe.src = 'about:blank';
      htmlScene.remove(htmlScreen);
      setup.dispose();
      clock.dispose();
      surfaces?.dispose();
      researchTextures?.dispose();
      glowMaterial.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
      css.domElement.remove();
    },
  };
}
