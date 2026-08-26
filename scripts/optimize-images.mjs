import sharp from "sharp";
import { mkdir } from "node:fs/promises";

// Every large asset in public/ is served as-is: `output: 'export'` forces
// images.unoptimized, so Next never resizes at request time. These presets do
// the resizing ahead of time. Full-resolution originals live in
// source-docs/image-originals/ so they are not copied into the static export.
const PRESETS = [
  {
    name: "city illustration",
    src: "source-docs/image-originals/city-map.png",
    out: "public/city/optimized",
    base: "scene",
    widths: [768, 1280, 1920, 2560],
    avif: 50,
    webp: 72,
    png: true,
  },
  {
    // Hero portrait: 352 CSS px wide at most, so 1408 covers a 4x display.
    name: "profile portrait",
    src: "source-docs/image-originals/profile-image.jpeg",
    out: "public/optimized",
    base: "profile",
    widths: [704, 1056, 1408],
    avif: 65,
    webp: 82,
    jpeg: 85,
  },
  {
    // Key-metrics field photo: ~622 CSS px wide at the max-w-6xl breakpoint,
    // and full container width on small screens.
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
    // Scholarship logo: rendered inside a 112 px box, contained.
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

for (const preset of PRESETS) {
  await mkdir(preset.out, { recursive: true });
  for (const w of preset.widths) {
    const img = sharp(preset.src).resize({ width: w, withoutEnlargement: true });
    const stem = `${preset.out}/${preset.base}-${w}`;
    if (preset.avif) await img.clone().avif({ quality: preset.avif }).toFile(`${stem}.avif`);
    if (preset.webp) await img.clone().webp({ quality: preset.webp }).toFile(`${stem}.webp`);
    if (preset.jpeg) await img.clone().jpeg({ quality: preset.jpeg, mozjpeg: true }).toFile(`${stem}.jpg`);
    if (preset.png) await img.clone().png({ compressionLevel: 9, palette: true }).toFile(`${stem}.png`);
  }
  console.log(`optimized ${preset.name}`);
}
