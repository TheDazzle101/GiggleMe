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

// Set B helpers: the classic cartoon turkey tail fan, pixel "deal with it" shades and a pilgrim hat.
const FEATHERS = ["#C8372D", "#F08A24", "#F2C14E", "#C8372D", "#F2C14E", "#F08A24", "#C8372D"];
const fan = (v) => {
  const edge = v === "light" ? `stroke="${C.ink}" stroke-width="24"` : "";
  return [-84, -56, -28, 0, 28, 56, 84].map((a, i) => {
    const c = FEATHERS[i], inner = c === "#F2C14E" ? "#F08A24" : "#F2C14E";
    return `<g transform="rotate(${a} 1800 1300)">
      <ellipse cx="1800" cy="${1300 - 800}" rx="330" ry="800" fill="${c}" ${edge}/>
      <ellipse cx="1800" cy="${1300 - 1000}" rx="200" ry="560" fill="${inner}"/>
      <ellipse cx="1800" cy="${1300 - 1150}" rx="85" ry="330" fill="#7A3B1A"/></g>`;
  }).join("");
};
// Pixel shades, 24 cells wide. "#" is black, "w" is a white glint pixel.
const SHADES = ["########################", "##ww#########ww#########",
  ".##ww######..##ww######.", "..##ww####....##ww####..", "...######......######..."];
const shades = (x0 = 540, y0 = 860, rot = 0, cw = 105, ch = 150) =>
  `<g transform="rotate(${rot} 1800 ${y0 + 250})">${SHADES.flatMap((row, r) => [...row].map((p, c) =>
    p === "." ? "" : `<rect x="${x0 + c * cw - 1}" y="${y0 + r * ch - 1}" width="${cw + 2}" height="${ch + 2}" fill="${p === "w" ? C.white : C.ink}"/>`)).join("")}</g>`;
const PILGRIM = `<path d="M 1200 640 L 1330 -260 L 2270 -260 L 2400 640 Z" fill="${C.ink}"/>
  <rect x="1240" y="380" width="1120" height="190" fill="#6B4A2E"/>
  <rect x="1640" y="330" width="320" height="290" rx="24" fill="none" stroke="#F2C14E" stroke-width="60"/>
  <ellipse cx="1800" cy="660" rx="1050" ry="150" fill="${C.ink}"/>`;
const classicEyes = [(e) => pupil(e.x + 110, e.y + 70), (e) => pupil(e.x - 110, e.y + 70)];

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
  // Set B (Dazzle, 2026-10-06): closer to the original, plainly a Thanksgiving turkey, some in pixel shades.
  { slug: "06-classic-gobbler", name: "Classic Gobbler", set: "b", k: 0.98, top: -560,
    why: "The original face with a big red, orange and gold tail fan behind it. Nobody can mistake it for anything but a Thanksgiving turkey.",
    eyes: classicEyes, back: fan },
  { slug: "07-cool-turkey", name: "Cool Turkey", set: "b",
    why: "The original face in pixel 'deal with it' shades. A meme everyone knows, no words needed.",
    eyes: classicEyes, extra: () => shades() },
  { slug: "08-cool-gobbler", name: "Cool Gobbler", set: "b", k: 0.98, top: -560,
    why: "Pixel shades plus the tail fan: the meme laugh and an instant 'that's a turkey' from across the room.",
    eyes: classicEyes, back: fan, extra: () => shades() },
  { slug: "09-deal-with-it-turkey", name: "Deal With It Turkey", set: "b", k: 0.98, top: -560,
    why: "The shades slide down his beak and his eyes peek over the top. Same fan, a bit more attitude.",
    eyes: [(e) => pupil(e.x + 60, e.y - 120, 220), (e) => pupil(e.x - 60, e.y - 120, 220)], back: fan, extra: () => shades(540, 1240, -5) },
  { slug: "10-pilgrim-turkey", name: "Pilgrim Turkey", set: "b", k: 1.15, top: -330,
    why: "The original face under a black pilgrim hat with a gold buckle. Says Thanksgiving before anyone reads a thing.",
    eyes: classicEyes, extra: () => PILGRIM },
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
  const x = (f) => (typeof f === "function" ? f(v) : f || "");
  return `<g id="block">${x(d.back)}${eyes}${snood}${beak}${x(d.extra)}</g>`;
};
// A fixed scale per design (not fit-to-bounds) so brows or a sweat drop don't shrink the face. Designs with the
// tail fan or hat use a smaller scale or a higher top (`top` = the source y that lands at the top of the print).
const place = (body, { k = 1.25, top = 100 } = {}) => `<g transform="translate(${PW / 2 - 1800 * k} ${TOP - top * k}) scale(${k})">${body}</g>`;

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
    await render(html(place(face(d, v), d), PW, PH, "transparent"), join(dir, `print-${v}-shirts.png`), PW, PH,
      { transparent: true, dpi: true, svgOut: join(dir, `design-${v}-shirts.svg`) });
  }
  for (const [name, s] of Object.entries(SHIRTS)) {
    await render(html(HEATHER + tee(join(dir, `print-${s.ink}-shirts.png`), s), 1200, 1400, "#ECEAE4"), join(dir, `mockup-${name}.png`), 1200, 1400);
  }
}

// Contact sheets on the brown tee, like the original: set A (1–5) and set B (6–10).
const cw = 900, ch = 1120;
for (const [set, file] of [[undefined, "classic-03-concepts.jpg"], ["b", "classic-03-concepts-b.jpg"]]) {
  const row = DESIGNS.filter((d) => d.set === set);
  const cells = row.map((d, i) => `
  ${tee(join(out, d.slug, "print-dark-shirts.png"), SHIRTS.brown, i * cw + 30, 30, 0.7)}
  <text x="${i * cw + cw / 2}" y="1070" text-anchor="middle" font-family="Barlow Condensed" font-weight="800" font-size="44" fill="#222">${parseInt(d.slug)}. ${d.name}</text>`).join("");
  await render(html(HEATHER + cells, cw * row.length, ch, "#ECEAE4"), join(out, file), cw * row.length, ch);
}

await browser.close();
console.log("Built", DESIGNS.length, "classic-03 designs →", out);
