// Diagnostic : liste les décalages de mise en page (CLS) au chargement, avec l'élément concerné et sa position avant / après.
// Usage : node scripts/qa-cls.mjs [?lang=en] [largeur] [hauteur]
import puppeteer from "puppeteer-core";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const BASE = process.env.SITE_URL || "http://localhost:4180/";
const CHROME = process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const [query = "", w = "1440", h = "810"] = process.argv.slice(2);

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox", "--hide-scrollbars"] });
const page = await browser.newPage();
await page.setViewport({ width: Number(w), height: Number(h), deviceScaleFactor: 1 });
await page.evaluateOnNewDocument(() => {
  window.__shifts = [];
  const r = (x) => x && [x.x, x.y, x.width, x.height].map(Math.round);
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      if (e.hadRecentInput) continue;
      window.__shifts.push({
        t: Math.round(e.startTime), value: +e.value.toFixed(4),
        sources: (e.sources || []).map((s) => ({ node: s.node ? s.node.nodeName + "." + String(s.node.className || "").slice(0, 50) : "?", from: r(s.previousRect), to: r(s.currentRect) })),
      });
    }
  }).observe({ type: "layout-shift", buffered: true });
});
await page.goto(BASE + query, { waitUntil: "load" });
await sleep(3500);
const shifts = await page.evaluate(() => window.__shifts);
const total = shifts.reduce((a, s) => a + s.value, 0);
console.log(`${query || "(langue par défaut)"} ${w}x${h} : CLS ${total.toFixed(4)} · ${shifts.length} décalage(s)`);
for (const s of shifts) { console.log(`  t=${s.t} ms  valeur ${s.value}`); for (const x of s.sources) console.log(`    ${x.node}  ${JSON.stringify(x.from)} -> ${JSON.stringify(x.to)}`); }
await browser.close();
