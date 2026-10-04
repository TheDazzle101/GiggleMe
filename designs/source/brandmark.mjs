// The official GiggleMe wordmark: tattoo-inked letters in cotton-candy colors.
// wordmark(id) returns SVG in a 2600-wide space; the letters sit at about x 160–2480, y 600–935.
import { INK, rose, nauticalStar, flames, bolt } from "./tattoo.mjs";

export const CANDY = {
  pink: "#FF9EC7", pinkDeep: "#F06AA8", blue: "#9FD3F7", blueDeep: "#64AEE3",
  lavender: "#C9B1F5", mint: "#9EE6CF", mintDeep: "#5FBFA0", lemon: "#FFF1A0",
  gold: "#B8955A", black: "#121212",
};

// The tattoo primitives read their colors from INK, so switch it to the cotton-candy set.
Object.assign(INK, {
  red: CANDY.pink, redDark: CANDY.pinkDeep, green: CANDY.mint, greenDark: CANDY.mintDeep,
  yellow: CANDY.lemon, teal: CANDY.blue, tealDark: CANDY.blueDeep,
});

const W = 2600, H = 1250;

const art = () => `
  <rect width="${W}" height="${H}" fill="${CANDY.blue}"/>
  ${Array.from({ length: 9 }, (_, i) => `<path d="M ${i * 320 - 60} 420 q 80 -60 160 0 t 160 0" fill="none" stroke="${CANDY.blueDeep}" stroke-width="16"/>`).join("")}
  <rect y="520" width="${W}" height="${H}" fill="${CANDY.lavender}" opacity=".55"/>
  ${flames(0, W, 1000, 360)}
  ${[260, 700, 1180, 1660, 2120].map((x, i) => rose(x, 600 + (i % 2) * 70, 120, [140, 30])).join("")}
  ${[480, 940, 1420, 1900, 2380].map((x, i) => nauticalStar(x, 400 + (i % 2) * 260, 70, CANDY.lavender, i * 9)).join("")}
  ${[120, 1050, 2000].map((x) => bolt(x, 700, 90, 15)).join("")}`;

const WORD = `<text x="1300" y="900" text-anchor="middle" font-family="Rye" font-size="380">GIGGLEME</text>`;

export function wordmark(id = "gm") {
  return `
  <defs><clipPath id="${id}">${WORD}</clipPath></defs>
  <g transform="translate(22 22)" fill="${CANDY.lavender}">${WORD}</g>
  <g transform="translate(22 22)" fill="none" stroke="${CANDY.black}" stroke-width="10" stroke-linejoin="round">${WORD}</g>
  <g clip-path="url(#${id})">${art()}</g>
  <g fill="none" stroke="${CANDY.black}" stroke-width="10" stroke-linejoin="round">${WORD}</g>
  <g fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linejoin="round" transform="translate(-4 -4)" opacity=".6">${WORD}</g>`;
}

export const tagline = (y = 1130, size = 132, x = 1300) =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-family="Pinyon Script" font-size="${size}" fill="${CANDY.gold}">We hope to always Giggleyou Viciously</text>`;

// Place the wordmark centered at (cx, cy) with a given width.
export function wordmarkAt(cx, cy, width, id) {
  const s = width / 2320;
  return `<g transform="translate(${(cx - 1320 * s).toFixed(1)} ${(cy - 768 * s).toFixed(1)}) scale(${s.toFixed(4)})">${wordmark(id)}</g>`;
}
