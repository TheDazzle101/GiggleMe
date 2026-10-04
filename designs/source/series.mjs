// Series 01: ten stacked sayings in the GiggleMe tattoo-ink style + the "GM" left-chest mark.
// Run: node series.mjs
//   → ../series-01/<nn-slug>/back-print.png   (3600 × 4800 px, 300 DPI, back print)
//   → ../series-01/<nn-slug>/mockup.png        (front + back preview)
//   → ../series-01/gm-left-chest.png           (1200 × 1200 px, 300 DPI, front left chest)
//   → ../previews/series-01.png                (all ten at a glance)
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { CANDY } from "./brandmark.mjs"; // also switches the tattoo ink to cotton candy
import { rose, nauticalStar, flames, bolt } from "./tattoo.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "../series-01");
const font = (pkg, file) => pathToFileURL(join(here, "node_modules/@fontsource", pkg, "files", file)).href;

export const SAYINGS = [
  { slug: "01-lidda-sno", lines: ["LIDDA SNO", "LIDDA BLO", "KUPPA HOS", "LETS RO"] },
  { slug: "02-firs-koffee", lines: ["FIRS KOFFEE", "DEN TALKEE", "SEKOND KOFFEE", "DEN WALKEE"] },
  { slug: "03-jingl-mingl", lines: ["JINGL", "MINGL", "EGGNOG", "STILL SINGL"] },
  { slug: "04-planz-canseld", lines: ["PLANZ", "CANSELD", "PJZ ON", "LYF GUD"] },
  { slug: "05-walkies-zoomies", lines: ["WALKIES", "TREETSIES", "ZOOMIES", "SNOOZIES"] },
  { slug: "06-payday-broke-agen", lines: ["PAYDAY", "PAY RENT", "PAY BILLZ", "BROKE AGEN"] },
  { slug: "07-turky-taters", lines: ["TURKY", "TATERS", "PIE TYM", "NAP TYM"] },
  { slug: "08-seen-it-on-red", lines: ["SEEN IT", "RED IT", "LEFT IT", "ON RED"] },
  { slug: "09-gym-who-jim", lines: ["GYM?", "WHO JIM?", "PASS DA", "SNAKS"] },
  { slug: "10-ovrthink", lines: ["THINK", "OVRTHINK", "UNDRTHINK", "NO SLEEP"] },
];

// Tattoo art that fills the letters, tiled in rows across any canvas size. k scales the pieces.
function artSheet(W, H, k = 1) {
  const parts = [`<rect width="${W}" height="${H}" fill="${CANDY.blue}"/>`];
  const rowH = 560 * k;
  for (let r = 0, y = 0; y < H + rowH; r++, y += rowH) {
    const kind = r % 3, off = (r % 2) * 220 * k;
    if (kind === 0) {
      for (let x = -off; x < W + 300 * k; x += 330 * k) parts.push(`<path d="M ${x} ${y + 120 * k} q ${80 * k} ${-60 * k} ${165 * k} 0 t ${165 * k} 0" fill="none" stroke="${CANDY.blueDeep}" stroke-width="${16 * k}"/>`);
      for (let x = 160 * k - off; x < W + 200 * k; x += 520 * k) parts.push(rose(x, y + 330 * k, 125 * k, [140, 30]));
      for (let x = 420 * k - off; x < W + 200 * k; x += 520 * k) parts.push(nauticalStar(x, y + 200 * k, 70 * k, CANDY.lavender, (x / k) % 40));
    } else if (kind === 1) {
      parts.push(`<rect y="${y}" width="${W}" height="${rowH}" fill="${CANDY.lavender}" opacity=".55"/>`);
      parts.push(`<g transform="translate(0 ${y + rowH}) scale(${k})">${flames(-200, W / k + 200, 0, 420)}</g>`);
    } else {
      for (let x = 260 * k - off; x < W + 200 * k; x += 600 * k) parts.push(rose(x, y + 300 * k, 115 * k, [200, -20]));
      for (let x = 0 - off; x < W + 200 * k; x += 600 * k) parts.push(bolt(x, y + 280 * k, 95 * k, 15));
      for (let x = 520 * k - off; x < W + 200 * k; x += 600 * k) parts.push(nauticalStar(x, y + 160 * k, 60 * k, CANDY.pink, 12));
    }
  }
  return parts.join("");
}

// The browser lays out each line (measured glyph bounds), then builds the inked layers.
const LAYOUT = `
function inked(svg, lines, o){
  const ctx=document.createElement("canvas").getContext("2d"), NS="http://www.w3.org/2000/svg";
  let tw=o.width, rows;
  const measure=()=>lines.map(t=>{ctx.font='1000px Rye';const m=ctx.measureText(t);const w=m.actualBoundingBoxLeft+m.actualBoundingBoxRight;
    let s=1000*tw/w; s=Math.min(s,o.maxSize); return {t,s,asc:m.actualBoundingBoxAscent*s/1000,desc:m.actualBoundingBoxDescent*s/1000,lx:m.actualBoundingBoxLeft*s/1000,w:w*s/1000}});
  const total=r=>r.reduce((a,x)=>a+x.asc+x.desc,0)+o.gap*(r.length-1);
  rows=measure(); while(total(rows)>o.maxHeight){tw*=0.96;rows=measure()}
  let y=o.top+(o.center?(o.maxHeight-total(rows))/2:0);
  rows.forEach(r=>{y+=r.asc;r.y=y;y+=r.desc+o.gap});
  const mk=(r)=>{const t=document.createElementNS(NS,"text");t.textContent=r.t;t.setAttribute("x",(o.cx-r.w/2+r.lx).toFixed(1));t.setAttribute("y",r.y.toFixed(1));t.setAttribute("font-family","Rye");t.setAttribute("font-size",r.s.toFixed(1));return t};
  const layer=(attrs,dx,dy,strokeK)=>{const g=document.createElementNS(NS,"g");for(const k in attrs)g.setAttribute(k,attrs[k]);if(dx||dy)g.setAttribute("transform","translate("+dx+" "+dy+")");
    rows.forEach(r=>{const t=mk(r);if(strokeK)t.setAttribute("stroke-width",(r.s*strokeK).toFixed(1));g.appendChild(t)});return g};
  const clip=document.createElementNS(NS,"clipPath");clip.id=o.id;rows.forEach(r=>clip.appendChild(mk(r)));svg.querySelector("defs").appendChild(clip);
  const sh=rows[0].s*0.058;
  const art=svg.querySelector("#art");
  svg.insertBefore(layer({fill:o.shadow},sh,sh),art);
  svg.insertBefore(layer({fill:"none",stroke:"#121212","stroke-linejoin":"round"},sh,sh,0.026),art);
  art.setAttribute("clip-path","url(#"+o.id+")");
  svg.appendChild(layer({fill:"none",stroke:"#121212","stroke-linejoin":"round"},0,0,0.026));
  svg.appendChild(layer({fill:"none",stroke:"#FFFFFF","stroke-linejoin":"round",opacity:".6"},-sh*0.18,-sh*0.18,0.011));
  return y-o.gap;
}`;

const page = (W, H, art, script) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:"Rye";src:url(${font("rye", "rye-latin-400-normal.woff2")})}
@font-face{font-family:"Pinyon Script";src:url(${font("pinyon-script", "pinyon-script-latin-400-normal.woff2")})}
html,body{margin:0;background:transparent} svg{display:block}</style></head><body>
<svg id="s" xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs></defs><g id="art">${art}</g></svg>
<script>${LAYOUT}
document.fonts.load('100px Rye').then(()=>document.fonts.load('100px "Pinyon Script"')).then(()=>{${script};document.body.dataset.ready=1})</script></body></html>`;

// Tee silhouettes for previews: front shows the GM on the wearer's left chest, back shows the saying.
const TEE = "M 330 90 Q 600 190 870 90 L 1150 230 L 1080 520 L 960 480 L 960 1340 Q 600 1380 240 1340 L 240 480 L 120 520 L 50 230 Z";
const mockHTML = (shirt, frontPng, backPng, label) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:"Rye";src:url(${font("rye", "rye-latin-400-normal.woff2")})}
html,body{margin:0;background:#ECEAE4}</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1500" viewBox="0 0 2400 1500">
  <g><path d="${TEE}" fill="${shirt}" stroke="#000" stroke-width="4"/><path d="M 470 120 Q 600 200 730 120" fill="none" stroke="#000" stroke-width="6"/>
     <image href="${frontPng}" x="${600 + 75}" y="300" width="125" height="125"/></g>
  <g transform="translate(1200 0)"><path d="${TEE}" fill="${shirt}" stroke="#000" stroke-width="4"/><path d="M 470 112 Q 600 136 730 112" fill="none" stroke="#000" stroke-width="6"/>
     <image href="${backPng}" x="390" y="250" width="420" height="560"/></g>
  <text x="600" y="1450" text-anchor="middle" font-family="Rye" font-size="44" fill="#5A4E60">FRONT</text>
  <text x="1800" y="1450" text-anchor="middle" font-family="Rye" font-size="44" fill="#5A4E60">BACK · ${label}</text>
</svg><script>document.fonts.ready.then(()=>document.body.dataset.ready=1)</script></body></html>`;

const browser = await chromium.launch();
async function render(html, file, w, h, transparent = true) {
  mkdirSync(dirname(file), { recursive: true });
  const tmp = file + ".tmp.html";
  writeFileSync(tmp, html);
  const p = await browser.newPage({ viewport: { width: w, height: h } });
  await p.goto(pathToFileURL(tmp).href);
  await p.waitForSelector("body[data-ready]", { timeout: 60000 });
  await p.screenshot({ path: file, omitBackground: transparent });
  await p.close();
  execFileSync("rm", [tmp]);
  if (transparent) execFileSync("convert", [file, "-units", "PixelsPerInch", "-density", "300", file]);
}

// Front left chest: "GM" at 1200 × 1200 (4 × 4 in).
const gmFile = join(out, "gm-left-chest.png");
await render(page(1200, 1200, artSheet(1200, 1200, 1.15),
  `inked(document.getElementById("s"),["GM"],{id:"c",cx:600,top:0,width:1080,maxSize:1300,maxHeight:1120,gap:0,center:true,shadow:"${CANDY.lavender}"})`),
  gmFile, 1200, 1200);

// Back prints: stacked saying + the gold tagline, 3600 × 4800 (12 × 16 in).
for (const s of SAYINGS) {
  const dir = join(out, s.slug), back = join(dir, "back-print.png");
  await render(page(3600, 4800, artSheet(3600, 4800, 1.9), `
    const svg=document.getElementById("s");
    const bottom=inked(svg,${JSON.stringify(s.lines)},{id:"c",cx:1800,top:120,width:3300,maxSize:1150,maxHeight:3900,gap:110,center:false,shadow:"${CANDY.lavender}"});
    const t=document.createElementNS("http://www.w3.org/2000/svg","text");
    t.setAttribute("x","1800");t.setAttribute("y",(bottom+330).toFixed(0));t.setAttribute("text-anchor","middle");
    t.setAttribute("font-family","Pinyon Script");t.setAttribute("font-size","170");t.setAttribute("fill","${CANDY.gold}");
    t.textContent="We hope to always Giggleyou Viciously";svg.appendChild(t);`),
    back, 3600, 4800);
  await render(mockHTML("#1C1C1E", pathToFileURL(gmFile).href, pathToFileURL(back).href, s.lines.join(" / ")), join(dir, "mockup.png"), 2400, 1500, false);
  console.log("built", s.slug);
}
await browser.close();
