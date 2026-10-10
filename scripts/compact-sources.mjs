// Allège production/sources/ : convertit les PNG d'origine (7 Mo pièce) en JPEG de très haute qualité (≈ 1 Mo), ou en WebP quand la photo a un fond transparent.
// La date de modification d'origine est conservée : `npm run images` ne retraite donc pas les photos déjà converties en AVIF / WebP.
// Usage : node scripts/compact-sources.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const dir = path.resolve(import.meta.dirname, "..", "production", "sources");
let before = 0, after = 0;
for (const f of fs.readdirSync(dir).filter((f) => /\.png$/i.test(f))) {
  const src = path.join(dir, f), stat = fs.statSync(src);
  const meta = await sharp(src).metadata();
  const base = f.replace(/\.png$/i, "");
  const out = path.join(dir, base + (meta.hasAlpha ? ".webp" : ".jpg"));
  if (meta.hasAlpha) await sharp(src).webp({ quality: 93, alphaQuality: 100, effort: 5 }).toFile(out);
  else await sharp(src).removeAlpha().toColourspace("srgb").jpeg({ quality: 94, chromaSubsampling: "4:4:4", mozjpeg: true }).toFile(out);
  fs.utimesSync(out, stat.atime, stat.mtime);
  before += stat.size; after += fs.statSync(out).size;
  fs.unlinkSync(src);
  console.log(f, "->", path.basename(out), (fs.statSync(out).size / 1024 / 1024).toFixed(2) + " Mo");
}
console.log(`\n${(before / 1024 / 1024).toFixed(0)} Mo -> ${(after / 1024 / 1024).toFixed(0)} Mo`);
