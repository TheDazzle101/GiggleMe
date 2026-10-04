// Traditional tattoo-flash drawing pieces (roses, stars, flames, bolts…) used inside the GiggleMe wordmark.
// Colors come from INK; brandmark.mjs switches them to the cotton-candy set.

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
