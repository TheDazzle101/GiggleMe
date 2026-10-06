// Social launch kit: YouTube banner and video watermark, Instagram story highlight covers.
// Profile pictures for all three apps are the GM channel image (node channel-icon.mjs).
// Run: node social-kit.mjs → ../brand/social/*
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { writeFileSync, rmSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { doc, street, grain, tape, label, place, FOIL } from "./hero.mjs";
import { tee, SHIRTS } from "./ads.mjs";
import { LOGO, wordmarkAt } from "./brandmark.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "../brand/social");
const url = (f) => pathToFileURL(f).href;
const back = (slug) => url(resolve(here, "../series-01", slug, "back-print.png"));

// YouTube banner, 2560 × 1440. Phones only show the middle 1546 × 423 (x 507–2053, y 508–931),
// so the logo and both lines sit there. Desktop shows the full-width band, which adds the shirts;
// TVs show everything, including the gold tape.
const W = 2560, H = 1440, CX = W / 2;
const youtube = street(W, H, CX, 700, 1010, 640) +
  place(330, 720, 0.3, -8, tee("back", SHIRTS.navy, back("02-firs-koffee"), "l")) +
  place(W - 330, 720, 0.3, 8, tee("back", SHIRTS.black, back("01-lidda-sno"), "r")) +
  wordmarkAt(CX, 640, 660) +
  `<rect x="${CX - 330}" y="812" width="660" height="3" fill="url(#foil)"/>` +
  label(CX, 864, 38, "WE HOPE TO ALWAYS GIGGLEYOU VICIOUSLY.", "#F4F1EA", 600, "middle", 6) +
  label(CX, 906, 26, "FUNNY SHIRTS • NEW DROP EVERY FRIDAY", LOGO.gold, 600, "middle", 8) +
  tape(W, 1270, -2.5, 52) + grain(W, H);

// Safe-area overlay so the banner can be checked at a glance (not for upload).
const guides = `<g fill="none" stroke-width="6" stroke-dasharray="24 14">
  <rect x="507" y="508" width="1546" height="423" stroke="#FE2C55"/>
  <rect x="0" y="508" width="${W}" height="423" stroke="#7FA2FF"/>
  <rect x="352" y="508" width="1855" height="423" stroke="#9EE6CF"/></g>` +
  label(523, 548, 30, "PHONE (always visible)", "#FE2C55", 600) +
  label(16, 548, 30, "DESKTOP", "#7FA2FF", 600) + label(368, 905, 30, "TABLET", "#9EE6CF", 600) +
  label(16, 60, 30, "TV shows the whole image", "#F4F1EA", 600);

// Instagram story highlight covers, 1080 × 1920. Instagram crops the middle to a small circle,
// so each one is a single gold word inside a gold ring.
const C = 1080, CH = 1920;
const HIGHLIGHTS = [["shop", "SHOP"], ["drops", "DROPS"], ["lidda", "LIDDA"], ["laughs", "LAUGHS"], ["faq", "FAQ"]];
const cover = (word) => `<defs>${FOIL}<radialGradient id="g" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#6A2FB8" stop-opacity=".45"/>
  <stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>
  <rect width="${C}" height="${CH}" fill="#0B0B0D"/><circle cx="${C / 2}" cy="${CH / 2}" r="520" fill="url(#g)"/>
  <circle cx="${C / 2}" cy="${CH / 2}" r="400" fill="none" stroke="url(#foil)" stroke-width="14"/>
  <g class="fitw" data-w="560"><text x="${C / 2}" y="${CH / 2 + 82}" text-anchor="middle" font-family="Anton" font-size="230"
    letter-spacing="8" fill="url(#foil)">${word}</text></g>`;
// The covers center themselves, so they skip the left-anchored fit in hero.mjs's doc().
const centered = (svg) => svg.replace(/class="fitw"/g, 'class="fitc"');
const coverDoc = (svg) => doc(C, CH, centered(svg)).replace("document.body.dataset.ready=1",
  "(()=>{for(const g of document.querySelectorAll('g.fitc')){const b=g.getBBox(),k=Math.min(1,g.dataset.w/b.width),cx=b.x+b.width/2,cy=b.y+b.height/2;g.setAttribute('transform','translate('+cx*(1-k)+' '+cy*(1-k)+') scale('+k+')')}document.body.dataset.ready=1})()");

const browser = await chromium.launch();
async function shot(html, file, w, h) {
  const tmp = file + ".tmp.html";
  writeFileSync(tmp, html);
  const p = await browser.newPage({ viewport: { width: w, height: h } });
  await p.goto(url(tmp));
  await p.waitForSelector("body[data-ready]", { timeout: 60000 });
  await p.screenshot({ path: file });
  await p.close();
  rmSync(tmp);
}

const banner = join(out, "youtube-banner.png");
await shot(doc(W, H, youtube), banner, W, H);
// YouTube caps banners at 6 MB; a JPG keeps it well under.
execFileSync("convert", [banner, "-quality", "90", "-sampling-factor", "4:2:0", join(out, "youtube-banner.jpg")]);
await shot(doc(W, H, youtube + guides), join(out, "youtube-banner-safe-areas.png"), W, H);
execFileSync("convert", [join(out, "youtube-banner-safe-areas.png"), "-resize", "1280x", join(out, "youtube-banner-safe-areas.png")]);
rmSync(banner);

for (const [name, word] of HIGHLIGHTS) {
  const png = join(out, `ig-highlight-${name}.png`);
  await shot(coverDoc(cover(word)), png, C, CH);
  execFileSync("convert", [png, "-quality", "92", png.replace(/\.png$/, ".jpg")]);
  rmSync(png);
}
await browser.close();

// YouTube video watermark (the small button in the corner of every video): 150 × 150, under 1 MB.
const icon = join(out, "channel-icon.png");
if (!existsSync(icon)) throw new Error("Run node channel-icon.mjs first");
execFileSync("convert", [icon, "-resize", "150x150", join(out, "youtube-watermark-150.png")]);
console.log("social kit written");
