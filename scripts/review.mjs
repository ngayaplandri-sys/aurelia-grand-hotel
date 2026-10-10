// Outil de contrôle visuel : convertit les rendus d'un dossier en JPEG légers dans <dossier>/_jpg/ (pour les relire rapidement).
// Usage : node scripts/review.mjs production/review/test-modeles [largeur=1400]
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const dir = path.resolve(process.argv[2]);
const width = Number(process.argv[3]) || 1400;
const out = path.join(dir, "_jpg");
fs.mkdirSync(out, { recursive: true });
for (const f of fs.readdirSync(dir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f))) {
  const target = path.join(out, f.replace(/\.\w+$/, ".jpg"));
  if (fs.existsSync(target) && fs.statSync(target).mtimeMs > fs.statSync(path.join(dir, f)).mtimeMs) continue;
  const info = await sharp(path.join(dir, f)).resize({ width, withoutEnlargement: true }).jpeg({ quality: 82 }).toFile(target);
  console.log(f, "->", info.width + "x" + info.height);
}
