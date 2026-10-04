// Official GiggleMe logo: retro script with a double-height G and M (dark matte grey, black + gold
// outline) and the matte-gold script tagline.
// Run: node logo-final.mjs
//   → ../previews/logo-final.png            (on black, for review)
//   → ../brand/giggleme-logo.png            (transparent, full lockup)
//   → ../brand/giggleme-wordmark.png        (transparent, letters only)
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { wordmark as mark, tagline as tag } from "./brandmark.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const font = (pkg, file) => pathToFileURL(join(here, "node_modules/@fontsource", pkg, "files", file)).href;

const W = 2600, H = 1250;
const wordmark = mark();
const tagline = tag();

const page = (svg, bg, w, h, vb) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:"Yellowtail";src:url(${font("yellowtail", "yellowtail-latin-400-normal.woff2")})}
@font-face{font-family:"Pinyon Script";src:url(${font("pinyon-script", "pinyon-script-latin-400-normal.woff2")})}
html,body{margin:0;background:${bg}} svg{display:block}</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${vb}">${svg}</svg>
<script>document.fonts.load('100px Yellowtail').then(()=>document.fonts.load('100px "Pinyon Script"')).then(()=>document.body.dataset.ready=1)</script></body></html>`;

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
await shot(page(`<rect width="${W}" height="${H}" fill="#141414"/>${wordmark}${tagline}`, "#141414", W / 2, 500, `0 250 ${W} 1000`),
  resolve(here, "../previews/logo-final.png"), W / 2, 500, false);
// Transparent brand files at full resolution (tight crop around the art).
for (const [svg, name] of [[`${wordmark}${tagline}`, "giggleme-logo"], [wordmark, "giggleme-wordmark"]]) {
  const file = resolve(here, `../brand/${name}.png`);
  await shot(page(svg, "transparent", W * 2, H * 2, `0 0 ${W} ${H}`), file, W * 2, H * 2, true);
  execFileSync("convert", [file, "-trim", "+repage", "-bordercolor", "none", "-border", "60", "-units", "PixelsPerInch", "-density", "300", file]);
}
await browser.close();
console.log("Logo files written");
