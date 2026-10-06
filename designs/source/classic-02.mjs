// Classic 02: the proven flex tank look (distressed white bold condensed caps, centered, four lines,
// royal blue tank) with original GiggleMe gym phrases and the GiggleMe wordmark underneath.
// Run: npm install && node classic-02.mjs   → ../classic-02/<design>/ and ../previews/classic-02-concepts.jpg
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { wordmarkAt } from "./brandmark.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "..", "classic-02");
const font = (pkg, file) => pathToFileURL(join(here, "node_modules/@fontsource", pkg, "files", file)).href;

const FONTS = `
@font-face{font-family:"Barlow Condensed";font-weight:700;src:url(${font("barlow-condensed", "barlow-condensed-latin-700-normal.woff2")})}
@font-face{font-family:"Barlow Condensed";font-weight:800;src:url(${font("barlow-condensed", "barlow-condensed-latin-800-normal.woff2")})}
@font-face{font-family:"Yellowtail";src:url(${font("yellowtail", "yellowtail-latin-400-normal.woff2")})}`;

export const DESIGNS = [
  { slug: "01-my-sleeves-took-a-rest-day", lines: ["MY SLEEVES", "TOOK A", "PERMANENT", "REST DAY"],
    why: "Explains the tank with a joke every lifter gets. Same 'where did the sleeves go' laugh, told our way." },
  { slug: "02-my-biceps-ate-the-sleeves", lines: ["MY BICEPS", "ATE THE", "SLEEVES", "AGAIN"],
    why: "Short words, reads from across the gym. The 'again' makes it a brag." },
  { slug: "03-sleeves-couldnt-handle-the-pump", lines: ["THE SLEEVES", "COULDN'T", "HANDLE", "THE PUMP"],
    why: "Uses real gym slang ('the pump'), so it lands with regulars." },
  { slug: "04-do-you-even-sleeve-bro", lines: ["DO YOU", "EVEN", "SLEEVE", "BRO?"],
    why: "Twists the 'do you even lift' meme everyone already knows." },
  { slug: "05-not-showing-off-arms-need-air", lines: ["I'M NOT", "SHOWING OFF", "MY ARMS", "NEED AIR"],
    why: "A fake excuse for showing off. Works for the gym, the beach and cookouts." },
];

// Print canvas: 12 × 16 in at 300 DPI, same as the other series.
const PW = 3600, PH = 4800, CX = PW / 2, TEXT_W = 2900, TOP = 260;
const INK = { dark: "#FFFFFF", light: "#151515" };

// Worn, cracked ink like the original: two noise layers punch holes through the letters.
// The wordmark stays clean so the brand reads.
const DISTRESS = `<defs><filter id="distress" filterUnits="userSpaceOnUse" x="0" y="0" width="${PW}" height="${PH}">
  <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="4" seed="11" result="big"/>
  <feColorMatrix in="big" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  13 0 0 0 -8.1" result="blotches"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.16" numOctaves="2" seed="3" result="fine"/>
  <feColorMatrix in="fine" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  16 0 0 0 -10.2" result="specks"/>
  <feMerge result="holes"><feMergeNode in="blotches"/><feMergeNode in="specks"/></feMerge>
  <feComposite in="SourceGraphic" in2="holes" operator="out"/>
</filter></defs>`;

const art = (d, v) => `${DISTRESS}
  <g filter="url(#distress)"><g id="block" font-family="Barlow Condensed" font-weight="700" font-size="200" text-anchor="middle" fill="${INK[v]}" letter-spacing="3">
    ${d.lines.map((l, i) => `<text x="0" y="${i * 226}">${l.replace(/'/g, "’")}</text>`).join("")}
  </g></g>
  <g id="tag">${wordmarkAt(0, 0, 820)}</g>`;
const LAYOUT = `
const b = document.getElementById("block"), bb = b.getBBox(), k = Math.min(${TEXT_W} / bb.width, 3000 / bb.height);
b.setAttribute("transform", "translate(${CX} " + (${TOP} - bb.y * k) + ") scale(" + k + ")");
const bottom = ${TOP} + bb.height * k;
document.getElementById("tag").setAttribute("transform", "translate(${CX} " + (bottom + 400) + ")");`;

const html = (body, w, h, bg, script = "") => `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS} html,body{margin:0;background:${bg}} svg{display:block}</style></head><body>
<svg id="art" xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>
<script>document.fonts.ready.then(()=>{${script};document.body.dataset.ready=1})</script></body></html>`;

// Tank top like the reference photo: narrow straps, scoop neck, deep armholes.
const TANK = "M 375 70 L 485 70 Q 600 380 715 70 L 825 70 Q 830 470 990 560 L 1010 1345 Q 600 1385 190 1345 L 210 560 Q 370 470 375 70 Z";
const SHIRTS = {
  royal: { fill: "#2448C8", stroke: "#16307F", ink: "dark" },
  black: { fill: "#1C1C1E", stroke: "#000", ink: "dark" },
  white: { fill: "#F6F5F1", stroke: "#CFCBC2", ink: "light" },
};
const HEATHER = `<defs><filter id="heather" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.9 0.25" numOctaves="2" seed="4"/>
  <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.6 -0.55"/>
  <feComposite in2="SourceGraphic" operator="in"/></filter></defs>`;
const tank = (print, s, x = 0, y = 0, k = 1) => `
<g transform="translate(${x} ${y}) scale(${k})">
  <path d="${TANK}" fill="${s.fill}" stroke="${s.stroke}" stroke-width="4"/>
  <path d="${TANK}" fill="#fff" filter="url(#heather)" opacity="${s.ink === "dark" ? 0.08 : 0.04}"/>
  <path d="M 492 88 Q 600 355 708 88" fill="none" stroke="${s.stroke}" stroke-width="5" opacity="0.6"/>
  <image href="${pathToFileURL(print).href}" x="370" y="420" width="460" height="613" preserveAspectRatio="xMidYMin meet"/>
</g>`;

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const ctx = await browser.newContext({ deviceScaleFactor: 1 });

async function render(page, file, w, h, { transparent = false, dpi = false, svgOut } = {}) {
  mkdirSync(dirname(file), { recursive: true });
  const tmp = file.replace(/\.(png|jpg)$/, ".tmp.html");
  writeFileSync(tmp, page);
  const p = await ctx.newPage();
  await p.setViewportSize({ width: w, height: h });
  await p.goto(pathToFileURL(tmp).href);
  await p.waitForSelector("body[data-ready]");
  await p.waitForTimeout(300);
  await p.screenshot({ path: file, omitBackground: transparent, clip: { x: 0, y: 0, width: w, height: h }, ...(file.endsWith(".jpg") ? { type: "jpeg", quality: 90 } : {}) });
  if (svgOut) writeFileSync(svgOut, (await p.$eval("#art", (e) => e.outerHTML)) + "\n");
  await p.close();
  execFileSync("rm", [tmp]);
  if (dpi) execFileSync("convert", [file, "-units", "PixelsPerInch", "-density", "300", file]);
}

for (const d of DESIGNS) {
  const dir = join(out, d.slug);
  for (const v of ["dark", "light"]) {
    await render(html(art(d, v), PW, PH, "transparent", LAYOUT), join(dir, `print-${v}-shirts.png`), PW, PH,
      { transparent: true, dpi: true, svgOut: join(dir, `design-${v}-shirts.svg`) });
  }
  for (const [name, s] of Object.entries(SHIRTS)) {
    await render(html(HEATHER + tank(join(dir, `print-${s.ink}-shirts.png`), s), 1200, 1400, "#ECEAE4"), join(dir, `mockup-${name}.png`), 1200, 1400);
  }
}

// Contact sheet: all five on the royal blue tank.
const cw = 900, ch = 1120;
const cells = DESIGNS.map((d, i) => `
  ${tank(join(out, d.slug, "print-dark-shirts.png"), SHIRTS.royal, i * cw + 30, 20, 0.7)}
  <text x="${i * cw + cw / 2}" y="1080" text-anchor="middle" font-family="Barlow Condensed" font-weight="800" font-size="40" fill="#222">${i + 1}. ${d.lines.join(" ").replace(/'/g, "’")}</text>`).join("");
await render(html(HEATHER + cells, cw * DESIGNS.length, ch, "#ECEAE4"), resolve(here, "..", "previews", "classic-02-concepts.jpg"), cw * DESIGNS.length, ch);

await browser.close();
console.log("Built", DESIGNS.length, "classic-02 designs →", out);
