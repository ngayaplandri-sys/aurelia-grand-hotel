// Prépare le dossier dist/ prêt à être mis en ligne : un seul fichier JS et un seul fichier CSS, minifiés, plus les images, polices et logos.
// Les fichiers sources ne changent pas (le site reste modifiable tel quel) ; dist/ se recrée à chaque fois.
// Usage : npm run build   puis   SERVE_DIR=dist PORT=4181 npm run serve   pour l'essayer.
import { transformSync } from "esbuild";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIST = path.join(ROOT, "dist");
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(path.join(DIST, "assets", "js"), { recursive: true });
fs.mkdirSync(path.join(DIST, "assets", "css"), { recursive: true });

let html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

// CSS : concaténé dans l'ordre de la page, minifié (les adresses ../fonts/ restent valides : même profondeur de dossier)
const cssLinks = [...html.matchAll(/<link rel="stylesheet" href="(assets\/css\/[^"]+)">\s*/g)];
const css = cssLinks.map((m) => transformSync(fs.readFileSync(path.join(ROOT, m[1]), "utf8"), { loader: "css", minify: true }).code).join("");
fs.writeFileSync(path.join(DIST, "assets", "css", "aurelia.min.css"), css);
cssLinks.forEach((m, i) => { html = html.replace(m[0], i === 0 ? '<link rel="stylesheet" href="assets/css/aurelia.min.css">\n  ' : ""); });

// JS : scripts classiques, dans l'ordre de la page ; chaque fichier est une fonction autonome, la concaténation garde le même comportement
const jsTags = [...html.matchAll(/<script src="(assets\/js\/[^"]+)"><\/script>\s*/g)];
const js = jsTags.map((m) => transformSync(fs.readFileSync(path.join(ROOT, m[1]), "utf8"), { loader: "js", minify: true, target: "es2018", legalComments: "none" }).code.trim().replace(/;?$/, ";")).join("\n");
fs.writeFileSync(path.join(DIST, "assets", "js", "aurelia.min.js"), js);
jsTags.forEach((m, i) => { html = html.replace(m[0], i === 0 ? '<script src="assets/js/aurelia.min.js"></script>\n  ' : ""); });
// commentaires HTML de réglage inutiles en ligne
html = html.replace(/<!-- (?:\/)?build:[\w-]+ -->\s*/g, "").replace(/\n\s*\n\s*\n/g, "\n\n");
fs.writeFileSync(path.join(DIST, "index.html"), html);

// Médias
for (const d of ["img", "fonts", "brand"]) fs.cpSync(path.join(ROOT, "assets", d), path.join(DIST, "assets", d), { recursive: true });

const kb = (f) => (fs.statSync(f).size / 1024).toFixed(0) + " Ko";
console.log(`dist/index.html ${kb(path.join(DIST, "index.html"))} · aurelia.min.css ${kb(path.join(DIST, "assets/css/aurelia.min.css"))} · aurelia.min.js ${kb(path.join(DIST, "assets/js/aurelia.min.js"))}`);
let n = 0, size = 0;
(function walk(d) { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); f.isDirectory() ? walk(p) : (n++, size += fs.statSync(p).size); } })(DIST);
console.log(`${n} fichiers, ${(size / 1024 / 1024).toFixed(1)} Mo : prêt à être envoyé chez l'hébergeur.`);
