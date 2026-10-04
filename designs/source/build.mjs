// Renders every logo and shirt design to print-ready PNGs plus preview mockups.
// Run: npm install && npm run build   (needs Playwright's Chromium)
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { SHIRTS, SIZE, BRAND, palette } from "./designs.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "..");
const font = (pkg, file) => pathToFileURL(join(here, "node_modules/@fontsource", pkg, "files", file)).href;

const FONTS = `
@font-face{font-family:"Anton";src:url(${font("anton", "anton-latin-400-normal.woff2")})}
@font-face{font-family:"Archivo Black";src:url(${font("archivo-black", "archivo-black-latin-400-normal.woff2")})}
@font-face{font-family:"DM Serif Display";src:url(${font("dm-serif-display", "dm-serif-display-latin-400-normal.woff2")})}
@font-face{font-family:"DM Serif Display";font-style:italic;src:url(${font("dm-serif-display", "dm-serif-display-latin-400-italic.woff2")})}
@font-face{font-family:"Shrikhand";src:url(${font("shrikhand", "shrikhand-latin-400-normal.woff2")})}
@font-face{font-family:"Space Mono";font-weight:400;src:url(${font("space-mono", "space-mono-latin-400-normal.woff2")})}
@font-face{font-family:"Space Mono";font-weight:700;src:url(${font("space-mono", "space-mono-latin-700-normal.woff2")})}
@font-face{font-family:"Rye";src:url(${font("rye", "rye-latin-400-normal.woff2")})}`;

// Auto-size every text[data-w] to exactly that width.
const FIT = `
document.querySelectorAll("text[data-w]").forEach(t => {
  const target = +t.dataset.w, fs = parseFloat(t.getAttribute("font-size"));
  const w = t.getBBox().width; if (w > 0) t.setAttribute("font-size", (fs * target / w).toFixed(1));
});`;

const page = (svg, w, h, outW, outH, bg = "transparent") => `<!doctype html><html><head><meta charset="utf-8">
<style>${FONTS} html,body{margin:0;background:${bg}} svg{display:block}</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" width="${outW}" height="${outH}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMin meet">${svg}</svg>
<script>document.fonts.ready.then(()=>{${FIT};document.body.dataset.ready=1})</script></body></html>`;

// T-shirt silhouette for preview mockups (1200 × 1400 canvas).
const TEE = "M 330 90 Q 600 190 870 90 L 1150 230 L 1080 520 L 960 480 L 960 1340 Q 600 1380 240 1340 L 240 480 L 120 520 L 50 230 Z";
const mockup = (printPath, shirt, stroke) => `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#ECEAE4}</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1400" viewBox="0 0 1200 1400">
<path d="${TEE}" fill="${shirt}" stroke="${stroke}" stroke-width="4"/>
<path d="M 470 120 Q 600 200 730 120" fill="none" stroke="${stroke}" stroke-width="6"/>
<image href="${pathToFileURL(printPath).href}" x="390" y="270" width="420" height="560" preserveAspectRatio="xMidYMin meet"/>
</svg><script>document.body.dataset.ready=1</script></body></html>`;

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const ctx = await browser.newContext({ deviceScaleFactor: 1 });

async function render(html, file, w, h, transparent = true) {
  mkdirSync(dirname(file), { recursive: true });
  const tmp = file.replace(/\.png$/, ".tmp.html");
  writeFileSync(tmp, html);
  const p = await ctx.newPage();
  await p.setViewportSize({ width: w, height: h });
  await p.goto(pathToFileURL(tmp).href);
  await p.waitForSelector("body[data-ready]");
  await p.screenshot({ path: file, omitBackground: transparent, clip: { x: 0, y: 0, width: w, height: h } });
  await p.close();
  execFileSync("rm", [tmp]);
  // Tag the file as 300 DPI so Printful reads the right physical size.
  execFileSync("convert", [file, "-units", "PixelsPerInch", "-density", "300", file]);
}

// Printful's standard tee front area: 12 × 16 in → 3600 × 4800 px at 300 DPI.
const PW = 3600, PH = 4800;
for (const s of SHIRTS) {
  for (const v of ["dark", "light"]) {
    const p = palette(v);
    const dir = join(out, "shirts", s.slug);
    const print = join(dir, `print-${v}-shirts.png`);
    await render(page(s.svg(p), SIZE.W, SIZE.H, PW, PH), print, PW, PH);
    writeFileSync(join(dir, `design-${v}-shirts.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE.W} ${SIZE.H}">${s.svg(p)}</svg>\n`);
    await render(mockup(print, v === "dark" ? "#1C1C1E" : "#F6F5F1", v === "dark" ? "#000" : "#CFCBC2"), join(dir, `mockup-${v}.png`), 1200, 1400, false);
  }
}
await browser.close();
console.log("Built", SHIRTS.length, "shirts. Brand colors:", BRAND);
