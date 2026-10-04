# GiggleMe designs

*We hope to always Giggleyou Viciously.*

![All five shirts](previews/all-shirts.png)

## What's here

| Folder | What it is |
|---|---|
| `brand/` | Logo files (transparent PNG). `-on-dark` versions go on black or dark backgrounds, `-on-light` on white or light backgrounds. |
| `shirts/<design>/print-dark-shirts.png` | Print file for **black, navy and charcoal** shirts. Upload this to Printful. |
| `shirts/<design>/print-light-shirts.png` | Print file for **white, cream and light heather** shirts. |
| `shirts/<design>/mockup-*.png` | Quick previews. Use Printful's mockups for the store photos. |
| `shirts/<design>/design-*.svg` | Editable vector versions of each design. |
| `source/` | The code that draws everything. Change `designs.mjs`, then run `npm install` and `npm run build`. |

Every print file is **3600 × 4800 px at 300 DPI** (12 × 16 in, the standard Printful tee front area), with a transparent background. All fonts are open-license (SIL OFL), so they're safe to use on products you sell.

## Brand colors

| Name | Hex | Use |
|---|---|---|
| Ink | `#151515` | Text on light shirts, the grin |
| Bone | `#F7F1E3` | Text on dark shirts |
| Giggle Yellow | `#FFD23F` | The face, stars, highlights |
| Vicious Pink | `#FF4F8B` | "Me" in the logo, punchlines |
| Teal | `#22C3B5` | Small accents |

Fonts: **Titan One** (logo), **Anton** and **Archivo Black** (headlines), **DM Serif Display** and **Shrikhand** (sayings), **Space Mono** (small details).

## Put a design in your store

1. In Printful, open **Stores → GiggleMe → Add product** and pick a soft tee (e.g. Bella+Canvas 3001).
2. Choose your shirt colors. **Start with Black, Navy and Dark Grey Heather** and upload `print-dark-shirts.png`. Bold colors on dark shirts look best on camera.
3. Keep the design at the top of the print area, centered. Don't stretch it.
4. Optional: add white and cream colors with `print-light-shirts.png`. If Printful won't take a different file for some colors on that product, make a separate "light" listing later.
5. Generate mockups, then paste the title, description and tags below. Price it at $27.99.
6. Submit to store. Repeat for each design. Save the first one as a **product template** to make the rest faster.

## Listing text

**1. Low Battery. High Standards. Tee**
*Theme: Straight to the Punchline · Tags: `tee, theme-punchline`*
> For people running on 2% who still won't settle. Printed just for you.

**2. My Comfort Zone Has Five-Star Reviews Tee**
*Theme: Straight to the Punchline · Tags: `tee, theme-punchline`*
> Verified homebody. Never leaving. Five stars, would stay in again.

**3. The Tip Screen Asked for 25% Tee**
*Theme: Brutally Current · Tags: `tee, theme-current`*
> You scanned it. You bagged it. You poured it. Wear the receipt.

**4. "I'm Five Minutes Away" Is a Feeling Tee**
*Theme: Funny Because It's True · Tags: `tee, theme-truth`*
> For the friend who's "almost there" and still in the shower. You know who you are.

**5. If at First You Don't Succeed, Rename It Tee**
*Theme: Sayings, Upgraded · Tags: `tee, theme-sayings`*
> final.png, final2.png, FINAL_final.png… we've all been there. Wisdom, upgraded.

Add these bullets under each description:

```
• Super soft, lightweight cotton
• Printed just for you when you order
• Fits true to size; see the Size Guide
• Ships in about [X–Y] business days
```

## Before you print

- Order one sample of your favorite to check colors and size in person.
- Search each phrase at tmsearch.uspto.gov (clothing, Class 25). These were written fresh for GiggleMe, but short phrases can already be someone's trademark.
- Each design has a small GiggleMe tag under it. To remove it, delete the `${tag(...)}` line for that design in `source/designs.mjs` and rebuild.
