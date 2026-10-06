// Classic 05: the proven "favorite people" family tee look (heather black tee, distressed white print,
// centered stack of small caps / big condensed caps / script / huge condensed caps) with original
// GiggleMe family lines. The brand goes on the inside neck label (printful-pack.mjs).
// Run: npm install && node classic-05.mjs   → ../classic-05/<design>/ and ../previews/classic-05-concepts.jpg
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "..", "classic-05");
const font = (pkg, file) => pathToFileURL(join(here, "node_modules/@fontsource", pkg, "files", file)).href;

const FONTS = `
@font-face{font-family:"Barlow Condensed";font-weight:700;src:url(${font("barlow-condensed", "barlow-condensed-latin-700-normal.woff2")})}
@font-face{font-family:"Barlow Condensed";font-weight:800;src:url(${font("barlow-condensed", "barlow-condensed-latin-800-normal.woff2")})}
@font-face{font-family:"Yellowtail";src:url(${font("yellowtail", "yellowtail-latin-400-normal.woff2")})}`;

// Four lines like the original: small caps, big caps, script, huge caps.
export const DESIGNS = [
  { slug: "01-my-best-title-is-still-papa", lines: ["MY BEST", "TITLE", "is still", "PAPA"],
    why: "Same warm brag about the name the family gives him, said our way. Easy Father's Day and birthday gift." },
  { slug: "02-what-i-do-best-is-grandpa", lines: ["WHAT I DO", "BEST", "is being", "GRANDPA"],
    why: "Opens the grandpa market, the biggest gift-buyer group for this style." },
  { slug: "03-my-greatest-job-title-dad", lines: ["MY GREATEST", "JOB", "title ever", "DAD"],
    why: "Work joke plus dad pride. Sells to new dads and to kids buying for Dad." },
  { slug: "04-blessed-enough-to-be-pops", lines: ["BLESSED", "ENOUGH", "to be", "POPS"],
    why: "Heartfelt and short. Pops is a name many grandpas actually go by, so buyers search for it." },
  { slug: "05-they-say-grumpy-i-say-grampy", lines: ["THEY SAY", "GRUMPY", "I say", "GRAMPY"],
    why: "The funny one of the set. The rhyme lands in one read and suits the grumpy-grandpa gift crowd." },
];

// Print canvas: Printful's tee front, 12 × 16 in at 300 DPI, same as the other series.
const PW = 3600, PH = 4800, CX = PW / 2, TEXT_W = 3000, TEXT_H = 3700, TOP = 260;
const INK = { dark: "#FFFFFF", light: "#151515" };

// Worn, speckled ink like the original: two noise layers punch holes through the letters.
const DISTRESS = `<defs><filter id="distress" filterUnits="userSpaceOnUse" x="0" y="0" width="${PW}" height="${PH}">
  <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="4" seed="21" result="big"/>
  <feColorMatrix in="big" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  13 0 0 0 -8.3" result="blotches"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.16" numOctaves="2" seed="7" result="fine"/>
  <feColorMatrix in="fine" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  16 0 0 0 -10.4" result="specks"/>
  <feMerge result="holes"><feMergeNode in="blotches"/><feMergeNode in="specks"/></feMerge>
  <feComposite in="SourceGraphic" in2="holes" operator="out"/>
</filter></defs>`;

const caps = `font-family="Barlow Condensed" font-weight="700" letter-spacing="4"`;
const art = (d, v) => {
  const [small, big, script, huge] = d.lines.map((l) => l.replace(/'/g, "’"));
  return `${DISTRESS}
  <g filter="url(#distress)"><g id="block" text-anchor="middle" fill="${INK[v]}">
    <text id="l0" x="0" ${caps} font-size="200">${small}</text>
    <text id="l1" x="0" ${caps} font-size="200">${big}</text>
    <text id="l2" x="0" font-family="Yellowtail" font-size="200">${script}</text>
    <text id="l3" x="0" ${caps} font-size="200">${huge}</text>
  </g></g>`;
};

// Size each line in a 1000-unit-wide block, stack them, then scale the block onto the canvas.
// Big and huge lines fill the width like PEOPLE and PAPA do, capped so short words don't balloon;
// the last line always stays the biggest.
const LAYOUT = `
const el = (i) => document.getElementById("l" + i), w = (i) => el(i).getBBox().width;
const fit = (i, max) => Math.min(1000 / w(i) * 200, max);
const s3 = fit(3, 680), s1 = Math.min(fit(1, 460), s3 / 1.2);
el(1).setAttribute("font-size", s1); el(3).setAttribute("font-size", s3);
const wb = Math.max(w(1), w(3));
const sizes = [Math.min(wb * 0.88 / w(0) * 200, s1 * 0.42), s1, Math.min(wb * 0.66 / w(2) * 200, s1 * 0.75), s3];
sizes.forEach((s, i) => el(i).setAttribute("font-size", s));
const gaps = [0, 22, -2, 0];
let y = 0;
for (let i = 0; i < 4; i++) {
  el(i).setAttribute("y", 0);
  const bb = el(i).getBBox(), top = i === 2 ? bb.y + bb.height * 0.12 : bb.y;
  el(i).setAttribute("y", y + gaps[i] - top);
  y = y + gaps[i] + (bb.y + bb.height - top) * (i === 2 ? 0.86 : 1);
}
const b = document.getElementById("block"), bb = b.getBBox(), k = Math.min(${TEXT_W} / bb.width, ${TEXT_H} / bb.height);
b.setAttribute("transform", "translate(${CX} " + (${TOP} - bb.y * k) + ") scale(" + k + ")");`;

const html = (body, w, h, bg, script = "") => `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS} html,body{margin:0;background:${bg}} svg{display:block}</style></head><body>
<svg id="art" xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>
<script>document.fonts.ready.then(()=>{${script};document.body.dataset.ready=1})</script></body></html>`;

// Heather black tee like the reference photo, plus navy and white.
const TEE = "M 330 90 Q 600 190 870 90 L 1150 230 L 1080 520 L 960 480 L 960 1340 Q 600 1380 240 1340 L 240 480 L 120 520 L 50 230 Z";
const SHIRTS = {
  "heather-black": { fill: "#26262A", stroke: "#0E0E10", ink: "dark", heather: 0.2 },
  navy: { fill: "#1E2A44", stroke: "#0F172A", ink: "dark", heather: 0.1 },
  white: { fill: "#F6F5F1", stroke: "#CFCBC2", ink: "light", heather: 0.05 },
};
const HEATHER = `<defs><filter id="heather" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.9 0.25" numOctaves="2" seed="4"/>
  <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.6 -0.55"/>
  <feComposite in2="SourceGraphic" operator="in"/></filter></defs>`;
const tee = (print, s, x = 0, y = 0, k = 1) => `
<g transform="translate(${x} ${y}) scale(${k})">
  <path d="${TEE}" fill="${s.fill}" stroke="${s.stroke}" stroke-width="4"/>
  <path d="${TEE}" fill="#fff" filter="url(#heather)" opacity="${s.heather}"/>
  <path d="M 470 120 Q 600 200 730 120" fill="none" stroke="${s.stroke}" stroke-width="6"/>
  <image href="${pathToFileURL(print).href}" x="330" y="240" width="540" height="720" preserveAspectRatio="xMidYMin meet"/>
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
  await p.waitForTimeout(300);
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

// Contact sheet: all five on heather black.
const cw = 900, ch = 1120;
const cells = DESIGNS.map((d, i) => `
  ${tee(join(out, d.slug, "print-dark-shirts.png"), SHIRTS["heather-black"], i * cw + 30, 30, 0.7)}
  <text x="${i * cw + cw / 2}" y="1070" text-anchor="middle" font-family="Barlow Condensed" font-weight="800" font-size="44" fill="#222">${i + 1}. ${d.lines.join(" ").toUpperCase()}</text>`).join("");
await render(html(HEATHER + cells, cw * DESIGNS.length, ch, "#ECEAE4"), resolve(here, "..", "previews", "classic-05-concepts.jpg"), cw * DESIGNS.length, ch);

await browser.close();
console.log("Built", DESIGNS.length, "classic-05 designs →", out);
