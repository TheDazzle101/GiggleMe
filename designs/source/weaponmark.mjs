// GiggleMe "weapon letters" wordmark: every letter is built from blades.
// Letters sit in an 800-unit cap height; pieces are drawn at a set thickness T so strokes match.

const T = 92;            // stroke thickness of every piece
const CAP = 800;         // letter height
const GAP = 70;          // space between letters

const rad = (d) => (d * Math.PI) / 180;
const f = (n) => n.toFixed(1);

// Each piece is drawn pointing UP: tip at (0,0), butt at (0,L). Place it with place(x, y, angle).
const place = (x, y, deg, body) => `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(deg)})">${body}</g>`;

function katana(L, c) {
  const b = L * 0.64, hw = T / 2;
  const wraps = [];
  for (let y = b + T * 0.75; y < L - T * 0.55; y += T * 0.42) wraps.push(`M ${-hw * 0.85} ${f(y)} L ${hw * 0.85} ${f(y + T * 0.2)} M ${hw * 0.85} ${f(y)} L ${-hw * 0.85} ${f(y + T * 0.2)}`);
  return `
    <path d="M ${-hw * 0.82} ${f(b)} L ${-hw * 0.82} ${f(T * 1.4)} Q ${-hw * 0.82} ${f(T * 0.4)} ${hw * 0.5} 0 L ${hw * 0.88} ${f(T * 1.1)} Q ${hw * 0.95} ${f(b * 0.55)} ${hw * 0.82} ${f(b)} Z" fill="url(#${c.steel})"/>
    <path d="M ${hw * 0.55} ${f(T * 0.9)} Q ${hw * 0.66} ${f(b * 0.55)} ${hw * 0.55} ${f(b - 6)}" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="${f(T * 0.07)}"/>
    <rect x="${-hw * 0.95}" y="${f(b)}" width="${hw * 1.9}" height="${f(T * 0.3)}" fill="${c.fit}"/>
    <ellipse cx="0" cy="${f(b + T * 0.42)}" rx="${f(T * 0.95)}" ry="${f(T * 0.17)}" fill="#14171C" stroke="${c.fit}" stroke-width="${f(T * 0.06)}"/>
    <rect x="${-hw}" y="${f(b + T * 0.58)}" width="${T}" height="${f(L - b - T * 0.9)}" rx="${f(T * 0.18)}" fill="${c.wrap}"/>
    <path d="${wraps.join(" ")}" stroke="${c.wrapLine}" stroke-width="${f(T * 0.08)}"/>
    <rect x="${-hw * 1.05}" y="${f(L - T * 0.36)}" width="${hw * 2.1}" height="${f(T * 0.36)}" rx="${f(T * 0.1)}" fill="${c.fit}"/>`;
}

function kunai(L, c) {
  const b = Math.min(L * 0.46, T * 3.4), hw = T / 2, r = T * 0.5, ry = L - r - T * 0.12;
  const wraps = [];
  for (let y = b + T * 0.2; y < ry - r - T * 0.15; y += T * 0.36) wraps.push(`M ${-hw * 0.66} ${f(y)} L ${hw * 0.66} ${f(y + T * 0.18)}`);
  return `
    <path d="M 0 0 C ${hw * 1.5} ${f(b * 0.28)}, ${hw * 1.25} ${f(b * 0.7)}, ${hw * 0.52} ${f(b)} L ${-hw * 0.52} ${f(b)} C ${-hw * 1.25} ${f(b * 0.7)}, ${-hw * 1.5} ${f(b * 0.28)}, 0 0 Z" fill="url(#${c.steel})"/>
    <path d="M 0 ${f(T * 0.3)} L 0 ${f(b - 4)}" stroke="#2A3038" stroke-width="${f(T * 0.07)}"/>
    <rect x="${-hw * 0.72}" y="${f(b - 2)}" width="${hw * 1.44}" height="${f(ry - r - b + 4)}" rx="${f(T * 0.1)}" fill="${c.wrap}" stroke="${c.fit}" stroke-width="${f(T * 0.05)}"/>
    <path d="${wraps.join(" ")}" stroke="${c.wrapLine}" stroke-width="${f(T * 0.08)}"/>
    <circle cx="0" cy="${f(ry)}" r="${f(r)}" fill="none" stroke="url(#${c.steel})" stroke-width="${f(T * 0.22)}"/>`;
}

// Curved kama blade along an arc, tip at angle a0, handle from aH to a1 (degrees, SVG coords).
function kamaArc(cx, cy, R, a0, aH, a1, c) {
  const pts = (from, to, rr, n = 40) => Array.from({ length: n + 1 }, (_, i) => {
    const a = rad(from + ((to - from) * i) / n);
    return [cx + rr(i / n) * Math.cos(a), cy + rr(i / n) * Math.sin(a)];
  });
  const taper = (t) => Math.min(1, t / 0.28);
  const outer = pts(a0, aH, (t) => R + (T / 2) * taper(t));
  const inner = pts(aH, a0, (t) => R - (T / 2) * taper(1 - t));
  const blade = [...outer, ...inner].map((p, i) => `${i ? "L" : "M"} ${f(p[0])} ${f(p[1])}`).join(" ") + " Z";
  const edge = pts(a0 + (aH - a0) * 0.05, aH, (t) => R + (T / 2) * taper(t) - T * 0.12).map((p, i) => `${i ? "L" : "M"} ${f(p[0])} ${f(p[1])}`).join(" ");
  const hOuter = pts(aH, a1, () => R + T / 2, 12), hInner = pts(a1, aH, () => R - T / 2, 12);
  const handle = [...hOuter, ...hInner].map((p, i) => `${i ? "L" : "M"} ${f(p[0])} ${f(p[1])}`).join(" ") + " Z";
  const wraps = Array.from({ length: 6 }, (_, i) => {
    const a = rad(aH + ((a1 - aH) * (i + 0.5)) / 6);
    return `M ${f(cx + (R - T * 0.4) * Math.cos(a))} ${f(cy + (R - T * 0.4) * Math.sin(a))} L ${f(cx + (R + T * 0.4) * Math.cos(a))} ${f(cy + (R + T * 0.4) * Math.sin(a))}`;
  }).join(" ");
  const g = rad(aH);
  return `
    <path d="${blade}" fill="url(#${c.steel})"/>
    <path d="${edge}" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="${f(T * 0.07)}"/>
    <path d="${handle}" fill="${c.wrap}"/>
    <path d="${wraps}" stroke="${c.wrapLine}" stroke-width="${f(T * 0.09)}"/>
    <path d="M ${f(cx + (R - T * 0.75) * Math.cos(g))} ${f(cy + (R - T * 0.75) * Math.sin(g))} L ${f(cx + (R + T * 0.75) * Math.cos(g))} ${f(cy + (R + T * 0.75) * Math.sin(g))}" stroke="${c.fit}" stroke-width="${f(T * 0.28)}" stroke-linecap="round"/>`;
}

// Each letter: width + drawing function (origin = top-left of the letter box).
const LETTERS = {
  I: { w: 190, draw: (c) => place(95, 0, 0, katana(CAP, c)) },
  G: {
    w: 720,
    draw: (c) => {
      const cx = 340, cy = 400, R = 400 - T / 2;
      return kamaArc(cx, cy, R, -48, -228, -352, c) +
        place(cx - 20, 440, -90, kunai(330, c)); // bar: tip points left, ring at right
    },
  },
  L: {
    w: 500,
    draw: (c) => place(T / 2 + 10, 0, 0, katana(CAP - T * 0.2, c)) + place(500, CAP - T / 2, 90, kunai(500 - T - 20, c)),
  },
  E: {
    w: 500,
    draw: (c) => place(T / 2 + 10, 0, 0, katana(CAP, c)) +
      place(500, T / 2 + 6, 90, kunai(500 - T - 30, c)) +
      place(440, CAP / 2, 90, kunai(440 - T - 30, c)) +
      place(500, CAP - T / 2 - 6, 90, kunai(500 - T - 30, c)),
  },
  M: {
    w: 760,
    draw: (c) => {
      const l = T / 2 + 10, r = 760 - T / 2 - 10, mx = 380, my = 600, top = 60;
      // Kunai tip sits at the bottom of the V; its ring hangs on each outer sword near the top.
      const toward = (bx, by) => (Math.atan2(-(bx - mx), by - my) * 180) / Math.PI;
      const len = Math.hypot(mx - l, my - top);
      return place(l, 0, 0, katana(CAP, c)) + place(r, 0, 0, katana(CAP, c)) +
        place(mx, my, toward(l, top), kunai(len, c)) +
        place(mx, my, toward(r, top), kunai(len, c));
    },
  },
};

export const STEEL_DEFS = (id) => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#F4F7FA"/><stop offset=".42" stop-color="#AEB7C3"/><stop offset=".5" stop-color="#6B7482"/><stop offset=".62" stop-color="#C9D1DB"/><stop offset="1" stop-color="#4A525E"/></linearGradient>`;

// Builds the word. colors: { base, accent } each { steel, wrap, wrapLine, fit }. Returns { svg, width, height }.
export function weaponWord(word, colors, accentFrom = 6) {
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
