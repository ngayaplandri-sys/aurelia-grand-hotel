// Planche-contact pour relire d'un coup d'œil plusieurs photographies.
// Usage : node scripts/sheet.mjs <sortie.jpg> <colonnes> <largeur-vignette> <dossier> [filtre-regex]
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const [out, colsArg, widthArg, dirArg, filter] = process.argv.slice(2);
const cols = Number(colsArg) || 4, tw = Number(widthArg) || 300, dir = path.resolve(dirArg);
const re = filter ? new RegExp(filter) : /./;
const files = fs.readdirSync(dir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f) && re.test(f)).sort();
const cells = [];
for (const f of files) {
  const buf = await sharp(path.join(dir, f)).resize({ width: tw }).jpeg({ quality: 80 }).toBuffer();
  const m = await sharp(buf).metadata();
  cells.push({ f, buf, h: m.height });
}
const rowH = [];
cells.forEach((c, i) => { const r = Math.floor(i / cols); rowH[r] = Math.max(rowH[r] || 0, c.h); });
const gap = 8, label = 18;
const W = cols * tw + (cols + 1) * gap;
const H = rowH.reduce((a, b) => a + b + label + gap, gap);
const comps = [];
let y = gap;
for (let r = 0; r < rowH.length; r++) {
  for (let c = 0; c < cols; c++) {
    const cell = cells[r * cols + c]; if (!cell) break;
    const x = gap + c * (tw + gap);
    comps.push({ input: cell.buf, left: x, top: y });
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${tw}" height="${label}"><text x="2" y="13" font-family="Arial" font-size="12" fill="#ddd">${cell.f.replace(/\.\w+$/, "")}</text></svg>`;
    comps.push({ input: Buffer.from(svg), left: x, top: y + rowH[r] });
  }
  y += rowH[r] + label + gap;
}
await sharp({ create: { width: W, height: H, channels: 3, background: "#111" } }).composite(comps).jpeg({ quality: 82 }).toFile(path.resolve(out));
console.log(files.length, "images ->", out, W + "x" + H);
