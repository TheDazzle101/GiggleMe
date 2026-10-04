// GiggleMe tactical wordmark: every letter is built from modern weapon profiles.
// Primitives are drawn horizontally (rear at x=0, muzzle/tip pointing right, bore on y=0),
// then rotated, flipped and scaled into place inside an 800-unit-tall letter box.

const CAP = 800, GAP = 90;
const f = (n) => (+n).toFixed(1);
const rect = (x, y, w, h, fill, rx = 0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`;
const place = (x, y, deg, sx, sy, body) => `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(deg)}) scale(${f(sx)} ${f(sy)})">${body}</g>`;

// ---- Weapon primitives -------------------------------------------------------------

// M4-style carbine, ~1000 long. o.optic adds a red-dot sight.
export function carbine(c, o = {}) {
  const teeth = Array.from({ length: 25 }, (_, i) => rect(258 + i * 18.5, -76, 9, 9, c.dark)).join("");
  const slots = [0, 1, 2, 3].map((i) => rect(548 + i * 52, -36, 34, 14, c.dark, 7)).join("");
  return `
    <path d="M 0 -52 L 30 -60 L 178 -40 L 178 32 L 112 32 L 44 74 L 0 84 Z" fill="${c.furn}"/>
    <path d="M 18 -30 L 150 -30" stroke="${c.furnHi}" stroke-width="6"/>
    ${rect(150, -30, 120, 36, c.metal)}
    <path d="M 250 -8 L 522 -8 L 522 40 L 446 40 L 424 56 L 300 56 L 280 40 L 250 40 Z" fill="${c.metal}"/>
    ${rect(250, -58, 272, 52, c.metal)}${rect(250, -58, 272, 8, c.metalHi)}
    ${rect(254, -70, 466, 14, c.dark)}${teeth}
    ${rect(270, -42, 36, 10, c.dark, 4)}${rect(420, -40, 60, 18, c.dark, 4)}
    <path d="M 300 52 L 352 52 L 338 162 Q 336 174 322 174 L 292 172 Q 280 170 283 158 Z" fill="${c.furn}"/>
    <path d="M 352 58 Q 362 92 420 92 L 426 56" fill="none" stroke="${c.metal}" stroke-width="10"/>
    <path d="M 378 56 Q 384 74 392 80" fill="none" stroke="${c.dark}" stroke-width="7" stroke-linecap="round"/>
    <path d="M 442 54 L 502 54 Q 512 124 530 206 L 468 216 Q 454 132 442 54 Z" fill="${c.furn}"/>
    <path d="M 452 90 L 500 88 M 458 130 L 508 126 M 464 170 L 516 164" stroke="${c.furnHi}" stroke-width="5"/>
    ${rect(520, -58, 252, 84, c.furn, 6)}${rect(520, -58, 252, 8, c.furnHi, 4)}${slots}
    <path d="M 640 24 L 682 24 L 678 112 Q 678 122 668 122 L 654 122 Q 644 122 644 112 Z" fill="${c.furn}"/>
    ${rect(772, -30, 150, 20, c.dark)}${rect(800, -44, 34, 18, c.dark, 3)}
    ${rect(920, -38, 80, 34, c.dark, 4)}
    <path d="M 940 -38 V -4 M 962 -38 V -4 M 984 -38 V -4" stroke="${c.metal}" stroke-width="5"/>
    ${o.optic ? `${rect(390, -96, 44, 26, c.dark, 4)}${rect(362, -146, 146, 54, c.dark, 24)}${rect(362, -146, 146, 10, c.metalHi, 5)}<ellipse cx="508" cy="-119" rx="8" ry="22" fill="${c.accent}"/>` : ""}`;
}

// Suppressed pistol, ~720 long (slide + can), grip hangs below.
export function pistol(c) {
  const serr = Array.from({ length: 6 }, (_, i) => `M ${18 + i * 12} -54 V -12`).join(" ");
  return `
    ${rect(0, -62, 384, 58, c.metal, 6)}${rect(0, -62, 384, 9, c.metalHi, 4)}
    <path d="${serr}" stroke="${c.dark}" stroke-width="5"/>
    ${rect(20, -74, 18, 14, c.dark, 2)}${rect(350, -72, 14, 12, c.dark, 2)}
    <path d="M 40 -4 L 384 -4 L 384 18 L 168 24 L 150 30 L 40 30 Z" fill="${c.dark}"/>
    <path d="M 44 -4 L 152 -4 L 138 40 L 122 206 Q 120 220 106 220 L 32 212 Q 16 210 20 196 L 44 40 Z" fill="${c.dark}"/>
    <path d="M 150 26 Q 158 66 214 66 L 226 24" fill="none" stroke="${c.dark}" stroke-width="10"/>
    <path d="M 176 24 Q 182 40 190 46" fill="none" stroke="${c.metal}" stroke-width="7" stroke-linecap="round"/>
    ${rect(384, -64, 336, 62, c.metal, 12)}${rect(384, -64, 336, 10, c.metalHi, 6)}
    <path d="M 430 -64 V -2 M 680 -64 V -2" stroke="${c.dark}" stroke-width="6"/>`;
}

// Rifle cartridge (.50 BMG proportions), 1000 long, 140 wide, tip right.
export function cartridge(c) {
  return `
    ${rect(0, -70, 24, 140, "url(#brass)", 4)}${rect(24, -56, 18, 112, c.brassDark)}
    <path d="M 42 -70 L 600 -66 L 682 -40 L 762 -38 L 762 38 L 682 40 L 600 66 L 42 70 Z" fill="url(#brass)"/>
    <path d="M 762 -38 Q 930 -30 1000 0 Q 930 30 762 38 Z" fill="url(#copper)"/>
    ${c.tracer ? `<path d="M 938 -14 Q 974 -7 1000 0 Q 974 7 938 14 Z" fill="${c.accent}"/>` : ""}`;
}

// M67-style frag grenade lying on its side, fuse/pin to the left, ~300 long.
export function grenade(c) {
  return `
    <circle cx="190" cy="0" r="108" fill="${c.olive}"/>
    <path d="M 120 -78 A 108 108 0 0 1 270 -66" fill="none" stroke="${c.oliveHi}" stroke-width="14" stroke-linecap="round"/>
    ${rect(40, -34, 66, 68, c.metal, 8)}${rect(40, -34, 66, 10, c.metalHi, 5)}
    <path d="M 56 -34 L 70 -66 Q 150 -128 262 -96" fill="none" stroke="${c.metal}" stroke-width="16" stroke-linecap="round"/>
    <circle cx="22" cy="-52" r="28" fill="none" stroke="${c.metalHi}" stroke-width="9"/>
    <path d="M 40 -40 L 50 -30" stroke="${c.metalHi}" stroke-width="7"/>`;
}

// Claymore-style directional mine, 330 wide, faces up-front; legs below.
export function claymore(c) {
  return `
    <path d="M 0 -70 Q 165 -96 330 -70 L 330 62 Q 165 38 0 62 Z" fill="${c.olive}"/>
    <path d="M 0 -70 Q 165 -96 330 -70" fill="none" stroke="${c.oliveHi}" stroke-width="10"/>
    ${rect(110, -110, 26, 30, c.metal, 4)}${rect(194, -110, 26, 30, c.metal, 4)}
    <text x="165" y="-14" text-anchor="middle" font-family="Saira Stencil One" font-size="38" fill="${c.stencil}">FRONT TOWARD</text>
    <text x="165" y="34" text-anchor="middle" font-family="Saira Stencil One" font-size="38" fill="${c.stencil}">ENEMY</text>
    <path d="M 40 58 L 14 120 M 40 58 L 66 120 M 290 58 L 264 120 M 290 58 L 316 120" stroke="${c.dark}" stroke-width="10" stroke-linecap="round"/>`;
}

// AT4-style shoulder-fired rocket launcher, 1000 long, tube 120 wide.
export function launcher(c) {
  return `
    ${rect(0, -60, 1000, 120, c.olive, 10)}${rect(0, -60, 1000, 14, c.oliveHi, 7)}
    ${rect(0, -66, 46, 132, c.dark, 8)}${rect(954, -66, 46, 132, c.dark, 8)}
    ${rect(150, -64, 22, 128, c.dark)}${rect(830, -64, 22, 128, c.dark)}
    ${rect(300, -98, 70, 40, c.dark, 6)}${rect(700, -96, 46, 38, c.dark, 6)}
    ${rect(400, 58, 150, 42, c.dark, 6)}
    <path d="M 470 96 L 512 96 L 502 186 Q 500 198 488 198 L 470 198 Q 458 198 460 186 Z" fill="${c.dark}"/>
    ${rect(210, 58, 60, 70, c.dark, 8)}
    <text x="620" y="16" text-anchor="middle" font-family="Saira Stencil One" font-size="46" fill="${c.stencil}" opacity=".85">${c.tag || ""}</text>`;
}

// ---- Letters (box origin top-left, 800 tall) ---------------------------------------

const vertUp = (x, s, body, flip = 1) => place(x, CAP, -90, s, s * flip, body); // rear at bottom, muzzle up

const LETTERS = {
  I: { w: 250, draw: (c) => vertUp(80, 0.8, launcher(c), -1) },
  G: {
    w: 760,
    draw: (c) => {
      const cx = 360, cy = 400, R = 330, rounds = [];
      for (let a = -40; a >= -320; a -= 3.6) rounds.push(place(cx + (R + 100) * Math.cos((a * Math.PI) / 180), cy + (R + 100) * Math.sin((a * Math.PI) / 180), a + 180, 0.17, 0.17, cartridge(c)));
      const r = R + 88, a0 = (-38 * Math.PI) / 180, a1 = (-322 * Math.PI) / 180;
      const belt = `<path d="M ${f(cx + r * Math.cos(a0))} ${f(cy + r * Math.sin(a0))} A ${r} ${r} 0 1 0 ${f(cx + r * Math.cos(a1))} ${f(cy + r * Math.sin(a1))}" fill="none" stroke="${c.dark}" stroke-width="26"/>`;
      return belt + rounds.join("") + place(cx + 30, 460, 0, 0.92, 0.92, grenade(c));
    },
  },
  L: {
    w: 600,
    draw: (c) => vertUp(190, 0.8, carbine(c), -1) + place(250, CAP - 44, 0, 0.42, 0.42, cartridge(c)),
  },
  E: {
    w: 620,
    draw: (c) => vertUp(190, 0.8, carbine(c), -1) +
      place(250, 50, 0, 0.42, 0.42, cartridge(c)) +
      place(260, 420, 0, 0.95, 0.95, claymore(c)) +
      place(250, CAP - 44, 0, 0.42, 0.42, cartridge(c)),
  },
  M: {
    w: 860,
    draw: (c) => {
      const l = 70, r = 790, mx = 430, my = 640, top = 120;
      // Rifles: stock at the top by each outer tube, muzzles meeting at the bottom of the V.
      // flip keeps each magazine on the outside of the V.
      const rifle = (bx, flip) => {
        const len = Math.hypot(mx - bx, my - top), deg = (Math.atan2(my - top, mx - bx) * 180) / Math.PI;
        return place(bx, top, deg, len / 1000, (flip * len) / 1000, carbine(c));
      };
      return vertUp(l, 0.8, launcher(c), -1) + vertUp(r, 0.8, launcher(c), 1) +
        rifle(l + 70, 1) + rifle(r - 70, -1);
    },
  },
};

export function tacticalWord(word, colors, accentFrom = 6) {
  let x = 0;
  const parts = [...word].map((ch, i) => {
    const L = LETTERS[ch];
    const c = i >= accentFrom ? colors.accent : colors.base;
    const s = `<g transform="translate(${x} 0)">${L.draw(c)}</g>`;
    x += L.w + GAP;
    return s;
  });
  return { svg: parts.join(""), width: x - GAP, height: CAP };
}

export const TACTICAL_DEFS = `
  <linearGradient id="brass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3D88C"/><stop offset=".45" stop-color="#C99B3E"/><stop offset="1" stop-color="#7E5A1E"/></linearGradient>
  <linearGradient id="copper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F0A77A"/><stop offset=".5" stop-color="#B8653A"/><stop offset="1" stop-color="#6E3518"/></linearGradient>`;

// Same letters, returned one by one ({ ch, svg, w }) so they can be laid out on a curve.
export function tacticalLetters(word, colors, accentFrom = 6) {
  return [...word].map((ch, i) => ({ ch, svg: LETTERS[ch].draw(i >= accentFrom ? colors.accent : colors.base), w: LETTERS[ch].w }));
}
export const LETTER_GAP = GAP, LETTER_CAP = CAP;
