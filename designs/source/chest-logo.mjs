// Front left-chest logo: GiggleMe with the first G and the M at double height, inked in the same
// flat matte grey with a bold black + gold outline as the Series 01 backs.
// Run: node chest-logo.mjs  → ../series-01/logo-left-chest.png (1200 px wide = 4 in at 300 DPI)
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { ROYAL } from "./royal.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "../series-01/logo-left-chest.png");
const font = pathToFileURL(join(here, "node_modules/@fontsource/rye/files/rye-latin-400-normal.woff2")).href;
const SMALL = 320, BIG = SMALL * 2;
// All letters share one baseline; G and M are twice the size of the others.
const WORD = `<text x="1300" y="1000" text-anchor="middle" font-family="Rye"><tspan font-size="${BIG}">G</tspan><tspan font-size="${SMALL}">IGGLE</tspan><tspan font-size="${BIG}">M</tspan><tspan font-size="${SMALL}">E</tspan></text>`;
const sh = SMALL * 0.058, layer = (attrs, dx = 0, dy = 0) => `<g ${attrs} ${dx || dy ? `transform="translate(${dx} ${dy})"` : ""}>${WORD}</g>`;
// Flat matte-grey letters with a hard double outline: bold black inside, gold outside.
const svg = `<defs><clipPath id="chest">${WORD}</clipPath></defs>
  ${layer(`fill="${ROYAL.black}"`, sh, sh)}
  ${layer(`fill="none" stroke="${ROYAL.gold}" stroke-width="${SMALL * 0.24}" stroke-linejoin="round"`)}
  ${layer(`fill="none" stroke="${ROYAL.black}" stroke-width="${SMALL * 0.13}" stroke-linejoin="round"`)}
  <g clip-path="url(#chest)"><rect width="2600" height="1250" fill="${ROYAL.grey}"/></g>`;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>@font-face{font-family:"Rye";src:url(${font})}html,body{margin:0;background:transparent}svg{display:block}</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" width="2600" height="1250" viewBox="0 0 2600 1250">${svg}</svg>
<script>document.fonts.load('100px Rye').then(()=>document.body.dataset.ready=1)</script></body></html>`;
const tmp = out + ".tmp.html";
writeFileSync(tmp, html);
const browser = await chromium.launch();
const p = await browser.newPage({ viewport: { width: 2600, height: 1250 } });
await p.goto(pathToFileURL(tmp).href);
await p.waitForSelector("body[data-ready]");
await p.screenshot({ path: out, omitBackground: true });
await browser.close();
execFileSync("rm", [tmp]);
execFileSync("convert", [out, "-trim", "+repage", "-resize", "1200x", "-units", "PixelsPerInch", "-density", "300", out]);
console.log("wrote", out);
