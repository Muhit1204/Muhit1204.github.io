import * as THREE from 'three';
import { readLocalClock } from '@/lib/clock';
import type { Palette } from '@/components/scene/workstationModel';
import type { ResearchTextureId } from '@/components/scene/researchProps';

function canvas(width: number, height: number) {
  const surface = document.createElement('canvas');
  surface.width = width; surface.height = height;
  const context = surface.getContext('2d');
  if (!context) throw new Error('Canvas unavailable');
  return { surface, context };
}
function texture(surface: HTMLCanvasElement) {
  const result = new THREE.CanvasTexture(surface);
  result.colorSpace = THREE.SRGBColorSpace;
  return result;
}

/** Original deterministic surface detail: no image assets or extra downloads. */
export function createSurfaceTextures(palette: Palette) {
  let seed = 7341;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const { surface, context } = canvas(512, 512);
  context.fillStyle = '#b2b2b2'; context.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 6500; i++) {
    const shade = Math.floor(80 + random() * 140);
    context.fillStyle = `rgba(${shade},${shade},${shade},${0.08 + random() * 0.2})`;
    context.fillRect(random() * 512, random() * 512, 1 + random() * 4, 1 + random() * 3);
  }
  context.lineWidth = 0.7;
  for (let i = 0; i < 280; i++) {
    const x = random() * 512, y = random() * 512;
    context.strokeStyle = i % 3 ? 'rgba(15,15,15,0.18)' : 'rgba(255,255,255,0.24)';
    context.beginPath(); context.moveTo(x, y); context.lineTo(x + random() * 34, y + random() * 3); context.stroke();
  }
  // Dark seams and edge wear read at the desk camera without adding polygons.
  context.strokeStyle = 'rgba(10,10,10,0.25)'; context.lineWidth = 2;
  context.strokeRect(7, 7, 498, 498);
  const metal = texture(surface);
  metal.wrapS = metal.wrapT = THREE.RepeatWrapping;

  const plate = canvas(256, 256);
  plate.context.fillStyle = '#9b9b9b'; plate.context.fillRect(0, 0, 256, 256);
  for (let y = -32; y < 288; y += 32) for (let x = -32; x < 288; x += 32) {
    plate.context.save(); plate.context.translate(x + (y % 64 ? 16 : 0), y); plate.context.rotate(y % 64 ? Math.PI / 4 : -Math.PI / 4);
    plate.context.fillStyle = '#565656'; plate.context.fillRect(-10, -2, 22, 5);
    plate.context.fillStyle = '#d5d5d5'; plate.context.fillRect(-10, -3, 20, 2); plate.context.restore();
  }
  const floor = texture(plate.surface);
  floor.wrapS = floor.wrapT = THREE.RepeatWrapping;
  floor.repeat.set(7, 5);

  const flare = canvas(128, 128);
  const color = new THREE.Color(palette('--scene-cyan'));
  const rgb = `${Math.round(color.r * 255)},${Math.round(color.g * 255)},${Math.round(color.b * 255)}`;
  const gradient = flare.context.createRadialGradient(64, 64, 1, 64, 64, 64);
  gradient.addColorStop(0, `rgba(${rgb},0.65)`); gradient.addColorStop(0.25, `rgba(${rgb},0.20)`); gradient.addColorStop(1, `rgba(${rgb},0)`);
  flare.context.fillStyle = gradient; flare.context.fillRect(0, 0, 128, 128);
  const glow = texture(flare.surface);
  return { metal, floor, glow, dispose() { metal.dispose(); floor.dispose(); glow.dispose(); } };
}

const SEGMENTS: Record<string, string> = { '0': 'abcedf', '1': 'bc', '2': 'abged', '3': 'abgcd', '4': 'fgbc', '5': 'afgcd', '6': 'afgecd', '7': 'abc', '8': 'abcdefg', '9': 'abfgcd' };

export function createClockTexture(palette: Palette) {
  const { surface, context } = canvas(512, 128);
  const map = texture(surface);
  map.generateMipmaps = false;
  map.minFilter = THREE.LinearFilter;
  const red = palette('--scene-red');
  const dark = palette('--scene-dark');
  const print = palette('--scene-print');
  const update = (date = new Date()) => {
    const reading = readLocalClock(date);
    context.fillStyle = dark; context.fillRect(0, 0, 512, 128);
    const horizontal = (x: number, y: number) => { context.beginPath(); context.moveTo(x + 5, y); context.lineTo(x + 32, y); context.lineTo(x + 37, y + 4); context.lineTo(x + 32, y + 8); context.lineTo(x + 5, y + 8); context.lineTo(x, y + 4); context.closePath(); context.fill(); };
    const vertical = (x: number, y: number) => { context.beginPath(); context.moveTo(x + 4, y); context.lineTo(x + 8, y + 5); context.lineTo(x + 8, y + 26); context.lineTo(x + 4, y + 31); context.lineTo(x, y + 26); context.lineTo(x, y + 5); context.closePath(); context.fill(); };
    let x = 68;
    for (const char of reading.time) {
      if (char === ':') {
        context.fillStyle = red; context.shadowColor = red; context.shadowBlur = 9;
        context.fillRect(x + 5, 40, 6, 6); context.fillRect(x + 5, 68, 6, 6); x += 28; continue;
      }
      const active = SEGMENTS[char];
      for (const segment of 'abcdefg') {
        context.globalAlpha = active.includes(segment) ? 1 : 0.065;
        context.fillStyle = red; context.shadowColor = red; context.shadowBlur = active.includes(segment) ? 8 : 0;
        if (segment === 'a') horizontal(x + 4, 17);
        if (segment === 'g') horizontal(x + 4, 53);
        if (segment === 'd') horizontal(x + 4, 89);
        if (segment === 'f') vertical(x, 23);
        if (segment === 'b') vertical(x + 37, 23);
        if (segment === 'e') vertical(x, 59);
        if (segment === 'c') vertical(x + 37, 59);
      }
      context.globalAlpha = 1; x += 54;
    }
    context.shadowBlur = 0; context.fillStyle = print;
    context.font = '11px monospace'; context.textAlign = 'center';
    context.fillText(`LOCAL TIME / ${reading.zone}`, 256, 117);
    map.needsUpdate = true;
    return reading;
  };
  return { map, update, dispose() { map.dispose(); } };
}

/** Original printed research notes, solar cells and equipment labels. */
export function createResearchTextures(palette: Palette) {
  const maps = {} as Record<ResearchTextureId, THREE.CanvasTexture>;
  const paper = palette('--scene-paper');
  const ink = palette('--scene-paper-ink');
  const blue = palette('--scene-blue');
  const dark = palette('--scene-dark');
  const print = palette('--scene-print');
  const make = (id: ResearchTextureId, width: number, height: number, draw: (context: CanvasRenderingContext2D) => void) => {
    const { surface, context } = canvas(width, height);
    draw(context);
    maps[id] = texture(surface);
  };
  const rulePaper = (context: CanvasRenderingContext2D, title: string, subtitle: string) => {
    context.fillStyle = paper; context.fillRect(0, 0, 512, 352);
    context.strokeStyle = 'rgba(60,90,110,0.15)'; context.lineWidth = 1;
    for (let y = 75; y < 352; y += 24) { context.beginPath(); context.moveTo(20, y); context.lineTo(492, y); context.stroke(); }
    context.fillStyle = ink; context.font = 'bold 24px monospace'; context.fillText(title, 24, 34);
    context.font = '13px monospace'; context.fillText(subtitle, 24, 56);
  };
  make('solar', 256, 256, context => {
    context.fillStyle = dark; context.fillRect(0, 0, 256, 256);
    for (let row = 0; row < 6; row++) for (let col = 0; col < 4; col++) {
      context.fillStyle = blue; context.globalAlpha = (row + col) % 3 ? 0.72 : 0.92;
      context.fillRect(7 + col * 62, 6 + row * 41, 56, 35);
      context.strokeStyle = print; context.globalAlpha = 0.4; context.lineWidth = 1;
      for (let i = 1; i < 4; i++) { context.beginPath(); context.moveTo(7 + col * 62 + i * 13, 7 + row * 41); context.lineTo(7 + col * 62 + i * 13, 38 + row * 41); context.stroke(); }
    }
    context.globalAlpha = 1;
  });
  make('link-notes', 512, 352, context => {
    rulePaper(context, 'SATELLITE LINK BUDGET', 'LEO / DTN   -   RESEARCH NOTES');
    context.strokeStyle = blue; context.lineWidth = 3;
    context.beginPath(); context.ellipse(155, 170, 94, 48, -0.3, 0, Math.PI * 2); context.stroke();
    context.beginPath(); context.arc(155, 170, 35, 0, Math.PI * 2); context.stroke();
    context.fillStyle = ink; context.fillRect(227, 123, 12, 12);
    context.beginPath(); context.moveTo(228, 135); context.lineTo(179, 194); context.stroke();
    context.font = '16px monospace';
    context.fillText('P_rx = P_tx + G - L', 270, 130);
    context.fillText('link margin?', 277, 166);
    context.fillText('delay / routing', 270, 202);
    context.fillText('maritime channel', 34, 275);
    context.fillText('check loss model + integrity', 34, 308);
    context.strokeStyle = palette('--accent'); context.beginPath(); context.ellipse(352, 164, 91, 19, -0.03, 0, Math.PI * 2); context.stroke();
  });
  make('threat-notes', 512, 352, context => {
    rulePaper(context, 'NETWORK SECURITY', 'THREAT MODEL / ICS + SATCOM');
    context.strokeStyle = ink; context.lineWidth = 3;
    const nodes = [[80, 160], [250, 160], [420, 160], [250, 265]];
    context.beginPath(); context.moveTo(80, 160); context.lineTo(420, 160); context.moveTo(250, 160); context.lineTo(250, 265); context.stroke();
    context.fillStyle = paper;
    for (const [x, y] of nodes) { context.fillRect(x - 32, y - 22, 64, 44); context.strokeRect(x - 32, y - 22, 64, 44); }
    context.fillStyle = ink; context.font = '13px monospace'; context.textAlign = 'center';
    ['LINK', 'GATEWAY', 'HOST', 'LOGS'].forEach((text, i) => context.fillText(text, nodes[i][0], nodes[i][1] + 5));
    context.textAlign = 'left'; context.font = '15px monospace'; context.fillText('segment / verify / monitor', 50, 320);
    context.strokeStyle = palette('--accent'); context.setLineDash([6, 5]); context.strokeRect(198, 120, 104, 88);
  });
  make('rf-label', 512, 80, context => {
    context.fillStyle = dark; context.fillRect(0, 0, 512, 80);
    context.fillStyle = print; context.font = 'bold 28px monospace'; context.fillText('RF / SDR RECEIVER', 18, 32);
    context.font = '17px monospace'; context.fillText('SATELLITE LINK RESEARCH', 18, 62);
  });
  make('switch-label', 512, 80, context => {
    context.fillStyle = dark; context.fillRect(0, 0, 512, 80);
    context.fillStyle = print; context.font = 'bold 19px monospace'; context.fillText('NETWORK / SECURITY LAB', 12, 21);
    context.font = '12px monospace'; context.fillText('1          2          3          4', 12, 75);
  });
  make('security-key', 128, 256, context => {
    context.fillStyle = dark; context.fillRect(0, 0, 128, 256);
    context.strokeStyle = print; context.lineWidth = 5; context.strokeRect(32, 100, 64, 60);
    context.beginPath(); context.arc(64, 97, 21, Math.PI, 0); context.stroke();
    context.fillStyle = print; context.font = 'bold 18px monospace'; context.textAlign = 'center'; context.fillText('KEY', 64, 208);
  });
  return { maps, dispose() { Object.values(maps).forEach(map => map.dispose()); } };
}
