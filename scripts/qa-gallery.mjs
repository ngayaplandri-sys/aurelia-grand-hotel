// Contrôle : filtres de la galerie (mise en page recomposée sans trous). Usage : node scripts/qa-gallery.mjs <dossier-sortie>
import puppeteer from "puppeteer-core";
import fs from "node:fs";
const out = process.argv[2] || "production/review/gal";
fs.mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new", args: ["--no-sandbox", "--hide-scrollbars"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:4180/", { waitUntil: "load" });
await new Promise((r) => setTimeout(r, 1500));
for (const cat of ["spa", "rooms", "restaurant", "details"]) {
  await page.evaluate(() => { const el = document.querySelector("#gallery"); window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 60); });
  await new Promise((r) => setTimeout(r, 600));
  await page.evaluate((c) => document.querySelector(`[data-cat="${c}"]`).click(), cat);
  await new Promise((r) => setTimeout(r, 1800));
  const n = await page.evaluate(() => document.querySelectorAll(".gi").length);
  await page.screenshot({ path: `${out}/gallery-${cat}.png` });
  console.log(cat, n, "photographies");
}
await browser.close();
