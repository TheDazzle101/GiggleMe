// Gamer 01: five original takes on the proven "gamer who'd rather be playing" tee
// (a top seller on royal blue heather with big white condensed text).
// Same buyer and gift moment, but each design adds a visual gag the plain-text original lacks.
// Run: npm install && node gamer.mjs   → ../gamer-01/<design>/ and ../previews/gamer-01-concepts.png
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { wordmarkAt } from "./brandmark.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "..", "gamer-01");
const font = (pkg, file) => pathToFileURL(join(here, "node_modules/@fontsource", pkg, "files", file)).href;

const FONTS = `
@font-face{font-family:"Barlow Condensed";font-weight:800;src:url(${font("barlow-condensed", "barlow-condensed-latin-800-normal.woff2")})}
@font-face{font-family:"Press Start 2P";src:url(${font("press-start-2p", "press-start-2p-latin-400-normal.woff2")})}
@font-face{font-family:"Yellowtail";src:url(${font("yellowtail", "yellowtail-latin-400-normal.woff2")})}`;

// Auto-size every text[data-w] to exactly that width.
const FIT = `
document.querySelectorAll("text[data-w]").forEach(t => {
  const target = +t.dataset.w, fs = parseFloat(t.getAttribute("font-size"));
  const w = t.getBBox().width; if (w > 0) t.setAttribute("font-size", (fs * target / w).toFixed(1));
});`;

const W = 4500, H = 5400, CX = W / 2, L = 450, R = W - 450, TW = R - L;

// "dark" = white ink for royal blue, black, navy and charcoal shirts. "light" = dark ink for white and sand.
const palette = (v) => v === "dark"
  ? { fg: "#FFFFFF", sub: "#D9E1FF", hot: "#FFD23F", red: "#FF5A6E", ink: "#111111" }
  : { fg: "#141414", sub: "#4A4A4A", hot: "#E0A100", red: "#E23B52", ink: "#FFFFFF" };

const HEAD = `font-family="Barlow Condensed" font-weight="800"`;
const PIX = `font-family="'Press Start 2P'"`;
const tag = (y) => wordmarkAt(CX, y, 700);

// A little 8-bit heart, drawn on a 7 × 6 pixel grid.
const heart = (x, y, px, fill) => {
  const rows = [".XX.XX.", "XXXXXXX", "XXXXXXX", ".XXXXX.", "..XXX..", "...X..."];
  return rows.flatMap((r, j) => [...r].map((c, i) => c === "X"
    ? `<rect x="${x + i * px}" y="${y + j * px}" width="${px + 1}" height="${px + 1}" fill="${fill}"/>` : "")).join("");
};

export const DESIGNS = [
  {
    slug: "01-left-a-boss-fight",
    title: "I Left a Boss Fight for This",
    pitch: "Same joke as the original, higher stakes: the boss is at 3% health.",
    svg: (p) => `
      <text x="${L}" y="420" ${PIX} font-size="130" fill="${p.fg}">FINAL BOSS</text>
      <text x="${R}" y="420" text-anchor="end" ${PIX} font-size="130" fill="${p.red}">HP 3%</text>
      <rect x="${L}" y="520" width="${TW}" height="300" fill="none" stroke="${p.fg}" stroke-width="60"/>
      <rect x="${L + 75}" y="595" width="${TW * 0.03}" height="150" fill="${p.red}"/>
      <text x="${CX}" y="2200" data-w="${TW}" text-anchor="middle" ${HEAD} font-size="800" fill="${p.fg}">I LEFT A</text>
      <text x="${CX}" y="3100" data-w="${TW}" text-anchor="middle" ${HEAD} font-size="800" fill="${p.hot}">BOSS FIGHT</text>
      <text x="${CX}" y="4000" data-w="${TW}" text-anchor="middle" ${HEAD} font-size="800" fill="${p.fg}">FOR THIS</text>
      <text x="${CX}" y="4450" data-w="${TW * 0.8}" text-anchor="middle" ${PIX} font-size="120" fill="${p.sub}">PROGRESS NOT SAVED.</text>
      ${tag(4950)}`,
  },
  {
    slug: "02-cant-pause-its-online",
    title: "I Can't Pause. It's Online.",
    pitch: "The line every gamer has yelled at a parent. Big crossed-out pause icon reads from across a room.",
    svg: (p) => `
      <g transform="translate(${CX} 1450)">
        <circle r="820" fill="none" stroke="${p.fg}" stroke-width="130"/>
        <rect x="-330" y="-430" width="230" height="860" rx="40" fill="${p.fg}"/>
        <rect x="100" y="-430" width="230" height="860" rx="40" fill="${p.fg}"/>
        <line x1="-580" y1="-580" x2="580" y2="580" stroke="${p.red}" stroke-width="150" stroke-linecap="round"/>
      </g>
      <text x="${CX}" y="3330" data-w="${TW}" text-anchor="middle" ${HEAD} font-size="800" fill="${p.fg}">I CAN'T PAUSE.</text>
      <text x="${CX}" y="4230" data-w="${TW * 0.86}" text-anchor="middle" ${HEAD} font-size="800" fill="${p.hot}">IT'S ONLINE.</text>
      ${tag(4850)}`,
  },
  {
    slug: "03-side-quest-accepted",
    title: "Side Quest Accepted",
    pitch: "A retro RPG quest box for family events, weddings and holidays. The reward line is the punchline.",
    svg: (p) => {
      const top = 1450, bh = 2650;
      return `
      <text x="${CX}" y="1150" data-w="${TW}" text-anchor="middle" ${HEAD} font-size="800" fill="${p.fg}">SIDE QUEST</text>
      <rect x="${L}" y="${top}" width="${TW}" height="${bh}" fill="none" stroke="${p.fg}" stroke-width="60"/>
      <rect x="${L + 110}" y="${top + 110}" width="${TW - 220}" height="${bh - 220}" fill="none" stroke="${p.fg}" stroke-width="25"/>
      <text x="${L + 280}" y="${top + 480}" ${PIX} font-size="170" fill="${p.hot}">NEW QUEST:</text>
      <text x="${L + 280}" y="${top + 820}" ${PIX} font-size="200" fill="${p.fg}">Show up to the</text>
      <text x="${L + 280}" y="${top + 1100}" ${PIX} font-size="200" fill="${p.fg}">family thing.</text>
      <text x="${L + 280}" y="${top + 1550}" ${PIX} font-size="130" fill="${p.sub}">REWARD: free food</text>
      <text x="${L + 280}" y="${top + 1800}" ${PIX} font-size="130" fill="${p.sub}">XP: +0</text>
      <polygon points="${L + 380},${top + 2120} ${L + 380},${top + 2320} ${L + 520},${top + 2220}" fill="${p.hot}"/>
      <text x="${L + 600}" y="${top + 2295}" ${PIX} font-size="150" fill="${p.fg}">ACCEPT</text>
      <text x="${L + 2150}" y="${top + 2295}" ${PIX} font-size="150" fill="${p.sub}" opacity="0.55">DECLINE</text>
      <line x1="${L + 2130}" y1="${top + 2230}" x2="${L + 3270}" y2="${top + 2230}" stroke="${p.sub}" stroke-width="30" opacity="0.55"/>
      <text x="${CX}" y="4500" data-w="${TW * 0.62}" text-anchor="middle" ${PIX} font-size="120" fill="${p.sub}">(NOT BY CHOICE)</text>
      ${tag(4950)}`;
    },
  },
  {
    slug: "04-afk-against-my-will",
    title: "AFK Against My Will",
    pitch: "The minimalist one: a giant pixel AFK. Cheapest to print, easiest to read in a thumbnail.",
    svg: (p) => `
      <text x="${CX}" y="1000" data-w="${TW * 0.78}" text-anchor="middle" ${PIX} font-size="120" fill="${p.sub}">STATUS:</text>
      <text x="${CX}" y="2500" data-w="${TW}" text-anchor="middle" ${PIX} font-size="1000" fill="${p.fg}">AFK</text>
      <text x="${CX}" y="3700" data-w="${TW}" text-anchor="middle" ${HEAD} font-size="800" fill="${p.hot}">AGAINST MY WILL</text>
      <text x="${CX}" y="4200" data-w="${TW * 0.8}" text-anchor="middle" ${PIX} font-size="120" fill="${p.sub}">away from keyboard</text>
      ${tag(4800)}`,
  },
  {
    slug: "05-player-2-dragged-me-here",
    title: "Player 2 Dragged Me Here",
    pitch: "Date-night and couples angle. Sells to the partner who buys the gift, and sets up a matching Player 1 tee.",
    svg: (p) => {
      // Simple game-controller line drawing.
      const pad = `
        <g transform="translate(${CX} 1350)" fill="none" stroke="${p.fg}" stroke-width="110" stroke-linejoin="round" stroke-linecap="round">
          <path d="M -900 -330 L 900 -330 Q 1230 -330 1330 80 L 1450 600 Q 1500 900 1220 900 Q 1050 900 880 560 L -880 560 Q -1050 900 -1220 900 Q -1500 900 -1450 600 L -1330 80 Q -1230 -330 -900 -330 Z"/>
          <path d="M -870 -80 L -870 320 M -1070 120 L -670 120"/>
          <circle cx="760" cy="0" r="85" fill="${p.hot}" stroke="none"/>
          <circle cx="960" cy="200" r="85" fill="${p.red}" stroke="none"/>
        </g>`;
      return `${pad}
      ${heart(CX - 245, 1150, 70, p.red)}
      <text x="${CX}" y="3150" data-w="${TW}" text-anchor="middle" ${HEAD} font-size="800" fill="${p.hot}">PLAYER 2</text>
      <text x="${CX}" y="4050" data-w="${TW}" text-anchor="middle" ${HEAD} font-size="800" fill="${p.fg}">DRAGGED ME HERE</text>
      ${tag(4800)}`;
    },
  },
];

// T-shirt silhouette for mockups (1200 × 1400), with a heather texture like the reference tee.
const TEE = "M 330 90 Q 600 190 870 90 L 1150 230 L 1080 520 L 960 480 L 960 1340 Q 600 1380 240 1340 L 240 480 L 120 520 L 50 230 Z";
const SHIRTS = {
  royal: { fill: "#2D56C4", stroke: "#1A3584", ink: "dark", name: "Royal Blue Heather" },
  black: { fill: "#1C1C1E", stroke: "#000", ink: "dark", name: "Black" },
  white: { fill: "#F6F5F1", stroke: "#CFCBC2", ink: "light", name: "White" },
};
const teeSvg = (print, s, x = 0, y = 0, k = 1) => `
<g transform="translate(${x} ${y}) scale(${k})">
  <path d="${TEE}" fill="${s.fill}" stroke="${s.stroke}" stroke-width="4"/>
  <path d="${TEE}" fill="#fff" filter="url(#heather)" opacity="${s.ink === "dark" ? 0.13 : 0.05}"/>
  <path d="M 470 120 Q 600 200 730 120" fill="none" stroke="${s.stroke}" stroke-width="6"/>
  <image href="${pathToFileURL(print).href}" x="360" y="240" width="480" height="640" preserveAspectRatio="xMidYMin meet"/>
</g>`;
const HEATHER = `<defs><filter id="heather" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.9 0.25" numOctaves="2" seed="4"/>
  <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.6 -0.55"/>
  <feComposite in2="SourceGraphic" operator="in"/></filter></defs>`;
const doc = (w, h, body, bg) => `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS} html,body{margin:0;background:${bg}} svg{display:block}</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${HEATHER}${body}</svg>
<script>document.fonts.ready.then(()=>{${FIT};document.body.dataset.ready=1})</script></body></html>`;
const printPage = (svg) => `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS} html,body{margin:0;background:transparent} svg{display:block}</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" width="3600" height="4800" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMin meet">${svg}</svg>
<script>document.fonts.ready.then(()=>{${FIT};document.body.dataset.ready=1})</script></body></html>`;

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const ctx = await browser.newContext({ deviceScaleFactor: 1 });

async function render(html, file, w, h, transparent, dpi = true) {
  mkdirSync(dirname(file), { recursive: true });
  const tmp = file.replace(/\.(png|jpg)$/, ".tmp.html");
  writeFileSync(tmp, html);
  const p = await ctx.newPage();
  await p.setViewportSize({ width: w, height: h });
  await p.goto(pathToFileURL(tmp).href);
  await p.waitForSelector("body[data-ready]");
  if (!transparent) await p.waitForTimeout(300);
  await p.screenshot({ path: file, omitBackground: transparent, clip: { x: 0, y: 0, width: w, height: h }, ...(file.endsWith(".jpg") ? { type: "jpeg", quality: 90 } : {}) });
  await p.close();
  execFileSync("rm", [tmp]);
  if (dpi) execFileSync("convert", [file, "-units", "PixelsPerInch", "-density", "300", file]);
}

// Print files (3600 × 4800 px at 300 DPI, transparent), editable SVGs and mockups.
for (const d of DESIGNS) {
  const dir = join(out, d.slug);
  for (const v of ["dark", "light"]) {
    await render(printPage(d.svg(palette(v))), join(dir, `print-${v}-shirts.png`), 3600, 4800, true);
    writeFileSync(join(dir, `design-${v}-shirts.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">${d.svg(palette(v))}</svg>\n`);
  }
  for (const [name, s] of Object.entries(SHIRTS)) {
    await render(doc(1200, 1400, teeSvg(join(dir, `print-${s.ink}-shirts.png`), s), "#ECEAE4"), join(dir, `mockup-${name}.png`), 1200, 1400, false, false);
  }
}

// One contact sheet: all five on royal blue heather, the reference tee's color.
const cw = 900, ch = 1150, sheetW = cw * DESIGNS.length, sheetH = ch;
const cells = DESIGNS.map((d, i) => `
  ${teeSvg(join(out, d.slug, "print-dark-shirts.png"), SHIRTS.royal, i * cw + 30, 40, 0.7)}
  <text x="${i * cw + cw / 2}" y="1080" text-anchor="middle" font-family="Barlow Condensed" font-weight="800" font-size="46" fill="#222">${i + 1}. ${d.title.toUpperCase()}</text>`).join("");
await render(doc(sheetW, sheetH, cells, "#ECEAE4"), resolve(here, "..", "previews", "gamer-01-concepts.jpg"), sheetW, sheetH, false, false);

await browser.close();
console.log("Built", DESIGNS.length, "gamer designs →", out);
