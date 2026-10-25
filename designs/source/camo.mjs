// Camo 01: the Lidda Sno shirt (Series 01) with green and black camouflage inside the letters.
// Same words, same Rye letters, same left-aligned four-line stack; three camo looks.
// Run: node camo.mjs [out-dir]   (default ../camo-01)
//   → <out>/<nn-slug>/print.png        (4500 × 5400 px, 300 DPI, transparent: fits Printful's 15 × 18 in back or 12 × 16 in front)
//   → <out>/<nn-slug>/design.svg       (editable vector; needs the Rye font installed)
//   → <out>/<nn-slug>/mockup-<color>.png
//   → <out>/printful-upload/camo-01-<nn-slug>.png   (trimmed to the art, 300 DPI)
//   → <out>/camo-01-concepts.jpg
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync, copyFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { SAYINGS, page } from "./series.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(process.argv[2] || resolve(here, "../camo-01"));
const LIDDA = SAYINGS.find((s) => s.slug === "01-lidda-sno").lines;

const W = 4500, H = 5400;
const GOLD = "#B8955A", BLACK = "#111111";

// Woodland: olive base with forest, moss and black blobs. Digital: the same greens on a square grid.
const WOODLAND = { base: "#4E5E2C", layers: ["#7C8F45", "#2B3A19", BLACK] };
const DIGITAL = { base: "#56692F", layers: ["#8A9C58", "#2D3B1D", BLACK] };

export const LOOKS = [
  { slug: "01-lidda-sno-woodland-gold", name: "Woodland, gold outline", camo: "woodland", palette: WOODLAND, outline: GOLD, inline: BLACK },
  { slug: "02-lidda-sno-woodland-blackout", name: "Woodland, army green outline", camo: "woodland", palette: WOODLAND, outline: "#8DB43E", inline: BLACK },
  { slug: "03-lidda-sno-digital-gold", name: "Digital camo, gold outline", camo: "digital", palette: DIGITAL, outline: GOLD, inline: BLACK },
];

// Small seeded random so every rebuild draws the same camo.
function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const f = (n) => n.toFixed(1);

// One irregular rounded blob, stretched sideways like woodland camo.
function blob(r, cx, cy, rad) {
  const n = 7 + Math.floor(r() * 4), pts = [];
  const rot = (r() - 0.5) * 0.9, sx = 1.3 + r() * 0.7;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, d = rad * (0.55 + r() * 0.6);
    const x = Math.cos(a) * d * sx, y = Math.sin(a) * d;
    pts.push([cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]);
  }
  // Smooth closed curve through the midpoints, with the points as controls.
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  let d = `M ${mid(pts[n - 1], pts[0]).map(f).join(" ")}`;
  for (let i = 0; i < n; i++) { const m = mid(pts[i], pts[(i + 1) % n]); d += ` Q ${pts[i].map(f).join(" ")} ${m.map(f).join(" ")}`; }
  return d + " Z";
}

export function woodland(w, h, p, seed = 7) {
  const r = rng(seed), parts = [`<rect width="${w}" height="${h}" fill="${p.base}"/>`];
  // Bigger light patches first, then the dark ones on top, smaller toward black.
  // [blob size, size spread, how much of the sheet it covers]: black stays the smallest share.
  const spec = [[170, 200, 1], [150, 180, 0.75], [80, 100, 0.4]];
  p.layers.forEach((color, li) => {
    const [base, spread, share] = spec[li], count = Math.round((w * h * share) / (base * base * 16));
    let d = "";
    for (let i = 0; i < count; i++) {
      const cx = r() * w, cy = r() * h, rad = base + r() * spread * 0.6;
      d += blob(r, cx, cy, rad);
      // Woodland blobs grow little arms: two or three smaller blobs hugging the first.
      for (let k = 0; k < 2 + Math.floor(r() * 2); k++) d += blob(r, cx + (r() - 0.5) * rad * 2.6, cy + (r() - 0.5) * rad * 1.4, rad * (0.35 + r() * 0.3));
    }
    parts.push(`<path d="${d}" fill="${color}"/>`);
  });
  return parts.join("");
}

// Digital camo: blocky value noise, thresholded into the three overlay colors, merged into row runs.
export function digital(w, h, p, seed = 11, cell = 54) {
  const r = rng(seed), cols = Math.ceil(w / cell), rows = Math.ceil(h / cell);
  const grid = (g) => { const gw = Math.ceil(cols / g) + 2, gh = Math.ceil(rows / g) + 2; return { g, gw, v: Array.from({ length: gw * gh }, r) }; };
  const sample = (n, x, y) => {
    const gx = x / n.g, gy = y / n.g, x0 = Math.floor(gx), y0 = Math.floor(gy), tx = gx - x0, ty = gy - y0;
    const s = (t) => t * t * (3 - 2 * t), at = (i, j) => n.v[j * n.gw + i];
    const a = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * s(tx), b = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * s(tx);
    return a + (b - a) * s(ty);
  };
  const octaves = [grid(9), grid(4), grid(2)];
  const noise = p.layers.map(() => octaves.map((o) => grid(o.g)));
  const parts = [`<rect width="${w}" height="${h}" fill="${p.base}"/>`];
  p.layers.forEach((color, li) => {
    const cut = [0.56, 0.6, 0.66][li];
    let d = "";
    for (let y = 0; y < rows; y++) {
      let run = -1;
      for (let x = 0; x <= cols; x++) {
        const v = x < cols ? noise[li].reduce((acc, o, k) => acc + sample(o, x, y) * [0.6, 0.28, 0.12][k], 0) : 0;
        if (v > cut && run < 0) run = x;
        if (v <= cut && run >= 0) { d += `M${run * cell} ${y * cell}h${(x - run) * cell}v${cell}h${-(x - run) * cell}z`; run = -1; }
      }
    }
    parts.push(`<path d="${d}" fill="${color}"/>`);
  });
  return parts.join("");
}

// Tee previews (same silhouette as the other sets), print centered at the top of the front.
const TEE = "M 330 90 Q 600 190 870 90 L 1150 230 L 1080 520 L 960 480 L 960 1340 Q 600 1380 240 1340 L 240 480 L 120 520 L 50 230 Z";
export const SHIRTS = [["black", "#161616", "#000"], ["military-green", "#4A5136", "#2A2E1E"], ["white", "#F4F4F1", "#9A9A9A"]];
const mockHTML = (print, shirt, stroke) => `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#ECEAE4}</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1400" viewBox="0 0 1200 1400">
<path d="${TEE}" fill="${shirt}" stroke="${stroke}" stroke-width="4"/>
<path d="M 470 120 Q 600 200 730 120" fill="none" stroke="${stroke}" stroke-width="6"/>
<image href="${pathToFileURL(print).href}" x="375" y="250" width="450" height="540" preserveAspectRatio="xMidYMin meet"/>
</svg></body></html>`;

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const exe = "/opt/pw-browsers/chromium";
  const browser = await chromium.launch(existsSync(exe) ? { executablePath: exe } : {});
  async function shot(html, file, w, h, transparent) {
    mkdirSync(dirname(file), { recursive: true });
    const tmp = file + ".tmp.html";
    writeFileSync(tmp, html);
    const p = await browser.newPage({ viewport: { width: w, height: h } });
    await p.goto(pathToFileURL(tmp).href);
    await p.waitForSelector("body[data-ready]", { timeout: 120000 }).catch(() => p.waitForTimeout(300));
    const svg = transparent ? await p.$eval("#s", (el) => el.outerHTML) : null;
    await p.screenshot({ path: file, omitBackground: transparent });
    await p.close();
    rmSync(tmp);
    return svg;
  }

  const up = join(out, "printful-upload");
  mkdirSync(up, { recursive: true });
  for (const look of LOOKS) {
    const dir = join(out, look.slug), print = join(dir, "print.png");
    const art = look.camo === "woodland" ? woodland(W, H, look.palette) : digital(W, H, look.palette);
    // Exactly the Lidda Sno layout: one letter size, every line on the same left edge, gold + black rings.
    const svg = await shot(page(W, H, art, `
      inked(document.getElementById("s"),${JSON.stringify(LIDDA)},{id:"c",cx:${W / 2},cy:${H / 2},width:4380,height:5000,align:"left",shadow:"${BLACK}",outline:"${look.outline}",outlineK:0.13,inline:"${look.inline}",inlineK:0.075});`),
      print, W, H, true);
    writeFileSync(join(dir, "design.svg"), svg.replace("<svg ", '<svg xmlns:xlink="http://www.w3.org/1999/xlink" '));
    execFileSync("convert", [print, "-units", "PixelsPerInch", "-density", "300", print]);
    const trimmed = join(up, `camo-01-${look.slug}.png`);
    execFileSync("convert", [print, "-trim", "+repage", "-units", "PixelsPerInch", "-density", "300", trimmed]);
    for (const [name, shirt, stroke] of SHIRTS) {
      const tmp = join(dir, `mockup-${name}.html`);
      writeFileSync(tmp, mockHTML(print, shirt, stroke));
      const p = await browser.newPage({ viewport: { width: 1200, height: 1400 } });
      await p.goto(pathToFileURL(tmp).href); await p.waitForTimeout(400);
      await p.screenshot({ path: join(dir, `mockup-${name}.png`) }); await p.close(); rmSync(tmp);
    }
    console.log("built", look.slug);
  }
  await browser.close();
  for (const side of ["dark", "light"]) copyFileSync(resolve(here, `../brand/giggleme-inside-label-${side}-shirts.png`), join(up, `giggleme-inside-label-${side}-shirts.png`));
}
