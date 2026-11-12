import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { addResearchProps } from './researchProps';

export const MAX_SCENE_TRIANGLES = 18_000;
export const SCREEN = { width: 3.1, height: 1.9375, pixelsWide: 1440, pixelsHigh: 900, center: [0, 2.85, -0.711] as const };
export type Palette = (token: string) => string;

export function countSceneTriangles(scene: THREE.Object3D) {
  let total = 0;
  scene.traverse((object) => {
    if (object instanceof THREE.Sprite) { total += 2; return; }
    if (!(object instanceof THREE.Mesh)) return;
    const geometry = object.geometry;
    total += (geometry.index?.count ?? geometry.attributes.position.count) / 3 * (object instanceof THREE.InstancedMesh ? object.count : 1);
  });
  return total;
}

/** Original industrial workstation. No model or texture extracted from the reference. */
export function buildSetup(palette: Palette) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(palette('--scene-bg'));
  scene.fog = new THREE.FogExp2(palette('--scene-bg'), 0.032);
  const make = (token: string, metalness = 0.16, roughness = 0.72) => new THREE.MeshStandardMaterial({ color: palette(token), metalness, roughness });
  const metal = make('--scene-metal');
  const edge = make('--scene-edge', 0.35, 0.48);
  const housing = make('--scene-housing', 0.25);
  const rust = make('--scene-rust', 0.3);
  const black = make('--scene-dark', 0.1);
  const keysMat = make('--scene-keys', 0.05);
  const floorMat = make('--scene-floor', 0.12);
  const green = new THREE.MeshBasicMaterial({ color: palette('--scene-green'), toneMapped: false });
  const cyan = new THREE.MeshBasicMaterial({ color: palette('--scene-cyan'), toneMapped: false });
  const amber = new THREE.MeshBasicMaterial({ color: palette('--scene-amber'), toneMapped: false });

  const add = (geometry: THREE.BufferGeometry, material: THREE.Material, position: number[], parent: THREE.Object3D = scene) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position[0], position[1], position[2]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };
  const box = (size: [number, number, number], pos: number[], mat = metal, parent: THREE.Object3D = scene) => add(new THREE.BoxGeometry(...size), mat, pos, parent);
  const rounded = (size: [number, number, number], pos: number[], mat = metal, radius = 0.04) => add(new RoundedBoxGeometry(...size, 2, radius), mat, pos);
  const pipe = (a: number[], b: number[], radius = 0.035, mat = edge) => {
    const start = new THREE.Vector3(...a);
    const end = new THREE.Vector3(...b);
    const mesh = add(new THREE.CylinderGeometry(radius, radius, start.distanceTo(end), 8), mat, start.clone().add(end).multiplyScalar(0.5).toArray());
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.sub(start).normalize());
    return mesh;
  };
  const instances = (geometry: THREE.BufferGeometry, material: THREE.Material, positions: number[][]) => {
    const mesh = new THREE.InstancedMesh(geometry, material, positions.length);
    const matrix = new THREE.Matrix4();
    positions.forEach((position, index) => { matrix.makeTranslation(position[0], position[1], position[2]); mesh.setMatrixAt(index, matrix); });
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
  };

  // A single worn workbench and structural frame.
  rounded([7.1, 0.16, 3.15], [0, 1.6, 0], metal);
  box([7.12, 0.07, 0.09], [0, 1.55, 1.57], rust);
  box([7.12, 0.07, 0.09], [0, 1.55, -1.57], edge);
  for (const x of [-3.05, 3.05]) {
    for (const z of [-1.15, 1.15]) {
      pipe([x, 0.14, z], [x, 1.54, z], 0.065, metal);
      box([0.34, 0.12, 0.32], [x, 0.06, z], black);
    }
    pipe([x, 0.28, -1.15], [x, 0.28, 1.15], 0.045, rust);
  }
  pipe([-3.05, 0.42, -1.15], [3.05, 0.42, -1.15], 0.045, edge);

  // One main monitor. The flat opening stays aligned with the real HTML screen.
  const monitor = rounded([3.6, 2.22, 0.75], [0, 2.85, -1.1], housing, 0.09);
  monitor.name = 'portfolio-monitor';
  rounded([1.36, 0.1, 0.75], [0, 1.73, -1], black);
  for (const x of [-1.69, 1.69]) box([0.20, 2.05, 0.04], [x, 2.85, -0.711], metal);
  for (const y of [1.81, 3.89]) box([3.58, 0.13, 0.04], [0, y, -0.711], metal);
  const opening = add(new THREE.PlaneGeometry(SCREEN.width, SCREEN.height), new THREE.MeshBasicMaterial({ color: palette('--scene-dark') }), [0, 2.85, -0.719]);
  opening.castShadow = false;
  const buttons = [-1.34, -1.17, -1.0].map(x => [x, 1.807, -0.679]);
  instances(new THREE.BoxGeometry(0.08, 0.035, 0.025), edge, buttons);
  instances(new THREE.BoxGeometry(0.035, 0.018, 0.018), green, [[1.37, 1.81, -0.68]]);

  // Compact rack: vent slots and controls, no extra computer screens.
  rounded([1.12, 1.38, 0.7], [-2.56, 2.38, -0.9], black);
  const ventPositions: number[][] = [];
  const ledPositions: number[][] = [];
  const boltPositions: number[][] = [];
  for (let row = 0; row < 3; row++) {
    const y = 1.95 + row * 0.43;
    box([1.06, 0.36, 0.045], [-2.56, y, -0.524], row === 1 ? rust : metal);
    for (let col = 0; col < 5; col++) ventPositions.push([-2.93 + col * 0.115, y + 0.035, -0.495]);
    for (const x of [-3.03, -2.09]) for (const dy of [-0.12, 0.12]) boltPositions.push([x, y + dy, -0.488]);
    ledPositions.push([-2.23, y + 0.065, -0.485]);
    const knob = add(new THREE.CylinderGeometry(0.045, 0.045, 0.045, 10), edge, [-2.25, y - 0.065, -0.476]);
    knob.rotation.x = Math.PI / 2;
  }
  // Two equipment enclosures under the desk, with front detail batched by material.
  for (const [index, x] of [-1.66, -0.57].entries()) {
    rounded([0.86, 1.36, 1.24], [x, 0.74, -0.18], index === 0 ? housing : metal);
    box([0.74, 1.23, 0.035], [x, 0.76, 0.46], black);
    for (let row = 0; row < 8; row++) for (let col = 0; col < 3; col++) ventPositions.push([x - 0.23 + col * 0.21, 0.34 + row * 0.07, 0.49]);
    for (const dx of [-0.32, 0.32]) for (const y of [0.2, 1.28]) boltPositions.push([x + dx, y, 0.5]);
    ledPositions.push([x - 0.23, 1.18, 0.5], [x - 0.12, 1.18, 0.5]);
    box([0.5, 0.08, 0.035], [x, 1.04, 0.50], metal);
  }
  instances(new THREE.BoxGeometry(0.075, 0.018, 0.012), edge, ventPositions);
  instances(new THREE.BoxGeometry(0.025, 0.025, 0.012), green, ledPositions);
  instances(new THREE.BoxGeometry(0.028, 0.028, 0.016), edge, boltPositions);

  // Input devices; boxes for keycaps instead of expensive bevels on every key.
  rounded([2.05, 0.12, 0.86], [0, 1.77, 0.65], black);
  const keys: number[][] = [];
  for (let row = 0; row < 4; row++) for (let col = 0; col < 13; col++) keys.push([-0.86 + col * 0.143, 1.85, 0.36 + row * 0.14]);
  instances(new THREE.BoxGeometry(0.12, 0.04, 0.10), keysMat, keys);
  box([0.67, 0.04, 0.10], [0, 1.85, 0.95], keysMat);
  box([0.12, 0.04, 0.10], [-0.86, 1.854, 0.36], rust);
  box([0.8, 0.012, 0.96], [1.57, 1.69, 0.65], black);
  const mouse = add(new THREE.SphereGeometry(1, 16, 10), keysMat, [1.57, 1.80, 0.65]);
  mouse.scale.set(0.17, 0.105, 0.25);
  box([0.018, 0.012, 0.08], [1.57, 1.903, 0.56], black);
  rounded([0.72, 0.22, 0.5], [2.65, 1.81, -0.68], metal);
  instances(new THREE.BoxGeometry(0.03, 0.018, 0.012), amber, [[2.45, 1.85, -0.42], [2.57, 1.85, -0.42]]);

  // A few readable low-sided cable runs, not a dense bundle of hidden loops.
  const cable = (points: number[][], radius = 0.022) => add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p))), 24, radius, 5, false), black, [0, 0, 0]);
  cable([[1.57, 1.77, 0.42], [1.75, 1.72, 0], [2.08, 1.72, -0.5], [1.5, 1.72, -1.4]]);
  cable([[-2.55, 2.15, -1.2], [-2.8, 1.8, -1.5], [-2.9, 0.8, -0.8], [-2.4, 0.22, 0.8], [-1.6, 0.38, 0.48]]);
  cable([[0.4, 1.8, -1.4], [0.65, 1.3, -1.65], [1.7, 0.17, -0.7], [2.35, 0.1, 0.6], [-0.5, 0.14, 0.49]], 0.028);
  cable([[-0.8, 1.8, -1.4], [-1, 1.3, -1.6], [-1.6, 1, -0.8], [-1.66, 0.72, 0.48]]);

  // Live clock face is one flat texture, independent from the portfolio screen.
  rounded([2.15, 0.61, 0.24], [-0.15, 4.42, -1.08], black, 0.035);
  for (const x of [-0.95, 0.65]) pipe([x, 3.93, -1.2], [x, 4.18, -1.2], 0.023, edge);
  const clockMaterial = new THREE.MeshBasicMaterial({ color: palette('--surface'), toneMapped: false });
  const clockFace = add(new THREE.PlaneGeometry(1.99, 0.48), clockMaterial, [-0.15, 4.42, -0.951]);
  clockFace.castShadow = false;
  clockFace.receiveShadow = false;
  clockFace.name = 'live-digital-clock';

  const glowPoints: THREE.Vector3[] = [];
  for (const side of [-1, 1]) {
    pipe([side * 3.0, 1.68, -1.25], [side * 3.0, 4.9, -1.25], 0.034, edge);
    pipe([side * 2.83, 1.68, -1.25], [side * 2.83, 4.9, -1.25], 0.025, metal);
    const lamp = new THREE.Group();
    lamp.position.set(side * 2.65, 4.95, -0.65);
    lamp.rotation.z = side * 0.11;
    scene.add(lamp);
    box([2.05, 0.23, 0.34], [0, 0.06, 0], metal, lamp);
    for (const x of [-0.98, 0.98]) box([0.08, 0.26, 0.40], [x, 0, 0], edge, lamp);
    for (const z of [-0.08, 0.08]) {
      const tube = add(new THREE.CylinderGeometry(0.045, 0.045, 1.82, 10), cyan, [0, -0.08, z], lamp);
      tube.rotation.z = Math.PI / 2;
    }
    glowPoints.push(lamp.position.clone());
    const spill = new THREE.PointLight(palette('--scene-cyan'), 3.2, 7, 2);
    spill.position.set(side * 2.5, 4.55, 0.1);
    scene.add(spill);
  }
  const platform = box([8.9, 0.08, 5.5], [0, -0.04, 0.1], floorMat);
  platform.castShadow = false;
  const ground = add(new THREE.PlaneGeometry(100, 100), black, [0, -0.09, 0]);
  ground.rotation.x = -Math.PI / 2;
  ground.castShadow = false;
  scene.add(new THREE.HemisphereLight(palette('--scene-ambient'), palette('--scene-dark'), 1.35));
  scene.add(new THREE.AmbientLight(palette('--scene-print'), 1.15));
  const light = new THREE.DirectionalLight(palette('--scene-print'), 2.1);
  light.position.set(-3, 8, 5);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  Object.assign(light.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: 0.1, far: 20 });
  light.shadow.camera.updateProjectionMatrix();
  light.shadow.normalBias = 0.035;
  scene.add(light);

  const research = addResearchProps(scene, palette);
  scene.userData.researchProps = research.names;

  // Merge static meshes by material/shadow settings to keep draw calls low.
  scene.updateMatrixWorld(true);
  const batches = new Map<string, { source: THREE.Mesh[]; geometries: THREE.BufferGeometry[] }>();
  scene.traverse(object => {
    if (!(object instanceof THREE.Mesh) || object instanceof THREE.InstancedMesh || object === monitor || object === clockFace || object.userData.researchSurface) return;
    const material = object.material as THREE.Material;
    const key = `${material.uuid}:${object.castShadow}:${object.receiveShadow}`;
    if (!batches.has(key)) batches.set(key, { source: [], geometries: [] });
    const batch = batches.get(key)!;
    batch.source.push(object);
    const geometry = object.geometry.index ? object.geometry.toNonIndexed() : object.geometry.clone();
    batch.geometries.push(geometry.applyMatrix4(object.matrixWorld));
  });
  for (const batch of batches.values()) {
    const geometry = mergeGeometries(batch.geometries);
    if (!geometry) throw new Error('Could not batch workstation geometry');
    const first = batch.source[0];
    const mesh = new THREE.Mesh(geometry, first.material);
    mesh.castShadow = first.castShadow;
    mesh.receiveShadow = first.receiveShadow;
    scene.add(mesh);
    batch.source.forEach(item => { item.removeFromParent(); item.geometry.dispose(); });
    batch.geometries.forEach(item => item.dispose());
  }
  const triangles = countSceneTriangles(scene);
  if (triangles + glowPoints.length * 2 > MAX_SCENE_TRIANGLES) throw new Error(`Workstation exceeds triangle budget: ${triangles}`);
  scene.userData.triangles = triangles;

  return {
    scene, monitor, clockFace, clockMaterial, glowPoints, triangles, researchSurfaces: research.surfaces,
    materials: { metal, edge, housing, rust, floor: floorMat },
    dispose() {
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse(object => {
        if (object instanceof THREE.Mesh) {
          geometries.add(object.geometry);
          for (const item of Array.isArray(object.material) ? object.material : [object.material]) materials.add(item);
        }
      });
      geometries.forEach(item => item.dispose());
      materials.forEach(item => item.dispose());
      light.shadow.dispose();
      scene.clear();
    },
  };
}
