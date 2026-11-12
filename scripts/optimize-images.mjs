import sharp from "sharp";
import { mkdir } from "node:fs/promises";

// Every large asset in public/ is served as-is: output: 'export' forces
// images.unoptimized, so Next never resizes at request time. These presets do
// the resizing ahead of time. Full-resolution originals live in source-docs/.
const PRESETS = [
  {
    name: "AAPA convention panel photo",
    src: "source-docs/image-originals/aapa-convention-2026.jpg",
    out: "public/optimized",
    base: "aapa-convention-2026",
    widths: [480, 800],
    webp: 72,
    jpeg: 82,
  },
  {
    name: "profile portrait",
    src: "source-docs/image-originals/profile-image.jpeg",
    out: "public/optimized",
    base: "profile",
    widths: [320, 480, 704, 1056, 1408],
    avif: 65,
    webp: 82,
    jpeg: 85,
  },
  {
    name: "key metrics photo",
    src: "source-docs/image-originals/key-metrics-photo.jpeg",
    out: "public/optimized",
    base: "key-metrics",
    widths: [640, 1280, 1920],
    avif: 65,
    webp: 82,
    jpeg: 85,
  },
  {
    name: "AIUB logo",
    src: "source-docs/image-originals/aiub-logo.png",
    out: "public/optimized",
    base: "aiub-logo",
    widths: [224, 448],
    avif: 55,
    webp: 82,
    png: true,
  },
];

// Optional name filter avoids re-encoding unrelated assets for a targeted update.
const requested = process.argv[2];
const requestedWidths = process.argv.slice(3).map(Number);
for (const preset of PRESETS.filter((entry) => !requested || entry.base === requested)) {
  await mkdir(preset.out, { recursive: true });
  for (const width of preset.widths.filter((value) => !requestedWidths.length || requestedWidths.includes(value))) {
    const image = sharp(preset.src).resize({ width, withoutEnlargement: true });
    const stem = `${preset.out}/${preset.base}-${width}`;
    if (preset.avif) await image.clone().avif({ quality: preset.avif }).toFile(`${stem}.avif`);
    if (preset.webp) await image.clone().webp({ quality: preset.webp }).toFile(`${stem}.webp`);
    if (preset.jpeg) await image.clone().jpeg({ quality: preset.jpeg, mozjpeg: true }).toFile(`${stem}.jpg`);
    if (preset.png) await image.clone().png({ compressionLevel: 9, palette: true }).toFile(`${stem}.png`);
  }
  console.log(`optimized ${preset.name}`);
}
