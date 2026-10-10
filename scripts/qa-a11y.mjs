// Audit d'accessibilité automatisé (axe-core) : page d'accueil à plusieurs positions, fiche ouverte, visionneuse, menu mobile, version française.
// Usage : node scripts/qa-a11y.mjs [desktop|mobile]
import puppeteer from "puppeteer-core";
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const axeSource = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const profile = process.argv[2] || "desktop";
const P = { desktop: { width: 1440, height: 810, deviceScaleFactor: 1 }, mobile: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true } };
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport(P[profile]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function audit(label, opts = {}) {
  await page.evaluate(axeSource);
  const res = await page.evaluate(async (opts) => {
    const r = await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] }, ...opts });
    return r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, 4).map((n) => n.target.join(" ") + " :: " + (n.failureSummary || "").split("\n").slice(1, 3).join(" | ")), count: v.nodes.length }));
  }, opts);
  console.log(`\n=== ${label} : ${res.length} type(s) de problème`);
  res.forEach((v) => console.log(`- [${v.impact}] ${v.id} (${v.count}) ${v.help}\n    ` + v.nodes.join("\n    ")));
  return res.length;
}
let total = 0;
await page.goto("http://localhost:4180/", { waitUntil: "load" }); await sleep(2600);
total += await audit("accueil (haut de page, visite)");
await page.evaluate(() => AURELIA.tour.seek(900)); await sleep(900);
total += await audit("visite au plan « vue »");
await page.evaluate(() => document.querySelector("#intro").scrollIntoView()); await sleep(1500);
total += await audit("contenu (page entière)");
await page.evaluate(() => document.querySelector('#room-junior-suite a[href="#/room/junior-suite"]').click()); await sleep(1500);
total += await audit("fiche chambre ouverte");
await page.evaluate(() => document.querySelector("[data-open-photo]").click()); await sleep(1200);
total += await audit("visionneuse ouverte");
await page.keyboard.press("Escape"); await sleep(400); await page.keyboard.press("Escape"); await sleep(600);
if (profile === "mobile") { await page.evaluate(() => document.querySelector("[data-burger]").click()); await sleep(1400); total += await audit("menu mobile ouvert"); await page.evaluate(() => document.querySelector("[data-burger]").click()); await sleep(600); }
await page.goto("http://localhost:4180/?lang=fr", { waitUntil: "load" }); await sleep(2600);
await page.evaluate(() => document.querySelector("#contact").scrollIntoView()); await sleep(1200);
total += await audit("version française (contact)");
console.log("\nTotal : " + total + " type(s) de problème au cumul des états testés.");
await browser.close();
