// TikTok photo post (swipe-through slides) in the black and gold street look, so the account
// can post on day one before any filming. 1080 × 1920; words stay clear of TikTok's buttons
// (right edge) and caption area (bottom).
// Run: node tiktok.mjs → ../social/tiktok/slide-1.jpg … slide-5.jpg
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { tee, SHIRTS } from "./ads.mjs";
import { street, tape, grain, caps, payoff, eyebrow, fit, place, label, doc } from "./hero.mjs";
import { LOGO } from "./brandmark.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "../social/tiktok");
mkdirSync(out, { recursive: true });
const url = (f) => pathToFileURL(f).href;
const back = (slug) => url(resolve(here, "../series-01", slug, "back-print.png"));
const W = 1080, H = 1920;
const shirt = (slug, color, id, cy = 1130, s = 0.62) => place(470, cy, s, 0, tee("back", color, back(slug), id));
const top = (lines, size, pay) => fit(860, eyebrow(70, 200, 24) + caps(lines, 66, 330, size, 1.0) +
  (pay ? payoff(80, 330 + lines.length * size + 40, size * 1.05) : ""));
const frame = (body) => street(W, H, 470, 1150, 1800, 330) + body + tape(W, 1760, -4, 34) + grain(W, H);

const SLIDES = [
  frame(top(["WE MADE SHIRTS", "THAT SAY IT", "FOR YOU."], 128, true).replace(/Alll Daaayyyy!/g, "Read it out loud.") +
    shirt("01-lidda-sno", SHIRTS.black, "a", 1250, 0.5) + label(990, 1560, 30, "SWIPE →", LOGO.gold, 600, "end", 6)),
  frame(top(["SAY IT", "OUT LOUD."], 140) + shirt("01-lidda-sno", SHIRTS.black, "b")),
  frame(top(["THE ONLY", "MORNING RULES."], 140) + shirt("02-firs-koffee", SHIRTS.navy, "c")),
  frame(top(["WINTER YOU", "OR SUMMER YOU?"], 140) + shirt("03-lidda-sun", SHIRTS.black, "d")),
  frame(`<image href="${url(resolve(here, "../brand/giggleme-logo.png"))}" x="110" y="300" width="760" height="${(760 * 1733) / 3107}"/>` +
    fit(860, caps(["FIRST DROP", "FRIDAY."], 66, 1020, 150, 1.0)) +
    payoff(80, 1330, 130).replace(/Alll Daaayyyy!/g, "Link in bio.")),
];

const browser = await chromium.launch();
for (const [i, body] of SLIDES.entries()) {
  const png = join(out, `slide-${i + 1}.png`), tmp = png + ".html";
  writeFileSync(tmp, doc(W, H, body));
  const p = await browser.newPage({ viewport: { width: W, height: H } });
  await p.goto(url(tmp));
  await p.waitForSelector("body[data-ready]", { timeout: 60000 });
  await p.screenshot({ path: png });
  await p.close();
  execFileSync("convert", [png, "-quality", "90", join(out, `slide-${i + 1}.jpg`)]);
  rmSync(tmp); rmSync(png);
}
await browser.close();
console.log("TikTok slides written");
