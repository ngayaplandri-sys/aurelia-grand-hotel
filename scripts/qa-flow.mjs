// Parcours de contrôle : ouvre une fiche chambre, la photographie en grand, réserve, change de langue, teste les formulaires.
// Usage : node scripts/qa-flow.mjs <dossier-sortie> [desktop|mobile]
import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";

const out = process.argv[2] || "production/review/flow";
const profile = process.argv[3] || "desktop";
const PROFILES = { desktop: { width: 1440, height: 810, deviceScaleFactor: 1 }, mobile: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true } };
fs.mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport(PROFILES[profile]);
const errors = [];
page.on("console", (m) => { if (["error", "warning"].includes(m.type())) errors.push(m.type() + ": " + m.text()); });
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
page.on("requestfailed", (r) => errors.push("requestfailed: " + r.url()));
page.on("response", (r) => { if (r.status() >= 400) errors.push("http " + r.status() + ": " + r.url()); });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const shot = async (name) => { const f = path.join(out, `${profile}-${name}.png`); await page.screenshot({ path: f }); console.log("capture :", f); };
const results = [];
const check = (name, ok, extra = "") => { results.push([ok ? "OK " : "ÉCHEC", name, extra]); };

await page.goto("http://localhost:4180/", { waitUntil: "load" });
await sleep(2500);

// 1) fiche chambre via lien
await page.evaluate(() => window.scrollTo(0, document.querySelector("#room-junior-suite").getBoundingClientRect().top + scrollY - 80));
await sleep(1500);
await page.evaluate(() => document.querySelector('#room-junior-suite a[href="#/room/junior-suite"]').click());
await sleep(1600);
check("fiche chambre ouverte", await page.evaluate(() => document.querySelector("[data-detail]").open && location.hash === "#/room/junior-suite"));
check("titre de la fiche", await page.evaluate(() => /Junior Suite/.test(document.querySelector("#detail-title").textContent)));
await shot("1-fiche");
// photographie en grand depuis la fiche
await page.evaluate(() => document.querySelector('[data-open-photo]').click());
await sleep(1200);
check("visionneuse ouverte", await page.evaluate(() => document.querySelector("[data-lightbox]").open));
await shot("2-visionneuse");
await page.keyboard.press("ArrowRight"); await sleep(700);
check("flèche droite : 2e photographie", await page.evaluate(() => /02 \//.test(document.querySelector("[data-lb-count]").textContent)));
await page.keyboard.press("Escape"); await sleep(500);
check("Échap ferme la visionneuse, pas la fiche", await page.evaluate(() => !document.querySelector("[data-lightbox]").open && document.querySelector("[data-detail]").open));
// réserver cette chambre
await page.evaluate(() => document.querySelector("[data-detail] [data-book-room]").click());
await sleep(1800);
check("fiche fermée après « réserver »", await page.evaluate(() => !document.querySelector("[data-detail]").open));
check("chambre présélectionnée", await page.evaluate(() => document.querySelector("#b-room").value === "junior-suite"));
check("l'adresse revient à la page", await page.evaluate(() => !location.hash.startsWith("#/")));
await shot("3-reservation");

// 2) formulaire de réservation : erreurs puis succès
await page.evaluate(() => document.querySelector('[data-booking-form] button[type=submit]').click());
await sleep(500);
check("erreurs affichées (dates vides)", await page.evaluate(() => document.querySelector("#b-e-arrival").textContent.length > 5 && document.querySelector("#b-e-departure").textContent.length > 5));
await shot("4-erreurs");
await page.evaluate(() => { const f = document.querySelector("[data-booking-form]"); const d = new Date(); d.setDate(d.getDate() + 20); const iso = (x) => x.toISOString().slice(0, 10); f.arrival.value = iso(d); f.arrival.dispatchEvent(new Event("change", { bubbles: true })); });
await sleep(200);
check("départ proposé automatiquement", await page.evaluate(() => !!document.querySelector("#b-departure").value));
await page.evaluate(() => document.querySelector('[data-booking-form] button[type=submit]').click());
await sleep(900);
check("récapitulatif affiché en mode démonstration", await page.evaluate(() => !document.querySelector("[data-booking-result]").hidden && /mailto:/.test(document.querySelector("[data-booking-result] a.btn").getAttribute("href"))));
await shot("5-recap");

// 3) langue : le site s'ouvre en français ; bascule vers l'anglais, puis retour
const introLabel = () => page.evaluate(() => ({ lang: document.documentElement.lang, label: document.querySelector("#intro-title").getAttribute("aria-label"), pressed: document.querySelector('[data-lang-switch] [aria-pressed="true"]').dataset.lang }));
let L = await introLabel();
check("français par défaut", L.lang === "fr" && /Plus qu/.test(L.label) && L.pressed === "fr");
await page.evaluate(() => document.querySelector('[data-lang-switch] [data-lang="en"]').click());
await sleep(900);
L = await introLabel();
check("langue anglaise appliquée", L.lang === "en" && /More than a stay/.test(L.label) && L.pressed === "en");
await page.evaluate(() => document.querySelector('[data-lang-switch] [data-lang="fr"]').click());
await sleep(900);
L = await introLabel();
check("retour au français", L.lang === "fr" && /Plus qu/.test(L.label) && L.pressed === "fr");
await page.evaluate(() => window.scrollTo(0, 0));
await sleep(900);
await shot("6-fr");

// 4) contact
await page.evaluate(() => document.querySelector("#contact").scrollIntoView());
await sleep(800);
await page.evaluate(() => document.querySelector('[data-contact-form] button[type=submit]').click());
await sleep(400);
check("erreurs du formulaire de contact", await page.evaluate(() => document.querySelector("#c-e-name").textContent.length > 3 && document.querySelector("#c-e-consent").textContent.length > 3));
await page.type("#c-name", "Test Visiteur"); await page.type("#c-email", "visiteur@example.com"); await page.type("#c-message", "Bonjour, ceci est un message de test.");
await page.click("#c-consent");
await page.evaluate(() => document.querySelector('[data-contact-form] button[type=submit]').click());
await sleep(500);
check("contact valide : message de démonstration", await page.evaluate(() => /mailto:/.test(document.querySelector("[data-cform-result] a")?.getAttribute("href") || "")));

// 5) pages légales et menu
await page.evaluate(() => document.querySelector('a[href="#/legal/privacy"]').click());
await sleep(1200);
check("page légale ouverte", await page.evaluate(() => document.querySelector("[data-detail]").open && /Privacy|confidentialité/i.test(document.querySelector("#detail-title").textContent)));
await page.keyboard.press("Escape"); await sleep(800);
check("Échap ferme la page légale", await page.evaluate(() => !document.querySelector("[data-detail]").open));

console.log("\n" + results.map((r) => r.join(" · ")).join("\n"));
console.log(errors.length ? "\nConsole :\n" + [...new Set(errors)].join("\n") : "\nAucune erreur de console.");
await browser.close();
