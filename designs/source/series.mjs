// Series 01: ten stacked sayings in the GiggleMe tattoo-ink style + the "GM" left-chest mark.
// Run: node series.mjs
//   → ../series-01/<nn-slug>/back-print.png   (4500 × 5400 px, 300 DPI = 15 × 18 in oversize back print)
//   → ../series-01/<nn-slug>/mockup.png        (front + back preview, to scale on a size-L tee)
//   → ../series-01/logo-left-chest.png         (1200 px wide, 300 DPI = 4 in, the GiggleMe wordmark)
//   → ../previews/series-01.png                (all ten at a glance)
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { CANDY } from "./brandmark.mjs"; // also switches the tattoo ink to cotton candy
import { INK, rose, nauticalStar, flames, bolt } from "./tattoo.mjs";

// Series 01 ink: the cotton-candy tattoo theme, darkened into gunmetal greys with dusty tints.
export const GUN = {
  base: "#555D68", baseDeep: "#3A4049", haze: "#6A6478", rose: "#9A6A7C", roseDeep: "#6A4656",
  sage: "#5F7A71", sageDeep: "#3E544D", brass: "#9C8C68", shadow: "#2A2E35", gold: CANDY.gold,
};
Object.assign(INK, { red: GUN.rose, redDark: GUN.roseDeep, green: GUN.sage, greenDark: GUN.sageDeep, yellow: GUN.brass, teal: GUN.base, tealDark: GUN.baseDeep });

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
export function artSheet(W, H, k = 1) {
  const parts = [`<rect width="${W}" height="${H}" fill="${GUN.base}"/>`];
  const rowH = 560 * k;
  for (let r = 0, y = 0; y < H + rowH; r++, y += rowH) {
    const kind = r % 3, off = (r % 2) * 220 * k;
    if (kind === 0) {
      for (let x = -off; x < W + 300 * k; x += 330 * k) parts.push(`<path d="M ${x} ${y + 120 * k} q ${80 * k} ${-60 * k} ${165 * k} 0 t ${165 * k} 0" fill="none" stroke="${GUN.baseDeep}" stroke-width="${16 * k}"/>`);
      for (let x = 160 * k - off; x < W + 200 * k; x += 520 * k) parts.push(rose(x, y + 330 * k, 125 * k, [140, 30]));
      for (let x = 420 * k - off; x < W + 200 * k; x += 520 * k) parts.push(nauticalStar(x, y + 200 * k, 70 * k, GUN.haze, (x / k) % 40));
    } else if (kind === 1) {
      parts.push(`<rect y="${y}" width="${W}" height="${rowH}" fill="${GUN.haze}" opacity=".55"/>`);
      parts.push(`<g transform="translate(0 ${y + rowH}) scale(${k})">${flames(-200, W / k + 200, 0, 420)}</g>`);
    } else {
      for (let x = 260 * k - off; x < W + 200 * k; x += 600 * k) parts.push(rose(x, y + 300 * k, 115 * k, [200, -20]));
      for (let x = 0 - off; x < W + 200 * k; x += 600 * k) parts.push(bolt(x, y + 280 * k, 95 * k, 15));
      for (let x = 520 * k - off; x < W + 200 * k; x += 600 * k) parts.push(nauticalStar(x, y + 160 * k, 60 * k, GUN.rose, 12));
    }
  }
  return parts.join("");
}

// The browser lays out each line (measured glyph bounds), then builds the inked layers.
export const LAYOUT = `
// Lays out lines at ONE shared letter size. align "left": every line starts at the same left edge
// (block centered on the canvas); align "center": each line centered. Returns the block's bottom y.
function inked(svg, lines, o){
  const ctx=document.createElement("canvas").getContext("2d"), NS="http://www.w3.org/2000/svg";
  ctx.font='1000px Rye';
  const capH=ctx.measureText("H").actualBoundingBoxAscent;
  const m=lines.map(t=>{const x=ctx.measureText(t);return {t,lx:x.actualBoundingBoxLeft,w:x.actualBoundingBoxLeft+x.actualBoundingBoxRight}});
  const maxW=Math.max(...m.map(r=>r.w)), n=lines.length, gapK=o.gapK??0.24;
  // Biggest size that fits both the width and the height budget.
  const sW=1000*o.width/maxW, sH=1000*o.height/(capH*(n+gapK*(n-1)));
  const s=Math.min(sW,sH,o.maxSize||1e9), cap=capH*s/1000, gap=cap*gapK, blockW=maxW*s/1000;
  const blockH=n*cap+(n-1)*gap, top=o.cy-(blockH+(o.extraBelow||0))/2, left=o.cx-blockW/2;
  const rows=m.map((r,i)=>({t:r.t,s,y:top+cap+i*(cap+gap),x:o.align==="left"?left+r.lx*s/1000:o.cx-r.w*s/2000+r.lx*s/1000}));
  const mk=(r)=>{const t=document.createElementNS(NS,"text");t.textContent=r.t;t.setAttribute("x",r.x.toFixed(1));t.setAttribute("y",r.y.toFixed(1));t.setAttribute("font-family","Rye");t.setAttribute("font-size",r.s.toFixed(1));return t};
  const layer=(attrs,dx,dy,strokeK)=>{const g=document.createElementNS(NS,"g");for(const k in attrs)g.setAttribute(k,attrs[k]);if(dx||dy)g.setAttribute("transform","translate("+dx+" "+dy+")");
    rows.forEach(r=>{const t=mk(r);if(strokeK)t.setAttribute("stroke-width",(r.s*strokeK).toFixed(1));g.appendChild(t)});return g};
  const clip=document.createElementNS(NS,"clipPath");clip.id=o.id;rows.forEach(r=>clip.appendChild(mk(r)));svg.querySelector("defs").appendChild(clip);
  const sh=s*0.058, art=svg.querySelector("#art");
  svg.insertBefore(layer({fill:o.shadow},sh,sh),art);
  svg.insertBefore(layer({fill:"none",stroke:"#121212","stroke-linejoin":"round"},sh,sh,0.026),art);
  art.setAttribute("clip-path","url(#"+o.id+")");
  if(o.outline){
    // Bold outline sits BEHIND the filled letters, so only its outer half shows; a fine dark edge keeps it crisp.
    svg.insertBefore(layer({fill:"none",stroke:o.outline,"stroke-linejoin":"round"},0,0,o.outlineK),art);
    svg.appendChild(layer({fill:"none",stroke:"#121212","stroke-linejoin":"round"},0,0,0.01));
  } else svg.appendChild(layer({fill:"none",stroke:"#121212","stroke-linejoin":"round"},0,0,0.026));
  if(!o.outline)svg.appendChild(layer({fill:"none",stroke:"#FFFFFF","stroke-linejoin":"round",opacity:".6"},-sh*0.18,-sh*0.18,0.011));
  return {bottom:top+blockH, left, size:s};
}`;

export const page = (W, H, art, script) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:"Rye";src:url(${font("rye", "rye-latin-400-normal.woff2")})}
@font-face{font-family:"Pinyon Script";src:url(${font("pinyon-script", "pinyon-script-latin-400-normal.woff2")})}
html,body{margin:0;background:transparent} svg{display:block}</style></head><body>
<svg id="s" xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs></defs><g id="art">${art}</g></svg>
<script>${LAYOUT}
document.fonts.load('100px Rye').then(()=>document.fonts.load('100px "Pinyon Script"')).then(()=>{${script};document.body.dataset.ready=1})</script></body></html>`;

// Tee silhouettes for previews, to scale on a size-L tee (~20 in chest ≈ 720 px → 36 px per inch).
// Front: GM on the wearer's left chest (viewer's right). Back: the 15 × 18 in print below the collar.
const TEE = "M 330 90 Q 600 190 870 90 L 1150 230 L 1080 520 L 960 480 L 960 1340 Q 600 1380 240 1340 L 240 480 L 120 520 L 50 230 Z";
const mockHTML = (shirt, frontPng, backPng) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:"Rye";src:url(${font("rye", "rye-latin-400-normal.woff2")})}
html,body{margin:0;background:#ECEAE4}</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1500" viewBox="0 0 2400 1500">
  <g><path d="${TEE}" fill="${shirt}" stroke="#000" stroke-width="4"/><path d="M 470 120 Q 600 200 730 120" fill="none" stroke="#000" stroke-width="6"/>
     <image href="${frontPng}" x="680" y="300" width="144" height="40"/></g>
  <g transform="translate(1200 0)"><path d="${TEE}" fill="${shirt}" stroke="#000" stroke-width="4"/><path d="M 470 112 Q 600 136 730 112" fill="none" stroke="#000" stroke-width="6"/>
     <image href="${backPng}" x="330" y="190" width="540" height="648"/></g>
  <text x="600" y="1450" text-anchor="middle" font-family="Rye" font-size="44" fill="#5A4E60">FRONT</text>
  <text x="1800" y="1450" text-anchor="middle" font-family="Rye" font-size="44" fill="#5A4E60">BACK</text>
</svg><script>document.fonts.ready.then(()=>document.body.dataset.ready=1)</script></body></html>`;

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
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

// Front left chest: the GiggleMe wordmark with a big G and M, 4 in wide (1200 px at 300 DPI).
const gmFile = join(out, "logo-left-chest.png");
execFileSync("node", [join(here, "chest-logo.mjs")]); // first G and M at double height

// Back prints: the stacked saying at Printful's biggest back size, 4500 × 5400 (15 × 18 in).
// One letter size, every line starts at the same left edge, block centered top to bottom.
for (const s of SAYINGS) {
  const dir = join(out, s.slug), back = join(dir, "back-print.png");
  await render(page(4500, 5400, artSheet(4500, 5400, 2.3), `
    inked(document.getElementById("s"),${JSON.stringify(s.lines)},{id:"c",cx:2250,cy:2700,width:4380,height:5000,align:"left",shadow:"${GUN.shadow}",outline:"${GUN.gold}",outlineK:0.075});`),
    back, 4500, 5400);
  await render(mockHTML("#1C1C1E", pathToFileURL(gmFile).href, pathToFileURL(back).href), join(dir, "mockup.png"), 2400, 1500, false);
  console.log("built", s.slug);
}
await browser.close();
}
