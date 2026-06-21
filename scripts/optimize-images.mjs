import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "public/city-map.png";
const OUT = "public/city/optimized";
const WIDTHS = [768, 1280, 1920, 2560];

await mkdir(OUT, { recursive: true });
for (const w of WIDTHS) {
  const img = sharp(SRC).resize({ width: w, withoutEnlargement: true });
  await img.clone().avif({ quality: 50 }).toFile(`${OUT}/scene-${w}.avif`);
  await img.clone().webp({ quality: 72 }).toFile(`${OUT}/scene-${w}.webp`);
}
console.log("optimized city illustration");
