// GiggleMe wordmark built ONLY from rifles, pistols, grenades and rockets, drawn with
// detailed shading. Primitives are horizontal: rear at x=0, pointing right, bore on y=0.
import { carbine } from "./tactical.mjs";

const CAP = 800, GAP = 90;
const f = (n) => (+n).toFixed(1);
const R = (x, y, w, h, fill, rx = 0, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
const place = (x, y, deg, sx, sy, body) => `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(deg)}) scale(${f(sx)} ${f(sy)})">${body}</g>`;

// Rifle: the carbine base plus the small parts that make it read as real.
export function rifle(c) {
  return carbine(c) + `
    ${R(330, -40, 92, 24, "#0B0D10", 3)}${R(334, -36, 84, 4, c.metalHi, 2)}
    <circle cx="452" cy="-24" r="11" fill="${c.dark}"/><circle cx="452" cy="-24" r="5" fill="${c.metalHi}"/>
    ${R(256, -54, 26, 10, c.dark, 3)}
    <circle cx="300" cy="22" r="9" fill="${c.dark}"/><path d="M 300 22 L 316 12" stroke="${c.metalHi}" stroke-width="5" stroke-linecap="round"/>
    <circle cx="268" cy="14" r="5" fill="${c.metalHi}"/><circle cx="500" cy="14" r="5" fill="${c.metalHi}"/>
    ${R(430, 34, 18, 10, c.dark, 2)}
    ${R(60, -6, 60, 16, c.dark, 6)}${R(70, -2, 40, 6, c.metalHi, 3)}
    <path d="M 694 -70 L 704 -104 L 724 -104 L 728 -70 Z" fill="${c.dark}"/>${R(708, -112, 10, 12, c.dark, 2)}
    <path d="M 268 -70 L 274 -98 L 300 -98 L 304 -70 Z" fill="${c.dark}"/>
    <circle cx="780" cy="18" r="8" fill="none" stroke="${c.dark}" stroke-width="5"/>
    <path d="M 520 18 H 772" stroke="#000" stroke-opacity=".35" stroke-width="4"/>
    <path d="M 250 -6 H 522" stroke="#000" stroke-opacity=".4" stroke-width="3"/>`;
}

// Striker-fired pistol, ~400 long, grip hangs below.
export function pistol(c) {
  const serr = Array.from({ length: 8 }, (_, i) => `M ${16 + i * 10} -56 V -14`).join(" ");
  const fserr = Array.from({ length: 5 }, (_, i) => `M ${318 + i * 10} -56 V -30`).join(" ");
  const stipple = Array.from({ length: 48 }, (_, i) => `<circle cx="${52 + (i % 6) * 14 + (Math.floor(i / 6) % 2) * 7}" cy="${64 + Math.floor(i / 6) * 18}" r="2.6" fill="#000" opacity=".45"/>`).join("");
  return `
    ${R(0, -64, 400, 60, c.metal, 8)}${R(0, -64, 400, 10, c.metalHi, 5)}
    <path d="${serr} ${fserr}" stroke="#0B0D10" stroke-width="4"/>
    ${R(150, -60, 96, 22, "#0B0D10", 3)}${R(156, -56, 84, 4, c.metalHi, 2)}
    ${R(22, -78, 22, 16, c.dark, 3)}${R(366, -76, 16, 14, c.dark, 3)}
    <path d="M 36 -4 L 400 -4 L 400 22 L 238 22 L 226 34 L 150 34 L 36 34 Z" fill="${c.dark}"/>
    ${[0, 1, 2].map((i) => R(272 + i * 36, 12, 24, 8, "#0B0D10", 2)).join("")}
    <path d="M 40 -4 L 156 -4 L 142 44 L 128 212 Q 126 226 110 226 L 30 218 Q 14 216 18 200 L 40 40 Z" fill="${c.dark}"/>
    ${stipple}
    ${R(18, 206, 104, 22, c.metal, 6)}
    <path d="M 150 30 Q 158 76 222 76 L 234 32" fill="none" stroke="${c.dark}" stroke-width="11"/>
    <path d="M 178 30 Q 184 50 192 58" fill="none" stroke="${c.metalHi}" stroke-width="7" stroke-linecap="round"/>
    <circle cx="140" cy="14" r="7" fill="${c.metal}"/>
    <path d="M 0 -4 H 400" stroke="#000" stroke-opacity=".45" stroke-width="3"/>`;
}

// Guided rocket, 1000 long, body Ø110 with tail fins and canards.
export function rocket(c, label = "") {
  return `
    <path d="M 0 -32 L 38 -46 L 38 46 L 0 32 Z" fill="${c.dark}"/>
    <path d="M 60 -52 L 92 -168 L 212 -168 L 236 -52 Z" fill="${c.fin}"/>
    <path d="M 60 52 L 92 168 L 212 168 L 236 52 Z" fill="${c.fin}"/>
    <path d="M 92 -168 L 212 -168 L 205 -150 L 100 -150 Z" fill="#fff" opacity=".18"/>
    ${R(36, -55, 790, 110, c.body, 4)}
    ${R(36, -55, 790, 12, "#fff", 4, 'opacity=".22"')}
    ${R(36, 30, 790, 25, "#000", 4, 'opacity=".25"')}
    ${R(60, -8, 176, 16, c.dark)}
    ${R(250, -55, 22, 110, c.band2)}${R(640, -55, 30, 110, c.band1)}
    <path d="M 660 -55 L 690 -110 L 730 -110 L 734 -55 Z" fill="${c.fin}"/><path d="M 660 55 L 690 110 L 730 110 L 734 55 Z" fill="${c.fin}"/>
    <path d="M 826 -55 Q 950 -48 1000 0 Q 950 48 826 55 Z" fill="${c.nose}"/>
    <path d="M 836 -50 Q 940 -42 990 -6" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="8"/>
    <circle cx="986" cy="0" r="16" fill="#0A1418"/><circle cx="982" cy="-5" r="5" fill="#9FD9F0" opacity=".8"/>
    ${[320, 380, 560, 590].map((x) => `<circle cx="${x}" cy="-38" r="4" fill="#000" opacity=".5"/>`).join("")}
    <text x="460" y="14" text-anchor="middle" font-family="Saira Stencil One" font-size="40" fill="${c.stencil}" opacity=".9">${label}</text>`;
}

// Frag grenade, body Ø210, fuse + spoon + pin to the left. ~320 long.
export function grenade(c) {
  return `
    <circle cx="200" cy="0" r="105" fill="url(#gSphere${c.sphere})"/>
    <path d="M 128 -76 A 105 105 0 0 0 128 76" fill="none" stroke="${c.band1}" stroke-width="12" opacity=".9"/>
    <ellipse cx="160" cy="-48" rx="34" ry="20" fill="#fff" opacity=".22" transform="rotate(-35 160 -48)"/>
    ${R(54, -40, 52, 80, c.metal, 6)}
    ${[0, 1, 2, 3, 4].map((i) => `<path d="M ${60 + i * 10} -40 V 40" stroke="#000" stroke-opacity=".35" stroke-width="3"/>`).join("")}
    ${R(96, -46, 18, 92, c.dark, 4)}
    <path d="M 70 -40 L 82 -78 Q 170 -142 284 -98 L 278 -86 Q 172 -124 92 -70 L 86 -40 Z" fill="${c.metal}"/>
    <path d="M 84 -76 Q 170 -136 282 -96" fill="none" stroke="${c.metalHi}" stroke-width="5"/>
    <path d="M 60 -48 L 30 -64" stroke="${c.metalHi}" stroke-width="7" stroke-linecap="round"/>
    <circle cx="18" cy="-74" r="30" fill="none" stroke="${c.metalHi}" stroke-width="9"/>
    <circle cx="18" cy="-74" r="30" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="3"/>`;
}

const vertUp = (x, sx, sy, body) => place(x, CAP, -90, sx, sy, body); // rear at bottom, nose/muzzle up

const LETTERS = {
  I: { w: 300, draw: (c) => vertUp(150, 0.8, 0.8, rocket(c)) },
  G: {
    w: 780,
    draw: (c) => {
      const cx = 380, cy = 400, Rr = 318, out = [];
      for (let a = -42; a >= -318; a -= 25) {
        const t = (a * Math.PI) / 180;
        out.push(place(cx + Rr * Math.cos(t) - 0, cy + Rr * Math.sin(t), a - 90, 0.62, 0.62, `<g transform="translate(-200 0)">${grenade(c)}</g>`));
      }
      return out.join("") + place(cx + 330, 450, 0, -0.82, 0.82, pistol(c));
    },
  },
  L: {
    w: 640,
    draw: (c) => vertUp(190, 0.8, -0.8, rifle(c)) + place(250, CAP - 50, 0, 0.4, 0.5, rocket(c)),
  },
  E: {
    w: 640,
    draw: (c) => vertUp(190, 0.8, -0.8, rifle(c)) +
      place(250, 55, 0, 0.4, 0.5, rocket(c)) +
      place(262, 400, 0, 0.82, 0.82, pistol(c)) +
      place(250, CAP - 50, 0, 0.4, 0.5, rocket(c)),
  },
  M: {
    w: 900,
    draw: (c) => {
      const l = 90, r = 810, mx = 450, my = 640, top = 130;
      const rifleTo = (bx, flip) => {
        const len = Math.hypot(mx - bx, my - top), deg = (Math.atan2(my - top, mx - bx) * 180) / Math.PI;
        return place(bx, top, deg, len / 1000, (flip * len) / 1000, rifle(c));
      };
      return vertUp(l, 0.8, 0.8, rocket(c)) + vertUp(r, 0.8, 0.8, rocket(c)) + rifleTo(l + 60, 1) + rifleTo(r - 60, -1);
    },
  },
};

export function realisticLetters(word, colors, accentFrom = 6) {
  return [...word].map((ch, i) => ({ ch, svg: LETTERS[ch].draw(i >= accentFrom ? colors.accent : colors.base), w: LETTERS[ch].w }));
}
export const R_GAP = GAP, R_CAP = CAP;

// Sphere shading for grenades: olive and blacked-out.
export const REAL_DEFS = `
  <radialGradient id="gSphereO" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#9AA66E"/><stop offset=".35" stop-color="#5E6A3E"/><stop offset=".8" stop-color="#2E3520"/><stop offset="1" stop-color="#1C2113"/></radialGradient>
  <radialGradient id="gSphereK" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#7A828E"/><stop offset=".35" stop-color="#3A4049"/><stop offset=".8" stop-color="#16191E"/><stop offset="1" stop-color="#0A0B0E"/></radialGradient>`;
