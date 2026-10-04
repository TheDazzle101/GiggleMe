// Logo pack: every version of the GiggleMe logo the accounts ask for.
// Run: node logo-pack.mjs
//   → ../brand/social/*.png        (upload-ready files for each account)
//   → ../brand/giggleme-logo-pack.pdf (one page per version; logos are vector, sharp at any size)
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { LOGO, wordmark, viciously } from "./brandmark.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "../brand/social");
mkdirSync(out, { recursive: true });
const font = (pkg, file) => pathToFileURL(join(here, "node_modules/@fontsource", pkg, "files", file)).href;
const FONTS = `@font-face{font-family:"Yellowtail";src:url(${font("yellowtail", "yellowtail-latin-400-normal.woff2")})}
@font-face{font-family:"Inter";font-weight:400;src:url(${font("inter", "inter-latin-400-normal.woff2")})}
@font-face{font-family:"Inter";font-weight:600;src:url(${font("inter", "inter-latin-600-normal.woff2")})}`;

// Monogram for tiny spots (favicon, app icon): G and M at full height, same ink as the logo.
const GM = `<text x="1300" y="820" text-anchor="middle" font-family="Yellowtail" font-size="600">GM</text>`;
const inked = (word) => {
  const L = (a, dx = 0, dy = 0) => `<g ${a}${dx || dy ? ` transform="translate(${dx} ${dy})"` : ""}>${word}</g>`;
  return L(`fill="${LOGO.black}"`, 18, 18) + L(`fill="none" stroke="${LOGO.gold}" stroke-width="60" stroke-linejoin="round"`) +
    L(`fill="none" stroke="${LOGO.black}" stroke-width="33" stroke-linejoin="round"`) + L(`fill="${LOGO.fill}"`);
};
const ART = { full: wordmark() + viciously(), word: wordmark(), mono: inked(GM) };

// An SVG that fits its art: the script trims the viewBox to the art (plus room for outlines).
const fit = (art, cls = "") => `<svg class="fit ${cls}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2600 1250"><g>${art}</g></svg>`;
const FIT = `for(const s of document.querySelectorAll("svg.fit")){const b=s.firstElementChild.getBBox(),p=50;s.setAttribute("viewBox",[b.x-p,b.y-p,b.width+2*p+18,b.height+2*p+18].join(" "))}`;
const BG = { dark: "radial-gradient(circle at 50% 45%, #2A2D33, #0E0E10 75%)", royal: "linear-gradient(135deg, #3050D0, #6A2FB8)" };

// Upload files: [file, width, height, background, art, art width as share of the canvas, art key].
const FILES = [
  ["profile-picture", 1080, 1080, BG.dark, "word", 0.83, "Profile picture: TikTok, Instagram, YouTube, Facebook, X, Threads, Pinterest, Google"],
  ["profile-picture-monogram", 1080, 1080, BG.dark, "mono", 0.62, "Profile picture when it shows very small, and Shopify favicon"],
  ["youtube-banner", 2560, 1440, BG.dark, "full", 0.28, "YouTube banner (logo sits inside the 1546 × 423 safe area for phones)"],
  ["facebook-cover", 1640, 624, BG.dark, "full", 0.42, "Facebook cover photo"],
  ["x-header", 1500, 500, BG.dark, "full", 0.4, "X (Twitter) header"],
  ["linkedin-banner", 1584, 396, BG.dark, "full", 0.32, "LinkedIn banner"],
  ["email-header", 1200, 400, BG.royal, "full", 0.42, "Email header for Shopify Email or Klaviyo"],
];
const LOGOS = [
  ["giggleme-logo-white-bg", "#FFFFFF", "full", "Full logo on white: invoices, packing slips, Shopify store header on a light theme"],
  ["giggleme-wordmark-white-bg", "#FFFFFF", "word", "Name only on white"],
];

const browser = await chromium.launch();
async function shot(html, file, w, h) {
  const tmp = file + ".tmp.html";
  writeFileSync(tmp, html);
  const p = await browser.newPage({ viewport: { width: w, height: h } });
  await p.goto(pathToFileURL(tmp).href);
  await p.waitForSelector("body[data-ready]");
  await p.screenshot({ path: file });
  await p.close();
  rmSync(tmp);
}
const doc = (body, css) => `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}html,body{margin:0}${css}</style></head><body>${body}
<script>Promise.all([document.fonts.load('100px Yellowtail'),document.fonts.load('100px Inter')]).then(()=>{${FIT};document.body.dataset.ready=1})</script></body></html>`;

for (const [name, w, h, bg, key, share] of FILES)
  await shot(doc(`<div class="c">${fit(ART[key])}</div>`, `.c{width:${w}px;height:${h}px;background:${bg};display:grid;place-items:center}.fit{width:${w * share}px;height:auto}`),
    join(out, name + ".png"), w, h);
for (const [name, bg, key] of LOGOS)
  await shot(doc(`<div class="c">${fit(ART[key])}</div>`, `.c{width:3000px;height:1500px;background:${bg};display:grid;place-items:center}.fit{width:2600px;height:auto}`),
    join(out, name + ".png"), 3000, 1500);

// PDF: vector logos first, then the upload files as pictures.
const page = (title, uses, inner, bg = "#fff", ink = "#1A1A1C") => `<section style="background:${bg};color:${ink}">
  <header><h1>${title}</h1><p>${uses}</p></header><div class="art">${inner}</div></section>`;
const pages = [
  page("GiggleMe logo", "The full logo with <i>viciously.</i> Store header, banners, packaging, anywhere it shows big.", fit(ART.full), "#141416", "#EDEBE6"),
  page("GiggleMe logo on white", "Same logo on a light background: invoices, packing slips, light store themes.", fit(ART.full)),
  page("Name only", "GiggleMe without <i>viciously.</i> Profile pictures, shirt tags, small spaces.", fit(ART.word), "#141416", "#EDEBE6"),
  page("Monogram", "G and M only, for spots too small for the full name: favicon, app icon, tiny avatars.", fit(ART.mono, "small"), "#141416", "#EDEBE6"),
  ...FILES.map(([name, w, h, , , , uses]) => page(`${name}.png`, `${uses}. ${w} × ${h} px.`,
    `<img src="${pathToFileURL(join(out, name + ".png")).href}" class="${w === h ? "sq" : ""}"><small>File: designs/brand/social/${name}.png</small>`, "#F2F0EC")),
  page("Colors", "Use these when you need to match the logo anywhere else.",
    `<div class="sw">${[["Letter grey", LOGO.fill], ["Outline black", LOGO.black], ["Matte gold", LOGO.gold], ["Royal blue", "#3050D0"], ["Royal purple", "#6A2FB8"]]
      .map(([n, c]) => `<div><span style="background:${c}"></span><b>${n}</b><code>${c}</code></div>`).join("")}</div>
     <p class="fonts">Logo font: Yellowtail · <i>viciously.</i>: Inter · Shirt backs: Rye</p>`),
];
const pdfHtml = doc(pages.join(""), `@page{size:11in 8.5in;margin:0}
  section{width:11in;height:8.5in;box-sizing:border-box;padding:.6in .7in;display:flex;flex-direction:column;page-break-after:always;font-family:Inter,sans-serif}
  h1{font-weight:600;font-size:22pt;margin:0}header p{margin:.08in 0 0;font-size:11.5pt;opacity:.75}
  .art{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.15in;min-height:0}
  .fit{width:8.4in;height:auto;max-height:5.6in}.fit.small{width:4in}
  img{max-width:9.4in;max-height:5.6in;box-shadow:0 2px 12px rgba(0,0,0,.18)}img.sq{max-height:5.2in}
  small{font-size:9.5pt;opacity:.7}
  .sw{display:flex;gap:.3in;flex-wrap:wrap;justify-content:center}.sw div{display:flex;flex-direction:column;gap:.06in;font-size:11pt}
  .sw span{width:1.4in;height:1.4in;border-radius:.12in;border:1px solid #ddd}code{font-size:10.5pt}.fonts{font-size:11pt;margin-top:.3in}`);
const tmp = resolve(here, "../brand/pack.tmp.html");
writeFileSync(tmp, pdfHtml);
const p = await browser.newPage();
await p.goto(pathToFileURL(tmp).href);
await p.waitForSelector("body[data-ready]");
await p.pdf({ path: resolve(here, "../brand/giggleme-logo-pack.pdf"), width: "11in", height: "8.5in", printBackground: true });
rmSync(tmp);
await browser.close();
console.log("Logo pack written");
