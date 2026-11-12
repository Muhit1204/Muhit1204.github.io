import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { Palette } from './workstationModel';

export type ResearchTextureId = 'solar' | 'link-notes' | 'threat-notes' | 'rf-label' | 'switch-label' | 'security-key';
export type ResearchSurface = { id: ResearchTextureId; material: THREE.MeshBasicMaterial };

/** Illustrative research objects and everyday clutter; no simulated instrument data. */
export function addResearchProps(scene: THREE.Scene, palette: Palette) {
  const surfaces: ResearchSurface[] = [];
  const material = (token: string, metalness = 0.2) => new THREE.MeshStandardMaterial({ color: palette(token), metalness, roughness: 0.7 });
  const metal = material('--scene-edge', 0.35);
  const dark = material('--scene-dark');
  const gold = material('--scene-gold', 0.4);
  const paper = material('--scene-paper', 0);
  const blue = material('--scene-blue', 0.1);
  const rust = material('--scene-rust');
  const add = (parent: THREE.Object3D, geometry: THREE.BufferGeometry, mat: THREE.Material, position: number[]) => {
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.position.set(position[0], position[1], position[2]);
    mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  };
  const box = (parent: THREE.Object3D, size: [number, number, number], pos: number[], mat: THREE.Material) => add(parent, new THREE.BoxGeometry(...size), mat, pos);
  const rod = (parent: THREE.Object3D, a: number[], b: number[], radius: number, mat: THREE.Material) => {
    const from = new THREE.Vector3(...a), to = new THREE.Vector3(...b);
    const mesh = add(parent, new THREE.CylinderGeometry(radius, radius, from.distanceTo(to), 6), mat, from.clone().add(to).multiplyScalar(0.5).toArray());
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.sub(from).normalize());
  };
  const label = (parent: THREE.Object3D, id: ResearchTextureId, width: number, height: number, position: number[]) => {
    const mat = new THREE.MeshBasicMaterial({ color: palette('--surface'), toneMapped: false });
    const mesh = add(parent, new THREE.PlaneGeometry(width, height), mat, position);
    mesh.castShadow = false;
    mesh.userData.researchSurface = true;
    surfaces.push({ id, material: mat });
    return mesh;
  };
  const prop = (name: string, position: number[]) => {
    const group = new THREE.Group(); group.name = name; group.position.set(position[0], position[1], position[2]); scene.add(group); return group;
  };

  // Clearly recognizable tabletop dish model: concave reflector and feed supports.
  const dish = prop('satellite-dish-model', [2.65, 1.69, -0.72]);
  add(dish, new THREE.CylinderGeometry(0.32, 0.39, 0.07, 16), dark, [0, 0.04, 0]);
  rod(dish, [0, 0.08, 0], [0, 0.72, 0], 0.055, metal);
  const reflector = new THREE.Group(); reflector.position.y = 0.94;
  reflector.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0.63, 0.78).normalize());
  dish.add(reflector);
  const bowl = new THREE.MeshStandardMaterial({ color: palette('--scene-dish'), metalness: 0.35, roughness: 0.45, side: THREE.DoubleSide });
  const profile = [new THREE.Vector2(0.015, -0.17), new THREE.Vector2(0.16, -0.155), new THREE.Vector2(0.31, -0.11), new THREE.Vector2(0.46, -0.035), new THREE.Vector2(0.61, 0.075), new THREE.Vector2(0.69, 0.15)];
  add(reflector, new THREE.LatheGeometry(profile, 24), bowl, [0, 0, 0]);
  const rim = add(reflector, new THREE.TorusGeometry(0.69, 0.016, 5, 24), metal, [0, 0.15, 0]);
  rim.rotation.x = Math.PI / 2;
  for (let i = 0; i < 3; i++) {
    const angle = i * Math.PI * 2 / 3;
    rod(reflector, [Math.cos(angle) * 0.65, 0.13, Math.sin(angle) * 0.65], [0, 0.55, 0], 0.013, metal);
  }
  add(reflector, new THREE.CylinderGeometry(0.035, 0.065, 0.14, 10), gold, [0, 0.52, 0]);

  // Gold CubeSat model with blue solar wings, casually placed on the left.
  const satellite = prop('cubesat-model', [-2.48, 2.14, 0.48]);
  satellite.rotation.y = -0.2; satellite.rotation.z = 0.05;
  box(satellite, [0.32, 0.64, 0.32], [0, 0, 0], gold);
  for (const x of [-0.17, 0.17]) for (const z of [-0.17, 0.17]) box(satellite, [0.018, 0.69, 0.018], [x, 0, z], metal);
  for (const side of [-1, 1]) {
    rod(satellite, [0, 0, 0], [side * 0.78, 0, 0], 0.014, metal);
    box(satellite, [0.55, 0.56, 0.035], [side * 0.54, 0, 0], dark);
    label(satellite, 'solar', 0.51, 0.52, [side * 0.54, 0, 0.021]);
  }
  rod(satellite, [-0.13, 0.33, 0.12], [-0.39, 0.61, 0.12], 0.007, metal);
  rod(satellite, [0.13, 0.33, 0.12], [0.39, 0.61, 0.12], 0.007, metal);
  box(scene, [0.52, 0.07, 0.45], [-2.48, 1.73, 0.48], dark);
  rod(scene, [-2.48, 1.77, 0.48], [-2.48, 1.84, 0.48], 0.035, metal);

  // Loose annotated papers and an angled threat-model notebook.
  const notes = prop('link-budget-notes', [-1.79, 1.696, 1.12]);
  notes.rotation.y = -0.18;
  box(notes, [0.95, 0.012, 0.64], [-0.05, 0.008, -0.03], paper);
  box(notes, [0.94, 0.012, 0.65], [0, 0.025, 0], paper);
  const linkNote = label(notes, 'link-notes', 0.91, 0.61, [0, 0.032, 0]); linkNote.rotation.x = -Math.PI / 2;
  const notebook = prop('network-security-notes', [2.73, 1.696, 0.98]);
  notebook.rotation.y = 0.23;
  box(notebook, [0.9, 0.06, 0.64], [0, 0.03, 0], blue);
  box(notebook, [0.85, 0.03, 0.60], [0.015, 0.055, 0], paper);
  const threatNote = label(notebook, 'threat-notes', 0.86, 0.59, [0.015, 0.072, 0]); threatNote.rotation.x = -Math.PI / 2;
  const pen = add(scene, new THREE.CylinderGeometry(0.015, 0.015, 0.48, 6), rust, [2.46, 1.80, 1.13]);
  pen.rotation.z = Math.PI / 2; pen.rotation.y = -0.28;

  // A real-world security workflow cue: switch ports, patch leads and a security key.
  const network = prop('network-switch-model', [2.48, 1.78, 0.16]);
  box(network, [1.18, 0.18, 0.5], [0, 0, 0], metal);
  label(network, 'switch-label', 1.1, 0.13, [0, 0, 0.256]);
  for (let i = 0; i < 4; i++) box(network, [0.15, 0.085, 0.018], [-0.4 + i * 0.23, -0.025, 0.267], dark);
  const patch = (points: number[][], mat: THREE.Material) => add(scene, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p))), 24, 0.016, 5, false), mat, [0, 0, 0]);
  patch([[2.08, 1.77, 0.45], [1.98, 1.715, 0.62], [2.14, 1.715, 1.1], [2.66, 1.715, 1.27], [3.12, 1.715, 0.55], [2.85, 1.715, -0.42]], blue);
  patch([[2.31, 1.77, 0.45], [2.28, 1.715, 0.64], [2.1, 1.715, 0.77], [1.85, 1.715, 0.40], [2.1, 1.715, -0.65]], rust);
  const key = prop('security-key-model', [1.12, 1.73, 1.12]); key.rotation.y = -0.35;
  add(key, new RoundedBoxGeometry(0.12, 0.035, 0.27, 1, 0.01), dark, [0, 0, 0]);
  box(key, [0.09, 0.025, 0.1], [0, 0, -0.17], metal);
  const keyLabel = label(key, 'security-key', 0.095, 0.19, [0, 0.018, 0.01]); keyLabel.rotation.x = -Math.PI / 2;

  // Ordinary desk clutter gives the technical props a lived-in setting.
  const mug = prop('coffee-mug', [-1.82, 1.69, 0.02]);
  const ceramic = material('--scene-paper', 0);
  ceramic.side = THREE.DoubleSide;
  add(mug, new THREE.CylinderGeometry(0.18, 0.15, 0.35, 16, 1, true), ceramic, [0, 0.18, 0]);
  const coffee = add(mug, new THREE.CircleGeometry(0.159, 16), dark, [0, 0.31, 0]); coffee.rotation.x = -Math.PI / 2;
  const handle = add(mug, new THREE.TorusGeometry(0.13, 0.026, 5, 12), ceramic, [-0.2, 0.20, 0]); handle.rotation.y = Math.PI / 2;
  label(scene, 'rf-label', 0.91, 0.15, [-2.56, 2.91, -0.491]);

  return { surfaces, names: ['satellite-dish-model', 'cubesat-model', 'link-budget-notes', 'network-security-notes', 'network-switch-model', 'security-key-model', 'coffee-mug'] };
}
