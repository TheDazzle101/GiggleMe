// Classic 04: the proven fishing-excuse hoodie look (distressed gold print on a navy pullover: arched
// condensed caps, a big sun circle with an angler fishing from the end of a dock knocked out of it, and a
// script punchline underneath) with original GiggleMe fishing puns. The brand goes on the inside neck
// label (printful-pack.mjs).
// Run: npm install && node classic-04.mjs → ../classic-04/<design>/ and ../classic-04/classic-04-concepts.jpg
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "..", "classic-04");
const font = (pkg, file) => pathToFileURL(join(here, "node_modules/@fontsource", pkg, "files", file)).href;

const FONTS = `
@font-face{font-family:"Barlow Condensed";font-weight:700;src:url(${font("barlow-condensed", "barlow-condensed-latin-700-normal.woff2")})}
@font-face{font-family:"Barlow Condensed";font-weight:800;src:url(${font("barlow-condensed", "barlow-condensed-latin-800-normal.woff2")})}
@font-face{font-family:"Yellowtail";src:url(${font("yellowtail", "yellowtail-latin-400-normal.woff2")})}`;

// The joke is always the same shape as the proven seller: a flat excuse in caps up top, then the
// fishing pun that explains it in script. None of these is the original's phrase.
export const DESIGNS = [
  { slug: "01-i-pulled-a-mussel", top: "CALLING IN SICK", script: ["I pulled", "A mussel"],
    name: "I Pulled a Mussel",
    why: "The same fake-injury excuse as the proven seller, told with our own pun. Everyone hears 'muscle', then reads it again." },
  { slug: "02-under-the-water", top: "NOT COMING IN TODAY", script: ["I'm feeling", "Under the water"],
    name: "Under the Water",
    why: "Twists 'under the weather', the excuse everybody has already used. Reads as a sick note and a fishing trip at once." },
  { slug: "03-a-reel-emergency", top: "TAKING THE DAY OFF", script: ["It's a reel", "Emergency"],
    name: "A Reel Emergency",
    why: "The reel/real pun is the one fishing joke non-anglers get instantly, so it sells to the gift buyer too." },
  { slug: "04-my-line-is-busy", top: "OUT OF OFFICE", script: ["My line", "Is busy"],
    name: "My Line Is Busy",
    why: "Pure office language doing double duty. The best one for desk workers who fish on weekends." },
  { slug: "05-bass-fever", top: "DOCTOR'S ORDERS", script: ["I've got", "Bass fever"],
    name: "Bass Fever",
    why: "Names the fish, so bass anglers claim it as theirs. 'Doctor's orders' keeps the sick-day gag." },
];

// Print canvas: 12 × 16 in at 300 DPI, same as the other series.
const PW = 3600, PH = 4800;
const CX = 1800, CY = 2380, R = 1000;          // the sun circle
const INK = { dark: "#E9A63E", light: "#15375E" }; // distressed gold on dark shirts, deep navy on light

// Worn, cracked ink like the original: two noise layers punch holes through everything.
const DISTRESS = `<filter id="distress" filterUnits="userSpaceOnUse" x="0" y="0" width="${PW}" height="${PH}">
  <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="4" seed="7" result="big"/>
  <feColorMatrix in="big" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  10 0 0 0 -6.8" result="blotches"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="5" result="fine"/>
  <feColorMatrix in="fine" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  11 0 0 0 -7.6" result="specks"/>
  <feMerge result="holes"><feMergeNode in="blotches"/><feMergeNode in="specks"/></feMerge>
  <feComposite in="SourceGraphic" in2="holes" operator="out"/>
</filter>`;

// The rod and the cast line. Inside the circle they are knocked out; outside they are printed,
// so the rod tip and the top of the line break out past the sun the way the original's does.
const ROD = `M 1958 2404 L 2744 1836`;
const LINE = `M 2744 1836 C 2806 2096 2742 2374 2566 2606`;

// The lake behind him: the horizon splits the sun, then broken ripple lines to the bottom of it.
const LAKE = `
  <path d="M 806 2262 L 2794 2262" stroke-width="14"/>
  <path d="M 2060 2372 L 2600 2372 M 980 2372 L 1420 2372" stroke-width="18"/>
  <path d="M 880 2756 L 1540 2756 M 1690 2756 L 2720 2756
           M 980 2908 L 1700 2908 M 1860 2908 L 2630 2908
           M 1070 3062 L 1840 3062 M 1980 3062 L 2520 3062
           M 1280 3200 L 1860 3200 M 1990 3200 L 2340 3200"
        stroke-width="34" stroke-linecap="round"/>
  <g fill="none" stroke-width="22">
    <path d="M 2452 2624 Q 2566 2670 2680 2624"/><path d="M 2386 2692 Q 2566 2756 2746 2692"/>
  </g>`;

// The dock he is sitting on: deck running out from the left of the sun, posts down into the water.
const DOCK = `
  <path d="M 806 2488 L 1930 2488 L 1930 2572 L 806 2572 Z"/>
  <path d="M 1148 2566 L 1192 2566 L 1192 2700 L 1148 2700 Z M 1638 2566 L 1682 2566 L 1682 2694 L 1638 2694 Z
           M 1840 2566 L 1884 2566 L 1884 2690 L 1840 2690 Z"/>`;

// The angler, seated at the end of the dock in a ball cap, legs hanging over the edge.
const ANGLER = `
  <circle cx="1818" cy="2196" r="76"/>
  <path d="M 1748 2168 A 78 78 0 0 1 1894 2156 L 1902 2176 L 1996 2192 L 1888 2212 Z"/>
  <path d="M 1800 2258 L 1812 2300" stroke-width="54" stroke-linecap="round"/>
  <path d="M 1796 2298 C 1764 2360 1766 2440 1788 2500 L 1872 2498 C 1878 2428 1872 2344 1856 2286 Z"/>
  <path d="M 1800 2496 L 1944 2520" stroke-width="66" stroke-linecap="round"/>
  <path d="M 1944 2520 L 1962 2706 M 1962 2706 L 2026 2716" stroke-width="52" stroke-linecap="round"/>
  <path d="M 1792 2502 L 1912 2534" stroke-width="58" stroke-linecap="round"/>
  <path d="M 1912 2534 L 1926 2714 M 1926 2714 L 1986 2724" stroke-width="46" stroke-linecap="round"/>
  <path d="M 1820 2318 L 1888 2378" stroke-width="48" stroke-linecap="round"/>
  <path d="M 1888 2378 L 1966 2402" stroke-width="42" stroke-linecap="round"/>`;

const art = (d, v) => `<defs>
  ${DISTRESS}
  <mask id="knock" maskUnits="userSpaceOnUse" x="0" y="0" width="${PW}" height="${PH}">
    <circle cx="${CX}" cy="${CY}" r="${R}" fill="#fff"/>
    <g fill="#000" stroke="#000">${DOCK}<g transform="translate(1850 2560) scale(1.16) translate(-1850 -2560)">${ANGLER}</g><g fill="none" stroke-linecap="butt">${LAKE}</g>
      <path d="${ROD}" fill="none" stroke-width="40" stroke-linecap="round"/>
      <path d="${LINE}" fill="none" stroke-width="26"/></g>
  </mask>
  <mask id="outside" maskUnits="userSpaceOnUse" x="0" y="0" width="${PW}" height="${PH}">
    <rect width="${PW}" height="${PH}" fill="#fff"/><circle cx="${CX}" cy="${CY}" r="${R}" fill="#000"/>
  </mask>
  <path id="arc" d="M ${CX - 1460} ${CY} A 1460 1460 0 0 1 ${CX + 1460} ${CY}"/>
</defs>
<g filter="url(#distress)" fill="${INK[v]}">
  <circle cx="${CX}" cy="${CY}" r="${R}" mask="url(#knock)"/>
  <g mask="url(#outside)" fill="none" stroke="${INK[v]}" stroke-linecap="round">
    <path d="${ROD}" stroke-width="40"/><path d="${LINE}" stroke-width="26"/>
  </g>
  <text id="top" font-family="Barlow Condensed" font-weight="700" font-size="300">
    <textPath href="#arc" startOffset="50%" text-anchor="middle">${d.top.replace(/'/g, "’")}</textPath></text>
  <g id="punch" font-family="Yellowtail" font-size="300" text-anchor="middle">
    ${d.script.map((l, i) => `<text x="0" y="${i * 330}">${l.replace(/'/g, "’")}</text>`).join("")}
  </g>
</g>`;

// Fit the arched line into the arch, then drop the script punchline under the circle.
const LAYOUT = `
const t = document.getElementById("top"), tp = t.firstElementChild;
const natural = tp.getComputedTextLength(), k = Math.min(2620 / natural, 1.2);
t.setAttribute("font-size", 300 * k);
tp.setAttribute("textLength", natural * k);
const p = document.getElementById("punch"), bb = p.getBBox(), s = Math.min(2680 / bb.width, 1.3);
p.setAttribute("transform", "translate(${CX} " + (3560 - bb.y * s) + ") scale(" + s + ")");`;

const html = (body, w, h, bg, script = "") => `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS} html,body{margin:0;background:${bg}} svg{display:block}</style></head><body>
<svg id="art" xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>
<script>document.fonts.ready.then(()=>{${script};document.body.dataset.ready=1})</script></body></html>`;

// Pullover hoodie like the reference photo: hood, raglan-ish sleeves, cuffs, kangaroo pocket.
const HOOD = "M 392 352 C 352 92 848 92 808 352 Q 600 424 392 352 Z";
const HOOD_IN = "M 432 338 C 452 196 748 196 768 338 Q 600 404 432 338 Z";
const BODY = "M 400 316 Q 600 402 800 316 L 905 352 C 1010 392 1055 470 1078 570 L 1150 900 L 1148 986 L 960 1004 L 952 908 L 905 662 L 930 1252 Q 600 1304 270 1252 L 295 662 L 248 908 L 240 1004 L 52 986 L 50 900 L 122 570 C 145 470 190 392 295 352 Z";
const POCKET = "M 352 1000 L 848 1000 Q 866 1110 862 1196 L 338 1196 Q 334 1110 352 1000 Z";
const SHIRTS = {
  navy: { fill: "#1E2A46", stroke: "#131C31", ink: "dark" },
  black: { fill: "#1B1B1D", stroke: "#000000", ink: "dark" },
  white: { fill: "#F6F5F1", stroke: "#CFCBC2", ink: "light" },
};
const HEATHER = `<defs><filter id="heather" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.9 0.25" numOctaves="2" seed="4"/>
  <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.6 -0.55"/>
  <feComposite in2="SourceGraphic" operator="in"/></filter></defs>`;
const hoodie = (print, s, x = 0, y = 0, k = 1) => `
<g transform="translate(${x} ${y}) scale(${k})">
  <path d="${HOOD}" fill="${s.fill}" stroke="${s.stroke}" stroke-width="4"/>
  <path d="${HOOD_IN}" fill="${s.stroke}" opacity="0.55"/>
  <path d="${BODY}" fill="${s.fill}" stroke="${s.stroke}" stroke-width="4"/>
  <path d="${BODY}" fill="#fff" filter="url(#heather)" opacity="${s.ink === "dark" ? 0.07 : 0.04}"/>
  <image href="${pathToFileURL(print).href}" x="382" y="402" width="436" height="581" preserveAspectRatio="xMidYMin meet"/>
  <path d="${POCKET}" fill="none" stroke="${s.stroke}" stroke-width="5" opacity="0.75"/>
  <g stroke="${s.ink === "dark" ? "#E8E4DC" : "#B9B4AA"}" stroke-width="9" stroke-linecap="round" fill="none">
    <path d="M 548 362 L 540 508"/><path d="M 656 362 L 664 504"/></g>
  <g fill="none" stroke="${s.stroke}" stroke-width="4" opacity="0.8">
    <path d="M 926 1206 Q 600 1258 274 1206"/><path d="M 1148 986 L 960 1004"/><path d="M 52 986 L 240 1004"/></g>
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
    await render(html(HEATHER + hoodie(join(dir, `print-${s.ink}-shirts.png`), s), 1200, 1400, "#ECEAE4"), join(dir, `mockup-${name}.png`), 1200, 1400);
  }
}

// Contact sheet: all five on the navy hoodie.
const cw = 900, ch = 1140;
const cells = DESIGNS.map((d, i) => `
  ${hoodie(join(out, d.slug, "print-dark-shirts.png"), SHIRTS.navy, i * cw + 30, 20, 0.7)}
  <text x="${i * cw + cw / 2}" y="1096" text-anchor="middle" font-family="Barlow Condensed" font-weight="800" font-size="40" fill="#222">${i + 1}. ${d.name}</text>`).join("");
await render(html(HEATHER + cells, cw * DESIGNS.length, ch, "#ECEAE4"), join(out, "classic-04-concepts.jpg"), cw * DESIGNS.length, ch);

await browser.close();
console.log("Built", DESIGNS.length, "classic-04 designs →", out);
