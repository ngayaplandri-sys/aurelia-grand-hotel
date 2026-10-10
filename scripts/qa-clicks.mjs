// Contrôle : chaque lien et chaque bouton d'action de la page fait bien ce qu'il annonce (ancre → section visible, fiche → dialogue, présélections).
import puppeteer from "puppeteer-core";
const profile = process.argv[2] || "desktop";
const P = { desktop: { width: 1440, height: 810 }, mobile: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } };
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport(P[profile]);
const errors = []; page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await page.goto("http://localhost:4180/", { waitUntil: "load" }); await sleep(2200);
const hrefs = await page.evaluate(() => [...new Set([...document.querySelectorAll("a[href^='#']")].map((a) => a.getAttribute("href")).filter((h) => h.length > 1))]);
const res = []; let bad = 0;
for (const h of hrefs) {
  await page.evaluate(() => { window.scrollTo(0, 0); });
  await sleep(150);
  const out = await page.evaluate(async (h) => {
    const a = [...document.querySelectorAll(`a[href="${h}"]:not([data-tour-start])`)].find((x) => x.offsetParent !== null || x.closest(".tour")) || document.querySelector(`a[href="${h}"]`);
    if (!a) return { ok: false, why: "lien introuvable" };
    a.click();
    await new Promise((r) => setTimeout(r, 1500));
    if (/^#\//.test(h)) { const d = document.querySelector("[data-detail]"); const ok = d.open; if (ok) { A = window.AURELIA; A.router.closeDetail(); await new Promise((r) => setTimeout(r, 900)); } return { ok, why: ok ? "" : "la fiche ne s'ouvre pas" }; }
    const id = h === "#top" ? null : h.slice(1);
    if (!id) return { ok: window.scrollY < 40, why: "retour en haut" };
    const t = document.getElementById(id); const r = t.getBoundingClientRect();
    const ok = r.top < window.innerHeight * 0.85 && r.bottom > 0;
    return { ok, why: ok ? "" : "la section n'est pas à l'écran (top " + Math.round(r.top) + ")" };
  }, h);
  if (!out.ok) bad++;
  res.push((out.ok ? "OK    " : "ÉCHEC ") + h + (out.why ? " · " + out.why : ""));
}
console.log(res.join("\n"));
console.log(`\n${hrefs.length - bad}/${hrefs.length} liens corrects.` + (errors.length ? "\nErreurs :\n" + [...new Set(errors)].join("\n") : "\nAucune erreur de console."));
await browser.close();
process.exit(bad ? 1 : 0);
