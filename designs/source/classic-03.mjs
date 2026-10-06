// Classic 03: the proven turkey face tee (big flat cartoon face, googly eyes, orange beak, red snood,
// no text, brown tee) with an original GiggleMe twist on the face. The brand goes on the inside neck label
// (printful-pack.mjs). Run: npm install && node classic-03.mjs → ../classic-03/<design>/ and ../classic-03/classic-03-concepts.jpg
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "..", "classic-03");
const font = (pkg, file) => pathToFileURL(join(here, "node_modules/@fontsource", pkg, "files", file)).href;
const FONTS = `@font-face{font-family:"Barlow Condensed";font-weight:800;src:url(${font("barlow-condensed", "barlow-condensed-latin-800-normal.woff2")})}`;

// Flat colors close to the original print.
const C = { ink: "#141414", white: "#FFFFFF", beak: "#FF7B2E", leg: "#F2602A", red: "#E2302E", sweat: "#8FD8FF" };

// Eyes: centers, white radius, and the dark rim that sits behind and slightly outside each one.
const EYES = [{ x: 1310, y: 1130, rim: [-40, 40] }, { x: 2290, y: 1090, rim: [40, 40] }];
const R = 590, RIM = 640;

const pupil = (x, y, r = 235) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.ink}"/><circle cx="${x - r * 0.36}" cy="${y - r * 0.42}" r="${r * 0.3}" fill="${C.white}"/>`;
// A heavy lid: dark fill over the top of the eye down to `cut`, with a gently curved edge.
const lid = (e, cut, tilt = 0) =>
  `<path d="M ${e.x - R - 20} ${e.y - R - 20} L ${e.x + R + 20} ${e.y - R - 20} L ${e.x + R + 20} ${e.y + cut + tilt} Q ${e.x} ${e.y + cut + 90} ${e.x - R - 20} ${e.y + cut - tilt} Z" fill="${C.ink}"/>`;

// Each twist only changes what sits inside the eyes, plus at most one small extra on the face.
export const DESIGNS = [
  { slug: "01-nervous-turkey", name: "Nervous Turkey",
    why: "Pupils dart to the side and one bead of sweat rolls down. The turkey knows what's for dinner. Same face, instant story.",
    eyes: [(e) => pupil(e.x - 250, e.y + 60, 215), (e) => pupil(e.x - 250, e.y + 60, 215)],
    extra: `<path d="M 2985 760 C 3060 900 3120 980 3120 1060 A 135 135 0 1 1 2850 1060 C 2850 980 2910 900 2985 760 Z" fill="${C.sweat}"/>
      <ellipse cx="2925" cy="1060" rx="34" ry="62" fill="${C.white}" transform="rotate(20 2925 1060)"/>` },
  { slug: "02-undercover-turkey", name: "Undercover Turkey",
    why: "A stick-on mustache so nobody recognizes him on Thanksgiving. One added shape, big laugh.",
    eyes: [(e) => pupil(e.x + 110, e.y + 70), (e) => pupil(e.x - 110, e.y + 70)],
    extra: `<path d="M 1810 2010 C 1700 1930 1500 1930 1380 2020 C 1290 2090 1170 2090 1110 2010 C 1130 2190 1330 2240 1480 2170 C 1600 2120 1720 2080 1810 2110
      C 1900 2080 2020 2120 2140 2170 C 2290 2240 2490 2190 2510 2010 C 2450 2090 2330 2090 2240 2020 C 2120 1930 1920 1930 1810 2010 Z" fill="${C.ink}"/>` },
  { slug: "03-food-coma-turkey", name: "Food Coma Turkey",
    why: "Heavy eyelids, pupils sinking. It's how everyone looks after the second plate, so the whole table gets it.",
    eyes: [(e) => pupil(e.x + 60, e.y + 300, 210) + lid(e, 110, -30), (e) => pupil(e.x - 60, e.y + 300, 210) + lid(e, 110, 30)] },
  { slug: "04-suspicious-turkey", name: "Suspicious Turkey",
    why: "Side-eye under one raised brow. Reads as 'I saw you sharpen that knife.'",
    eyes: [(e) => pupil(e.x + 280, e.y + 40, 220) + lid(e, -170, -60), (e) => pupil(e.x + 280, e.y + 40, 220) + lid(e, -330, 40)],
    extra: `<path d="M 840 380 Q 1300 430 1740 600" fill="none" stroke="${C.ink}" stroke-width="120" stroke-linecap="round"/>
      <path d="M 1880 360 Q 2300 180 2760 300" fill="none" stroke="${C.ink}" stroke-width="120" stroke-linecap="round"/>` },
  { slug: "05-winking-turkey", name: "Winking Turkey",
    why: "One cheeky wink. The friendliest version, good for kids, families and matching group shirts.",
    eyes: [(e) => `<path d="M ${e.x - 330} ${e.y + 40} Q ${e.x} ${e.y - 230} ${e.x + 330} ${e.y + 40}" fill="none" stroke="${C.ink}" stroke-width="120" stroke-linecap="round"/>`,
      (e) => pupil(e.x - 110, e.y + 70)] },
];

// Print canvas: 12 × 16 in at 300 DPI, same as the other series.
const PW = 3600, PH = 4800, TOP = 150;

const face = (d, v) => {
  // On light shirts the beak and snood get the same dark edge the eyes already have, so they don't wash out.
  const edge = v === "light" ? `stroke="${C.ink}" stroke-width="28" stroke-linejoin="round"` : "";
  const eyes = EYES.map((e, i) => `
    <circle cx="${e.x + e.rim[0]}" cy="${e.y + e.rim[1]}" r="${RIM}" fill="${C.ink}"/>
    <clipPath id="eye${i}"><circle cx="${e.x}" cy="${e.y}" r="${R}"/></clipPath>
    <circle cx="${e.x}" cy="${e.y}" r="${R}" fill="${C.white}" ${v === "light" ? `stroke="${C.ink}" stroke-width="28"` : ""}/>
    <g clip-path="url(#eye${i})">${d.eyes[i](e)}</g>`).join("");
  const snood = `
    <path d="M 1600 2100 C 1420 2320 1350 2750 1380 3180" fill="none" stroke="${v === "light" ? C.ink : "none"}" stroke-width="300" stroke-linecap="round"/>
    <path d="M 1600 2100 C 1420 2320 1350 2750 1380 3180" fill="none" stroke="${C.red}" stroke-width="260" stroke-linecap="round"/>
    <path d="M 1820 2350 C 1860 2650 1890 2900 1860 3100" fill="none" stroke="${v === "light" ? C.ink : "none"}" stroke-width="280" stroke-linecap="round"/>
    <path d="M 1820 2350 C 1860 2650 1890 2900 1860 3100" fill="none" stroke="${C.leg}" stroke-width="240" stroke-linecap="round"/>`;
  const beak = `
    <path d="M 1000 2010 Q 1420 1760 1810 1760 Q 2220 1760 2640 1980 Q 2330 2060 2110 2130 L 1870 2660 Q 1820 2730 1775 2660 L 1550 2160 Q 1290 2070 1000 2010 Z" fill="${C.beak}" ${edge}/>
    <path d="M 1990 1900 Q 2010 2050 1955 2330 Q 1935 2120 1945 1900 Z" fill="${C.white}"/>`;
  return `<g id="block">${eyes}${snood}${beak}${d.extra || ""}</g>`;
};
// One fixed scale for every twist so the face is the same size on all five (extras like brows don't shrink it).
const K = 1.25;
const place = (body) => `<g transform="translate(${PW / 2 - 1800 * K} ${TOP - 100 * K}) scale(${K})">${body}</g>`;

const html = (body, w, h, bg, script = "") => `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS} html,body{margin:0;background:${bg}} svg{display:block}</style></head><body>
<svg id="art" xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>
<script>document.fonts.ready.then(()=>{${script};document.body.dataset.ready=1})</script></body></html>`;

const TEE = "M 330 90 Q 600 190 870 90 L 1150 230 L 1080 520 L 960 480 L 960 1340 Q 600 1380 240 1340 L 240 480 L 120 520 L 50 230 Z";
const SHIRTS = {
  brown: { fill: "#4A2C1E", stroke: "#2E1A11", ink: "dark" },
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
  <path d="${TEE}" fill="#fff" filter="url(#heather)" opacity="${s.ink === "dark" ? 0.08 : 0.05}"/>
  <path d="M 470 120 Q 600 200 730 120" fill="none" stroke="${s.stroke}" stroke-width="6"/>
  <image href="${pathToFileURL(print).href}" x="300" y="210" width="600" height="800" preserveAspectRatio="xMidYMin meet"/>
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
    await render(html(place(face(d, v)), PW, PH, "transparent"), join(dir, `print-${v}-shirts.png`), PW, PH,
      { transparent: true, dpi: true, svgOut: join(dir, `design-${v}-shirts.svg`) });
  }
  for (const [name, s] of Object.entries(SHIRTS)) {
    await render(html(HEATHER + tee(join(dir, `print-${s.ink}-shirts.png`), s), 1200, 1400, "#ECEAE4"), join(dir, `mockup-${name}.png`), 1200, 1400);
  }
}

// Contact sheet: all five on the brown tee, like the original.
const cw = 900, ch = 1120;
const cells = DESIGNS.map((d, i) => `
  ${tee(join(out, d.slug, "print-dark-shirts.png"), SHIRTS.brown, i * cw + 30, 30, 0.7)}
  <text x="${i * cw + cw / 2}" y="1070" text-anchor="middle" font-family="Barlow Condensed" font-weight="800" font-size="44" fill="#222">${i + 1}. ${d.name}</text>`).join("");
await render(html(HEATHER + cells, cw * DESIGNS.length, ch, "#ECEAE4"), join(out, "classic-03-concepts.jpg"), cw * DESIGNS.length, ch);

await browser.close();
console.log("Built", DESIGNS.length, "classic-03 designs →", out);
