# GiggleMe Series 01

![All ten backs](../previews/series-01-backs.jpg)

![Front and back](../previews/series-01-front-back.jpg)

Ten tees in the GiggleMe tattoo-ink style: a small **GM** on the front left chest and a stacked saying on the back, signed with the gold tagline.

## Files

| File | Where it prints | Size |
|---|---|---|
| `gm-left-chest.png` | **Front, left chest** (same file on every shirt) | 1200 × 1200 px · 4 × 4 in · 300 DPI |
| `<design>/back-print.png` | **Back** | 3600 × 4800 px · 12 × 16 in · 300 DPI |
| `<design>/mockup.png` | Preview only | |

The letters carry their own black outline and colors, so the same files work on **black, navy, charcoal, white and cream** shirts.

## Set it up in Printful

1. **Add product** → Bella+Canvas 3001 (or Comfort Colors 1717 for a heavier, vintage feel).
2. Under **Front**, choose the **Left chest** placement and upload `gm-left-chest.png`. Keep it about 3.5–4 in wide.
3. Under **Back**, upload that design's `back-print.png`. Keep it at the top of the print area, centered, about 12 in wide.
4. Pick colors: start with **Black** and **Navy**.
5. Price: two print spots cost more at Printful, so price around **$32.99–34.99**.
6. Paste the listing text below and submit. Save the first one as a product template.

## Listing text

| # | Title | Description | Theme tag |
|---|---|---|---|
| 01 | Lidda Sno Tee | Lidda sno. Lidda blo. Kuppa hos. Lets ro. | theme-sayings |
| 02 | Firs Koffee Tee | The morning routine, spelled the way it feels before coffee. | theme-truth |
| 03 | Jingl Mingl Tee | Jingl. Mingl. Eggnog. Still singl. The holiday party, summed up. | theme-current |
| 04 | Planz Canseld Tee | The best text you'll get all week. PJs on, life good. | theme-truth |
| 05 | Walkies Zoomies Tee | A dog's whole schedule. Walkies, treetsies, zoomies, snoozies. | theme-punchline |
| 06 | Payday Broke Agen Tee | Payday lasts about four minutes. This shirt lasts longer. | theme-current |
| 07 | Turky Taters Tee | Turky, taters, pie tym, nap tym. Your Thanksgiving game plan. | theme-sayings |
| 08 | Seen It On Red Tee | Seen it. Red it. Left it on red. No further questions. | theme-truth |
| 09 | Who Jim Tee | Gym? Who Jim? Pass da snaks. | theme-punchline |
| 10 | Ovrthink Tee | Think, ovrthink, undrthink, no sleep. Built for 3 a.m. brains. | theme-truth |

Add the usual bullets under each description (soft cotton, printed just for you, fits true to size, ships in X–Y business days).

## Rebuild

`cd ../source && npm install && node series.mjs`. Edit the `SAYINGS` list in `series.mjs` to add or change shirts.
