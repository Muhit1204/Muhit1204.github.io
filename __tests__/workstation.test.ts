import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { buildSetup, countSceneTriangles, MAX_SCENE_TRIANGLES } from '../components/scene/workstationModel';
import { readLocalClock } from '../lib/clock';

describe('workstation geometry budget', () => {
  it('counts every repeated instance and glow quad', () => {
    const scene = new THREE.Scene();
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial();
    scene.add(new THREE.InstancedMesh(geometry, material, 4));
    const glowMaterial = new THREE.SpriteMaterial();
    scene.add(new THREE.Sprite(glowMaterial));
    expect(countSceneTriangles(scene)).toBe(50); // four 12-triangle boxes + one quad
    geometry.dispose(); material.dispose(); glowMaterial.dispose();
  });
  it('keeps the full workstation under 18k with only one portfolio monitor', () => {
    const setup = buildSetup(() => '#808080');
    try {
      const total = countSceneTriangles(setup.scene) + setup.glowPoints.length * 2;
      expect(total).toBeGreaterThan(1000);
      expect(total).toBeLessThanOrEqual(MAX_SCENE_TRIANGLES);
      expect(setup.scene.getObjectsByProperty('name', 'portfolio-monitor')).toHaveLength(1);
      expect(setup.clockFace.name).toBe('live-digital-clock');
      console.info(`Workstation geometry: ${total.toLocaleString('en-US')} triangles including light quads`);
    } finally { setup.dispose(); }
  });
});

describe('actual clock time', () => {
  it('formats midnight and seconds with a 24-hour clock', () => {
    expect(readLocalClock(new Date('2026-11-11T00:00:07Z'), 'UTC').time).toBe('00:00:07');
  });
  it('reads the supplied wall-clock instant instead of incrementing a counter', () => {
    expect(readLocalClock(new Date('2026-11-11T19:34:56Z'), 'America/Chicago')).toMatchObject({ time: '13:34:56', zone: 'CST' });
    expect(readLocalClock(new Date('2026-11-11T20:02:01Z'), 'America/Chicago').time).toBe('14:02:01');
  });
});
