// Logo concept board: "the words are a comedian on a huge stage."
// Run: node concepts.mjs  → ../previews/logo-concepts.png
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const font = (pkg, file) => pathToFileURL(join(here, "node_modules/@fontsource", pkg, "files", file)).href;
const FONTS = `
@font-face{font-family:"Anton";src:url(${font("anton", "anton-latin-400-normal.woff2")})}
@font-face{font-family:"Archivo Black";src:url(${font("archivo-black", "archivo-black-latin-400-normal.woff2")})}
@font-face{font-family:"Titan One";src:url(${font("titan-one", "titan-one-latin-400-normal.woff2")})}
@font-face{font-family:"Playfair Display";font-style:italic;font-weight:900;src:url(${font("playfair-display", "playfair-display-latin-900-italic.woff2")})}
@font-face{font-family:"Space Mono";font-weight:700;src:url(${font("space-mono", "space-mono-latin-700-normal.woff2")})}`;

const STAGE = "#0D0B10", GOLD = "#FFC94A", WARM = "#FFF4DC", RED = "#C8102E", PINK = "#FF4F8B";

// Classic stand-up microphone on a stand. Origin = floor point under the stand; height ≈ 1000.
export function mic(color, grille) {
  return `
  <g>
    <g transform="rotate(-14 0 -760)">
      <rect x="-40" y="-860" width="80" height="140" rx="30" fill="${color}"/>
      <rect x="-115" y="-1190" width="230" height="350" rx="115" fill="${color}"/>
      <path d="M -80 -1110 H 80 M -92 -1050 H 92 M -92 -990 H 92 M -80 -930 H 80" stroke="${grille}" stroke-width="22" stroke-linecap="round"/>
    </g>
    <rect x="-42" y="-760" width="84" height="720" rx="20" fill="${color}"/>
    <path d="M -230 0 L 0 -70 L 230 0" fill="none" stroke="${color}" stroke-width="60" stroke-linecap="round" stroke-linejoin="round"/>
  </g>`;
}

// Lays out [data-row] children left→right (with optional data-gap), then centers the row at data-cx.
const ROW = `
document.querySelectorAll("[data-row]").forEach(row => {
  const cx = +row.dataset.cx, gap = +(row.dataset.gap || 0); let x = 0;
  [...row.children].forEach(el => {
    const b = el.getBBox(); const pre = +(el.dataset.pad || 0);
    el.setAttribute("transform", "translate(" + (x + pre - b.x) + " 0)"); x += pre + b.width + gap + +(el.dataset.after || 0);
  });
  row.setAttribute("transform", "translate(" + (cx - (x - gap) / 2) + " 0)");
});`;

const CONCEPTS = [
  {
    name: "1 · The Headliner",
    note: "The name steps up to the mic: the “i” is a microphone, under one big spotlight.",
    bg: STAGE,
    svg: `
      <defs>
        <radialGradient id="spot" cx=".5" cy="0" r="1"><stop offset="0" stop-color="${WARM}" stop-opacity=".55"/><stop offset=".6" stop-color="${WARM}" stop-opacity=".12"/><stop offset="1" stop-color="${WARM}" stop-opacity="0"/></radialGradient>
        <radialGradient id="pool" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${WARM}" stop-opacity=".45"/><stop offset="1" stop-color="${WARM}" stop-opacity="0"/></radialGradient>
      </defs>
      <path d="M 1150 -20 L 1450 -20 L 2150 930 L 450 930 Z" fill="url(#spot)"/>
      <ellipse cx="1300" cy="930" rx="900" ry="90" fill="url(#pool)"/>
      <g data-row data-cx="1300">
        <text y="870" font-family="Titan One" font-size="430" fill="${WARM}">G</text>
        <g data-pad="20" data-after="10"><g transform="translate(0 885) scale(.6)">${mic(GOLD, STAGE)}</g></g>
        <text y="870" font-family="Titan One" font-size="430" fill="${WARM}">ggle<tspan fill="${PINK}">Me</tspan></text>
      </g>
      <text x="1300" y="1060" text-anchor="middle" font-family="Space Mono" font-weight="700" font-size="50" letter-spacing="8" fill="#BDB2A0">WE HOPE TO ALWAYS GIGGLEYOU VICIOUSLY.</text>`,
  },
  {
    name: "2 · The Marquee",
    note: "Your name in lights over the theater door. Big, bold and impossible to miss.",
    bg: STAGE,
    svg: (() => {
      const bulbs = [];
      const x0 = 330, y0 = 150, w = 1940, h = 760, step = 80;
      for (let x = x0; x <= x0 + w; x += step) bulbs.push([x, y0], [x, y0 + h]);
      for (let y = y0 + step; y < y0 + h; y += step) bulbs.push([x0, y], [x0 + w, y]);
      return `
      <defs><filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter></defs>
      <rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="40" fill="${RED}"/>
      <rect x="${x0 + 70}" y="${y0 + 70}" width="${w - 140}" height="${h - 140}" rx="18" fill="#1A0E10"/>
      ${bulbs.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="26" fill="${GOLD}" filter="url(#glow)"/><circle cx="${x}" cy="${y}" r="17" fill="#FFF6D6"/>`).join("")}
      <text x="1300" y="330" text-anchor="middle" font-family="Space Mono" font-weight="700" font-size="56" letter-spacing="14" fill="${GOLD}">LIVE · TONIGHT · LIVE</text>
      <text x="1300" y="680" text-anchor="middle" font-family="Anton" font-size="330" letter-spacing="10" fill="${WARM}">GIGGLE<tspan fill="${GOLD}">ME</tspan></text>
      <text x="1300" y="800" text-anchor="middle" font-family="Space Mono" font-weight="700" font-size="46" letter-spacing="6" fill="#E9D9B8">WE HOPE TO ALWAYS GIGGLEYOU VICIOUSLY</text>
      <path d="M 1150 910 L 1150 1080 M 1450 910 L 1450 1080" stroke="#3A3036" stroke-width="30"/>`;
    })(),
  },
  {
    name: "3 · Curtain Call",
    note: "Red velvet curtains part, the spotlight hits, and the name takes a bow.",
    bg: STAGE,
    svg: (() => {
      const folds = (x, dir) => [0, 1, 2, 3].map((i) => {
        const fx = x + dir * i * 70;
        return `<path d="M ${fx} 0 Q ${fx + dir * 60} 500 ${fx + dir * 10} 1000" fill="none" stroke="#7A0718" stroke-width="18" opacity=".7"/>`;
      }).join("");
      return `
      <defs>
        <radialGradient id="cspot" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${WARM}" stop-opacity=".5"/><stop offset=".7" stop-color="${WARM}" stop-opacity=".08"/><stop offset="1" stop-color="${WARM}" stop-opacity="0"/></radialGradient>
        <linearGradient id="vel" x1="0" x2="1"><stop offset="0" stop-color="#8E0A1E"/><stop offset=".5" stop-color="${RED}"/><stop offset="1" stop-color="#8E0A1E"/></linearGradient>
      </defs>
      <ellipse cx="1300" cy="600" rx="900" ry="470" fill="url(#cspot)"/>
      <path d="M 0 0 L 520 0 Q 380 520 560 1000 L 0 1000 Z" fill="url(#vel)"/>${folds(110, 1)}
      <path d="M 2600 0 L 2080 0 Q 2220 520 2040 1000 L 2600 1000 Z" fill="url(#vel)"/>${folds(2490, -1)}
      <path d="M 0 0 H 2600 V 110 Q 2275 190 1950 110 Q 1625 190 1300 110 Q 975 190 650 110 Q 325 190 0 110 Z" fill="${RED}"/>
      <path d="M 0 110 Q 325 190 650 110 Q 975 190 1300 110 Q 1625 190 1950 110 Q 2275 190 2600 110" fill="none" stroke="${GOLD}" stroke-width="14"/>
      <rect x="0" y="1000" width="2600" height="120" fill="#2A1A12"/>
      <text x="1300" y="690" text-anchor="middle" font-family="Playfair Display" font-style="italic" font-weight="900" font-size="320" fill="${WARM}">Giggle<tspan fill="${GOLD}">Me</tspan></text>
      <text x="1300" y="850" text-anchor="middle" font-family="Space Mono" font-weight="700" font-size="48" letter-spacing="6" fill="#E9D9B8">WE HOPE TO ALWAYS GIGGLEYOU VICIOUSLY.</text>`;
    })(),
  },
];

const W = 2600, H = 1120;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}
html,body{margin:0;background:#E9E6DF} .c{margin:0 0 24px} .lab{font:700 34px "Space Mono";color:#222;padding:10px 6px}
.n{font-weight:400;color:#555;font-size:26px}</style></head><body style="padding:24px">
${CONCEPTS.map((c) => `<div class="c"><div class="lab">${c.name} <span class="n">${c.note}</span></div>
<svg xmlns="http://www.w3.org/2000/svg" width="${W / 2}" height="${H / 2}" viewBox="0 0 ${W} ${H}" style="display:block;border-radius:18px;background:${c.bg}">${c.svg}</svg></div>`).join("")}
<script>document.fonts.ready.then(()=>{${ROW};document.body.dataset.ready=1})</script></body></html>`;

const tmp = join(here, "concepts.tmp.html");
writeFileSync(tmp, html);
const browser = await chromium.launch();
const p = await browser.newPage({ viewport: { width: W / 2 + 48, height: 800 }, deviceScaleFactor: 2 });
await p.goto(pathToFileURL(tmp).href);
await p.waitForSelector("body[data-ready]");
const outFile = resolve(here, "../previews/logo-concepts.png");
await p.screenshot({ path: outFile, fullPage: true });
await browser.close();
execFileSync("rm", [tmp]);
console.log("Wrote", outFile);
