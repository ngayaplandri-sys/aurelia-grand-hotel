// Contrôle : l'ouverture de la visite dans le temps (photographie qui se pose, titre révélé mot à mot). Usage : node scripts/qa-intro.mjs <dossier> [profil]
import puppeteer from "puppeteer-core";
import fs from "node:fs";
const out = process.argv[2] || "production/review/intro";
const P = { desktop: { width: 1440, height: 810, deviceScaleFactor: 1 }, mobile: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true } };
const profile = process.argv[3] || "desktop";
fs.mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new", args: ["--no-sandbox", "--hide-scrollbars"] });
const page = await browser.newPage();
await page.setViewport(P[profile]);
const t0 = Date.now();
await page.goto("http://localhost:4180/", { waitUntil: "domcontentloaded" });
for (const t of [350, 800, 1300, 1900, 2800]) {
  const wait = t - (Date.now() - t0); if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  await page.screenshot({ path: `${out}/${profile}-t${t}.png` });
}
console.log("ok");
await browser.close();
