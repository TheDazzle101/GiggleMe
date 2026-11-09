// PDF of one Series 01 back print for Printful: just the words on a transparent 15 × 18 in page,
// carrying the full 4500 × 5400 px (300 DPI) back-print.png.
// Run: node print-pdf.mjs 03-lidda-sun  → ../printful-upload/<name>-back.pdf
import { chromium } from "playwright";
import { existsSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const slug = process.argv[2] || "03-lidda-sun";
const png = resolve(here, "../series-01", slug, "back-print.png");
if (!existsSync(png)) throw new Error("no back print for " + slug);
const file = resolve(here, "../printful-upload", slug.replace(/^\d+-/, "") + "-back.pdf");
const tmp = file + ".tmp.html";
writeFileSync(tmp, `<!doctype html><html><head><style>@page{size:15in 18in;margin:0}html,body{margin:0;background:transparent}
img{display:block;width:15in;height:18in}</style></head><body><img src="${pathToFileURL(png).href}"></body></html>`);
// CHROME=/path/to/chrome uses a specific browser build.
const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
const p = await browser.newPage();
await p.goto(pathToFileURL(tmp).href);
await p.evaluate(() => document.images[0].decode());
await p.pdf({ path: file, width: "15in", height: "18in", printBackground: false, pageRanges: "1" });
await browser.close();
rmSync(tmp);
console.log("wrote", file);
