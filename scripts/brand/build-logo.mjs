// AURELIA GRAND : génère les masters vectoriels du logo (texte vectorisé : aucune police requise à l'affichage).
// Prérequis (outil de production) : npm i -D opentype.js@1.3.4 @fontsource/cormorant-garamond @fontsource/hanken-grotesk sharp
// Usage : node scripts/brand/build-logo.mjs <dossier-de-sortie> [dossier node_modules]
import opentype from "opentype.js";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const OUT = process.argv[2] || "assets/brand";
const NM = process.argv[3] || "node_modules";
fs.mkdirSync(OUT, { recursive: true });
const load = (f) => { const b = fs.readFileSync(path.join(NM, f)); return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)); };
const serif = load("@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff");
const sans = load("@fontsource/hanken-grotesk/files/hanken-grotesk-latin-500-normal.woff");

// Mot vectorisé, glyphe par glyphe ; tracking en em.
function word(font, text, size, tracking = 0) {
  let x = 0; const parts = []; let top = Infinity, bottom = -Infinity;
  const glyphs = [...text].map((ch) => font.charToGlyph(ch));
  glyphs.forEach((g, i) => {
    parts.push(g.getPath(x, 0, size).toPathData(2));
    const bb = g.getPath(0, 0, size).getBoundingBox();
    if (isFinite(bb.y1) && ch(text, i) !== " ") { top = Math.min(top, bb.y1); bottom = Math.max(bottom, bb.y2); }
    const kern = i < glyphs.length - 1 ? (font.getKerningValue(g, glyphs[i + 1]) / font.unitsPerEm) * size : 0;
    x += (g.advanceWidth / font.unitsPerEm) * size + kern + (i < glyphs.length - 1 ? tracking * size : 0);
  });
  return { d: parts.join(""), width: x, top, bottom };
}
const ch = (t, i) => [...t][i];

// Symbole : deux arcades concentriques et un soleil bas (les arches de la façade, la lumière dorée). Boîte 60 x 80.
const markD = [
  "M4 78V30a26 26 0 0 1 52 0V78h-2.2V30a23.8 23.8 0 0 0-47.6 0V78z",           // arche extérieure (trait fin)
  "M13 78V32a17 17 0 0 1 34 0V78h-2V32a15 15 0 0 0-30 0V78z",                    // arche intérieure
  "M30 28.4a4.6 4.6 0 1 1 0 9.2a4.6 4.6 0 0 1 0-9.2z",                           // soleil
].join("");
const mark = (tx, ty, s) => `<path transform="translate(${tx} ${ty}) scale(${s})" d="${markD}"/>`;
const svg = (w, h, body, color) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w.toFixed(1)} ${h.toFixed(1)}" role="img" aria-label="AURELIA GRAND, Hotel &amp; Resort"><title>AURELIA GRAND, Hotel &amp; Resort</title><g fill="${color}">${body}</g></svg>\n`;

const COLORS = { ivory: "#F4EEE3", ink: "#0B0907", champagne: "#D9C39D" };

// 1) Version horizontale (en-tête) : symbole + AURELIA GRAND sur une ligne
function horizontal() {
  const L = word(serif, "AURELIA GRAND", 100, 0.26);
  const mS = 1.0, mW = 60 * mS, mH = 80 * mS, gap = 34;
  const lBase = -L.top;
  const textH = lBase + L.bottom;
  const H = Math.max(textH, mH), W = mW + gap + L.width;
  const ty = (H - textH) / 2;
  const body = mark(0, (H - mH) / 2, mS) +
    `<path transform="translate(${(mW + gap).toFixed(1)} ${(ty + lBase).toFixed(1)})" d="${L.d}"/>`;
  return { W, H, body };
}
// 2) Version empilée
function stacked() {
  const L = word(serif, "AURELIA", 120, 0.34);
  const L2 = word(serif, "GRAND", 120, 0.34);
  const S = word(sans, "HOTEL & RESORT", 26, 0.5);
  const mW = 60 * 1.1, mH = 80 * 1.1;
  const W = Math.max(L.width, L2.width, S.width) + 60;
  let y = 10 + mH + 46;
  const l1 = y - L.top; y = l1 + L.bottom + 26;
  const l2 = y - L2.top; y = l2 + L2.bottom + 34;
  const s1 = y - S.top; const H = s1 + S.bottom + 12;
  const body = mark((W - mW) / 2, 10, 1.1) +
    `<path transform="translate(${((W - L.width) / 2).toFixed(1)} ${l1.toFixed(1)})" d="${L.d}"/>` +
    `<path transform="translate(${((W - L2.width) / 2).toFixed(1)} ${l2.toFixed(1)})" d="${L2.d}"/>` +
    `<path transform="translate(${((W - S.width) / 2).toFixed(1)} ${s1.toFixed(1)})" d="${S.d}"/>`;
  return { W, H, body };
}
const hz = horizontal(), st = stacked();
for (const [name, c] of Object.entries(COLORS)) {
  fs.writeFileSync(path.join(OUT, `aurelia-logo-horizontal-${name}.svg`), svg(hz.W, hz.H, hz.body, c));
  fs.writeFileSync(path.join(OUT, `aurelia-logo-stacked-${name}.svg`), svg(st.W, st.H, st.body, c));
  fs.writeFileSync(path.join(OUT, `aurelia-mark-${name}.svg`), svg(60, 80, mark(0, 0, 1), c));
}
console.log("logo horizontal", hz.W.toFixed(1), "x", hz.H.toFixed(1), "(ratio", (hz.W / hz.H).toFixed(3) + ")");

// Favicon / icônes d'application : le symbole sur fond noir
const icon = (size, pad) => {
  const s = (size - 2 * pad) / 80, x = (size - 60 * s) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="${Math.round(size * 0.18)}" fill="#0B0907"/><g fill="#D9C39D">${mark(x, pad, s)}</g></svg>`;
};
fs.writeFileSync(path.join(OUT, "favicon.svg"), icon(64, 10));
await sharp(Buffer.from(icon(512, 90))).png().toFile(path.join(OUT, "icon-512.png"));
await sharp(Buffer.from(icon(180, 30))).png().toFile(path.join(OUT, "apple-touch-icon.png"));
console.log("logos et icônes écrits dans", OUT);
