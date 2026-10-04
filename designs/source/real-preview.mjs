// Rifles/pistols/grenades/rockets GiggleMe wordmark bent into a smile → ../previews/logo-real*.png
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { TACTICAL_DEFS } from "./tactical.mjs";
import { realisticLetters, REAL_DEFS, R_GAP as LETTER_GAP, R_CAP as LETTER_CAP } from "./realistic.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const font = (pkg, file) => pathToFileURL(join(here, "node_modules/@fontsource", pkg, "files", file)).href;

// Shaded "realistic" finishes: light from above, rounded-body falloff, a specular band.
const grad = (id, stops) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</linearGradient>`;
const FINISHES = [
  grad("gMetal", [[0, "#9AA4B2"], [0.18, "#6C7583"], [0.5, "#3A414B"], [0.85, "#22272E"], [1, "#4A525D"]]),
  grad("gMetalHi", [[0, "#C9D1DB"], [1, "#8C96A4"]]),
  grad("gDark", [[0, "#4A515B"], [0.3, "#22262C"], [1, "#0B0D10"]]),
  grad("gFurn", [[0, "#DCC596"], [0.25, "#B79E70"], [0.6, "#93794F"], [1, "#6B5737"]]),
  grad("gFurnHi", [[0, "#EBDDB9"], [1, "#C9B184"]]),
  grad("gOlive", [[0, "#8A9663"], [0.25, "#5C6840"], [0.65, "#3C4528"], [1, "#2A3019"]]),
  grad("gOliveHi", [[0, "#A3AE7C"], [1, "#6E7A4C"]]),
  grad("gBlack", [[0, "#6A727E"], [0.22, "#3A4049"], [0.6, "#1D2127"], [1, "#0E1013"]]),
  grad("gBlackHi", [[0, "#8B94A1"], [1, "#4E5662"]]),
].join("");

const BASE = { body: "url(#gOlive)", nose: "url(#gOlive)", fin: "url(#gDark)", band1: "#E5B521", band2: "#7A5A2E", sphere: "O", metal: "url(#gMetal)", metalHi: "url(#gMetalHi)", dark: "url(#gDark)", furn: "url(#gFurn)", furnHi: "url(#gFurnHi)", olive: "url(#gOlive)", oliveHi: "url(#gOliveHi)", stencil: "#E8E2C8", brassDark: "#5E4214", accent: "#FF2A1F", tracer: false };
const COLORS = { base: BASE, accent: { ...BASE, furn: "url(#gBlack)", furnHi: "url(#gBlackHi)", olive: "url(#gBlack)", oliveHi: "url(#gBlackHi)", stencil: "#FF2A1F", tracer: true, body: "url(#gBlack)", nose: "url(#gBlack)", band1: "#FF2A1F", band2: "#3A4049", sphere: "K" } };

const letters = realisticLetters("GIGGLEME", COLORS);
const total = letters.reduce((s, l) => s + l.w, 0) + LETTER_GAP * (letters.length - 1);
const R = 6800;                     // smile radius: smaller = bigger grin
const W = total + 1300, H = 2700, CX = W / 2, BASEY = 1980;

let x = -total / 2;
const placed = letters.map((l) => {
  const dx = x + l.w / 2; x += l.w + LETTER_GAP;
  const py = BASEY - R + Math.sqrt(R * R - dx * dx);
  const deg = (Math.asin(-dx / R) * 180) / Math.PI;
  return `<g transform="translate(${(CX + dx).toFixed(1)} ${py.toFixed(1)}) rotate(${deg.toFixed(2)}) translate(${-l.w / 2} ${-LETTER_CAP})">${l.svg}</g>`;
});

// Red-dot holographic sights as the eyes.
const eye = (ex, ey) => `
  <g transform="translate(${ex} ${ey})">
    <circle r="250" fill="url(#gBlack)"/>
    <circle r="250" fill="none" stroke="url(#gMetalHi)" stroke-width="10"/>
    ${Array.from({ length: 36 }, (_, i) => { const a = (i * Math.PI) / 18; return `<path d="M ${(232 * Math.cos(a)).toFixed(1)} ${(232 * Math.sin(a)).toFixed(1)} L ${(248 * Math.cos(a)).toFixed(1)} ${(248 * Math.sin(a)).toFixed(1)}" stroke="#0B0D10" stroke-width="8"/>`; }).join("")}
    <circle r="190" fill="url(#gDark)"/>
    <circle r="165" fill="#06110C"/>
    <circle r="165" fill="url(#glass)"/>
    <g filter="url(#red)"><circle r="100" fill="none" stroke="#FF2A1F" stroke-width="11"/><circle r="15" fill="#FF2A1F"/>
      <path d="M -150 0 H -55 M 55 0 H 150 M 0 -150 V -55 M 0 55 V 150" stroke="#FF2A1F" stroke-width="8"/></g>
    <path d="M -110 -105 A 150 150 0 0 1 60 -150" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="14" stroke-linecap="round"/>
  </g>`;

const svgDoc = (withEyes) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W / 2}" height="${H / 2}" viewBox="0 0 ${W} ${H}">
  <defs>${TACTICAL_DEFS}${REAL_DEFS}${FINISHES}
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9FD9C0" stop-opacity=".25"/><stop offset=".5" stop-color="#9FD9C0" stop-opacity="0"/><stop offset="1" stop-color="#9FD9C0" stop-opacity=".12"/></linearGradient>
    <pattern id="carbon" width="28" height="28" patternUnits="userSpaceOnUse"><rect width="28" height="28" fill="#0A0C10"/><rect width="14" height="14" fill="#10141A"/><rect x="14" y="14" width="14" height="14" fill="#10141A"/></pattern>
    <radialGradient id="vig" cx=".5" cy=".5" r=".7"><stop offset="0" stop-color="#1E2836" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity=".7"/></radialGradient>
    <filter id="sh" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="22" stdDeviation="18" flood-color="#000" flood-opacity=".8"/></filter>
    <filter id="red" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#carbon)"/><rect width="${W}" height="${H}" fill="url(#vig)"/>
  ${withEyes ? eye(CX - 1300, 430) + eye(CX + 1300, 430) : ""}
  <g filter="url(#sh)">${placed.join("")}</g>
  <text x="${CX}" y="${BASEY + 330}" text-anchor="middle" font-family="Orbitron" font-weight="700" font-size="92" letter-spacing="22" fill="#9AA4B2">WE HOPE TO ALWAYS GIGGLEYOU VICIOUSLY</text>
</svg>`;

const browser = await chromium.launch();
for (const [name, eyes] of [["logo-real", false], ["logo-real-eyes", true]]) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face{font-family:"Saira Stencil One";src:url(${font("saira-stencil-one", "saira-stencil-one-latin-400-normal.woff2")})}
  @font-face{font-family:"Orbitron";font-weight:700;src:url(${font("orbitron", "orbitron-latin-700-normal.woff2")})}
  html,body{margin:0;background:#000} svg{display:block}</style></head><body>${svgDoc(eyes)}
  <script>document.fonts.ready.then(()=>document.body.dataset.ready=1)</script></body></html>`;
  const tmp = join(here, `${name}.tmp.html`);
  writeFileSync(tmp, html);
  const p = await browser.newPage({ viewport: { width: Math.ceil(W / 2), height: H / 2 }, deviceScaleFactor: 1 });
  await p.goto(pathToFileURL(tmp).href);
  await p.waitForSelector("body[data-ready]");
  await p.screenshot({ path: resolve(here, `../previews/${name}.png`) });
  await p.close();
  execFileSync("rm", [tmp]);
}
await browser.close();
console.log("Wrote smile previews", W, H);
