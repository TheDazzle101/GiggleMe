# Classic 02: the flex tank look, with GiggleMe phrases

![All five on the royal blue tank](../previews/classic-02-concepts.jpg)

Same style as the proven flex tank top seller: distressed white bold condensed capitals, four centered lines, royal blue tank, no graphics. The difference is our own gym joke. The front has no logo: GiggleMe goes on the inside back neck label, like the original's brand label. None reuse the original's phrase.

| # | Phrase | Why it should sell |
|---|---|---|
| 1 | **MY SLEEVES / TOOK A / PERMANENT / REST DAY** (recommended) | Explains the tank with a joke every lifter gets. Same "where did the sleeves go" laugh, told our way. |
| 2 | MY BICEPS / ATE THE / SLEEVES / AGAIN | Short words, reads from across the gym. The "again" makes it a brag. |
| 3 | THE SLEEVES / COULDN'T / HANDLE / THE PUMP | Real gym slang, so it lands with regulars. |
| 4 | DO YOU / EVEN / SLEEVE / BRO? | Twists the "do you even lift" meme everyone already knows. |
| 5 | I'M NOT / SHOWING OFF / MY ARMS / NEED AIR | A fake excuse for showing off. Gym, beach and cookouts. |

## Upload to Printful

Everything to upload is in **`printful-upload/`**, one file per design and shirt color:
- `classic-02-<design>-FRONT-dark-shirts.png`: distressed white text for **royal blue, black, navy, charcoal**.
- `classic-02-<design>-FRONT-light-shirts.png`: distressed black text for **white, sand, light heather**.
- `giggleme-inside-label-dark-shirts.png` / `-light-shirts.png`: the GiggleMe logo for the inside back neck label (900 × 339 px, Printful's 3 × 1.13 in logo area at 300 DPI). Printful adds the size, origin and fabric text itself.

Front files are transparent, 300 DPI and trimmed to the art (about 10 in wide), so they drop into any tee or tank print area. Center them at the top of the front.

Each design folder also has editable `design-*.svg` files, full-canvas `print-*.png` files (3600 × 4800) and `mockup-royal/black/white.png` previews.

Font: Barlow Condensed Bold (SIL OFL, safe for products you sell). To change a phrase, edit `source/classic-02.mjs`, run `node classic-02.mjs`, then `node printful-pack.mjs classic-02`.
