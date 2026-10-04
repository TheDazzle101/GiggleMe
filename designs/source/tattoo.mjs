// Traditional tattoo-flash GiggleMe concepts → ../previews/logo-tattoo.png
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const font = (pkg, file) => pathToFileURL(join(here, "node_modules/@fontsource", pkg, "files", file)).href;

export const INK = {
  black: "#121212", red: "#C8102E", redDark: "#7E0A1C", green: "#1F7A4D", greenDark: "#11492D",
  yellow: "#F2B830", teal: "#2A9D8F", tealDark: "#1B6A61", cream: "#F4E9D3", creamDark: "#D9C7A2", white: "#FFFDF6",
};
const K = INK;
const f = (n) => (+n).toFixed(1);

// ---- Flash primitives (all with heavy black outlines) ------------------------------

export function leaf(x, y, r, deg) {
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${deg})">
    <path d="M 0 0 Q ${r * 0.9} ${-r * 0.55} ${r * 1.75} 0 Q ${r * 0.9} ${r * 0.55} 0 0 Z" fill="${K.green}" stroke="${K.black}" stroke-width="${r * 0.09}" stroke-linejoin="round"/>
    <path d="M ${r * 0.15} 0 Q ${r * 0.9} ${-r * 0.08} ${r * 1.5} 0" fill="none" stroke="${K.greenDark}" stroke-width="${r * 0.06}"/>
    <path d="M ${r * 0.5} ${-r * 0.25} Q ${r * 0.9} ${-r * 0.4} ${r * 1.2} ${-r * 0.25}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="${r * 0.05}" stroke-linecap="round"/>
  </g>`;
}

export function rose(x, y, r, leaves = [150, 30]) {
  const w = r * 0.1;
  return `${leaves.map((d) => leaf(x, y, r, d)).join("")}
  <g transform="translate(${f(x)} ${f(y)})">
    <circle r="${r}" fill="${K.red}" stroke="${K.black}" stroke-width="${w}"/>
    <path d="M ${-r * 0.92} ${r * 0.1} A ${r * 0.92} ${r * 0.92} 0 0 0 ${r * 0.92} ${r * 0.1} Q 0 ${r * 0.45} ${-r * 0.92} ${r * 0.1} Z" fill="${K.redDark}" opacity=".55"/>
    <g fill="none" stroke="${K.black}" stroke-width="${w * 0.8}" stroke-linecap="round">
      <path d="M ${-r * 0.78} ${-r * 0.05} Q ${-r * 0.62} ${r * 0.68} 0 ${r * 0.72} Q ${r * 0.62} ${r * 0.68} ${r * 0.78} ${-r * 0.05}"/>
      <path d="M ${-r * 0.56} ${-r * 0.22} Q ${-r * 0.36} ${r * 0.38} ${r * 0.1} ${r * 0.32} Q ${r * 0.5} ${r * 0.22} ${r * 0.56} ${-r * 0.3}"/>
      <path d="M ${-r * 0.62} ${-r * 0.3} Q ${-r * 0.3} ${-r * 0.78} ${r * 0.15} ${-r * 0.64} Q ${r * 0.56} ${-r * 0.52} ${r * 0.62} ${-r * 0.24}"/>
      <path d="M ${-r * 0.2} ${-r * 0.26} Q ${-r * 0.04} ${-r * 0.46} ${r * 0.2} ${-r * 0.3} Q ${r * 0.3} ${-r * 0.08} ${r * 0.04} 0 Q ${-r * 0.16} ${r * 0.02} ${-r * 0.1} ${-r * 0.16}"/>
    </g>
    <g fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="${w * 0.55}" stroke-linecap="round">
      <path d="M ${-r * 0.48} ${-r * 0.48} Q ${-r * 0.3} ${-r * 0.66} ${-r * 0.08} ${-r * 0.66}"/>
      <path d="M ${-r * 0.6} ${r * 0.2} Q ${-r * 0.5} ${r * 0.42} ${-r * 0.3} ${r * 0.5}"/>
    </g>
  </g>`;
}

export function nauticalStar(x, y, r, accent = K.red, deg = 0) {
  const pt = (a, rr) => [rr * Math.cos(a), rr * Math.sin(a)];
  const parts = [];
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    const [tx, ty] = pt(a, r), [lx, ly] = pt(a - Math.PI / 5, r * 0.42), [rx, ry] = pt(a + Math.PI / 5, r * 0.42);
    parts.push(`<path d="M 0 0 L ${f(tx)} ${f(ty)} L ${f(lx)} ${f(ly)} Z" fill="${K.black}"/>`, `<path d="M 0 0 L ${f(tx)} ${f(ty)} L ${f(rx)} ${f(ry)} Z" fill="${accent}"/>`);
  }
  const outline = Array.from({ length: 10 }, (_, i) => pt(-Math.PI / 2 + (i * Math.PI) / 5, i % 2 ? r * 0.42 : r)).map((p, i) => `${i ? "L" : "M"} ${f(p[0])} ${f(p[1])}`).join(" ") + " Z";
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${deg})">${parts.join("")}<path d="${outline}" fill="none" stroke="${K.black}" stroke-width="${r * 0.08}" stroke-linejoin="round"/></g>`;
}

export function heart(x, y, s) {
  const d = `M 0 ${s * 0.9} C ${-s * 0.2} ${s * 0.7} ${-s * 1.1} ${s * 0.2} ${-s} ${-s * 0.35} C ${-s * 0.95} ${-s * 0.85} ${-s * 0.3} ${-s} 0 ${-s * 0.55} C ${s * 0.3} ${-s} ${s * 0.95} ${-s * 0.85} ${s} ${-s * 0.35} C ${s * 1.1} ${s * 0.2} ${s * 0.2} ${s * 0.7} 0 ${s * 0.9} Z`;
  return `<g transform="translate(${f(x)} ${f(y)})">
    <path d="${d}" fill="${K.red}"/>
    <path d="M 0 ${s * 0.9} C ${s * 0.2} ${s * 0.7} ${s * 1.1} ${s * 0.2} ${s} ${-s * 0.35} C ${s * 0.95} ${-s * 0.85} ${s * 0.3} ${-s} ${s * 0.12} ${-s * 0.66} C ${s * 0.6} ${-s * 0.4} ${s * 0.55} ${s * 0.35} 0 ${s * 0.9} Z" fill="${K.redDark}" opacity=".45"/>
    <path d="${d}" fill="none" stroke="${K.black}" stroke-width="${s * 0.07}" stroke-linejoin="round"/>
    <path d="M ${-s * 0.78} ${-s * 0.3} Q ${-s * 0.75} ${-s * 0.72} ${-s * 0.42} ${-s * 0.76}" fill="none" stroke="#fff" stroke-width="${s * 0.06}" stroke-linecap="round" opacity=".85"/>
  </g>`;
}

export function dagger(x, y, len, deg) {
  const w = len * 0.06;
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${deg})" stroke="${K.black}" stroke-width="${w * 0.35}" stroke-linejoin="round">
    <path d="M 0 ${-len * 0.5} L ${w} ${-len * 0.38} L ${w} ${len * 0.15} L ${-w} ${len * 0.15} L ${-w} ${-len * 0.38} Z" fill="#DDE3E8"/>
    <path d="M 0 ${-len * 0.47} L 0 ${len * 0.13}" stroke-width="${w * 0.2}"/>
    <path d="M ${-w * 0.2} ${-len * 0.3} L ${-w * 0.2} ${len * 0.1}" stroke="#fff" stroke-width="${w * 0.25}"/>
    <path d="M ${-w * 3.4} ${len * 0.15} Q 0 ${len * 0.12} ${w * 3.4} ${len * 0.15} L ${w * 3.1} ${len * 0.2} Q 0 ${len * 0.18} ${-w * 3.1} ${len * 0.2} Z" fill="${K.yellow}"/>
    <rect x="${-w * 0.8}" y="${len * 0.2}" width="${w * 1.6}" height="${len * 0.22}" fill="${K.black}"/>
    ${[0, 1, 2, 3].map((i) => `<path d="M ${-w * 0.8} ${len * (0.23 + i * 0.05)} L ${w * 0.8} ${len * (0.25 + i * 0.05)}" stroke="#555" stroke-width="${w * 0.2}"/>`).join("")}
    <circle cx="0" cy="${len * 0.47}" r="${w * 1.3}" fill="${K.yellow}"/>
  </g>`;
}

export function banner(cx, cy, w, h, curve, fill = K.cream, text = "", font = "", size = 0, color = K.black) {
  const sw = h * 0.07, y0 = -h / 2 + h * 0.42, y1 = h / 2 + h * 0.42, ex = w / 2;
  const tail = (s) => `<path d="M ${s * (ex - 40)} ${y0} L ${s * (ex + h)} ${y0} L ${s * (ex + h * 0.68)} ${(y0 + y1) / 2} L ${s * (ex + h)} ${y1} L ${s * (ex - 40)} ${y1} Z" fill="${K.creamDark}" stroke="${K.black}" stroke-width="${sw}" stroke-linejoin="round"/>
    <path d="M ${s * ex} ${h / 2 - curve * 0.15} L ${s * (ex - 40)} ${y1} L ${s * (ex - 40)} ${h / 2 - curve * 0.1} Z" fill="${K.black}"/>`;
  return `<g transform="translate(${f(cx)} ${f(cy)})">${tail(-1)}${tail(1)}
    <path d="M ${-ex} ${-h / 2} Q 0 ${-h / 2 - curve} ${ex} ${-h / 2} L ${ex} ${h / 2} Q 0 ${h / 2 - curve} ${-ex} ${h / 2} Z" fill="${fill}" stroke="${K.black}" stroke-width="${sw}" stroke-linejoin="round"/>
    <path d="M ${-ex + 30} ${-h / 2 + 22} Q 0 ${-h / 2 - curve + 22} ${ex - 30} ${-h / 2 + 22}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="${sw * 0.6}"/>
    ${text ? `<text x="0" y="${size * 0.32 - curve * 0.45}" text-anchor="middle" font-family="${font}" font-size="${size}" fill="${color}">${text}</text>` : ""}
  </g>`;
}

export function flames(x0, x1, yb, hMax) {
  const n = Math.round((x1 - x0) / 110), out = [];
  for (let i = 0; i < n; i++) {
    const x = x0 + ((i + 0.5) * (x1 - x0)) / n, h = hMax * (0.6 + 0.4 * Math.abs(Math.sin(i * 1.7))), s = (i % 2 ? 1 : -1) * 40;
    out.push(`<path d="M ${f(x - 70)} ${yb} C ${f(x - 80)} ${f(yb - h * 0.5)} ${f(x + s)} ${f(yb - h * 0.6)} ${f(x + s * 0.6)} ${f(yb - h)} C ${f(x + 90)} ${f(yb - h * 0.55)} ${f(x + 80)} ${f(yb - h * 0.3)} ${f(x + 70)} ${yb} Z" fill="${K.red}" stroke="${K.black}" stroke-width="12" stroke-linejoin="round"/>`);
    out.push(`<path d="M ${f(x - 32)} ${yb} C ${f(x - 36)} ${f(yb - h * 0.35)} ${f(x + s * 0.3)} ${f(yb - h * 0.4)} ${f(x + s * 0.25)} ${f(yb - h * 0.62)} C ${f(x + 42)} ${f(yb - h * 0.35)} ${f(x + 38)} ${f(yb - h * 0.2)} ${f(x + 32)} ${yb} Z" fill="${K.yellow}"/>`);
  }
  return out.join("");
}

export function bolt(x, y, s, deg = 0) {
  return `<path transform="translate(${f(x)} ${f(y)}) rotate(${deg})" d="M ${-s * 0.15} ${-s} L ${s * 0.45} ${-s} L ${s * 0.1} ${-s * 0.15} L ${s * 0.45} ${-s * 0.15} L ${-s * 0.3} ${s} L ${-s * 0.05} ${s * 0.1} L ${-s * 0.4} ${s * 0.1} Z" fill="${K.yellow}" stroke="${K.black}" stroke-width="${s * 0.08}" stroke-linejoin="round"/>`;
}

// Grinning skull with one fang: the "vicious giggle".
export function skull(x, y, s) {
  const teeth = Array.from({ length: 8 }, (_, i) => {
    const tx = -s * 0.56 + i * s * 0.16;
    return `<path d="M ${f(tx)} ${f(s * 0.62)} L ${f(tx)} ${f(s * (i === 5 ? 0.98 : 0.86))}" stroke="${K.black}" stroke-width="${s * 0.04}"/>`;
  }).join("");
  return `<g transform="translate(${f(x)} ${f(y)})" stroke-linejoin="round">
    <path d="M ${-s} ${-s * 0.1} C ${-s * 1.05} ${-s * 1.25} ${s * 1.05} ${-s * 1.25} ${s} ${-s * 0.1} C ${s} ${s * 0.28} ${s * 0.78} ${s * 0.36} ${s * 0.72} ${s * 0.6} L ${-s * 0.72} ${s * 0.6} C ${-s * 0.78} ${s * 0.36} ${-s} ${s * 0.28} ${-s} ${-s * 0.1} Z" fill="${K.cream}" stroke="${K.black}" stroke-width="${s * 0.07}"/>
    <path d="M ${-s * 0.7} ${s * 0.58} Q 0 ${s * 0.5} ${s * 0.7} ${s * 0.58} L ${s * 0.6} ${s * 1.02} Q 0 ${s * 1.18} ${-s * 0.6} ${s * 1.02} Z" fill="${K.cream}" stroke="${K.black}" stroke-width="${s * 0.07}"/>
    <path d="M ${-s * 0.62} ${s * 0.72} Q 0 ${s * 1.0} ${s * 0.62} ${s * 0.72} L ${s * 0.58} ${s * 0.86} Q 0 ${s * 1.1} ${-s * 0.58} ${s * 0.86} Z" fill="${K.black}"/>
    ${teeth}
    <path d="M ${s * 0.22} ${s * 0.7} L ${s * 0.34} ${s * 0.7} L ${s * 0.28} ${s * 1.0} Z" fill="${K.white}" stroke="${K.black}" stroke-width="${s * 0.03}"/>
    <path d="M ${-s * 0.62} ${-s * 0.22} Q ${-s * 0.35} ${-s * 0.48} ${-s * 0.1} ${-s * 0.2} Q ${-s * 0.2} ${s * 0.12} ${-s * 0.42} ${s * 0.1} Q ${-s * 0.66} ${s * 0.06} ${-s * 0.62} ${-s * 0.22} Z" fill="${K.black}"/>
    <path d="M ${s * 0.62} ${-s * 0.22} Q ${s * 0.35} ${-s * 0.48} ${s * 0.1} ${-s * 0.2} Q ${s * 0.2} ${s * 0.12} ${s * 0.42} ${s * 0.1} Q ${s * 0.66} ${s * 0.06} ${s * 0.62} ${-s * 0.22} Z" fill="${K.black}"/>
    <circle cx="${-s * 0.38}" cy="${-s * 0.1}" r="${s * 0.07}" fill="${K.red}"/><circle cx="${s * 0.38}" cy="${-s * 0.1}" r="${s * 0.07}" fill="${K.red}"/>
    <path d="M 0 ${s * 0.18} L ${-s * 0.1} ${s * 0.38} L ${s * 0.1} ${s * 0.38} Z" fill="${K.black}"/>
    <path d="M ${-s * 0.75} ${-s * 0.62} Q ${-s * 0.5} ${-s * 0.9} ${-s * 0.15} ${-s * 0.88}" fill="none" stroke="#fff" stroke-width="${s * 0.05}" stroke-linecap="round" opacity=".9"/>
    <path d="M ${s * 0.55} ${-s * 0.6} L ${s * 0.4} ${-s * 0.45} M ${s * 0.68} ${-s * 0.4} L ${s * 0.55} ${-s * 0.3}" stroke="${K.black}" stroke-width="${s * 0.03}" stroke-linecap="round"/>
  </g>`;
}

// ---- Concepts -----------------------------------------------------------------------

const W = 2600, H = 1500;
const paper = `<rect width="${W}" height="${H}" fill="${K.cream}"/><rect width="${W}" height="${H}" fill="url(#grain)" opacity=".35"/>`;

const CONCEPTS = [
  {
    name: "1 · Heart & Dagger",
    note: "Classic tattoo flash: dagger through a heart, roses, and GiggleMe on a scroll.",
    svg: `${paper}
      ${nauticalStar(230, 230, 110, K.teal, 12)}${nauticalStar(2370, 230, 110, K.teal, -12)}
      ${dagger(1300, 610, 1000, 200)}
      ${heart(1300, 600, 350)}
      ${banner(1300, 880, 1440, 270, 60, K.cream, "GiggleMe", "Yesteryear", 250, K.black)}
      ${rose(520, 900, 165, [200, 250])}${rose(2080, 900, 165, [-20, -70])}
      ${banner(1300, 1230, 1500, 150, 30, K.black, "WE HOPE TO ALWAYS GIGGLEYOU VICIOUSLY", "Rye", 58, K.cream)}`,
  },
  {
    name: "2 · Inked Letters",
    note: "The letters themselves are tattooed: roses, flames, stars and lightning inked inside.",
    svg: (() => {
      const art = `
        <rect x="0" y="0" width="${W}" height="${H}" fill="${K.teal}"/>
        ${Array.from({ length: 9 }, (_, i) => `<path d="M ${i * 320 - 60} 420 q 80 -60 160 0 t 160 0" fill="none" stroke="${K.tealDark}" stroke-width="16"/>`).join("")}
        ${flames(0, W, 1000, 360)}
        ${[260, 700, 1180, 1660, 2120].map((x, i) => rose(x, 600 + (i % 2) * 70, 120, [140, 30])).join("")}
        ${[480, 940, 1420, 1900, 2380].map((x, i) => nauticalStar(x, 400 + (i % 2) * 260, 70, K.red, i * 9)).join("")}
        ${[120, 1050, 2000].map((x) => bolt(x, 700, 90, 15)).join("")}`;
      const T = `<text x="1300" y="900" text-anchor="middle" font-family="Rye" font-size="380" letter-spacing="0">GIGGLEME</text>`;
      return `<rect width="${W}" height="${H}" fill="${K.black}"/><rect width="${W}" height="${H}" fill="url(#grain)" opacity=".15"/>
        <defs><clipPath id="word">${T}</clipPath></defs>
        <g transform="translate(22 22)" fill="${K.red}">${T}</g>
        <g clip-path="url(#word)">${art}</g>
        <g fill="none" stroke="${K.black}" stroke-width="10" stroke-linejoin="round">${T}</g>
        <g fill="none" stroke="${K.cream}" stroke-width="5" stroke-linejoin="round" transform="translate(-4 -4)" opacity=".7">${T}</g>
        ${banner(1300, 1170, 1600, 150, 30, K.cream, "WE HOPE TO ALWAYS GIGGLEYOU VICIOUSLY", "Rye", 58, K.black)}`;
    })(),
  },
  {
    name: "3 · Laughing Skull",
    note: "A grinning skull with one fang (the vicious giggle), roses and a script scroll.",
    svg: `<rect width="${W}" height="${H}" fill="#151515"/><rect width="${W}" height="${H}" fill="url(#grain)" opacity=".2"/>
      <g opacity=".95">${flames(800, 1800, 760, 520)}</g>
      ${rose(930, 820, 160, [190, 230])}${rose(1670, 820, 160, [-10, -50])}
      ${skull(1300, 470, 330)}
      ${banner(1300, 1000, 1500, 280, 60, K.cream, "GiggleMe", "Yesteryear", 260, K.red)}
      <text x="1300" y="1330" text-anchor="middle" font-family="Rye" font-size="58" letter-spacing="4" fill="${K.cream}">WE HOPE TO ALWAYS GIGGLEYOU VICIOUSLY</text>
      ${nauticalStar(300, 300, 100, K.red, 10)}${nauticalStar(2300, 300, 100, K.red, -10)}`,
  },
];

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:"Yesteryear";src:url(${font("yesteryear", "yesteryear-latin-400-normal.woff2")})}
@font-face{font-family:"Rye";src:url(${font("rye", "rye-latin-400-normal.woff2")})}
@font-face{font-family:"Space Mono";font-weight:700;src:url(${font("space-mono", "space-mono-latin-700-normal.woff2")})}
html,body{margin:0;background:#E9E6DF} .c{margin:0 0 24px} .lab{font:700 34px "Space Mono";color:#222;padding:10px 6px}
.n{font-weight:400;color:#555;font-size:26px}</style></head><body style="padding:24px">
<svg width="0" height="0" style="position:absolute"><defs>
<filter id="grainF"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.2  0 0 0 0 0.15  0 0 0 0 0.1  0 0 0 .5 0"/></filter>
<pattern id="grain" width="400" height="400" patternUnits="userSpaceOnUse"><rect width="400" height="400" filter="url(#grainF)"/></pattern></defs></svg>
${CONCEPTS.map((c) => `<div class="c"><div class="lab">${c.name} <span class="n">${c.note}</span></div>
<svg xmlns="http://www.w3.org/2000/svg" width="${W / 2}" height="${H / 2}" viewBox="0 0 ${W} ${H}" style="display:block;border-radius:18px">${c.svg}</svg></div>`).join("")}
<script>document.fonts.ready.then(()=>document.body.dataset.ready=1)</script></body></html>`;

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const tmp = join(here, "tattoo.tmp.html");
  writeFileSync(tmp, html);
  const browser = await chromium.launch();
  const p = await browser.newPage({ viewport: { width: W / 2 + 48, height: 800 }, deviceScaleFactor: 2 });
  await p.goto(pathToFileURL(tmp).href);
  await p.waitForSelector("body[data-ready]");
  const out = resolve(here, "../previews/logo-tattoo.png");
  await p.screenshot({ path: out, fullPage: true });
  await browser.close();
  execFileSync("rm", [tmp]);
  console.log("Wrote", out);
}
