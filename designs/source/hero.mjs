// Shopify header logo and homepage hero banners.
// Run: node hero.mjs → ../brand/shopify/*
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { tee, SHIRTS } from "./ads.mjs";
import { LOGO, wordmark, viciously } from "./brandmark.mjs";
import { ROYAL } from "./royal.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "../brand/shopify");
mkdirSync(out, { recursive: true });
const url = (f) => pathToFileURL(f).href;
const font = (pkg, file) => url(join(here, "node_modules/@fontsource", pkg, "files", file));
const back = (slug) => url(resolve(here, "../series-01", slug, "back-print.png"));
const FONTS = `@font-face{font-family:"Rye";src:url(${font("rye", "rye-latin-400-normal.woff2")})}
@font-face{font-family:"Yellowtail";src:url(${font("yellowtail", "yellowtail-latin-400-normal.woff2")})}
@font-face{font-family:"Inter";font-weight:400;src:url(${font("inter", "inter-latin-400-normal.woff2")})}
@font-face{font-family:"Inter";font-weight:600;src:url(${font("inter", "inter-latin-600-normal.woff2")})}`;

// Headline lettering in the shirt-back style: grey fill, hard black ring, gold outer ring, black shadow.
function inkedText(lines, x, y, size, lead, fill = "#74787E") {
  const t = lines.map((l, i) => `<text x="${x}" y="${y + i * size * lead}" font-family="Rye" font-size="${size}">${l}</text>`).join("");
  const L = (a, dx = 0, dy = 0) => `<g ${a} transform="translate(${dx} ${dy})">${t}</g>`;
  return L(`fill="${LOGO.black}"`, size * 0.06, size * 0.06) +
    L(`fill="none" stroke="${LOGO.gold}" stroke-width="${size * 0.13}" stroke-linejoin="round"`) +
    L(`fill="none" stroke="${LOGO.black}" stroke-width="${size * 0.075}" stroke-linejoin="round"`) +
    L(`fill="${fill}"`);
}
// Shrink a block to a max width (anchored at its top-left) once fonts have loaded.
const fit = (maxW, inner) => `<g class="fitw" data-w="${maxW}">${inner}</g>`;
const label = (x, y, size, text, fill, weight = 600, anchor = "start", ls = 0) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Inter" font-weight="${weight}" font-size="${size}" letter-spacing="${ls}" fill="${fill}">${text}</text>`;
const button = (x, y, w, h, text, size) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${LOGO.gold}"/>` +
  label(x + w / 2, y + h / 2 + size * 0.36, size, text, "#141416", 600, "middle", size * 0.12);

// Background: royal blue → purple, a spotlight behind the shirts, light rays and a soft vignette.
function stage(w, h, cx, cy) {
  const rays = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2, b = a + Math.PI / 48, r = Math.max(w, h) * 1.4;
    return `<path d="M${cx} ${cy} L${cx + Math.cos(a) * r} ${cy + Math.sin(a) * r} L${cx + Math.cos(b) * r} ${cy + Math.sin(b) * r} Z"/>`;
  }).join("");
  return `<defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${ROYAL.base}"/><stop offset="1" stop-color="${ROYAL.purple}"/></linearGradient>
    <radialGradient id="spot" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${0.45 * Math.max(w, h)}">
      <stop offset="0" stop-color="#C9B8FF" stop-opacity=".55"/><stop offset="1" stop-color="#C9B8FF" stop-opacity="0"/></radialGradient>
    <radialGradient id="vig" cx=".5" cy=".5" r=".8"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <g fill="#fff" opacity=".05">${rays}</g>
  <rect width="${w}" height="${h}" fill="url(#spot)"/>
  <rect width="${w}" height="${h}" fill="url(#vig)"/>`;
}
// Three shirts fanned out: Lidda Sno in front, Firs Koffee and Lidda Sun behind.
const place = (x, y, s, r, inner) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s}) translate(-600 -700)">${inner}</g>`;
const trio = (cx, cy, s) =>
  place(cx - 560 * s, cy + 60 * s, s * 0.8, -9, tee("back", SHIRTS.navy, back("02-firs-koffee"), "l")) +
  place(cx + 560 * s, cy + 60 * s, s * 0.8, 9, tee("back", SHIRTS.black, back("03-lidda-sun"), "r")) +
  place(cx, cy, s, 0, tee("back", SHIRTS.black, back("01-lidda-sno"), "c"));

const HEAD = ["WE LOVE TO CREATE", "THOSE CLEVERLY", "VICIOUS GIGGLES..."];
const ALLDAY = (x, y, size) => `<g transform="rotate(-4 ${x} ${y})">${inkedText(["ALLL DAAAYYYY!"], x, y, size, 1, LOGO.gold)}</g>`;
const BANNERS = [
  // [file, w, h, body]
  ["hero-desktop", 2880, 1280, (w, h) => stage(w, h, 2230, 640) + trio(2230, 690, 0.72) +
    fit(1240, inkedText(HEAD, 200, 380, 112, 1.16) + ALLDAY(196, 920, 178) +
      button(206, 1030, 520, 120, "SHOP THE DROP", 44) + label(206, 1250, 40, "viciously.", LOGO.gold, 400))],
  ["hero-desktop-no-text", 2880, 1280, (w, h) => stage(w, h, 2230, 640) + trio(2230, 690, 0.72)],
  ["hero-mobile", 1080, 1350, (w, h) => stage(w, h, 540, 980) + trio(540, 1010, 0.46) +
    fit(910, inkedText(HEAD, 90, 160, 80, 1.16) + ALLDAY(86, 545, 128))],
];

const browser = await chromium.launch();
async function shot(html, file, w, h, transparent = false) {
  const tmp = file + ".tmp.html";
  writeFileSync(tmp, html);
  const p = await browser.newPage({ viewport: { width: w, height: h } });
  await p.goto(url(tmp));
  await p.waitForSelector("body[data-ready]", { timeout: 60000 });
  await p.screenshot({ path: file, omitBackground: transparent });
  await p.close();
  rmSync(tmp);
}
const doc = (w, h, svg) => `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}html,body{margin:0;background:transparent}svg{display:block}</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${svg}</svg>
<script>Promise.all(['100px Rye','100px Yellowtail','400 40px Inter','600 40px Inter'].map(f=>document.fonts.load(f)))
.then(()=>Promise.all([...document.querySelectorAll('image')].map(i=>new Promise(r=>{const m=new Image();m.onload=m.onerror=r;m.src=i.getAttribute('href')}))))
.then(()=>{for(const g of document.querySelectorAll('g.fitw')){const b=g.getBBox(),k=Math.min(1,g.dataset.w/b.width);g.setAttribute('transform','translate('+b.x*(1-k)+' '+b.y*(1-k)+') scale('+k+')')}})
.then(()=>setTimeout(()=>document.body.dataset.ready=1,300))</script></body></html>`;

for (const [name, w, h, body] of BANNERS) {
  const png = join(out, name + ".png");
  await shot(doc(w, h, body(w, h)), png, w, h);
  execFileSync("convert", [png, "-quality", "90", "-sampling-factor", "4:2:0", join(out, name + ".jpg")]);
  rmSync(png);
}

// Header logos: transparent, trimmed tight so the theme's logo-width slider controls the size.
for (const [name, art] of [["header-logo", wordmark()], ["header-logo-viciously", wordmark() + viciously()]]) {
  const png = join(out, name + ".png");
  await shot(doc(2600, 1250, art), png, 2600, 1250, true);
  execFileSync("convert", [png, "-trim", "+repage", "-bordercolor", "none", "-border", "12", "-resize", "1200x", png]);
}

// Preview of the header on a dark bar and a light bar, to show how it sits with a menu.
const bar = (y, bg, ink) => `<rect y="${y}" width="2400" height="220" fill="${bg}"/>
  <image href="${url(join(out, "header-logo.png"))}" x="80" y="${y + 40}" width="320" height="${320 * 0.45}"/>
  ${[["New Drops", 820], ["Best Sellers", 1110], ["The Lidda Saga", 1420], ["Shop All", 1780]].map(([t, x]) => label(x, y + 125, 34, t, ink, 600)).join("")}
  ${label(2300, y + 125, 34, "Cart", ink, 600, "end")}`;
await shot(doc(2400, 440, bar(0, "#141416", "#EDEBE6") + bar(220, "#F6F4F0", "#141416")), join(out, "header-preview.png"), 2400, 440);
await browser.close();
console.log("Shopify header and hero written");
