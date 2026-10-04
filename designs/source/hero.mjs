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
@font-face{font-family:"Anton";src:url(${font("anton", "anton-latin-400-normal.woff2")})}
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

// Elite streetwear look: matte black, film grain, gold foil, tall capitals, a giant outlined
// GIGGLEME behind everything, a gold tape strip, and the shirts lit like a product drop.
const FOIL = `<linearGradient id="foil" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#8C6A2E"/><stop offset=".3" stop-color="#F3D99A"/><stop offset=".5" stop-color="#B8955A"/>
  <stop offset=".72" stop-color="#FBE7B0"/><stop offset="1" stop-color="#8C6A2E"/></linearGradient>`;
function street(w, h, cx, cy, bigY, bigSize) {
  return `<defs>${FOIL}
    <radialGradient id="glow" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${0.42 * Math.max(w, h)}">
      <stop offset="0" stop-color="${ROYAL.purple}" stop-opacity=".55"/><stop offset=".55" stop-color="${ROYAL.base}" stop-opacity=".18"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <radialGradient id="vig2" cx=".5" cy=".5" r=".75"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".7"/></radialGradient>
    <filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4"/><feColorMatrix type="saturate" values="0"/></filter>
  </defs>
  <rect width="${w}" height="${h}" fill="#0B0B0D"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  <text x="${w / 2}" y="${bigY}" text-anchor="middle" font-family="Anton" font-size="${bigSize}" fill="none" stroke="${LOGO.gold}" stroke-opacity=".16" stroke-width="3" letter-spacing="${bigSize * 0.02}">GIGGLEME</text>
  <rect width="${w}" height="${h}" fill="url(#vig2)"/>`;
}
const grain = (w, h) => `<rect width="${w}" height="${h}" filter="url(#grain)" opacity=".09" style="mix-blend-mode:screen"/>`;
// Gold tape strip running across the frame.
function tape(w, y, angle, size) {
  const unit = "GIGGLEME \u2022 VICIOUSLY \u2022 SERIES 01 \u2022 ";
  return `<g transform="rotate(${angle} ${w / 2} ${y})"><rect x="${-w * 0.2}" y="${y - size * 0.95}" width="${w * 1.4}" height="${size * 1.5}" fill="url(#foil)"/>
    <text x="${-w * 0.2}" y="${y + size * 0.15}" font-family="Anton" font-size="${size}" fill="#0B0B0D" letter-spacing="${size * 0.08}">${unit.repeat(14)}</text></g>`;
}
// Tall white capitals with a hard shadow, and the gold-foil script payoff.
const caps = (lines, x, y, size, lead) => lines.map((l, i) =>
  `<text x="${x + size * 0.04}" y="${y + i * size * lead + size * 0.04}" font-family="Anton" font-size="${size}" fill="#000" opacity=".8">${l}</text>
   <text x="${x}" y="${y + i * size * lead}" font-family="Anton" font-size="${size}" fill="#F4F1EA" letter-spacing="${size * 0.01}">${l}</text>`).join("");
const payoff = (x, y, size) => `<g transform="rotate(-6 ${x} ${y})">
  <text x="${x + size * 0.05}" y="${y + size * 0.05}" font-family="Yellowtail" font-size="${size}" fill="#000">Alll Daaayyyy!</text>
  <text x="${x}" y="${y}" font-family="Yellowtail" font-size="${size}" fill="url(#foil)" stroke="#0B0B0D" stroke-width="${size * 0.02}" paint-order="stroke">Alll Daaayyyy!</text></g>`;
const eyebrow = (x, y, size) => `<rect x="${x}" y="${y - size * 0.42}" width="${size * 2.2}" height="${size * 0.12}" fill="${LOGO.gold}"/>` +
  label(x + size * 2.6, y, size, "SERIES 01 \u2014 LIMITED DROP", LOGO.gold, 600, "start", size * 0.3);
const ghostButton = (x, y, w, h, text, size) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="url(#foil)" stroke-width="4"/>` +
  label(x + w / 2, y + h / 2 + size * 0.36, size, text, "#F3D99A", 600, "middle", size * 0.2);
const HEAD = ["WE LOVE TO CREATE THOSE", "CLEVERLY VICIOUS", "GIGGLES..."];
const desktopShirts = (w, h) => street(w, h, 2190, 620, 1060, 760) + trio(2190, 640, 0.7);
const BANNERS = [
  // [file, w, h, body]
  ["hero-desktop", 2880, 1280, (w, h) => desktopShirts(w, h) +
    fit(1240, eyebrow(200, 230, 34) + caps(HEAD, 196, 380, 150, 1.0) + payoff(210, 905, 210) +
      ghostButton(206, 985, 560, 118, "SHOP THE DROP \u2192", 40)) +
    tape(w, 1190, -3, 46) + grain(w, h)],
  ["hero-desktop-no-text", 2880, 1280, (w, h) => desktopShirts(w, h) + tape(w, 1190, -3, 46) + grain(w, h)],
  ["hero-mobile", 1080, 1350, (w, h) => street(w, h, 540, 1000, 1290, 300) + trio(540, 1010, 0.42) +
    fit(920, eyebrow(80, 120, 26) + caps(HEAD, 78, 250, 104, 1.0) + payoff(92, 640, 150)) +
    tape(w, 1300, -4, 34) + grain(w, h)],
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
<script>Promise.all(['100px Rye','100px Anton','100px Yellowtail','400 40px Inter','600 40px Inter'].map(f=>document.fonts.load(f)))
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
