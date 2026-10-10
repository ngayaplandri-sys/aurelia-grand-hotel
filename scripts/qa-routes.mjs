// Contrôle : adresses partageables des fiches (#/room/…), bouton retour du navigateur, Échap, adresse invalide.
import puppeteer from "puppeteer-core";
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 810 });
const errors = []; page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const res = [];
const t = (name, ok, d = "") => res.push((ok ? "OK    " : "ÉCHEC ") + name + (d ? " · " + d : ""));
const state = () => page.evaluate(() => ({ open: document.querySelector("[data-detail]").open, hash: location.hash, title: (document.querySelector("#detail-title") || {}).textContent || "", scroll: Math.round(scrollY), pageTitle: document.title }));

// 1) adresse partagée ouverte directement
await page.goto("http://localhost:4180/#/room/deluxe-room", { waitUntil: "load" }); await sleep(2200);
let s = await state();
t("adresse directe : la fiche s'ouvre", s.open && /Deluxe/.test(s.title), JSON.stringify(s));
await page.keyboard.press("Escape"); await sleep(900);
s = await state();
t("Échap referme et nettoie l'adresse", !s.open && s.hash === "", JSON.stringify(s));
t("le titre de la page est rétabli", /AURELIA GRAND ·/.test(s.pageTitle) && !/Deluxe/.test(s.pageTitle), s.pageTitle);

// 2) ouverture par clic puis bouton retour
await page.evaluate(() => document.querySelector("#stay").scrollIntoView()); await sleep(1200);
const y0 = (await state()).scroll;
await page.evaluate(() => document.querySelector('a[href="#/room/presidential-suite"]').click()); await sleep(1400);
s = await state(); t("clic : la fiche s'ouvre et l'adresse change", s.open && s.hash === "#/room/presidential-suite", s.hash);
await page.goBack(); await sleep(1200);
s = await state(); t("bouton retour : la fiche se ferme", !s.open && s.hash === "", JSON.stringify(s));
t("la position de défilement est conservée", Math.abs(s.scroll - y0) < 5, `${y0} -> ${s.scroll}`);
await page.goForward(); await sleep(1200);
s = await state(); t("bouton avancer : la fiche se rouvre", s.open && /Presidential|Présidentielle/.test(s.title), s.title);
await page.keyboard.press("Escape"); await sleep(900);

// 3) adresse invalide et autres types de fiches
await page.goto("http://localhost:4180/#/room/inconnue", { waitUntil: "load" }); await sleep(1500);
s = await state(); t("adresse invalide : ignorée proprement", !s.open && s.hash === "", JSON.stringify(s));
for (const h of ["#/dining/hesperia", "#/wellness/aurelia-spa", "#/offer/romantic-escape", "#/legal/booking-terms"]) {
  await page.goto("http://localhost:4180/" + h, { waitUntil: "load" }); await sleep(1600);
  s = await state(); t("fiche " + h, s.open && s.title.length > 3, s.title);
}
console.log(res.join("\n"));
console.log(errors.length ? "\nErreurs :\n" + errors.join("\n") : "\nAucune erreur de console.");
await browser.close();
