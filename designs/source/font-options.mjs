// Logo font options board → ../previews/logo-font-options.png
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { ROYAL } from "./royal.mjs";
const here = dirname(fileURLToPath(import.meta.url));
const f = (pkg) => pathToFileURL(join(here, `node_modules/@fontsource/${pkg}/files/${pkg}-latin-400-normal.woff2`)).href;
const OPTS = [
  ["Yellowtail", "yellowtail", "1 · Retro script: classic 50s ballpark / hot-rod signature"],
  ["Pirata One", "pirata-one", "2 · Old English: classic tattoo and streetwear lettering"],
  ["Lobster", "lobster", "3 · Diner script: bold, rounded vintage sign lettering"],
  ["Graduate", "graduate", "4 · Varsity: old-school college athletic block letters"],
];
const S = 300, B = 600;
const word = (fam) => `<text x="1300" y="560" text-anchor="middle" font-family="${fam}"><tspan font-size="${B}">G</tspan><tspan font-size="${S}">iggle</tspan><tspan font-size="${B}">M</tspan><tspan font-size="${S}">e</tspan></text>`;
const card = (fam, i) => {
  const w = word(fam), L = (a, dx = 0, dy = 0) => `<g ${a} transform="translate(${dx} ${dy})">${w}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1300" height="400" viewBox="0 -20 2600 800" style="display:block;background:#1C1C1E;border-radius:16px">
    ${L(`fill="${ROYAL.black}"`, 18, 18)}${L(`fill="none" stroke="${ROYAL.gold}" stroke-width="${S * 0.2}" stroke-linejoin="round"`)}
    ${L(`fill="none" stroke="${ROYAL.black}" stroke-width="${S * 0.11}" stroke-linejoin="round"`)}${L(`fill="${ROYAL.grey}"`)}</svg>`;
};
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${OPTS.map(([fam, pkg]) => `@font-face{font-family:"${fam}";src:url(${f(pkg)})}`).join("")}
@font-face{font-family:"Space Mono";src:url(${pathToFileURL(join(here, "node_modules/@fontsource/space-mono/files/space-mono-latin-700-normal.woff2")).href})}
body{margin:0;background:#E9E6DF;padding:20px;font:700 22px "Space Mono"} .lab{margin:18px 4px 8px;color:#222}</style></head><body>
${OPTS.map(([fam, , label], i) => `<div class="lab">${label}</div>${card(fam, i)}`).join("")}
<script>document.fonts.ready.then(()=>Promise.all(${JSON.stringify(OPTS.map((o) => o[0]))}.map(x=>document.fonts.load('100px "'+x+'"')))).then(()=>document.body.dataset.ready=1)</script></body></html>`;
const tmp = join(here, "fonts.tmp.html"); writeFileSync(tmp, html);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1340, height: 800 } });
await p.goto(pathToFileURL(tmp).href); await p.waitForSelector("body[data-ready]");
await p.screenshot({ path: resolve(here, "../previews/logo-font-options.png"), fullPage: true }); await b.close(); execFileSync("rm", [tmp]);
