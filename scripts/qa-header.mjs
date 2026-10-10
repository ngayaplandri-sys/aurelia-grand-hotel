// Contrôle : l'en-tête tient-il sur une ligne à chaque largeur, dans les deux langues ?
import puppeteer from "puppeteer-core";
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new", args: ["--no-sandbox", "--hide-scrollbars"] });
const page = await browser.newPage();
for (const lang of ["en", "fr"]) {
  const rows = [];
  for (const w of [1240, 1280, 1310, 1366, 1440, 1536, 1920]) {
    await page.setViewport({ width: w, height: 800, deviceScaleFactor: 1 });
    await page.goto("http://localhost:4180/?lang=" + lang, { waitUntil: "load" });
    await new Promise((r) => setTimeout(r, 900));
    const m = await page.evaluate(() => {
      const inner = document.querySelector(".site-header__inner").getBoundingClientRect();
      const kids = [...document.querySelector(".site-header__inner").children].filter((e) => getComputedStyle(e).display !== "none");
      const last = kids[kids.length - 1].getBoundingClientRect();
      const nav = document.querySelector(".nav__list").getBoundingClientRect();
      const brand = document.querySelector(".brand").getBoundingClientRect();
      return { innerRight: Math.round(inner.right), lastRight: Math.round(last.right), navW: Math.round(nav.width), brandW: Math.round(brand.width), overflow: Math.round(last.right - inner.right) };
    });
    rows.push(`${lang} ${w}px : nav ${m.navW}px, logo ${m.brandW}px, débordement ${m.overflow}px`);
  }
  console.log(rows.join("\n"));
}
await browser.close();
