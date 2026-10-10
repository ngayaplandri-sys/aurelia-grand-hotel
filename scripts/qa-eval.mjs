// Outil de contrôle : charge le site dans Chrome (sans interface), fait défiler jusqu'à un élément, puis évalue une expression JavaScript et affiche le résultat.
// Usage : node scripts/qa-eval.mjs <profil> <sélecteur|-> "<expression JS>" [attente-ms]
// Exemple : node scripts/qa-eval.mjs desktop "#intro" "document.querySelector('.intro__main').className"
import puppeteer from "puppeteer-core";

const [profile = "desktop", target = "-", expr = "document.title", wait = "2500"] = process.argv.slice(2);
const PROFILES = {
  desktop: { width: 1440, height: 810, deviceScaleFactor: 1 },
  laptop: { width: 1280, height: 720, deviceScaleFactor: 1 },
  tablet: { width: 820, height: 1180, deviceScaleFactor: 1, isMobile: true, hasTouch: true },
  mobile: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
};
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport(PROFILES[profile]);
const logs = [];
page.on("console", (m) => logs.push(m.type() + ": " + m.text()));
page.on("pageerror", (e) => logs.push("pageerror: " + e.message));
await page.goto((process.env.SITE_URL || "http://localhost:4180/") + (process.env.QUERY || ""), { waitUntil: "load" });
await new Promise((r) => setTimeout(r, 1800));
if (target !== "-") {
  await page.evaluate((s) => { const el = document.querySelector(s); if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 70); }, target);
  await new Promise((r) => setTimeout(r, Number(wait)));
}
const out = await page.evaluate(expr);
console.log(typeof out === "string" ? out : JSON.stringify(out, null, 1));
if (logs.length) console.log("\n[console]\n" + logs.join("\n"));
await browser.close();
