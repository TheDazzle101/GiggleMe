// Classic 01: the proven top-seller look (big white bold condensed caps, centered, three lines,
// royal blue heather tee) with original GiggleMe phrases. The brand goes on the inside neck label (printful-pack.mjs).
// Run: npm install && node classic.mjs   → ../classic-01/<design>/ and ../previews/classic-01-concepts.jpg
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "..", "classic-01");
const font = (pkg, file) => pathToFileURL(join(here, "node_modules/@fontsource", pkg, "files", file)).href;

const FONTS = `
@font-face{font-family:"Barlow Semi Condensed";font-weight:700;src:url(${font("barlow-semi-condensed", "barlow-semi-condensed-latin-700-normal.woff2")})}
@font-face{font-family:"Barlow Condensed";font-weight:800;src:url(${font("barlow-condensed", "barlow-condensed-latin-800-normal.woff2")})}
@font-face{font-family:"Yellowtail";src:url(${font("yellowtail", "yellowtail-latin-400-normal.woff2")})}`;

export const DESIGNS = [
  { slug: "01-my-controller-thinks-im-coming-back", lines: ["MY CONTROLLER", "THINKS I'M", "COMING BACK"],
    why: "Same 'I'd rather be gaming' joke, told from the controller's side. Short, clean, gift-friendly." },
  { slug: "02-only-here-until-my-update-finishes", lines: ["I'M ONLY HERE", "UNTIL MY GAME", "FINISHES UPDATING"],
    why: "Every gamer has waited on a giant update. Gives a real reason they showed up." },
  { slug: "03-my-squad-thinks-i-rage-quit", lines: ["MY SQUAD", "THINKS I", "RAGE QUIT"],
    why: "Big, short words that read from across a room. Speaks to online multiplayer players." },
  { slug: "04-left-my-team-one-player-down", lines: ["I LEFT MY TEAM", "ONE PLAYER DOWN", "TO BE HERE"],
    why: "Closest in rhythm to the original, ending on the same 'to be here' beat with new stakes." },
  { slug: "05-somewhere-a-lobby-is-waiting", lines: ["SOMEWHERE", "A LOBBY IS", "WAITING FOR ME"],
    why: "A little dramatic and wistful. Funny at weddings, dinners and family events." },
];

// Print canvas: Printful's tee front, 12 × 16 in at 300 DPI.
const PW = 3600, PH = 4800, CX = PW / 2, TEXT_W = 3300, TOP = 260;
const INK = { dark: "#FFFFFF", light: "#151515" };

// Lines at one font size, centered like the original. The browser scales the block to TEXT_W wide
// and parks it at the top of the canvas.
const art = (d, v) => `
  <g id="block" font-family="Barlow Semi Condensed" font-weight="700" font-size="200" text-anchor="middle" fill="${INK[v]}" letter-spacing="2">
    ${d.lines.map((l, i) => `<text x="0" y="${i * 232}">${l.replace(/'/g, "’")}</text>`).join("")}
  </g>`;
const LAYOUT = `
const b = document.getElementById("block"), bb = b.getBBox(), k = ${TEXT_W} / bb.width;
b.setAttribute("transform", "translate(${CX} " + (${TOP} - bb.y * k) + ") scale(" + k + ")");`;

const html = (body, w, h, bg, script = "") => `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS} html,body{margin:0;background:${bg}} svg{display:block}</style></head><body>
<svg id="art" xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>
<script>document.fonts.ready.then(()=>{${script};document.body.dataset.ready=1})</script></body></html>`;

// Royal blue heather tee like the reference photo, plus black and white.
const TEE = "M 330 90 Q 600 190 870 90 L 1150 230 L 1080 520 L 960 480 L 960 1340 Q 600 1380 240 1340 L 240 480 L 120 520 L 50 230 Z";
const SHIRTS = {
  royal: { fill: "#2D56C4", stroke: "#1A3584", ink: "dark" },
  black: { fill: "#1C1C1E", stroke: "#000", ink: "dark" },
  white: { fill: "#F6F5F1", stroke: "#CFCBC2", ink: "light" },
};
const HEATHER = `<defs><filter id="heather" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.9 0.25" numOctaves="2" seed="4"/>
  <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.6 -0.55"/>
  <feComposite in2="SourceGraphic" operator="in"/></filter></defs>`;
const tee = (print, s, x = 0, y = 0, k = 1) => `
<g transform="translate(${x} ${y}) scale(${k})">
  <path d="${TEE}" fill="${s.fill}" stroke="${s.stroke}" stroke-width="4"/>
  <path d="${TEE}" fill="#fff" filter="url(#heather)" opacity="${s.ink === "dark" ? 0.13 : 0.05}"/>
  <path d="M 470 120 Q 600 200 730 120" fill="none" stroke="${s.stroke}" stroke-width="6"/>
  <image href="${pathToFileURL(print).href}" x="360" y="250" width="480" height="640" preserveAspectRatio="xMidYMin meet"/>
</g>`;

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const ctx = await browser.newContext({ deviceScaleFactor: 1 });

async function render(page, file, w, h, { transparent = false, dpi = false, svgOut } = {}) {
  mkdirSync(dirname(file), { recursive: true });
  const tmp = file.replace(/\.(png|jpg)$/, ".tmp.html");
  writeFileSync(tmp, page);
  const p = await ctx.newPage();
  await p.setViewportSize({ width: w, height: h });
  await p.goto(pathToFileURL(tmp).href);
  await p.waitForSelector("body[data-ready]");
  if (!transparent) await p.waitForTimeout(300);
  await p.screenshot({ path: file, omitBackground: transparent, clip: { x: 0, y: 0, width: w, height: h }, ...(file.endsWith(".jpg") ? { type: "jpeg", quality: 90 } : {}) });
  if (svgOut) writeFileSync(svgOut, (await p.$eval("#art", (e) => e.outerHTML)) + "\n");
  await p.close();
  execFileSync("rm", [tmp]);
  if (dpi) execFileSync("convert", [file, "-units", "PixelsPerInch", "-density", "300", file]);
}

for (const d of DESIGNS) {
  const dir = join(out, d.slug);
  for (const v of ["dark", "light"]) {
    await render(html(art(d, v), PW, PH, "transparent", LAYOUT), join(dir, `print-${v}-shirts.png`), PW, PH,
      { transparent: true, dpi: true, svgOut: join(dir, `design-${v}-shirts.svg`) });
  }
  for (const [name, s] of Object.entries(SHIRTS)) {
    await render(html(HEATHER + tee(join(dir, `print-${s.ink}-shirts.png`), s), 1200, 1400, "#ECEAE4"), join(dir, `mockup-${name}.png`), 1200, 1400);
  }
}

// Contact sheet: all five on royal blue heather.
const cw = 900, ch = 1120;
const cells = DESIGNS.map((d, i) => `
  ${tee(join(out, d.slug, "print-dark-shirts.png"), SHIRTS.royal, i * cw + 30, 30, 0.7)}
  <text x="${i * cw + cw / 2}" y="1070" text-anchor="middle" font-family="Barlow Condensed" font-weight="800" font-size="44" fill="#222">${i + 1}. ${d.lines.join(" ")}</text>`).join("");
await render(html(HEATHER + cells, cw * DESIGNS.length, ch, "#ECEAE4"), resolve(here, "..", "previews", "classic-01-concepts.jpg"), cw * DESIGNS.length, ch);

await browser.close();
console.log("Built", DESIGNS.length, "classic designs →", out);
