// AURELIA GRAND : lance une série de générations d'images Higgsfield (CLI `higgsfield`) et télécharge les résultats.
// Usage : node scripts/hf-batch.mjs production/jobs/<lot>.json [nom1 nom2 ...]   (sans noms : tout le lot)
// Le fichier décrit { outDir, model, args, bible, concurrency, items: [{ name, aspect, prompt, model?, args?, refs?, bible? }] }.
//  - bible : fichier texte collé au début de chaque prompt (bloc canonique de la bible visuelle) ; "bible": false sur un élément pour l'ignorer.
//  - refs  : images de référence (chemins relatifs à la racine du projet) passées en --image-references, pour garder les mêmes matières et le même bâtiment.
// Reprise automatique : un élément déjà téléchargé est ignoré. Journal : <outDir>/_jobs.json
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const spec = JSON.parse(fs.readFileSync(path.resolve(process.argv[2]), "utf8"));
const only = process.argv.slice(3);
const outDir = path.join(ROOT, spec.outDir);
fs.mkdirSync(outDir, { recursive: true });
const logFile = path.join(outDir, "_jobs.json");
const log = fs.existsSync(logFile) ? JSON.parse(fs.readFileSync(logFile, "utf8")) : {};
const bible = spec.bible ? fs.readFileSync(path.join(ROOT, spec.bible), "utf8").trim() : "";
const CONCURRENCY = spec.concurrency || 4;
// La CLI npm est un script Node : on l'appelle directement (évite les problèmes de guillemets du shell Windows).
const CLI = process.env.HIGGSFIELD_CLI || path.join(process.env.APPDATA || "", "npm", "node_modules", "@higgsfield", "cli", "bin", "higgsfield.js");

function run(args) {
  return new Promise((resolve) => {
    const p = spawn(process.execPath, [CLI, ...args], { shell: false, windowsHide: true, cwd: ROOT });
    let out = "", err = "";
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (err += d));
    p.on("close", (code) => resolve({ code, out, err }));
    p.on("error", (e) => resolve({ code: 1, out, err: String(e) }));
  });
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const saveLog = () => fs.writeFileSync(logFile, JSON.stringify(log, null, 2));
// Une référence « x.png » peut avoir été allégée en « x.jpg » ou « x.webp » (npm run compact) : on retrouve le fichier sous son autre extension.
function resolveRef(ref) {
  const p = path.resolve(ROOT, ref);
  if (fs.existsSync(p)) return p;
  const base = p.replace(/.w+$/, "");
  return [".png", ".jpg", ".webp"].map((e) => base + e).find((f) => fs.existsSync(f)) || null;
}
const existing = (name) => ["png", "jpg", "webp"].map((e) => path.join(outDir, `${name}.${e}`)).find((f) => fs.existsSync(f));

async function one(item) {
  if (existing(item.name)) return console.log("déjà là :", item.name);
  let jobId = log[item.name]?.job;
  if (!jobId) {
    const prompt = (item.bible === false || !bible ? "" : bible + "\n\n") + item.prompt;
    const model = item.model || spec.model;
    const args = ["generate", "create", model, "--prompt", prompt, "--aspect_ratio", item.aspect || "16:9", "--json"];
    for (const [k, v] of Object.entries({ ...(spec.args || {}), ...(item.args || {}) })) args.push(k, String(v));
    for (const ref of item.refs || []) {
      const p = resolveRef(ref);
      if (!p) return console.error("référence introuvable :", item.name, ref);
      args.push("--image-references", p);
    }
    for (let attempt = 0; attempt < 6 && !jobId; attempt++) {
      const r = await run(args);
      const m = r.out.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
      if (m) jobId = m[0];
      else { console.warn(`soumission refusée (${item.name}) : ${(r.err || r.out).trim().slice(0, 200)}`); await sleep(8000 * (attempt + 1)); }
    }
    if (!jobId) return console.error("ÉCHEC soumission :", item.name);
    log[item.name] = { job: jobId, model };
    saveLog();
  }
  const w = await run(["generate", "wait", jobId, "--timeout", "30m", "--interval", "5s", "--quiet", "--json"]);
  const url = (w.out.match(/"result_url":\s*"([^"]+)"/) || [])[1];
  if (!url) {
    // job en échec : on l'oublie pour qu'une relance du lot le soumette à nouveau
    delete log[item.name];
    saveLog();
    return console.error("ÉCHEC rendu :", item.name, (w.err || w.out).trim().slice(0, 240));
  }
  const ext = (new URL(url).pathname.match(/\.(png|jpe?g|webp)$/i) || [, "png"])[1].toLowerCase().replace("jpeg", "jpg");
  const res = await fetch(url);
  fs.writeFileSync(path.join(outDir, `${item.name}.${ext}`), Buffer.from(await res.arrayBuffer()));
  log[item.name] = { job: jobId, model: log[item.name]?.model, done: true }; // pas d'URL : elle contient l'identifiant du compte Higgsfield
  saveLog();
  console.log("ok :", item.name, jobId);
}

const items = spec.items.filter((i) => !only.length || only.includes(i.name));
const queue = [...items];
await Promise.all(Array.from({ length: CONCURRENCY }, async () => { while (queue.length) await one(queue.shift()); }));
console.log("terminé :", items.length, "éléments ->", spec.outDir);
