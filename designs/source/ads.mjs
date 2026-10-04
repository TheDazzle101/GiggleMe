// Store and ad images for Series 01 shirts: a shaded cotton tee (folds, seams, fabric grain)
// with the real print files placed to scale on a size-L Bella+Canvas 3001.
// Run: node ads.mjs [slug ...]   (default: the first two shirts)
//   → ../series-01/<nn-slug>/shopify/*.jpg
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { ROYAL } from "./royal.mjs";
import { LOGO } from "./brandmark.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const series = resolve(here, "../series-01");
const url = (f) => pathToFileURL(f).href;
const inter = url(join(here, "node_modules/@fontsource/inter/files/inter-latin-600-normal.woff2"));
const chest = url(join(series, "logo-left-chest.png"));
const brandLogo = url(resolve(here, "../brand/giggleme-logo.png"));

export const SHIRTS = { black: "#1B1B1D", navy: "#1E2638" };

// Tee in a 1200 × 1400 space, about 36 px per inch on a size L (20.5 in chest).
const BACK = "M420 70 Q600 104 780 70 L1005 138 Q1110 200 1178 470 L990 545 Q976 522 968 500 L978 1325 Q600 1356 222 1325 L232 500 Q224 522 210 545 L22 470 Q90 200 195 138 Z";
const FRONT = "M420 66 Q600 40 780 66 L1005 138 Q1110 200 1178 470 L990 545 Q976 522 968 500 L978 1325 Q600 1356 222 1325 L232 500 Q224 522 210 545 L22 470 Q90 200 195 138 Z";
const FOLDS = [
  ["M262 520 Q330 610 352 720", 0.32, 34], ["M938 520 Q870 610 848 720", 0.32, 34],
  ["M110 300 Q160 390 150 470", 0.22, 26], ["M1090 300 Q1040 390 1050 470", 0.22, 26],
  ["M400 980 Q425 1150 385 1318", 0.18, 40], ["M805 940 Q775 1110 825 1318", 0.18, 40],
  ["M600 1180 Q640 1260 610 1335", 0.12, 30],
];
const SHINE = [["M330 300 Q600 255 870 300", 0.04, 70], ["M300 760 Q330 900 300 1050", 0.05, 50], ["M905 760 Q875 900 905 1050", 0.05, 50]];

function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255];
  const f = (v) => Math.max(0, Math.min(255, Math.round(k >= 1 ? v + (255 - v) * (k - 1) : v * k)));
  return "#" + c.map(f).map((v) => v.toString(16).padStart(2, "0")).join("");
}

// One tee. view "back" carries the back print, "front" the left-chest logo.
export function tee(view, color, back, p) {
  const body = view === "back" ? BACK : FRONT;
  const rib = shade(color, 1.12), seam = "rgba(255,255,255,.13)";
  const art = view === "back"
    ? `<image href="${back}" x="330" y="190" width="540" height="648"/>`
    : `<image href="${chest}" x="652" y="232" width="150" height="81"/>`;
  const neck = view === "back"
    ? `<path d="M420 70 Q600 104 780 70" fill="none" stroke="${rib}" stroke-width="26"/>
       <path d="M432 86 Q600 116 768 86" fill="none" stroke="${seam}" stroke-width="2.4" stroke-dasharray="7 5"/>`
    : `<path d="M420 66 Q600 40 780 66 Q600 205 420 66 Z" fill="${shade(color, 0.55)}"/>
       <path d="M440 70 Q600 50 760 70" fill="none" stroke="${shade(color, 0.8)}" stroke-width="14"/>
       <path d="M420 66 Q600 205 780 66" fill="none" stroke="${rib}" stroke-width="28"/>
       <path d="M412 84 Q600 228 788 84" fill="none" stroke="${seam}" stroke-width="2.4" stroke-dasharray="7 5"/>`;
  return `<defs>
    <clipPath id="${p}c"><path d="${body}"/></clipPath>
    <linearGradient id="${p}side" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".42"/><stop offset=".2" stop-color="#000" stop-opacity="0"/><stop offset=".8" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".42"/></linearGradient>
    <linearGradient id="${p}top" y1="0" y2="1" x1="0" x2="0"><stop offset="0" stop-color="#fff" stop-opacity=".07"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient>
    <filter id="${p}soft" filterUnits="userSpaceOnUse" x="-100" y="-100" width="1400" height="1600"><feGaussianBlur stdDeviation="18"/></filter>
    <filter id="${p}drop" filterUnits="userSpaceOnUse" x="-150" y="-150" width="1500" height="1700"><feGaussianBlur stdDeviation="22"/></filter>
    <filter id="${p}grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="7"/><feColorMatrix type="saturate" values="0"/></filter>
  </defs>
  <path d="${body}" fill="#000" opacity=".38" filter="url(#${p}drop)" transform="translate(10 26)"/>
  <path d="${body}" fill="${color}"/>
  <g clip-path="url(#${p}c)">
    <g opacity=".95">${art}</g>
    <rect width="1200" height="1400" filter="url(#${p}grain)" opacity=".07" style="mix-blend-mode:overlay"/>
    <rect width="1200" height="1400" fill="url(#${p}side)"/>
    <rect width="1200" height="1400" fill="url(#${p}top)"/>
    ${FOLDS.map(([d, o, w]) => `<path d="${d}" fill="none" stroke="#000" stroke-opacity="${o}" stroke-width="${w}" stroke-linecap="round" filter="url(#${p}soft)"/>`).join("")}
    ${SHINE.map(([d, o, w]) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${o}" stroke-width="${w}" stroke-linecap="round" filter="url(#${p}soft)"/>`).join("")}
    <path d="M195 138 Q262 320 232 500" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="5"/>
    <path d="M1005 138 Q938 320 968 500" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="5"/>
    <path d="M420 70 L195 138 M780 70 L1005 138" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="4"/>
    <path d="M40 448 L215 518 M1160 448 L985 518" fill="none" stroke="${seam}" stroke-width="2.4" stroke-dasharray="7 5"/>
    <path d="M222 1298 Q600 1329 978 1298" fill="none" stroke="${seam}" stroke-width="2.4" stroke-dasharray="7 5"/>
    ${neck}
  </g>
  <path d="${body}" fill="none" stroke="#000" stroke-opacity=".55" stroke-width="3"/>`;
}

const STUDIO = (w, h) => `<defs><radialGradient id="bg" cx=".5" cy=".42" r=".75"><stop offset="0" stop-color="#F4F1EC"/><stop offset="1" stop-color="#D9D3CA"/></radialGradient></defs><rect width="${w}" height="${h}" fill="url(#bg)"/>`;
const ROYALBG = (w, h) => `<defs><linearGradient id="rb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${ROYAL.base}"/><stop offset="1" stop-color="${ROYAL.purple}"/></linearGradient>
  <radialGradient id="vg" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient></defs>
  <rect width="${w}" height="${h}" fill="url(#rb)"/><rect width="${w}" height="${h}" fill="url(#vg)"/>`;
const place = (x, y, s, inner) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
const label = (x, y, size, text, fill, ls = 0.12) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Inter" font-weight="600" font-size="${size}" letter-spacing="${size * ls}" fill="${fill}">${text}</text>`;

// Every image for one shirt: [file, width, height, svg body].
function shots(back, color, tag) {
  const T = (view, p) => tee(view, color, back, p + tag);
  return [
    [`back${tag}`, 2048, 2048, STUDIO(2048, 2048) + place(1024 - 600 * 1.3, 64, 1.3, T("back", "a"))],
    [`front${tag}`, 2048, 2048, STUDIO(2048, 2048) + place(1024 - 600 * 1.3, 64, 1.3, T("front", "b"))],
    [`front-back${tag}`, 2048, 2048, STUDIO(2048, 2048) + place(54, 360, 0.82, T("front", "c")) + place(1030, 360, 0.82, T("back", "d")) +
      label(546, 1630, 40, "FRONT", "#6B6460") + label(1522, 1630, 40, "BACK", "#6B6460")],
  ].concat(tag ? [] : [
    [`print-closeup`, 2048, 2048, place(1024 - 600 * 3.4, 1024 - 520 * 3.4, 3.4, T("back", "e"))],
    [`chest-closeup`, 2048, 2048, place(1024 - 735 * 8, 1024 - 300 * 8, 8, T("front", "f"))],
    [`ad-feed-4x5`, 2160, 2700, ROYALBG(2160, 2700) + `<image href="${brandLogo}" x="${1080 - 560}" y="90" width="1120" height="${(1120 * 1733) / 3107}"/>` +
      place(1080 - 600 * 1.22, 760, 1.22, T("back", "g")) + label(1080, 2600, 64, "SERIES 01 · SHOP NOW", "#FFFFFF")],
    [`ad-story-9x16`, 2160, 3840, ROYALBG(2160, 3840) + `<image href="${brandLogo}" x="${1080 - 680}" y="260" width="1360" height="${(1360 * 1733) / 3107}"/>` +
      place(1080 - 600 * 1.6, 1080, 1.6, T("back", "h")) + label(1080, 3560, 76, "SERIES 01 · SHOP NOW", "#FFFFFF")],
  ]);
}

const html = (w, h, body) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:"Inter";font-weight:600;src:url(${inter})}html,body{margin:0}svg{display:block}</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>
<script>document.fonts.load('600 40px Inter').then(()=>Promise.all([...document.images].map(i=>i.decode?.().catch(()=>{})))).then(()=>setTimeout(()=>document.body.dataset.ready=1,300))</script></body></html>`;

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const slugs = process.argv.slice(2).length ? process.argv.slice(2) : ["01-lidda-sno", "02-firs-koffee"];
  const browser = await chromium.launch();
  for (const slug of slugs) {
    const dir = join(series, slug, "shopify"), back = url(join(series, slug, "back-print.png"));
    mkdirSync(dir, { recursive: true });
    const list = [...shots(back, SHIRTS.black, ""), ...shots(back, SHIRTS.navy, "-navy")];
    for (const [name, w, h, body] of list) {
      const tmp = join(dir, name + ".tmp.html"), png = join(dir, name + ".png");
      writeFileSync(tmp, html(w, h, body));
      const p = await browser.newPage({ viewport: { width: w, height: h } });
      await p.goto(url(tmp));
      await p.waitForSelector("body[data-ready]", { timeout: 60000 });
      await p.screenshot({ path: png });
      await p.close();
      execFileSync("convert", [png, "-quality", "92", "-sampling-factor", "4:2:0", join(dir, name + ".jpg")]);
      execFileSync("rm", [tmp, png]);
      console.log("wrote", slug, name);
    }
  }
  await browser.close();
}
