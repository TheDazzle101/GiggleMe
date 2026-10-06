// Printful pack: one clearly named, upload-ready front PNG per design (trimmed to the art, 300 DPI,
// transparent) plus the GiggleMe inside-neck label. Printful adds the size, origin and fabric text
// to inside labels itself, so the label file is just the logo in its 3 × 1.13 in logo area.
// Run after the series script: node printful-pack.mjs classic-01 classic-02
//   → ../<series>/printful-upload/*.png and ../printful-upload/giggleme-inside-label-*.png
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { LOGO, LOGO_BOX, WORD, wordmark } from "./brandmark.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const designs = resolve(here, "..");
const yellowtail = pathToFileURL(join(here, "node_modules/@fontsource/yellowtail/files/yellowtail-latin-400-normal.woff2")).href;

// Inside label logo area: 3 × 1.13 in at 300 DPI.
const LW = 900, LH = 339;
const LABELS = {
  // White script with a gold edge for dark shirts; the full-color logo for light shirts.
  "dark-shirts": `<g fill="none" stroke="${LOGO.gold}" stroke-width="60" stroke-linejoin="round">${WORD}</g><g fill="#FFFFFF">${WORD}</g>`,
  "light-shirts": wordmark(),
};
const pad = 70, s = Math.min((LW - pad) / LOGO_BOX.w, (LH - pad) / LOGO_BOX.h);
const fit = (ink) => `<g transform="translate(${LW / 2 - (LOGO_BOX.x + LOGO_BOX.w / 2) * s} ${LH / 2 - (LOGO_BOX.y + LOGO_BOX.h / 2) * s}) scale(${s})">${ink}</g>`;

const labelDir = join(designs, "printful-upload");
mkdirSync(labelDir, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage({ viewport: { width: LW, height: LH } });
const labels = [];
for (const [v, ink] of Object.entries(LABELS)) {
  const tmp = join(labelDir, `label-${v}.tmp.html`);
  writeFileSync(tmp, `<!doctype html><style>@font-face{font-family:Yellowtail;src:url(${yellowtail})} html,body{margin:0;background:transparent}</style>
<svg xmlns="http://www.w3.org/2000/svg" width="${LW}" height="${LH}" viewBox="0 0 ${LW} ${LH}">${fit(ink)}</svg>`);
  await page.goto(pathToFileURL(tmp).href);
  await page.evaluate(() => document.fonts.ready);
  execFileSync("rm", [tmp]);
  await page.waitForTimeout(200);
  const file = join(labelDir, `giggleme-inside-label-${v}.png`);
  await page.screenshot({ path: file, omitBackground: true });
  execFileSync("convert", [file, "-units", "PixelsPerInch", "-density", "300", file]);
  labels.push(file);
}
await browser.close();

for (const series of process.argv.slice(2)) {
  const dir = join(designs, series), up = join(dir, "printful-upload");
  mkdirSync(up, { recursive: true });
  for (const slug of readdirSync(dir).filter((d) => /^\d\d-/.test(d)).sort()) {
    for (const v of ["dark-shirts", "light-shirts"]) {
      const src = join(dir, slug, `print-${v}.png`);
      if (!existsSync(src)) continue;
      execFileSync("convert", [src, "-trim", "+repage", "-bordercolor", "none", "-border", "60",
        "-units", "PixelsPerInch", "-density", "300", join(up, `${series}-${slug}-FRONT-${v}.png`)]);
    }
  }
  for (const l of labels) copyFileSync(l, join(up, l.split("/").pop()));
  writeFileSync(join(up, "README.txt"), `Upload these to Printful.
FRONT-dark-shirts: white text, for royal blue, black, navy, charcoal. FRONT-light-shirts: black text, for white, sand, light heather.
Each front file is trimmed to the art at 300 DPI. Center it at the top of the front print area.
giggleme-inside-label-*: the GiggleMe logo for the inside back neck label. Pick the one that matches the shirt color.
Printful adds the size, country of origin and fabric text to the label automatically.
`);
  console.log("Packed", series, "→", up);
}
