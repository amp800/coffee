// Coffee type definitions with hand-built flat-vector SVG illustrations.
// Style follows the classic "coffee types" infographic sets (e.g. the free
// Magnific vectors referenced in the brief): white/glass cups on saucers with
// clearly visible layered contents.

// ---------------------------------------------------------------- palette ---
const P = {
  espDark: '#3A2314', // deepest espresso
  esp: '#4E2E19', // espresso body
  espSoft: '#6E4526', // espresso towards the bottom of a long drink
  crema: '#C08A55', // crema band
  cremaLight: '#D9A468',
  milk: '#F2E2CA', // steamed milk body
  milkLight: '#F8EFDF', // lighter milk (surface sheen)
  milkDeep: '#E4CBA9', // milk warmed by espresso
  foam: '#FCF6EB', // milk foam
  foamShade: '#EFE3CF',
  ceramic: '#FFFFFF',
  outline: '#E2D9C9', // cup outline
  glass: '#FDFCFA',
  glassStroke: '#D8CFBF',
  water: '#F4E5C6',
  waterDeep: '#E8CE9E',
  saucer: '#F4EFE6',
  saucerInner: '#E9E2D3',
  saucerLine: '#E3DAC8',
  shadow: 'rgba(90, 72, 51, 0.14)',
  cacao: '#8A5A33',
};

// Half-width of the *inside* of a cup at height y (cup walls taper linearly).
const iw = (y, c) => {
  const f = Math.min(1, Math.max(0, (y - c.topY) / (c.botY - c.topY)));
  return c.topHW + (c.botHW - c.topHW) * f;
};

// A horizontal layer of liquid between y1 (top) and y2 (bottom).
// Walls are inset so liquid sits inside the cup; y2 uses the cup's width.
function layer(c, y1, y2, fill, extra = {}) {
  const x1 = iw(y1, c) - (extra.inset || 0);
  const x2 = iw(y2, c) - (extra.inset || 0);
  const { opacity = 1, rx = 0 } = extra;
  const op = opacity < 1 ? ` opacity="${opacity}"` : '';
  if (rx > 0 && y2 >= c.botY - 8) {
    // Round the bottom corners where the liquid meets the cup base.
    return `<path d="M ${100 - x1} ${y1} L ${100 + x1} ${y1} L ${100 + x2} ${y2 - rx} Q ${100 + x2} ${y2} ${100 + x2 - rx} ${y2} L ${100 - x2 + rx} ${y2} Q ${100 - x2} ${y2} ${100 - x2} ${y2 - rx} Z" fill="${fill}"${op}/>`;
  }
  return `<path d="M ${100 - x1} ${y1} L ${100 + x1} ${y1} L ${100 + x2} ${y2} L ${100 - x2} ${y2} Z" fill="${fill}"${op}/>`;
}

// Smooth top surface wave used for foam dollops / milk tops.
function surface(c, y, spread, fill, extra = {}) {
  const w = iw(y, c) * spread;
  const { opacity = 1, y2 } = extra;
  const base = y2 ?? y + 7;
  const op = opacity < 1 ? ` opacity="${opacity}"` : '';
  return `<path d="M ${100 - w} ${base} C ${100 - w} ${y - 6}, ${100 - w * 0.5} ${y}, ${100} ${y} C ${100 + w * 0.5} ${y}, ${100 + w} ${y - 6}, ${100 + w} ${base} Z" fill="${fill}"${op}/>`;
}

// ------------------------------------------------------- shared cup pieces ---
function saucer(big = 66) {
  return `
    <ellipse cx="100" cy="176" rx="${big + 6}" ry="10" fill="${P.shadow}"/>
    <ellipse cx="100" cy="173" rx="${big}" ry="10" fill="${P.saucer}" stroke="${P.saucerLine}" stroke-width="2"/>
    <ellipse cx="100" cy="172" rx="${big * 0.55}" ry="5" fill="${P.saucerInner}"/>`;
}

function handle(c, opts = {}) {
  const { stroke = P.ceramic, y1 = 104, y2 = 132, rx = 8, thick = 7 } = opts;
  const outer = c.topHW + rx;
  const x = 100 + outer;
  const sweep = opts.side === 'left' ? 1 : 0;
  const sx = opts.side === 'left' ? -1 : 1;
  return `<path d="M ${100 + sx * (iw(y1, c) + 6)} ${y1} A ${rx} ${(y2 - y1) / 2} 0 0 ${sweep} ${100 + sx * (iw(y2, c) + 6)} ${y2}" stroke="${stroke}" stroke-width="${thick}" fill="none" stroke-linecap="round"/>`;
}

// Tapered cup wall outline. topRim extends slightly above for the lip.
function ceramicBody(c) {
  const r = 12;
  const topY = c.topY;
  return `<path d="M ${100 - c.topHW} ${topY}
    L ${100 - c.botHW} ${c.botY - r}
    Q ${100 - c.botHW} ${c.botY} ${100 - c.botHW + r} ${c.botY}
    L ${100 + c.botHW - r} ${c.botY}
    Q ${100 + c.botHW} ${c.botY} ${100 + c.botHW} ${c.botY - r}
    L ${100 + c.topHW} ${topY} Z"
    fill="${P.ceramic}" stroke="${P.outline}" stroke-width="3" stroke-linejoin="round"/>`;
}

function glassBody(c) {
  const r = 10;
  return `<path d="M ${100 - c.topHW} ${c.topY}
    L ${100 - c.botHW} ${c.botY - r}
    Q ${100 - c.botHW} ${c.botY} ${100 - c.botHW + r} ${c.botY}
    L ${100 + c.botHW - r} ${c.botY}
    Q ${100 + c.botHW} ${c.botY} ${100 + c.botHW} ${c.botY - r}
    L ${100 + c.topHW} ${c.topY} Z"
    fill="${P.glass}" stroke="${P.glassStroke}" stroke-width="3" stroke-linejoin="round"/>`;
}

// Glass shine so transparent cups read as glass over the liquid.
function glassShine(c, y1, y2) {
  const x = 100 - iw(y1, c) * 0.62;
  const w = Math.max(4, (c.topHW - c.botHW) * 0.18);
  const top = Math.max(y1, c.topY + 3);
  const bot = y2;
  const lw = iw(top, c) - (iw(y1, c) - x);
  const bw = iw(bot, c) - (iw(y1, c) - x);
  return `<rect x="${100 - lw - w}" y="${top}" width="${w}" height="${bot - top}" rx="${w / 2}" fill="#FFFFFF" opacity="0.55"/>`;
}

// Steam wisps rising from hot drinks.
function steam(c, yTop) {
  const L = 100 - c.topHW * 0.5;
  const R = 100 + c.topHW * 0.35;
  const m = `stroke="${P.outline}" stroke-width="2.6" fill="none" stroke-linecap="round" opacity="0.85"`;
  return `<path d="M ${L} ${yTop - 12} q 4 -7 -2 -12 q -4 -5 2 -10" ${m}/>
    <path d="M ${R} ${yTop - 14} q -4 -7 2 -12 q 4 -5 -2 -10" ${m}/>
    <path d="M 100 ${yTop - 6} q 3 -6 -1 -11" ${m} opacity="0.5"/>`;
}

const wrap = (inner) =>
  `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">${inner}</svg>`;

// ------------------------------------------------------------------ drinks ---
// All cups share a baseline so the grid reads evenly.

function espressoArt() {
  const c = { topY: 100, botY: 152, topHW: 46, botHW: 40 };
  const s = 103; // liquid surface
  return wrap(`
${saucer(58)}
${handle(c, { y1: 108, y2: 134, rx: 9 })}
${ceramicBody(c)}
${layer(c, s, 147, P.espDark, { rx: 11 })}
${layer(c, s, s + 7, P.cremaLight, { inset: 1.5 })}
${layer(c, s + 7, s + 11, P.crema, { inset: 1.5 })}
<circle cx="88" cy="${s + 4}" r="1.7" fill="#FFFFFF" opacity="0.75"/>
<circle cx="108" cy="${s + 6}" r="1.3" fill="#FFFFFF" opacity="0.6"/>
<rect x="${100 - iw(s + 8, c) * 0.42}" y="${s + 8}" width="${iw(s + 8, c) * 0.84}" height="3" rx="1.5" fill="#FFFFFF" opacity="0.14"/>
${steam(c, 98)}`);
}

function glassSmallLayers({ milkToBrim }) {
  // Small glass tumbler shared by macchiato + piccolo.
  const c = { topY: 74, botY: 150, topHW: 40, botHW: 35 };
  const s = milkToBrim ? 78 : 84; // liquid surface
  const body = milkToBrim ? glassBody(c) : glassBody(c);
  let content = '';
  if (milkToBrim) {
    // Piccolo: ristretto at the base, milk right up to the brim.
    content = `
${layer(c, s, 150, P.milkLight, { rx: 10 })}
${layer(c, s, s + 4, P.foam, { inset: 1 })}
${layer(c, 116, 150, P.milkDeep, { rx: 10 })}
${layer(c, 134, 150, P.espSoft, { rx: 10 })}
${layer(c, 134, 146, P.esp, { inset: 2 })}`;
  } else {
    // Macchiato: mostly espresso, with a milk-foam dollop on top.
    content = `
${layer(c, s, 148, P.espDark, { rx: 10 })}
${layer(c, s, s + 8, P.cremaLight, { inset: 1.5 })}
${layer(c, s + 8, s + 12, P.crema, { inset: 1.5 })}
${surface(c, s + 4, 0.62, P.foam, { y2: s + 16 })}
${surface(c, s + 6, 0.4, P.foam, { y2: s + 13 })}
<ellipse cx="100" cy="${s + 2}" rx="${iw(s, c) * 0.62}" ry="5" fill="${P.foam}" opacity="0.55"/>`;
  }
  return wrap(`
${saucer(56)}
${content}
${glassShine(c, s - 2, 147)}
${body}`);
}

function macchiatoArt() {
  return glassSmallLayers({ milkToBrim: false });
}

function piccoloArt() {
  return glassSmallLayers({ milkToBrim: true });
}

function longBlackArt() {
  // Tall glass, mostly hot water with the espresso resting on top.
  const c = { topY: 62, botY: 152, topHW: 40, botHW: 33 };
  const s = 66;
  return wrap(`
${saucer(58)}
${layer(c, s, 148, P.water, { rx: 10 })}
${layer(c, s + 26, 150, P.waterDeep, { rx: 10 })}
${layer(c, s, 100, P.esp, { inset: 1.5 })}
${layer(c, s, s + 6, P.cremaLight, { inset: 2 })}
${layer(c, s + 6, s + 10, P.crema, { inset: 2 })}
<path d="M ${100 - iw(103, c) + 8} 101 q 10 -3 18 0 q 9 3 16 0" stroke="${P.espSoft}" stroke-width="2.5" fill="none" opacity="0.7" stroke-linecap="round"/>
${glassShine(c, s, 149)}
${glassBody(c)}
${steam(c, 60)}`);
}

function flatWhiteArt() {
  // Wide, low ceramic cup - the flat white profile.
  const c = { topY: 106, botY: 152, topHW: 56, botHW: 46 };
  const s = 109;
  return wrap(`
${saucer(70)}
${handle(c, { y1: 114, y2: 138, rx: 11, thick: 8 })}
${ceramicBody(c)}
${layer(c, s, 146, P.milkLight, { rx: 10 })}
${layer(c, 132, 150, P.milkDeep, { rx: 10 })}
${layer(c, 132, 146, P.espSoft, { rx: 10 })}
${layer(c, 140, 150, P.esp, { inset: 4, rx: 10 })}
<rect x="${100 - iw(s, c) + 6}" y="${s + 2}" width="${(iw(s, c) - 6) * 2}" height="3.5" rx="1.75" fill="${P.foam}"/>
<circle cx="100" cy="${s - 3}" r="7" fill="${P.foam}"/>
<circle cx="100" cy="${s - 3}" r="3" fill="${P.milkLight}"/>`);
}

function latteArt() {
  // Tall handled mug with distinct espresso/milk/foam layers.
  const c = { topY: 78, botY: 150, topHW: 46, botHW: 38 };
  const s = 81;
  return wrap(`
${saucer(62)}
${handle(c, { y1: 90, y2: 124, rx: 9 })}
${ceramicBody(c)}
${layer(c, s, 146, P.milkLight, { rx: 10 })}
${layer(c, 112, 148, P.milkDeep, { rx: 10 })}
${layer(c, 130, 150, P.espSoft, { rx: 10 })}
${layer(c, 136, 150, P.esp, { rx: 10 })}
${layer(c, s, s + 4, P.foam, { inset: 1 })}
${layer(c, 108, 111, P.crema, { opacity: 0.55 })}
<path d="M ${100 - iw(s, c) + 8} ${s + 9} q 20 -5 40 0" stroke="${P.foam}" stroke-width="2" fill="none" opacity="0.7" stroke-linecap="round"/>
${steam(c, 76)}`);
}

function cappuccinoArt() {
  // Wide mug with the thick foam domed above the rim.
  const c = { topY: 100, botY: 150, topHW: 50, botHW: 41 };
  const s = 95;
  const dome = `
<path d="M ${100 - iw(s, c) + 3} 96
  C ${100 - iw(s, c) + 3} 66, ${100 + iw(s, c) - 3} 66, ${100 + iw(s, c) - 3} 96 Z" fill="${P.foam}" stroke="${P.outline}" stroke-width="2.5"/>
<path d="M ${100 - iw(s, c) + 12} 93
  C ${100 - iw(s, c) + 16} 76, ${100 - iw(s, c) * 0.25} 74, 100 75" stroke="${P.foamShade}" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.9"/>
<circle cx="78" cy="80" r="1.9" fill="${P.cacao}"/>
<circle cx="96" cy="74" r="1.7" fill="${P.cacao}"/>
<circle cx="112" cy="81" r="1.9" fill="${P.cacao}"/>
<circle cx="103" cy="88" r="1.6" fill="${P.cacao}"/>`;
  return wrap(`
${saucer(68)}
${handle(c, { y1: 108, y2: 134, rx: 10, thick: 8 })}
${ceramicBody(c)}
${layer(c, 118, 148, P.espDark, { rx: 10 })}
${layer(c, 110, 120, P.crema, { inset: 2 })}
${layer(c, 104, 112, P.milkDeep, { inset: 2 })}
${layer(c, 97, 106, P.foam, { inset: 1.5 })}
${dome}`);
}

// ------------------------------------------------------------- exports ------
export const coffees = [
  { id: 'espresso', name: 'Espresso', hasMilk: false, svg: espressoArt() },
  { id: 'macchiato', name: 'Macchiato', hasMilk: true, svg: macchiatoArt() },
  { id: 'piccolo', name: 'Piccolo', hasMilk: true, svg: piccoloArt() },
  { id: 'long-black', name: 'Long Black', hasMilk: false, svg: longBlackArt() },
  { id: 'flat-white', name: 'Flat White', hasMilk: true, svg: flatWhiteArt() },
  { id: 'cafe-latte', name: 'Café Latte', hasMilk: true, svg: latteArt() },
  { id: 'cappuccino', name: 'Cappuccino', hasMilk: true, svg: cappuccinoArt() },
];

export const coffeeById = Object.fromEntries(coffees.map((c) => [c.id, c]));

// ------------------------------------------------------------ milk icons ----
const milkPlate = (tint, inner) => `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
  <rect x="4" y="4" width="112" height="112" rx="28" fill="${tint}"/>
  ${inner}
</svg>`;

function milkBottle(accent, accentDark, label, sub, labelBg) {
  return `
  <rect x="36" y="26" width="48" height="62" rx="9" fill="#FFFFFF" stroke="#E7DFD2" stroke-width="2.5"/>
  <rect x="46" y="10" width="28" height="20" rx="5" fill="${accent}"/>
  <rect x="46" y="10" width="28" height="8" rx="4" fill="${accentDark}" opacity="0.55"/>
  <rect x="40" y="48" width="40" height="30" rx="7" fill="${labelBg}"/>
  <circle cx="60" cy="57" r="9" fill="${accent}"/>
  <circle cx="56" cy="54.5" r="2.2" fill="#FFFFFF"/>
  <circle cx="64" cy="54.5" r="2.2" fill="#FFFFFF"/>
  <path d="M 60 62 q -2.2 3.5 0 6 q 2.2 -2.5 0 -6 Z" fill="#FFFFFF" opacity="0.95"/>
  <text x="60" y="85" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="10.5" font-weight="700" fill="#57534E">${label}</text>
  <text x="60" y="96" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="7.5" fill="#A8A29E">${sub}</text>`;
}

export const milkTypes = [
  {
    id: 'full-cream',
    name: 'Full Cream',
    svg: milkPlate('#EAF4FB', milkBottle('#8CC4E8', '#5FA6D6', 'Full Cream', 'MILK', '#E3F1FA')),
  },
  {
    id: 'skim',
    name: 'Skim',
    svg: milkPlate('#FDF0F4', milkBottle('#F2A6BC', '#DE7E9B', 'Skim', 'MILK', '#FCE4EB')),
  },
  {
    id: 'oat',
    name: 'Oat',
    svg: milkPlate('#F4F1E6', `
  <rect x="36" y="26" width="48" height="62" rx="9" fill="#FFFFFF" stroke="#E7DFD2" stroke-width="2.5"/>
  <rect x="46" y="10" width="28" height="20" rx="5" fill="#E5B45B"/>
  <rect x="46" y="10" width="28" height="8" rx="4" fill="#C9993F" opacity="0.5"/>
  <rect x="40" y="48" width="40" height="30" rx="7" fill="#FAF3E3"/>
  <g stroke="#E5B45B" stroke-width="2.2" stroke-linecap="round" fill="none">
    <path d="M 52 60 q -5 -7 1 -13"/>
    <path d="M 60 60 q 0 -9 5 -13"/>
    <path d="M 68 60 q 5 -6 1 -12"/>
  </g>
  <g fill="#D9A441">
    <ellipse cx="47" cy="61" rx="3.2" ry="4.6"/>
    <ellipse cx="55" cy="57" rx="3.2" ry="4.6"/>
    <ellipse cx="63" cy="57" rx="3.2" ry="4.6"/>
    <ellipse cx="71" cy="61" rx="3.2" ry="4.6"/>
  </g>
  <text x="60" y="85" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="10.5" font-weight="700" fill="#57534E">Oat</text>
  <text x="60" y="96" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="7.5" fill="#A8A29E">MILK</text>
`),
  },
];

export const milkById = Object.fromEntries(milkTypes.map((m) => [m.id, m]));

// Shared formatting helpers used by the pages.
export const sugarLabel = (n) =>
  n === 0 ? 'no sugar' : n === 1 ? '1 sugar' : `${n} sugars`;

export const statusLabel = {
  pending: 'Pending',
  making: 'Making',
  done: 'Done',
};
