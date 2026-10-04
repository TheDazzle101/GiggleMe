// Series 01 palette: the cotton-candy tattoo style redone in royal blue and royal purple,
// with lilac/sky highlights and a matte-gold outline. Importing this switches the tattoo ink.
import { INK } from "./tattoo.mjs";
import { CANDY } from "./brandmark.mjs";

export const ROYAL = {
  base: "#3050D0",      // royal blue: main fill inside the letters
  baseDeep: "#1E3394",  // deep blue wave lines
  sky: "#7FA2FF",       // light blue wave lines
  purple: "#6A2FB8",    // royal purple bands
  flame: "#8C4FE8",     // purple flames
  flameDeep: "#4E2399",
  lilac: "#CDB8FF",     // flame centers and lightning
  shadow: "#24124A",    // deep purple drop shadow
  gold: CANDY.gold,     // matte-gold outline
};
Object.assign(INK, { red: ROYAL.flame, redDark: ROYAL.flameDeep, yellow: ROYAL.lilac, teal: ROYAL.base, tealDark: ROYAL.baseDeep });
