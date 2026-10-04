// The official GiggleMe logo: retro script (Yellowtail) with the first G and the M at double
// height, a dark matte-grey fill, a hard black outline, a matte-gold outer outline and a black
// drop shadow. wordmark(id) returns SVG in a 2600 × 1250 space; the ink sits inside LOGO_BOX.
import { INK } from "./tattoo.mjs";

export const CANDY = {
  pink: "#FF9EC7", pinkDeep: "#F06AA8", blue: "#9FD3F7", blueDeep: "#64AEE3",
  lavender: "#C9B1F5", mint: "#9EE6CF", mintDeep: "#5FBFA0", lemon: "#FFF1A0",
  gold: "#B8955A", black: "#121212",
};

// Logo colors.
export const LOGO = { fill: "#4A4E55", black: "#111111", gold: CANDY.gold };

// Tattoo primitives (used by older art) keep the cotton-candy ink by default.
Object.assign(INK, {
  red: CANDY.pink, redDark: CANDY.pinkDeep, green: CANDY.mint, greenDark: CANDY.mintDeep,
  yellow: CANDY.lemon, teal: CANDY.blue, tealDark: CANDY.blueDeep,
});

const SMALL = 300, BIG = SMALL * 2;
const WORD = `<text x="1300" y="820" text-anchor="middle" font-family="Yellowtail"><tspan font-size="${BIG}">G</tspan><tspan font-size="${SMALL}">iggle</tspan><tspan font-size="${BIG}">M</tspan><tspan font-size="${SMALL}">e</tspan></text>`;

// Measured bounds of the inked logo in the 2600 × 1250 space (x, y, width, height).
export const LOGO_BOX = { x: 591, y: 355, w: 1494, h: 650 };

export function wordmark() {
  const L = (attrs, dx = 0, dy = 0) => `<g ${attrs}${dx || dy ? ` transform="translate(${dx} ${dy})"` : ""}>${WORD}</g>`;
  return L(`fill="${LOGO.black}"`, 18, 18) +
    L(`fill="none" stroke="${LOGO.gold}" stroke-width="${SMALL * 0.2}" stroke-linejoin="round"`) +
    L(`fill="none" stroke="${LOGO.black}" stroke-width="${SMALL * 0.11}" stroke-linejoin="round"`) +
    L(`fill="${LOGO.fill}"`);
}

export const tagline = (y = 1150, size = 120, x = 1300) =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-family="Pinyon Script" font-size="${size}" fill="${CANDY.gold}">We hope to always Giggleyou Viciously</text>`;

// Place the logo centered at (cx, cy) with a given ink width.
export function wordmarkAt(cx, cy, width) {
  const s = width / LOGO_BOX.w, bx = LOGO_BOX.x + LOGO_BOX.w / 2, by = LOGO_BOX.y + LOGO_BOX.h / 2;
  return `<g transform="translate(${(cx - bx * s).toFixed(1)} ${(cy - by * s).toFixed(1)}) scale(${s.toFixed(4)})">${wordmark()}</g>`;
}
