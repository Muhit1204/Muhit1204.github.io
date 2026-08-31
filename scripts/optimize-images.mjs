import sharp from "sharp";
import { mkdir } from "node:fs/promises";

// Every large asset in public/ is served as-is: output: 'export' forces
// images.unoptimized, so Next never resizes at request time. These presets do
// the resizing ahead of time. Full-resolution originals live in source-docs/.
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
    name: "expanded interactive city",
    src: "source-docs/image-originals/city-v2/city-expanded.png",
    out: "public/city/v2",
    base: "city-expanded",
    widths: [768, 1280, 1920, 2560],
    avif: 48,
    webp: 70,
    png: true,
  },
  {
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

const CITY_SPRITES = [
  { name: "satellite", src: "source-docs/image-originals/city-v2/satellite-transparent.png", width: 320 },
  { name: "car-teal", src: "source-docs/image-originals/city-v2/car-teal-transparent.png", width: 192 },
  { name: "car-amber", src: "source-docs/image-originals/city-v2/car-amber-transparent.png", width: 192 },
  { name: "dish", src: "source-docs/image-originals/city-v2/dish-transparent.png", width: 240 },
  { name: "cafe-smoke", src: "source-docs/image-originals/city-v2/cafe-smoke-clean-transparent.png", width: 256 },
  { name: "dim-publications", src: "source-docs/image-originals/city-v2/dim-publications-transparent.png", width: 560 },
  { name: "dim-research", src: "source-docs/image-originals/city-v2/dim-research-transparent.png", width: 560 },
  { name: "dim-experience", src: "source-docs/image-originals/city-v2/dim-experience-transparent.png", width: 370 },
  { name: "dim-cafe", src: "source-docs/image-originals/city-v2/dim-cafe-transparent.png", width: 620 },
];

for (const preset of PRESETS) {
  await mkdir(preset.out, { recursive: true });
  for (const width of preset.widths) {
    const image = sharp(preset.src).resize({ width, withoutEnlargement: true });
    const stem = `${preset.out}/${preset.base}-${width}`;
    if (preset.avif) await image.clone().avif({ quality: preset.avif }).toFile(`${stem}.avif`);
    if (preset.webp) await image.clone().webp({ quality: preset.webp }).toFile(`${stem}.webp`);
    if (preset.jpeg) await image.clone().jpeg({ quality: preset.jpeg, mozjpeg: true }).toFile(`${stem}.jpg`);
    if (preset.png) await image.clone().png({ compressionLevel: 9, palette: true }).toFile(`${stem}.png`);
  }
  console.log(`optimized ${preset.name}`);
}

await mkdir("public/city/v2", { recursive: true });
for (const sprite of CITY_SPRITES) {
  await sharp(sprite.src)
    .resize({ width: sprite.width, withoutEnlargement: true })
    .webp({ quality: 82, alphaQuality: 90 })
    .toFile(`public/city/v2/${sprite.name}.webp`);
  console.log(`optimized city sprite: ${sprite.name}`);
}


