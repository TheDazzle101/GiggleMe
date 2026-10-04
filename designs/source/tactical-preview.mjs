// Renders the weapon-letter wordmark for review → ../previews/logo-tactical.png
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { tacticalWord, TACTICAL_DEFS } from "./tactical.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const font = (pkg, file) => pathToFileURL(join(here, "node_modules/@fontsource", pkg, "files", file)).href;

const BASE = { metal: "#3E454F", metalHi: "#6B7482", dark: "#15181D", furn: "#A88F63", furnHi: "#C4AB7D", olive: "#4B5535", oliveHi: "#68744B", stencil: "#E8E2C8", brassDark: "#6A4B17", accent: "#E0201B", tracer: false };
const COLORS = { base: BASE, accent: { ...BASE, furn: "#2C3139", furnHi: "#4A515C", olive: "#2C3139", oliveHi: "#4A515C", stencil: "#E0201B", tracer: true } };
const word = tacticalWord("GIGGLEME", COLORS);
const PAD = 260, W = word.width + PAD * 2, H = 1500;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W / 2}" height="${H / 2}" viewBox="0 0 ${W} ${H}">
  <defs>${TACTICAL_DEFS}
    <pattern id="carbon" width="28" height="28" patternUnits="userSpaceOnUse"><rect width="28" height="28" fill="#0A0C10"/><rect width="14" height="14" fill="#10141A"/><rect x="14" y="14" width="14" height="14" fill="#10141A"/></pattern>
    <radialGradient id="vig" cx=".5" cy=".45" r=".7"><stop offset="0" stop-color="#1B2433" stop-opacity=".6"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></radialGradient>
    <filter id="sh" x="-5%" y="-5%" width="110%" height="115%"><feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#000" flood-opacity=".75"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#carbon)"/><rect width="${W}" height="${H}" fill="url(#vig)"/>
  <g transform="translate(${PAD} 260)" filter="url(#sh)">${word.svg}</g>
  <path d="M ${PAD + 200} 1215 H ${W - PAD - 200}" stroke="#3C4450" stroke-width="5"/>
  <text x="${W / 2}" y="1330" text-anchor="middle" font-family="Orbitron" font-weight="700" font-size="74" letter-spacing="18" fill="#9AA4B2">WE HOPE TO ALWAYS GIGGLEYOU VICIOUSLY</text>
</svg>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:"Saira Stencil One";src:url(${font("saira-stencil-one", "saira-stencil-one-latin-400-normal.woff2")})}
@font-face{font-family:"Orbitron";font-weight:700;src:url(${font("orbitron", "orbitron-latin-700-normal.woff2")})}
html,body{margin:0;background:#000} svg{display:block}</style></head><body>${svg}
<script>document.fonts.ready.then(()=>document.body.dataset.ready=1)</script></body></html>`;

const tmp = join(here, "tactical.tmp.html");
writeFileSync(tmp, html);
const browser = await chromium.launch();
const p = await browser.newPage({ viewport: { width: Math.ceil(W / 2), height: H / 2 }, deviceScaleFactor: 2 });
await p.goto(pathToFileURL(tmp).href);
await p.waitForSelector("body[data-ready]");
const out = resolve(here, "../previews/logo-tactical.png");
await p.screenshot({ path: out });
await browser.close();
execFileSync("rm", [tmp]);
console.log("Wrote", out, W, H);
