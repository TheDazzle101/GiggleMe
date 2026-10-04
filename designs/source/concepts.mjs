// Logo concept board: tactical / special-ops / ninja direction.
// Run: node concepts.mjs  → ../previews/logo-concepts.png
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const font = (pkg, file) => pathToFileURL(join(here, "node_modules/@fontsource", pkg, "files", file)).href;
const FONTS = `
@font-face{font-family:"Black Ops One";src:url(${font("black-ops-one", "black-ops-one-latin-400-normal.woff2")})}
@font-face{font-family:"Saira Stencil One";src:url(${font("saira-stencil-one", "saira-stencil-one-latin-400-normal.woff2")})}
@font-face{font-family:"Orbitron";font-weight:900;src:url(${font("orbitron", "orbitron-latin-900-normal.woff2")})}
@font-face{font-family:"Orbitron";font-weight:700;src:url(${font("orbitron", "orbitron-latin-700-normal.woff2")})}
@font-face{font-family:"Russo One";src:url(${font("russo-one", "russo-one-latin-400-normal.woff2")})}
@font-face{font-family:"Space Mono";font-weight:700;src:url(${font("space-mono", "space-mono-latin-700-normal.woff2")})}`;

const STEEL = ["#E8EDF3", "#8D97A5", "#3C4450"], NVG = "#7CFF6B", RED = "#E10600", NAVY = "#0B1626";

const steelDefs = (id) => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="${STEEL[2]}"/><stop offset=".45" stop-color="${STEEL[0]}"/><stop offset=".55" stop-color="${STEEL[1]}"/><stop offset="1" stop-color="${STEEL[2]}"/></linearGradient>`;

// Katana, tip up, 1000 units long.
export function katana(steel, wrap = "#111", fitting = "#B8892B") {
  const wraps = [0, 1, 2, 3, 4, 5, 6].map((i) => `<path d="M -22 ${712 + i * 36} L 22 ${730 + i * 36} M 22 ${712 + i * 36} L -22 ${730 + i * 36}" stroke="#3A3F48" stroke-width="7"/>`).join("");
  return `<path d="M -20 650 L -20 90 Q -20 25 14 0 L 24 70 Q 26 360 20 650 Z" fill="url(#${steel})"/>
    <path d="M 10 40 Q 16 360 12 640" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="5"/>
    <rect x="-26" y="650" width="52" height="30" rx="4" fill="${fitting}"/>
    <ellipse cx="0" cy="690" rx="70" ry="15" fill="#1C1F24" stroke="${fitting}" stroke-width="5"/>
    <rect x="-24" y="702" width="48" height="268" rx="10" fill="${wrap}"/>${wraps}
    <rect x="-27" y="966" width="54" height="30" rx="8" fill="${fitting}"/>`;
}

// Kunai, tip up, 1000 units long.
export function kunai(fill, ridge, grip) {
  const wraps = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M -16 ${430 + i * 48} L 16 ${452 + i * 48}" stroke="${ridge}" stroke-width="8"/>`).join("");
  return `<path d="M 0 0 C 70 130, 80 270, 28 400 L -28 400 C -80 270, -70 130, 0 0 Z" fill="${fill}"/>
    <path d="M 0 30 L 0 390" stroke="${ridge}" stroke-width="8"/>
    <rect x="-17" y="400" width="34" height="420" rx="6" fill="${grip}"/>${wraps}
    <circle cx="0" cy="900" r="70" fill="none" stroke="${fill}" stroke-width="26"/>`;
}

export function shuriken(r, fill, hole) {
  const pts = [];
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 - Math.PI / 2, rr = i % 2 ? r * 0.3 : r;
    pts.push(`${(rr * Math.cos(a)).toFixed(1)},${(rr * Math.sin(a)).toFixed(1)}`);
  }
  return `<polygon points="${pts.join(" ")}" fill="${fill}"/><circle r="${r * 0.14}" fill="${hole}"/>`;
}

export function reticle(r, color, w) {
  return `<circle r="${r}" fill="none" stroke="${color}" stroke-width="${w}"/>
    <path d="M ${-r * 1.25} 0 H ${-r * 0.45} M ${r * 0.45} 0 H ${r * 1.25} M 0 ${-r * 1.25} V ${-r * 0.45} M 0 ${r * 0.45} V ${r * 1.25}" stroke="${color}" stroke-width="${w}"/>
    <circle r="${w * 1.2}" fill="${color}"/>`;
}

// Lays out [data-row] children left→right, then centers the row at data-cx.
const ROW = `
document.querySelectorAll("[data-row]").forEach(row => {
  const cx = +row.dataset.cx; let x = 0;
  [...row.children].forEach(el => {
    const b = el.getBBox(), pre = +(el.dataset.pad || 0);
    el.setAttribute("transform", "translate(" + (x + pre - b.x) + " 0)"); x += pre + b.width + +(el.dataset.after || 0);
  });
  row.setAttribute("transform", "translate(" + (cx - x / 2) + " 0)");
});`;

const CONCEPTS = [
  {
    name: "1 · Blade Ops",
    note: "Gunmetal stencil letters. The “I” is a katana, with a crosshair locked on the G.",
    bg: "#090B0E",
    svg: `
      <defs>${steelDefs("st1")}
        <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2F5F8"/><stop offset=".5" stop-color="#9BA5B3"/><stop offset=".52" stop-color="#5B6472"/><stop offset="1" stop-color="#C9D0DA"/></linearGradient>
        <pattern id="carbon" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="#0C0F13"/><rect width="12" height="12" fill="#12161C"/><rect x="12" y="12" width="12" height="12" fill="#12161C"/></pattern>
      </defs>
      <rect width="2600" height="1120" fill="url(#carbon)"/>
      <g data-row data-cx="1300">
        <g><text y="760" font-family="Black Ops One" font-size="400" fill="url(#metal)" stroke="#000" stroke-width="6">G</text></g>
        <g data-pad="30" data-after="30"><g transform="translate(0 330) scale(.47)">${katana("st1")}</g></g>
        <text y="760" font-family="Black Ops One" font-size="400" fill="url(#metal)" stroke="#000" stroke-width="6">GGLE<tspan fill="${RED}">ME</tspan></text>
      </g>
      <g transform="translate(355 620)" opacity=".95">${reticle(165, RED, 11)}</g>
      <path d="M 520 880 H 2080" stroke="#3C4450" stroke-width="4"/>
      <text x="1300" y="960" text-anchor="middle" font-family="Orbitron" font-weight="700" font-size="50" letter-spacing="12" fill="#8D97A5">WE HOPE TO ALWAYS GIGGLEYOU VICIOUSLY</text>`,
  },
  {
    name: "2 · Night Ops",
    note: "Night-vision HUD. The “I” is a kunai. Threat level: hilarious.",
    bg: "#030A04",
    svg: (() => {
      const scan = Array.from({ length: 140 }, (_, i) => `<rect y="${i * 8}" width="2600" height="2" fill="#000" opacity=".35"/>`).join("");
      const bracket = (x, y, sx, sy) => `<path d="M ${x} ${y + sy * 120} V ${y} H ${x + sx * 120}" fill="none" stroke="${NVG}" stroke-width="10"/>`;
      return `
      <defs><radialGradient id="nv" cx=".5" cy=".5" r=".7"><stop offset="0" stop-color="#0F3A12"/><stop offset="1" stop-color="#020602"/></radialGradient>
        <filter id="g2" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="10" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <rect width="2600" height="1120" fill="url(#nv)"/>
      ${bracket(140, 110, 1, 1)}${bracket(2460, 110, -1, 1)}${bracket(140, 1010, 1, -1)}${bracket(2460, 1010, -1, -1)}
      <text x="200" y="210" font-family="Space Mono" font-weight="700" font-size="44" fill="${NVG}" opacity=".85">● REC   OP: GIGGLEYOU VICIOUSLY</text>
      <text x="2400" y="210" text-anchor="end" font-family="Space Mono" font-weight="700" font-size="44" fill="${NVG}" opacity=".85">THREAT LEVEL: HILARIOUS</text>
      <g filter="url(#g2)" data-row data-cx="1300">
        <text y="700" font-family="Orbitron" font-weight="900" font-size="320" fill="${NVG}">G</text>
        <g data-pad="30" data-after="20"><g transform="translate(0 405) scale(.62 .37)">${kunai(NVG, "#06200A", "#0B3A10")}</g></g>
        <text y="700" font-family="Orbitron" font-weight="900" font-size="320" fill="${NVG}">GGLEME</text>
      </g>
      <text x="1300" y="900" text-anchor="middle" font-family="Space Mono" font-weight="700" font-size="44" letter-spacing="6" fill="${NVG}" opacity=".85">34.0522° N  118.2437° W  ·  TARGET: YOUR FUNNY BONE</text>
      ${scan}`;
    })(),
  },
  {
    name: "3 · Shadow Clan",
    note: "Navy-black ninja style. One katana strike slices the name in two.",
    bg: NAVY,
    svg: `
      <defs>${steelDefs("st3")}
        <clipPath id="top"><path d="M 0 0 H 2600 V 400 L 0 720 Z"/></clipPath>
        <clipPath id="bot"><path d="M 0 720 L 2600 400 V 1120 H 0 Z"/></clipPath>
        <radialGradient id="nav" cx=".5" cy=".45" r=".7"><stop offset="0" stop-color="#16294A"/><stop offset="1" stop-color="#050A12"/></radialGradient>
        <filter id="g3" x="-10%" y="-200%" width="120%" height="500%"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect width="2600" height="1120" fill="url(#nav)"/>
      <g transform="translate(330 560) rotate(18)">${shuriken(170, "url(#st3)", NAVY)}</g>
      <g clip-path="url(#bot)"><text x="1420" y="740" text-anchor="middle" font-family="Russo One" font-size="360" letter-spacing="8" fill="#F2F4F7">GIGGLE<tspan fill="${RED}">ME</tspan></text></g>
      <g clip-path="url(#top)" transform="translate(26 -18)"><text x="1420" y="740" text-anchor="middle" font-family="Russo One" font-size="360" letter-spacing="8" fill="#F2F4F7">GIGGLE<tspan fill="${RED}">ME</tspan></text></g>
      <path d="M 560 652 L 2420 418" stroke="#fff" stroke-width="6" filter="url(#g3)"/>
      <g transform="translate(2480 405) rotate(97)"><g transform="scale(.5)">${katana("st3")}</g></g>
      <text x="1420" y="930" text-anchor="middle" font-family="Orbitron" font-weight="700" font-size="50" letter-spacing="12" fill="#8FA3C0">WE HOPE TO ALWAYS GIGGLEYOU VICIOUSLY</text>`,
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
