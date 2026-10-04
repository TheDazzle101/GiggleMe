// One-off: LIDDA SNO at the largest Printful back print (15 × 18 in) next to the standard 12 × 16 in.
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { CANDY } from "./brandmark.mjs";
import { artSheet, page } from "./series.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const dir = resolve(here, "../series-01/01-lidda-sno");
const lines = ["LIDDA SNO", "LIDDA BLO", "KUPPA HOS", "LETS RO"];
const W = 4500, H = 5400, TAG = 210, GAP = 300;
const script = `const svg=document.getElementById("s");
  const r=inked(svg,${JSON.stringify(lines)},{id:"c",cx:${W / 2},cy:${H / 2},width:${W - 120},height:${H - 200 - TAG - GAP},extraBelow:${TAG + GAP},align:"left",shadow:"${CANDY.lavender}"});
  const t=document.createElementNS("http://www.w3.org/2000/svg","text");t.setAttribute("x",r.left.toFixed(0));t.setAttribute("y",(r.bottom+${GAP}+${TAG}*0.55).toFixed(0));
  t.setAttribute("font-family","Pinyon Script");t.setAttribute("font-size","${TAG}");t.setAttribute("fill","${CANDY.gold}");t.textContent="We hope to always Giggleyou Viciously";svg.appendChild(t);`;
const browser = await chromium.launch();
const shot = async (html, file, w, h, transparent) => {
  const tmp = file + ".tmp.html"; writeFileSync(tmp, html);
  const p = await browser.newPage({ viewport: { width: w, height: h } });
  await p.goto(pathToFileURL(tmp).href); await p.waitForSelector("body[data-ready]", { timeout: 60000 });
  await p.screenshot({ path: file, omitBackground: transparent }); await p.close(); execFileSync("rm", [tmp]);
};
const maxFile = join(dir, "back-print-15x18.png");
await shot(page(W, H, artSheet(W, H, 2.3), script), maxFile, W, H, true);
execFileSync("convert", [maxFile, "-units", "PixelsPerInch", "-density", "300", maxFile]);

// Side by side at true scale on a size-L tee (~20 in chest ≈ 720 px → 36 px per inch).
const TEE = "M 330 90 Q 600 190 870 90 L 1150 230 L 1080 520 L 960 480 L 960 1340 Q 600 1380 240 1340 L 240 480 L 120 520 L 50 230 Z";
const tee = (x, png, w, h, label) => `<g transform="translate(${x} 0)"><path d="${TEE}" fill="#1C1C1E" stroke="#000" stroke-width="4"/>
  <path d="M 470 112 Q 600 136 730 112" fill="none" stroke="#000" stroke-width="6"/>
  <image href="${pathToFileURL(png).href}" x="${600 - w / 2}" y="190" width="${w}" height="${h}"/>
  <text x="600" y="1440" text-anchor="middle" font-family="Rye" font-size="46" fill="#5A4E60">${label}</text></g>`;
await shot(`<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:"Rye";src:url(${pathToFileURL(join(here, "node_modules/@fontsource/rye/files/rye-latin-400-normal.woff2")).href})}
html,body{margin:0;background:#ECEAE4}</style></head><body><svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1500" viewBox="0 0 2400 1500">
${tee(0, join(dir, "back-print.png"), 432, 576, "STANDARD · 12 × 16 IN")}${tee(1200, maxFile, 540, 648, "BIGGEST · 15 × 18 IN")}
</svg><script>document.fonts.ready.then(()=>document.body.dataset.ready=1)</script></body></html>`,
  resolve(here, "../previews/lidda-sno-biggest.png"), 2400, 1500, false);
await browser.close();
console.log("done");
