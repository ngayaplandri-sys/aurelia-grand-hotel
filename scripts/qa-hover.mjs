// Contrôle : survol d'un élément (aperçus, états au survol). Usage : node scripts/qa-hover.mjs <sortie.png> <sélecteur-défilement> <sélecteur-survol> [profil]
import puppeteer from "puppeteer-core";
const [out, scrollSel, hoverSel, profile = "desktop"] = process.argv.slice(2);
const P = { desktop: { width: 1440, height: 810, deviceScaleFactor: 1 }, laptop: { width: 1280, height: 720, deviceScaleFactor: 1 }, wide: { width: 1920, height: 1080, deviceScaleFactor: 1 } };
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new", args: ["--no-sandbox", "--hide-scrollbars"] });
const page = await browser.newPage();
await page.setViewport(P[profile]);
await page.goto((process.env.SITE_URL || "http://localhost:4180/") + (process.env.QUERY || ""), { waitUntil: "load" });
await new Promise((r) => setTimeout(r, 1800));
await page.evaluate((s) => { const el = document.querySelector(s); window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 120); }, scrollSel);
await new Promise((r) => setTimeout(r, 1800));
const el = await page.$(hoverSel);
await el.hover();
await new Promise((r) => setTimeout(r, 1200));
await page.screenshot({ path: out });
console.log("capture :", out);
await browser.close();
