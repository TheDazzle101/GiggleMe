// Channel image for YouTube and TikTok: just the G and the M from the logo, centered exactly
// (by the drawn pixels, not the font box) inside the circle both apps crop to.
// Run: node channel-icon.mjs → ../brand/social/channel-icon*.{png,jpg}
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { writeFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { LOGO } from "./brandmark.mjs";
import { ROYAL } from "./royal.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "../brand/social");
const url = (f) => pathToFileURL(f).href;
const yt = url(join(here, "node_modules/@fontsource/yellowtail/files/yellowtail-latin-400-normal.woff2"));
const D = 2048, tmp = join(out, "_gm.png"), bgFile = join(out, "_bg.png");

// The G and M exactly as the logo draws them: grey fill, black ring, gold outer ring, black shadow.
const word = `<text x="2000" y="1500" text-anchor="middle" font-family="Yellowtail" font-size="1400">GM</text>`;
const L = (a, dx = 0, dy = 0) => `<g ${a} transform="translate(${dx} ${dy})">${word}</g>`;
const gm = L(`fill="${LOGO.black}"`, 42, 42) +
  L(`fill="none" stroke="${LOGO.gold}" stroke-width="140" stroke-linejoin="round"`) +
  L(`fill="none" stroke="${LOGO.black}" stroke-width="77" stroke-linejoin="round"`) + L(`fill="${LOGO.fill}"`);

// Background: matte black, a soft royal glow, and a thin gold ring just inside the circle crop.
const bg = `<defs><radialGradient id="g" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${ROYAL.purple}" stop-opacity=".45"/>
  <stop offset=".6" stop-color="${ROYAL.base}" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
  <linearGradient id="foil" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8C6A2E"/><stop offset=".3" stop-color="#F3D99A"/>
  <stop offset=".5" stop-color="#B8955A"/><stop offset=".72" stop-color="#FBE7B0"/><stop offset="1" stop-color="#8C6A2E"/></linearGradient></defs>
  <rect width="${D}" height="${D}" fill="#0B0B0D"/><rect width="${D}" height="${D}" fill="url(#g)"/>
  <circle cx="${D / 2}" cy="${D / 2}" r="${D * 0.455}" fill="none" stroke="url(#foil)" stroke-width="${D * 0.012}"/>`;

const page = (w, h, svg) => `<!doctype html><html><head><meta charset="utf-8"><style>@font-face{font-family:"Yellowtail";src:url(${yt})}
html,body{margin:0;background:transparent}svg{display:block}</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${svg}</svg>
<script>document.fonts.load('100px Yellowtail').then(()=>document.body.dataset.ready=1)</script></body></html>`;
const browser = await chromium.launch();
async function shot(html, file, w, h, transparent) {
  const f = file + ".html";
  writeFileSync(f, html);
  const p = await browser.newPage({ viewport: { width: w, height: h } });
  await p.goto(url(f));
  await p.waitForSelector("body[data-ready]");
  await p.screenshot({ path: file, omitBackground: transparent });
  await p.close();
  rmSync(f);
}
await shot(page(4000, 2400, gm), tmp, 4000, 2400, true);
await shot(page(D, D, bg), bgFile, D, D, false);
await browser.close();

// Trim to the drawn pixels, then scale so the whole mark sits comfortably inside the circle:
// its corners stay within 43% of the width from the center, inside the gold ring.
execFileSync("convert", [tmp, "-trim", "+repage", tmp]);
const [w, h] = execFileSync("identify", ["-format", "%w %h", tmp]).toString().split(" ").map(Number);
const s = (0.43 * D) / Math.hypot(w / 2, h / 2);
const sw = Math.round(w * s), sh = Math.round(h * s);
execFileSync("convert", [tmp, "-resize", `${sw}x${sh}!`, tmp]);
const master = join(out, "channel-icon.png");
execFileSync("convert", [bgFile, tmp, "-geometry", `+${Math.round((D - sw) / 2)}+${Math.round((D - sh) / 2)}`, "-composite", master]);
execFileSync("convert", [master, "-resize", "800x800", "-quality", "95", join(out, "channel-icon-youtube-800.jpg")]);
execFileSync("convert", [master, "-resize", "1080x1080", "-quality", "95", join(out, "channel-icon-tiktok-1080.jpg")]);
// Preview: how it looks once the apps crop it to a circle.
execFileSync("convert", [master, "-resize", "800x800", "(", "-size", "800x800", "xc:none", "-fill", "white", "-draw", "circle 400,400 400,0", ")",
  "-compose", "DstIn", "-composite", "-background", "#F2F0EC", "-compose", "Over", "-flatten", join(out, "channel-icon-circle-preview.png")]);
rmSync(tmp); rmSync(bgFile);
console.log("channel icon written", { w, h, scale: s.toFixed(3) });
