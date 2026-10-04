// Official GiggleMe logo: tattoo-inked letters in cotton-candy colors + matte-gold script tagline.
// Run: node logo-final.mjs
//   → ../previews/logo-final.png            (on black, for review)
//   → ../brand/giggleme-logo.png            (transparent, full lockup)
//   → ../brand/giggleme-wordmark.png        (transparent, letters only)
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { INK, rose, nauticalStar, flames, bolt } from "./tattoo.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const font = (pkg, file) => pathToFileURL(join(here, "node_modules/@fontsource", pkg, "files", file)).href;

// Cotton-candy ink set (the tattoo primitives read their colors from INK).
export const CANDY = {
  pink: "#FF9EC7", pinkDeep: "#F06AA8", blue: "#9FD3F7", blueDeep: "#64AEE3",
  lavender: "#C9B1F5", mint: "#9EE6CF", mintDeep: "#5FBFA0", lemon: "#FFF1A0",
  gold: "#B8955A", black: "#121212",
};
Object.assign(INK, {
  red: CANDY.pink, redDark: CANDY.pinkDeep, green: CANDY.mint, greenDark: CANDY.mintDeep,
  yellow: CANDY.lemon, teal: CANDY.blue, tealDark: CANDY.blueDeep,
});

const W = 2600, H = 1250;

// Tattoo art that shows through the letters.
const art = `
  <rect width="${W}" height="${H}" fill="${CANDY.blue}"/>
  ${Array.from({ length: 9 }, (_, i) => `<path d="M ${i * 320 - 60} 420 q 80 -60 160 0 t 160 0" fill="none" stroke="${CANDY.blueDeep}" stroke-width="16"/>`).join("")}
  <rect y="520" width="${W}" height="${H}" fill="${CANDY.lavender}" opacity=".55"/>
  ${flames(0, W, 1000, 360)}
  ${[260, 700, 1180, 1660, 2120].map((x, i) => rose(x, 600 + (i % 2) * 70, 120, [140, 30])).join("")}
  ${[480, 940, 1420, 1900, 2380].map((x, i) => nauticalStar(x, 400 + (i % 2) * 260, 70, CANDY.lavender, i * 9)).join("")}
  ${[120, 1050, 2000].map((x) => bolt(x, 700, 90, 15)).join("")}`;

const WORD = `<text x="1300" y="900" text-anchor="middle" font-family="Rye" font-size="380">GIGGLEME</text>`;

const wordmark = `
  <defs><clipPath id="word">${WORD}</clipPath></defs>
  <g transform="translate(22 22)" fill="${CANDY.lavender}">${WORD}</g>
  <g transform="translate(22 22)" fill="none" stroke="${CANDY.black}" stroke-width="10" stroke-linejoin="round">${WORD}</g>
  <g clip-path="url(#word)">${art}</g>
  <g fill="none" stroke="${CANDY.black}" stroke-width="10" stroke-linejoin="round">${WORD}</g>
  <g fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linejoin="round" transform="translate(-4 -4)" opacity=".6">${WORD}</g>`;

const tagline = `<text x="1300" y="1130" text-anchor="middle" font-family="Pinyon Script" font-size="132" fill="${CANDY.gold}">We hope to always Giggleyou Viciously</text>`;

const page = (svg, bg, w, h, vb) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:"Rye";src:url(${font("rye", "rye-latin-400-normal.woff2")})}
@font-face{font-family:"Pinyon Script";src:url(${font("pinyon-script", "pinyon-script-latin-400-normal.woff2")})}
html,body{margin:0;background:${bg}} svg{display:block}</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${vb}">${svg}</svg>
<script>document.fonts.ready.then(()=>document.body.dataset.ready=1)</script></body></html>`;

const browser = await chromium.launch();
async function shot(html, file, w, h, transparent) {
  mkdirSync(dirname(file), { recursive: true });
  const tmp = file + ".tmp.html";
  writeFileSync(tmp, html);
  const p = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await p.goto(pathToFileURL(tmp).href);
  await p.waitForSelector("body[data-ready]");
  await p.screenshot({ path: file, omitBackground: transparent });
  await p.close();
  execFileSync("rm", [tmp]);
}

// Review image on black.
await shot(page(`<rect width="${W}" height="${H}" fill="#141414"/>${wordmark}${tagline}`, "#141414", W / 2, 520, `0 380 ${W} 1040`),
  resolve(here, "../previews/logo-final.png"), W / 2, 520, false);
// Transparent brand files at full resolution (tight crop around the art).
const LOCK = "60 420 2500 780", WM = "60 420 2500 560";
await shot(page(`${wordmark}${tagline}`, "transparent", 5000, 1560, LOCK), resolve(here, "../brand/giggleme-logo.png"), 5000, 1560, true);
await shot(page(wordmark, "transparent", 5000, 1120, WM), resolve(here, "../brand/giggleme-wordmark.png"), 5000, 1120, true);
await browser.close();
console.log("Logo files written");
