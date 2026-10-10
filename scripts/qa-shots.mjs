// Outil de contrôle visuel : ouvre le site dans Chrome (sans interface), place la visite à des positions précises et enregistre des captures.
// Usage : node scripts/qa-shots.mjs <dossier-sortie> <profil: desktop|mobile|tablet> <liste de positions>
//   positions : p=<plan>:<fraction> (avancement de la transition d'entrée, 0 à 1) ; click=<sélecteur> (clic puis capture) ; land=<plan> | mid=<plan> | start=<plan> (arrivée, milieu, début de la transition d'un plan) ; v=300 (position dans la visite, en vh) ; s=lobby@0.5 (plan et fraction) ; y=2400 (défilement en px) ; sel=#stay (élément) ; full (page entière)
// Exemple : node scripts/qa-shots.mjs production/review/qa desktop v=0 s=lobby@0.5 sel=#stay
import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";

const [outDir, profile = "desktop", ...marks] = process.argv.slice(2);
const URL_ = process.env.SITE_URL || "http://localhost:4180/";
const PROFILES = {
  desktop: { width: 1440, height: 810, deviceScaleFactor: 1 },
  laptop: { width: 1280, height: 720, deviceScaleFactor: 1 },
  wide: { width: 1920, height: 1080, deviceScaleFactor: 1 },
  ultra: { width: 2560, height: 1080, deviceScaleFactor: 1 },
  ipadl: { width: 1024, height: 768, deviceScaleFactor: 1, isMobile: true, hasTouch: true },
  tiny: { width: 320, height: 640, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  tablet: { width: 820, height: 1180, deviceScaleFactor: 1, isMobile: true, hasTouch: true },
  mobile: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
};
const CHROME = process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";
fs.mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox", "--hide-scrollbars", "--enable-features=VaapiVideoDecoder"] });
const page = await browser.newPage();
await page.setViewport(PROFILES[profile]);
const errors = [];
page.on("console", (m) => { if (["error", "warning"].includes(m.type())) errors.push(`${m.type()}: ${m.text()}`); });
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
page.on("requestfailed", (r) => errors.push("requestfailed: " + r.url()));
page.on("response", (r) => { if (r.status() >= 400) errors.push(`http ${r.status()}: ${r.url()}`); });

const query = process.env.QUERY || "";
await page.goto(URL_ + query, { waitUntil: "load" });
await new Promise((r) => setTimeout(r, 3200));            // ouverture de la visite

let n = 0;
for (const mark of marks.length ? marks : ["v=0"]) {
  const [k, val] = mark.includes("=") ? [mark.slice(0, mark.indexOf("=")), mark.slice(mark.indexOf("=") + 1)] : [mark, ""];
  let label = mark.replace(/[^\w@.-]+/g, "_");
  if (k === "v") await page.evaluate((v) => AURELIA.tour.seek(+v), val);
  else if (k === "s") { const [id, f] = val.split("@"); await page.evaluate((id, f) => AURELIA.tour.seekScene(id, +f), id, f == null ? 0.5 : f); }
  else if (k === "p") { const [id, f] = val.split(":"); await page.evaluate((id, f) => { const sc = AURELIA.tour.scenes.find((x) => x.def.id === id); AURELIA.tour.seek(sc.eStart + (+f) * (sc.eEnd - sc.eStart)); }, id, f); }
  else if (k === "land" || k === "mid" || k === "start") await page.evaluate((id, kind) => {
    const sc = AURELIA.tour.scenes.find((x) => x.def.id === id);
    AURELIA.tour.seek(kind === "land" ? sc.eEnd + 6 : kind === "mid" ? (sc.eStart + sc.eEnd) / 2 : sc.eStart + 4);
  }, val, k);
  else if (k === "click") { await page.evaluate((sel) => document.querySelector(sel).click(), val); await new Promise((r) => setTimeout(r, 1400)); }
  else if (k === "seq") {
    // seq=#section:N : N captures successives en descendant de 0,9 écran à partir du haut de la section
    const [sel, count] = val.split(":");
    await page.evaluate((s) => { const el = document.querySelector(s); if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 70); }, sel);
    for (let i = 0; i < Number(count || 4); i++) {
      for (let j = 0; j < 6; j++) { await page.evaluate(() => window.scrollBy(0, 1)); await new Promise((r) => setTimeout(r, 220)); }
      const f = path.join(outDir, `${profile}-${String(++n).padStart(2, "0")}-seq_${sel.replace(/W+/g, "")}_${i + 1}.png`);
      await page.screenshot({ path: f });
      console.log("capture :", f);
      await page.evaluate(() => window.scrollBy(0, Math.round(window.innerHeight * 0.9)));
    }
    continue;
  }
  else if (k === "y") await page.evaluate((y) => window.scrollTo(0, +y), val);
  else if (k === "sel") {
    await page.evaluate((s) => { const el = document.querySelector(s); if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 70); }, val);
  }
  await new Promise((r) => setTimeout(r, k === "full" ? 200 : 900));
  // laisse les apparitions se jouer
  if (k === "sel" || k === "y") { for (let i = 0; i < 5; i++) { await page.evaluate(() => window.scrollBy(0, 0)); await new Promise((r) => setTimeout(r, 250)); } }
  const file = path.join(outDir, `${profile}-${String(++n).padStart(2, "0")}-${label}.png`);
  await page.screenshot({ path: file, fullPage: k === "full" });
  console.log("capture :", file);
}
if (errors.length) console.log("\nMessages de la console :\n" + [...new Set(errors)].join("\n")); else console.log("\nAucune erreur de console.");
await browser.close();
