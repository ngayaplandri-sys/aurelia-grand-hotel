// Contrôles automatiques : liens, images, débordements horizontaux, clavier, mouvement réduit, performance au chargement et au défilement.
// Usage : node scripts/qa-checks.mjs   (le serveur local doit tourner : npm run serve)
import puppeteer from "puppeteer-core";

const BASE = process.env.SITE_URL || "http://localhost:4180/";
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new", args: ["--no-sandbox"] });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const ok = (name, pass, detail = "") => { results.push({ pass, line: `${pass ? "OK   " : "ÉCHEC"} ${name}${detail ? " · " + detail : ""}` }); };

/* ---------- 1. Liens, images, débordements ---------- */
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 810 });
  const bad = [];
  page.on("response", (r) => { if (r.status() >= 400) bad.push(r.status() + " " + r.url()); });
  await page.goto(BASE, { waitUntil: "load" });
  await sleep(2500);
  // faire défiler toute la page pour déclencher les chargements différés
  await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
  await sleep(1500);
  const info = await page.evaluate(() => {
    const A = window.AURELIA;
    const links = [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href"));
    const anchors = links.filter((h) => /^#[^/]/.test(h) && h.length > 1);
    const missing = [...new Set(anchors)].filter((h) => !document.getElementById(h.slice(1)) && h !== "#top");
    const routes = [...new Set(links.filter((h) => /^#\/(room|dining|wellness|offer|legal)\//.test(h)))];
    const badRoutes = routes.filter((h) => { const m = /^#\/(\w+)\/([\w-]+)$/.exec(h); return !A.detail.exists(m[1], m[2]); });
    const imgs = [...document.querySelectorAll("img")];
    const noAlt = imgs.filter((i) => !i.hasAttribute("alt")).length;
    const emptyAlt = imgs.filter((i) => i.getAttribute("alt") === "" && !i.closest("[aria-hidden='true'], .scene__layer, .ph.detail__heroimg")).length;
    const noDims = imgs.filter((i) => !i.getAttribute("width") || !i.getAttribute("height")).length;
    const broken = imgs.filter((i) => i.complete && i.naturalWidth === 0 && i.currentSrc).map((i) => i.currentSrc.split("/").pop());
    const externalNoRel = [...document.querySelectorAll('a[target="_blank"]')].filter((a) => !/noopener/.test(a.rel)).length;
    const h1 = document.querySelectorAll("h1").length;
    const dupIds = (() => { const seen = {}, d = []; document.querySelectorAll("[id]").forEach((e) => { if (seen[e.id]) d.push(e.id); seen[e.id] = 1; }); return d; })();
    return { total: links.length, anchors: anchors.length, missing, routes: routes.length, badRoutes, imgs: imgs.length, noAlt, emptyAlt, noDims, broken, externalNoRel, h1, dupIds };
  });
  ok("liens internes (ancres)", info.missing.length === 0, `${info.anchors} ancres${info.missing.length ? ", manquantes : " + info.missing.join(", ") : ""}`);
  ok("fiches détaillées (#/…)", info.badRoutes.length === 0, `${info.routes} liens${info.badRoutes.length ? ", introuvables : " + info.badRoutes.join(", ") : ""}`);
  ok("aucune réponse HTTP en erreur", bad.length === 0, bad.slice(0, 5).join(" | "));
  ok("images : attribut alt présent", info.noAlt === 0, `${info.imgs} images`);
  ok("images : largeur et hauteur déclarées", info.noDims === 0);
  ok("images chargées sans erreur", info.broken.length === 0, info.broken.join(", "));
  ok("liens externes avec rel=noopener", info.externalNoRel === 0);
  ok("un seul titre h1", info.h1 === 1, `${info.h1}`);
  ok("identifiants uniques", info.dupIds.length === 0, info.dupIds.join(", "));
  await page.close();
}

/* ---------- 2. Pas de défilement horizontal ---------- */
for (const w of [320, 375, 390, 414, 768, 820, 1024, 1280, 1440, 1920, 2560]) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: w < 700 ? 800 : 900, isMobile: w < 800, hasTouch: w < 800, deviceScaleFactor: 1 });
  await page.goto(BASE, { waitUntil: "load" });
  await sleep(1200);
  const r = await page.evaluate(async () => {
    let worst = 0;
    for (let y = 0; y < document.documentElement.scrollHeight; y += 900) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 25)); worst = Math.max(worst, document.documentElement.scrollWidth - window.innerWidth); }
    return worst;
  });
  ok(`aucun défilement horizontal à ${w}px`, r <= 0, r > 0 ? `+${r}px` : "");
  await page.close();
}

/* ---------- 3. Clavier ---------- */
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 810 });
  await page.goto(BASE, { waitUntil: "load" });
  await sleep(2500);
  const stops = [];
  for (let i = 0; i < 16; i++) {
    await page.keyboard.press("Tab");
    stops.push(await page.evaluate(() => {
      const e = document.activeElement; if (!e || e === document.body) return "(corps)";
      const cs = getComputedStyle(e);
      const ring = cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0;
      return (e.tagName.toLowerCase() + (e.getAttribute("href") ? "[" + e.getAttribute("href") + "]" : "") + " « " + (e.getAttribute("aria-label") || e.textContent || "").trim().replace(/\s+/g, " ").slice(0, 28) + " »") + (ring ? "" : " (sans anneau)");
    }));
  }
  console.log("\nOrdre de tabulation (16 premiers arrêts) :\n  " + stops.join("\n  "));
  ok("le premier arrêt est le lien d'évitement", /skip|Skip|contenu/i.test(stops[0]) || /#content/.test(stops[0]), stops[0]);
  ok("chaque arrêt de tabulation a un anneau de focus visible", stops.every((s) => !/sans anneau/.test(s)), stops.filter((s) => /sans anneau/.test(s)).join(" | "));
  // Entrée sur « passer la visite »
  await page.keyboard.down("Shift"); await page.keyboard.press("Tab"); await page.keyboard.up("Shift");
  await page.close();
}

/* ---------- 4. Mouvement réduit ---------- */
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 810 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.goto(BASE, { waitUntil: "load" });
  await sleep(2000);
  const r = await page.evaluate(() => {
    const stage = document.querySelector("[data-stage]");
    const panels = document.querySelectorAll(".tpanel").length;
    return { cls: document.documentElement.className, sticky: getComputedStyle(stage).position, panels, hero: !!document.querySelector("h1"), tourH: document.querySelector("[data-tour]").offsetHeight, reveal: document.documentElement.classList.contains("js-reveal") };
  });
  ok("mouvement réduit : mode fixe (pas de scène épinglée)", /is-static/.test(r.cls) && r.sticky !== "sticky", r.cls);
  ok("mouvement réduit : photographies et textes à la suite", r.panels >= 8, `${r.panels} panneaux`);
  ok("mouvement réduit : apparitions désactivées", !r.reveal);
  await page.close();
}

/* ---------- 5. Performance ---------- */
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 810, deviceScaleFactor: 1 });
  const cdp = await page.createCDPSession();
  await cdp.send("Network.enable");
  let bytes = 0, reqs = 0; const byType = {};
  cdp.on("Network.loadingFinished", (e) => { bytes += e.encodedDataLength; reqs++; });
  cdp.on("Network.responseReceived", (e) => { byType[e.type] = (byType[e.type] || 0) + 1; });
  await page.evaluateOnNewDocument(() => {
    window.__cls = 0; window.__lcp = 0; window.__long = [];
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
    try { new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__long.push(Math.round(e.duration)); }).observe({ type: "longtask", buffered: true }); } catch (e) {}
  });
  await page.goto(BASE, { waitUntil: "load" });
  await sleep(3500);
  const first = await page.evaluate(() => ({ lcp: Math.round(window.__lcp), cls: +window.__cls.toFixed(4), long: window.__long.slice(), fcp: Math.round(performance.getEntriesByName("first-contentful-paint")[0].startTime) }));
  const loadBytes = bytes, loadReqs = reqs;
  ok("poids au chargement < 1,2 Mo (première image comprise)", loadBytes < 1.2e6, `${(loadBytes / 1024).toFixed(0)} Ko, ${loadReqs} requêtes`);
  ok("LCP < 2,5 s (local)", first.lcp < 2500, `${first.lcp} ms (FCP ${first.fcp} ms)`);
  ok("décalage de mise en page (CLS) < 0,1", first.cls < 0.1, `${first.cls}`);
  // défilement de toute la visite
  const scroll = await page.evaluate(async () => {
    const total = AURELIA.tour.state().total, vhPx = AURELIA.tour.state().vhPx;
    const frames = []; let last = performance.now(); const long = [];
    new PerformanceObserver((l) => { for (const e of l.getEntries()) long.push(Math.round(e.duration)); }).observe({ type: "longtask" });
    for (let v = 0; v <= total; v += 4) { window.scrollTo(0, v * vhPx); await new Promise((r) => requestAnimationFrame(r)); const n = performance.now(); frames.push(n - last); last = n; }
    frames.sort((a, b) => a - b);
    return { n: frames.length, median: +frames[Math.floor(frames.length / 2)].toFixed(1), p95: +frames[Math.floor(frames.length * 0.95)].toFixed(1), max: +frames[frames.length - 1].toFixed(1), long };
  });
  await sleep(500);
  ok("défilement de la visite : image médiane < 24 ms (rendu logiciel sans GPU)", scroll.median < 24, `médiane ${scroll.median} ms, p95 ${scroll.p95} ms, max ${scroll.max} ms, ${scroll.n} images`);
  ok("défilement : aucune tâche longue > 120 ms", scroll.long.every((d) => d < 120), scroll.long.join(", "));
  console.log(`\nTransfert total après le défilement de la visite : ${((bytes) / 1024 / 1024).toFixed(1)} Mo, ${reqs} requêtes (${JSON.stringify(byType)})`);
  await page.close();
}

console.log("\n" + results.map((r) => r.line).join("\n"));
const failed = results.filter((r) => !r.pass).length;
console.log(`\n${results.length - failed} contrôles réussis sur ${results.length}.`);
await browser.close();
process.exit(failed ? 1 : 0);
