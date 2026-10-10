// Convertit les photographies de production/sources/ en AVIF + WebP responsives (assets/img/) et écrit le manifeste lu par le site.
// Usage : npm run images            (ne refait que ce qui a changé)
//         npm run images -- --force (tout refaire)
//         npm run images -- facade lobby (seulement ces photos)
//
// Convention de nommage des sources (PNG, JPEG ou WebP) :
//   production/sources/<id>.png     version ordinateur (paysage)
//   production/sources/<id>-m.png   version mobile (portrait), facultative : le site retombe sur la version ordinateur
// Pour remplacer une photographie : déposez le nouveau fichier sous le même nom, puis lancez `npm run images`.
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "production", "sources");
const OUT = path.join(ROOT, "assets", "img");
const MANIFEST = path.join(ROOT, "assets", "js", "data", "photos-manifest.js");
const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const ONLY = args.filter((a) => !a.startsWith("--"));

// Largeurs produites (jamais au-delà de la taille de la source).
const W_HERO = [768, 1280, 1920, 2560];       // scènes plein écran (ordinateur)
const W_HERO_M = [540, 800, 1080, 1440];      // scènes plein écran (mobile, portrait)
const W_WIDE = [640, 1024, 1600, 2200];       // grandes images de sections
const W_CARD = [480, 800, 1200, 1600];        // vignettes, cartes, portraits
const HERO_IDS = new Set(["facade", "entrance", "lobby", "reception", "corridor", "suite", "view", "dining-terrace", "dish", "dining-room", "spa", "pool", "rooftop"]);
const AVIF = { quality: 56, effort: 4, chromaSubsampling: "4:2:0" };
const WEBP = { quality: 76, effort: 5 };

function widthsFor(id, w, h) {
  const base = id.replace(/-m$/, "");
  const mobile = /-m$/.test(id);
  const list = HERO_IDS.has(base) ? (mobile ? W_HERO_M : W_HERO) : w >= 1900 ? W_WIDE : W_CARD;
  const out = list.filter((x) => x < w);
  out.push(Math.min(w, list[list.length - 1]));        // la plus grande taille utile
  return [...new Set(out)].sort((a, b) => a - b);
}

fs.mkdirSync(OUT, { recursive: true });
const files = fs.readdirSync(SRC).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
const ids = files.map((f) => ({ id: f.replace(/\.\w+$/, ""), file: path.join(SRC, f) })).filter((x) => !ONLY.length || ONLY.includes(x.id));

// Manifeste existant (pour ne pas perdre les photos non retraitées)
let manifest = {};
if (fs.existsSync(MANIFEST)) {
  const m = fs.readFileSync(MANIFEST, "utf8").match(/AURELIA\.manifest\s*=\s*(\{[\s\S]*\});?\s*$/);
  if (m) { try { manifest = JSON.parse(m[1]); } catch { manifest = {}; } }
}

let totalBytes = 0, done = 0;
async function one({ id, file }) {
  const srcTime = fs.statSync(file).mtimeMs;
  const meta = await sharp(file).metadata();
  const { width: w, height: h } = meta;
  const widths = widthsFor(id, w, h);
  const outs = widths.flatMap((x) => [path.join(OUT, `${id}-${x}.avif`), path.join(OUT, `${id}-${x}.webp`)]);
  const fresh = !FORCE && manifest[id] && manifest[id].w === w && outs.every((o) => fs.existsSync(o) && fs.statSync(o).mtimeMs >= srcTime);
  // Couleur moyenne : sert de fond le temps que la photo se charge
  const small = await sharp(file).resize(24, 24, { fit: "cover" }).removeAlpha().jpeg({ quality: 90 }).toBuffer();   // 8 bits : certains PNG sont en 16 bits
  const stats = await sharp(small).stats();
  const [r, g, b] = stats.channels.map((c) => Math.round(c.mean));
  const color = "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
  if (!fresh) {
    for (const x of widths) {
      const base = sharp(file).rotate().resize({ width: x, withoutEnlargement: true });
      const a = await base.clone().avif(AVIF).toFile(path.join(OUT, `${id}-${x}.avif`));
      const p = await base.clone().webp(WEBP).toFile(path.join(OUT, `${id}-${x}.webp`));
      totalBytes += a.size + p.size;
    }
    done++;
    console.log("ok :", id, `${w}x${h}`, "->", widths.join(", "));
  }
  manifest[id] = { w, h, widths, c: color };
}

const queue = [...ids];
await Promise.all(Array.from({ length: 2 }, async () => { while (queue.length) await one(queue.shift()); }));

// Photos disparues des sources : on les retire du manifeste
const known = new Set(files.map((f) => f.replace(/\.\w+$/, "")));
for (const k of Object.keys(manifest)) if (!known.has(k)) delete manifest[k];

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(MANIFEST,
  "/* Généré par `npm run images` : dimensions, largeurs disponibles et couleur moyenne de chaque photographie. Ne pas modifier à la main. */\n" +
  "window.AURELIA = window.AURELIA || {};\nAURELIA.manifest = " + JSON.stringify(sorted) + ";\n");

// Image de partage (réseaux sociaux) et blocs du héros dans index.html
if (fs.existsSync(path.join(SRC, "facade.png")) || ids.some((x) => x.id === "facade")) {
  const f = files.find((x) => /^facade\.\w+$/.test(x));
  if (f) await sharp(path.join(SRC, f)).resize(1200, 630, { fit: "cover", position: "centre" }).jpeg({ quality: 80, progressive: true, mozjpeg: true }).toFile(path.join(OUT, "og.jpg"));
}
const m = sorted.facade, mm = sorted["facade-m"];
const indexFile = path.join(ROOT, "index.html");
if (m && fs.existsSync(indexFile)) {
  const set = (ws, id, t) => ws.map((x) => `assets/img/${id}-${x}.${t} ${x}w`).join(", ");
  const preload =
    `<link rel="preload" as="image" type="image/avif" media="(min-width: 768px) and (orientation: landscape)" imagesrcset="${set(m.widths, "facade", "avif")}" imagesizes="100vw" fetchpriority="high">\n  ` +
    (mm ? `<link rel="preload" as="image" type="image/avif" media="(max-width: 767px), (orientation: portrait)" imagesrcset="${set(mm.widths, "facade-m", "avif")}" imagesizes="100vw" fetchpriority="high">` : "");
  const pic =
    `<picture>\n` +
    (mm ? `            <source media="(max-width: 767px), (orientation: portrait)" type="image/avif" srcset="${set(mm.widths, "facade-m", "avif")}" sizes="100vw">\n            <source media="(max-width: 767px), (orientation: portrait)" type="image/webp" srcset="${set(mm.widths, "facade-m", "webp")}" sizes="100vw">\n` : "") +
    `            <source type="image/avif" srcset="${set(m.widths, "facade", "avif")}" sizes="100vw">\n` +
    `            <source type="image/webp" srcset="${set(m.widths, "facade", "webp")}" sizes="100vw">\n` +
    `            <img src="assets/img/facade-${m.widths[Math.min(2, m.widths.length - 1)]}.webp" width="${m.w}" height="${m.h}" alt="La façade en travertin et arcades d'Aurelia Grand, illuminée au coucher du soleil au-dessus d'un bassin miroir" fetchpriority="high" decoding="async">\n` +
    `          </picture>`;
  let html = fs.readFileSync(indexFile, "utf8");
  html = html.replace(/<!-- build:hero-preload -->[\s\S]*?<!-- \/build:hero-preload -->/, `<!-- build:hero-preload -->\n  ${preload}\n  <!-- /build:hero-preload -->`);
  html = html.replace(/<!-- build:hero-picture -->[\s\S]*?<!-- \/build:hero-picture -->/, `<!-- build:hero-picture -->\n          ${pic}\n          <!-- /build:hero-picture -->`);
  fs.writeFileSync(indexFile, html);
}
console.log(`${done} photo(s) converties, ${(totalBytes / 1024 / 1024).toFixed(1)} Mo écrits, ${Object.keys(sorted).length} au manifeste.`);
