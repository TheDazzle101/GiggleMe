// GiggleMe brand + shirt artwork, drawn as SVG on a 4500 × 5400 px canvas
// (15 × 18 in at 300 DPI, Printful's full front print area).
// Any <text> with data-w="N" is auto-sized in the browser to exactly N px wide.

export const BRAND = {
  ink: "#151515",
  bone: "#F7F1E3",
  yellow: "#FFD23F",
  pink: "#FF4F8B",
  teal: "#22C3B5",
  red: "#FF5A36",
};

// Two palettes per design: "dark" prints on black/navy shirts, "light" on white/sand shirts.
export function palette(variant) {
  const B = BRAND;
  return variant === "dark"
    ? { fg: B.bone, sub: "#CFC7B8", ink: B.ink, card: "none", hot: B.yellow, yellow: B.yellow, pink: B.pink, teal: B.teal, red: B.red }
    : { fg: B.ink, sub: "#3B3B3B", ink: B.ink, card: "none", hot: "#E8336F", yellow: "#F2B705", pink: "#E8336F", teal: "#119E93", red: "#E8431F" };
}

const W = 4500, H = 5400, CX = W / 2;

// Fanged grin: the GiggleMe face. Happy closed eyes, wide grin, one sharp fang.
export function grin({ x, y, r, face, line, fang }) {
  const sw = r * 0.11;
  return `
  <g transform="translate(${x} ${y})">
    <circle r="${r}" fill="${face}"/>
    <path d="M ${-r * 0.5} ${-r * 0.12} q ${r * 0.16} ${-r * 0.24} ${r * 0.32} 0" fill="none" stroke="${line}" stroke-width="${sw}" stroke-linecap="round"/>
    <path d="M ${r * 0.18} ${-r * 0.12} q ${r * 0.16} ${-r * 0.24} ${r * 0.32} 0" fill="none" stroke="${line}" stroke-width="${sw}" stroke-linecap="round"/>
    <path d="M ${-r * 0.62} ${r * 0.14} Q 0 ${r * 0.95} ${r * 0.62} ${r * 0.14} Z" fill="${line}"/>
    <path d="M ${r * 0.16} ${r * 0.24} L ${r * 0.3} ${r * 0.24} L ${r * 0.23} ${r * 0.52} Z" fill="${fang}"/>
  </g>`;
}

// Small brand tag that sits under every shirt design.
function tag(p, y) {
  return `
  <g opacity="0.9">
    ${grin({ x: CX - 330, y, r: 95, face: p.yellow, line: BRAND.ink, fang: BRAND.bone })}
    <text x="${CX - 200}" y="${y + 52}" font-family="Titan One" font-size="150" fill="${p.fg}">Giggle<tspan fill="${p.pink}">Me</tspan></text>
  </g>`;
}

const star = (x, y, r, fill) => {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    pts.push(`${(x + rr * Math.cos(a)).toFixed(1)},${(y + rr * Math.sin(a)).toFixed(1)}`);
  }
  return `<polygon points="${pts.join(" ")}" fill="${fill}" stroke="${fill}" stroke-width="${r * 0.12}" stroke-linejoin="round"/>`;
};

export const SHIRTS = [
  {
    slug: "01-low-battery-high-standards",
    title: "Low Battery. High Standards.",
    theme: "Straight to the Punchline",
    tag: "theme-punchline",
    svg: (p) => `
      <text x="${CX}" y="980" data-w="3700" text-anchor="middle" font-family="Anton" font-size="700" fill="${p.fg}">LOW BATTERY.</text>
      <g transform="translate(${CX - 1750} 1300)">
        <rect x="0" y="0" width="3300" height="1500" rx="220" fill="none" stroke="${p.fg}" stroke-width="140"/>
        <rect x="3300" y="470" width="200" height="560" rx="60" fill="${p.fg}"/>
        <rect x="190" y="190" width="150" height="1120" rx="50" fill="${p.red}"/>
        <text x="1700" y="900" text-anchor="middle" font-family="Space Mono" font-weight="700" font-size="360" fill="${p.red}">2%</text>
      </g>
      <text x="${CX}" y="3900" data-w="3700" text-anchor="middle" font-family="Anton" font-size="700" fill="${p.hot}">HIGH STANDARDS.</text>
      ${tag(p, 4560)}`,
  },
  {
    slug: "02-comfort-zone-five-star-reviews",
    title: "My Comfort Zone Has Five-Star Reviews",
    theme: "Straight to the Punchline",
    tag: "theme-punchline",
    svg: (p) => `
      <g>${[0, 1, 2, 3, 4].map((i) => star(CX - 1640 + i * 820, 820, 330, p.yellow)).join("")}</g>
      <text x="${CX}" y="1900" data-w="3800" text-anchor="middle" font-family="Archivo Black" font-size="520" fill="${p.fg}">MY COMFORT ZONE</text>
      <text x="${CX}" y="2700" data-w="3600" text-anchor="middle" font-family="DM Serif Display" font-style="italic" font-size="560" fill="${p.pink}">has five-star reviews.</text>
      <g transform="translate(${CX - 1700} 3080)">
        <rect width="3400" height="1000" rx="90" fill="none" stroke="${p.fg}" stroke-width="40" stroke-dasharray="1 0"/>
        <text x="200" y="400" font-family="Space Mono" font-weight="700" font-size="200" fill="${p.fg}">“Never leaving.”</text>
        <text x="200" y="700" font-family="Space Mono" font-size="160" fill="${p.sub}">— Verified Homebody</text>
        <g>${[0, 1, 2, 3, 4].map((i) => star(2440 + i * 190, 610, 75, p.yellow)).join("")}</g>
      </g>
      ${tag(p, 4560)}`,
  },
  {
    slug: "03-tip-screen-poured-my-own-coffee",
    title: "The Tip Screen Asked for 25%",
    theme: "Brutally Current",
    tag: "theme-current",
    svg: (p) => {
      const btn = (x, label, on) => `
        <rect x="${x}" y="1660" width="760" height="560" rx="70" fill="${on ? p.pink : "none"}" stroke="${on ? p.pink : p.fg}" stroke-width="50"/>
        <text x="${x + 380}" y="2050" text-anchor="middle" font-family="Space Mono" font-weight="700" font-size="230" fill="${on ? BRAND.ink : p.fg}">${label}</text>`;
      return `
      <text x="${CX}" y="640" data-w="3300" text-anchor="middle" font-family="Space Mono" font-weight="700" font-size="200" fill="${p.sub}">the tip screen asked for 25%.</text>
      <g>
        <rect x="${CX - 1450}" y="880" width="2900" height="2050" rx="170" fill="none" stroke="${p.fg}" stroke-width="90"/>
        <text x="${CX}" y="1370" text-anchor="middle" font-family="Archivo Black" font-size="330" fill="${p.fg}">ADD A TIP?</text>
        ${btn(CX - 1240, "18%", false)}${btn(CX - 380, "25%", true)}${btn(CX + 480, "30%", false)}
        <text x="${CX}" y="2620" text-anchor="middle" font-family="Space Mono" font-size="170" fill="${p.sub}" text-decoration="underline">no tip (i'm a monster)</text>
      </g>
      <g transform="translate(${CX - 260} 3330)">
        <path d="M 0 0 L 520 0 L 470 560 Q 460 640 380 640 L 140 640 Q 60 640 50 560 Z" fill="none" stroke="${p.yellow}" stroke-width="60" stroke-linejoin="round"/>
        <path d="M 510 140 Q 720 150 700 330 Q 680 470 480 470" fill="none" stroke="${p.yellow}" stroke-width="60" stroke-linecap="round"/>
        <path d="M 150 -120 q 60 -90 0 -180 M 300 -120 q 60 -90 0 -180" fill="none" stroke="${p.yellow}" stroke-width="40" stroke-linecap="round"/>
      </g>
      <text x="${CX}" y="4620" data-w="3900" text-anchor="middle" font-family="Anton" font-size="600" fill="${p.fg}">I POURED MY OWN COFFEE.</text>
      ${tag(p, 5120)}`;
    },
  },
  {
    slug: "04-five-minutes-away-is-a-feeling",
    title: "“I'm Five Minutes Away” Is a Feeling",
    theme: "Funny Because It's True",
    tag: "theme-truth",
    svg: (p) => `
      <path d="M 750 3450 C 350 2900, 1500 2750, 1300 3250 S 2200 3950, 2300 3200 S 1600 2400, 2500 2450 S 3800 3100, 3550 2600"
            fill="none" stroke="${p.teal}" stroke-width="70" stroke-linecap="round" stroke-dasharray="1 150"/>
      <circle cx="750" cy="3450" r="120" fill="${p.teal}"/>
      <text x="750" y="3800" text-anchor="middle" font-family="Space Mono" font-weight="700" font-size="170" fill="${p.sub}">you</text>
      <g transform="translate(3550 2600)">
        <path d="M 0 0 C -50 -140, -270 -270, -270 -490 A 270 270 0 1 1 270 -490 C 270 -270, 50 -140, 0 0 Z" fill="${p.pink}"/>
        <circle cx="0" cy="-490" r="100" fill="${BRAND.ink}"/>
      </g>
      <text x="3550" y="2850" text-anchor="middle" font-family="Space Mono" font-weight="700" font-size="170" fill="${p.sub}">them</text>
      <text x="${CX}" y="700" data-w="3500" text-anchor="middle" font-family="Shrikhand" font-size="400" fill="${p.fg}">“I'm five</text>
      <text x="${CX}" y="1150" data-w="3700" text-anchor="middle" font-family="Shrikhand" font-size="400" fill="${p.fg}">minutes away”</text>
      <text x="${CX}" y="4250" data-w="3900" text-anchor="middle" font-family="Archivo Black" font-size="400" fill="${p.hot}">IS A FEELING,</text>
      <text x="${CX}" y="4700" data-w="3900" text-anchor="middle" font-family="Archivo Black" font-size="400" fill="${p.fg}">NOT A LOCATION.</text>
      ${tag(p, 5170)}`,
  },
  {
    slug: "05-rename-it-final-final-v2",
    title: "If at First You Don't Succeed, Rename It",
    theme: "Sayings, Upgraded",
    tag: "theme-sayings",
    svg: (p) => {
      const file = (x, y, rot, name, on, k = 1) => `
        <g transform="translate(${x} ${y}) rotate(${rot}) scale(${k})">
          <path d="M 0 0 L 1050 0 L 1400 350 L 1400 1650 L 0 1650 Z" fill="${on ? p.yellow : "none"}" stroke="${on ? p.yellow : p.fg}" stroke-width="50" stroke-linejoin="round"/>
          <path d="M 1050 0 L 1050 350 L 1400 350" fill="none" stroke="${on ? BRAND.ink : p.fg}" stroke-width="50" stroke-linejoin="round"/>
          <text x="700" y="1950" text-anchor="middle" font-family="Space Mono" font-weight="700" font-size="${on ? 250 : 230}" fill="${on ? p.fg : p.sub}">${name}</text>
        </g>`;
      return `
      <text x="${CX}" y="720" data-w="3900" text-anchor="middle" font-family="DM Serif Display" font-size="420" fill="${p.fg}">If at first you don't succeed,</text>
      ${file(620, 1050, -8, "final.png", false, 0.55)}
      ${file(1865, 1000, 0, "final2.png", false, 0.55)}
      ${file(3110, 1050, 8, "FINAL_final.png", false, 0.55)}
      ${file(1725, 2150, 0, "final_final_v2.png", true, 0.75)}
      <text x="${CX}" y="4880" data-w="3300" text-anchor="middle" font-family="Anton" font-size="700" fill="${p.pink}">RENAME IT.</text>
      ${tag(p, 5170)}`;
    },
  },
];

// Logo lockups.
export const LOGOS = [
  {
    slug: "logo-primary",
    w: 4000, h: 1600,
    svg: (p) => `
      ${grin({ x: 700, y: 700, r: 560, face: p.yellow, line: BRAND.ink, fang: BRAND.bone })}
      <text x="1400" y="960" data-w="2500" font-family="Titan One" font-size="700" fill="${p.fg}">Giggle<tspan fill="${p.pink}">Me</tspan></text>
      <text x="1420" y="1430" data-w="2460" font-family="Space Mono" font-weight="700" font-size="140" fill="${p.sub}">We hope to always Giggleyou Viciously.</text>`,
  },
  {
    slug: "logo-wordmark",
    w: 3200, h: 1000,
    svg: (p) => `<text x="1600" y="760" data-w="3000" text-anchor="middle" font-family="Titan One" font-size="700" fill="${p.fg}">Giggle<tspan fill="${p.pink}">Me</tspan></text>`,
  },
  {
    slug: "logo-icon",
    w: 1200, h: 1200,
    svg: (p) => grin({ x: 600, y: 600, r: 560, face: p.yellow, line: BRAND.ink, fang: BRAND.bone }),
  },
];

export const SIZE = { W, H };
