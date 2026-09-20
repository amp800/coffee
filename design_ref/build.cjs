// Builds src/data/illustrations.js from design_ref/coffee1.svg (free-license set).
//  - 6 coffees sliced verbatim from the vector set
//  - piccolo derived from the corretto glass (milk to the brim)
//  - 4 teas built from the americano glass geometry with tinted transparent liquids
//  - 3 milk bottle icons drawn in the same flat palette
const fs = require('fs');
const src = fs.readFileSync('design_ref/coffee1.svg', 'utf8');

// ---- split OBJECTS into top-level child groups -----------------------------
const objStart = src.indexOf('<g id="OBJECTS">');
const body = src.slice(objStart);
let groups = [], cur = null, depth = 1;
const tagRe = /<g\b[^>]*>|<\/g>/g;
tagRe.lastIndex = body.indexOf('>') + 1;
let m;
while ((m = tagRe.exec(body)) !== null) {
  if (m[0] === '</g>') {
    depth--;
    if (cur && depth === 1) { cur.end = m.index + 4; groups.push(cur); cur = null; }
    if (depth === 0) break;
  } else {
    if (depth === 1 && !cur) cur = { start: m.index };
    depth++;
  }
}

// ---- path point collector (for bboxes) -------------------------------------
function pathPoints(d) {
  const pts = [];
  const toks = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) || [];
  let i = 0, x = 0, y = 0, cmd = '';
  const num = () => parseFloat(toks[i++]);
  const P = (px, py) => pts.push([px, py]);
  while (i < toks.length) {
    if (/[a-zA-Z]/.test(toks[i])) cmd = toks[i++];
    switch (cmd) {
      case 'M': x=num(); y=num(); P(x,y); cmd='L'; break;
      case 'm': x+=num(); y+=num(); P(x,y); cmd='l'; break;
      case 'L': case 'T': x=num(); y=num(); P(x,y); break;
      case 'l': case 't': x+=num(); y+=num(); P(x,y); break;
      case 'H': x=num(); P(x,y); break;
      case 'h': x+=num(); P(x,y); break;
      case 'V': y=num(); P(x,y); break;
      case 'v': y+=num(); P(x,y); break;
      case 'C': x=num(); y=num(); P(x,y); x=num(); y=num(); P(x,y); x=num(); y=num(); P(x,y); break;
      case 'c': { const a=x+num(), b=y+num(); P(a,b); const c=x+num(), e=y+num(); P(c,e); x+=num(); y+=num(); P(x,y); break; }
      case 'S': case 'Q': x=num(); y=num(); P(x,y); x=num(); y=num(); P(x,y); break;
      case 's': case 'q': { const c=x+num(), e=y+num(); P(c,e); x+=num(); y+=num(); P(x,y); break; }
      case 'A': num();num();num();num();num(); x=num(); y=num(); P(x,y); break;
      case 'a': num();num();num();num();num(); x+=num(); y+=num(); P(x,y); break;
      case 'Z': case 'z': break;
      default: i++;
    }
  }
  return pts;
}

function groupPaths(idx) {
  const seg = body.slice(groups[idx].start, groups[idx].end);
  const out = [];
  const pathRe = /<path style="([^"]*)" d="([^"]+)"/g;
  let p;
  while ((p = pathRe.exec(seg)) !== null) {
    const fill = (p[1].match(/fill:(#[0-9A-Fa-f]+|none)/) || [])[1] || '#000';
    out.push({ fill, d: p[2] });
  }
  return out;
}

function bbox(paths) {
  const xs = [], ys = [];
  for (const { d } of paths) for (const [x, y] of pathPoints(d)) { xs.push(x); ys.push(y); }
  return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
}

// Normalize a drink group into a 200x140 viewBox:
//  - glass body (path 0) horizontally centered
//  - contents bottom-aligned at y=136
//  - scale chosen so nothing (incl. handle) is clipped
function normalize(paths, scaleCap = 1.85, shrink = 1) {
  const bodyB = bbox([paths[0]]);
  const fullB = bbox(paths);
  const cx = (bodyB.x0 + bodyB.x1) / 2;
  const limS = Math.min(
    scaleCap,
    96 / Math.max(0.01, fullB.x1 - cx),
    96 / Math.max(0.01, cx - fullB.x0),
    132 / Math.max(0.01, fullB.y1 - fullB.y0),
  );
  const S = limS * shrink;
  const tx = 100 - cx * S;
  const ty = 136 - fullB.y1 * S;
  const inner = paths.map(({ fill, d }) => `<path fill="${fill}" d="${d}"/>`).join('\n');
  return `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
<g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${S.toFixed(4)})">
${inner}
</g>
</svg>`;
}

// Same, but with extra source-space paths injected (used for the piccolo milk).
function normalizeWith(paths, extra, scaleCap = 1.85, shrink = 1) {
  const all = paths.concat(extra);
  return normalize(all, scaleCap, shrink);
}

// ---------------------------------------------------------------------------
// 1. Coffee slices (verbatim)
// ---------------------------------------------------------------------------
const SLICES = [
  [0, 'espresso', 0.6],   // small glass: half size + 20%
  [2, 'macchiato', 0.6],  // small glass: half size + 20%
  [5, 'long-black', 1],
  [6, 'flat-white', 1],
  [8, 'cafe-latte', 1],
];
const coffeeArt = {};
for (const [gi, id, shrink] of SLICES) {
  coffeeArt[id] = normalize(groupPaths(gi), 1.85, shrink);
}
// Cappuccino: keep only cup/foam paths (0-6) — drop the chocolate sprinkle
// dots (paths 7-17) since we don't do chocolate on top.
coffeeArt.cappuccino = normalize(groupPaths(7).slice(0, 7));

// ---------------------------------------------------------------------------
// 2. Piccolo — corretto glass, milk poured to the brim
// ---------------------------------------------------------------------------
{
  const g = groupPaths(2); // corretto
  const glass = [g[0], g[1], g[2]];       // body, rim, handle
  const espresso = g[12];                 // dark base layer
  // Milk follows the glass taper with a constant ~5px inset so the glass
  // reads the same thickness from rim to espresso (no splaying at the top).
  const milk = { fill: '#F2F1E9', d: 'M335,45 L400,45 L395.8,76 L339.4,76 Z' };
  const warmBand = { fill: '#EFE6C7', d: 'M338,69 L397,69 L395.8,76 L339.4,76 Z' };
  const surface = { fill: '#FFFFFF', d: 'M337,45 L398,45 Q398,48 394,48 L341,48 Q337,48 337,45 Z' };
  coffeeArt.piccolo = normalizeWith(glass, [milk, warmBand, espresso, surface], 1.70, 0.6);
}

// ---------------------------------------------------------------------------
// 3. Teas — americano glass geometry, tinted transparent liquids
// ---------------------------------------------------------------------------
{
  const am = groupPaths(5); // americano: 0 body, 1 rim, 2 handle, 3 surface, 4 base, 5 liquid
  const glassParts = [am[0], am[1], am[2]];
  const surfaceShape = am[3];
  const baseShape = am[4];
  const liquidShape = am[5];

  // Single-tone liquids (no two-tone layering). Black tea is a deep amber;
  // the others use the lighter shade of each pair, per feedback.
  const TEAS = {
    black: { main: '#95511A', line: '#D89B4F' },
    peppermint: { main: '#AFCD9C', line: '#D7EBC5' },
    'lemongrass-ginger': { main: '#E4C368', line: '#F3DE9E' },
    'green-lemon': { main: '#D6DB9B', line: '#EDF0C6' },
  };

  const garnish = {
    // black tea: no garnish — the teabag tag read as a white splotch + dashed
    // hairline near the handle, per feedback.
    black: '',
    peppermint: `
<path d="M84,50 q9,-3 14,3 q-1,9 -10,8 q-7,-5 -4,-11 Z" fill="#6F9E5E"/>
<path d="M88,52 L94,59" stroke="#FFFFFF" stroke-width="1.2" opacity="0.55" stroke-linecap="round"/>
<path d="M116,55 q-8,-2 -12,4 q2,8 10,6 q6,-4 2,-10 Z" fill="#57854A"/>
<path d="M113,57 L108,63" stroke="#FFFFFF" stroke-width="1" opacity="0.45" stroke-linecap="round"/>`,
    'lemongrass-ginger': `
<path d="M100,58 L138,18 L143,22 L106,62 Z" fill="#C9D96A"/>
<path d="M103,58 L139,20" stroke="#A9BC4A" stroke-width="1.4" fill="none"/>
<circle cx="78" cy="60" r="7.5" fill="#D9A65E"/>
<circle cx="78" cy="60" r="4.8" fill="#C08F45"/>
<circle cx="78" cy="60" r="1.6" fill="#F3DE9E"/>`,
    'green-lemon': `
<g transform="translate(153 36)">
  <circle r="13" fill="#F2C94C"/>
  <circle r="10.5" fill="#FFF6DA"/>
  <circle r="9" fill="#F7D968"/>
  <g stroke="#FFF6DA" stroke-width="1.6">
    <path d="M-9,0 L9,0"/><path d="M0,-9 L0,9"/>
    <path d="M-6.4,-6.4 L6.4,6.4"/><path d="M-6.4,6.4 L6.4,-6.4"/>
  </g>
  <circle r="1.5" fill="#FFF6DA"/>
</g>`,
  };

  const teaSvg = (t) => {
    // Uniform colour: BOTH liquid regions (body + bottom) share t.main so the
    // brew fills the glass to the bottom in a single flat colour.
    const liquid = { ...liquidShape, fill: t.main };
    const deep = { ...baseShape, fill: t.main };
    const line = { ...surfaceShape, fill: t.line };
    const paths = [...glassParts, liquid, deep, line];
    const base = normalize(paths, 1.46);
    // inject garnish before the closing tag (normalized 200x140 space)
    return base.replace('</svg>', `${garnish[t.id] ?? ''}\n</svg>`);
  };

  var teaArt = {};
  for (const id of Object.keys(TEAS)) {
    teaArt[id] = teaSvg({ id, ...TEAS[id] });
  }
}

// ---------------------------------------------------------------------------
// 4. Milk bottles — flat carton-style bottles in the set's palette
// ---------------------------------------------------------------------------
function milkBottle({ accent, accentDark, plate, band, kind }) {
  // Cow-head icon: white face with accent ears, forelock and eye patch so the
  // colour reads clearly (blue = full cream, pink = skim).
  const cow = `
<g transform="rotate(-26 62 84)"><ellipse cx="62" cy="84" rx="16" ry="10" fill="${accent}"/><ellipse cx="62" cy="84" rx="8" ry="4.5" fill="#FFFFFF" opacity="0.9"/></g>
<g transform="rotate(26 138 84)"><ellipse cx="138" cy="84" rx="16" ry="10" fill="${accent}"/><ellipse cx="138" cy="84" rx="8" ry="4.5" fill="#FFFFFF" opacity="0.9"/></g>
<ellipse cx="100" cy="106" rx="40" ry="36" fill="#FFFFFF"/>
<path d="M83,75 q7,-10 17,-10 q10,0 17,10 q-8,6 -17,6 q-9,0 -17,-6 Z" fill="${accent}"/>
<path d="M111,88 q15,1 17,13 q-1,12 -14,13 q-10,-1 -12,-10 q0,-11 9,-16 Z" fill="${accent}" opacity="0.4"/>
<circle cx="87" cy="97" r="4.6" fill="#3D2121"/>
<circle cx="113" cy="97" r="4.6" fill="#3D2121"/>
<circle cx="88.5" cy="95.5" r="1.5" fill="#FFFFFF"/>
<circle cx="114.5" cy="95.5" r="1.5" fill="#FFFFFF"/>
<ellipse cx="100" cy="122" rx="22" ry="14" fill="#F6D7DC"/>
<circle cx="92" cy="120" r="2.6" fill="#B06A7E"/>
<circle cx="108" cy="120" r="2.6" fill="#B06A7E"/>
<path d="M100,124 q0,5 -4,7 M100,124 q0,5 4,7" stroke="#B06A7E" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  // Wheat sheaf icon in oat/honey tones.
  const wheatHead = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})">
    <ellipse cx="-6" cy="-3" rx="4" ry="7.5" transform="rotate(-24 -6 -3)"/>
    <ellipse cx="6" cy="-3" rx="4" ry="7.5" transform="rotate(24 6 -3)"/>
    <ellipse cx="0" cy="-14" rx="4" ry="7.5"/>
  </g>`;
  const wheat = `
<g stroke="#C08F45" stroke-width="4.5" stroke-linecap="round" fill="none">
  <path d="M78,152 q-4,-26 -10,-44"/>
  <path d="M100,152 q0,-28 0,-50"/>
  <path d="M122,152 q4,-26 10,-44"/>
</g>
<g fill="#D9A65E">
  ${wheatHead(68, 108, -18)}
  ${wheatHead(100, 102, 0)}
  ${wheatHead(132, 108, 18)}
</g>
<g stroke="#B98745" stroke-width="1.6" stroke-linecap="round" fill="none">
  <path d="M64,92 l-3,-8 M72,92 l3,-8 M97,86 l0,-8 M103,86 l0,-8 M128,92 l-3,-8 M136,92 l3,-8"/>
</g>`;
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
<rect x="34" y="34" width="132" height="132" rx="34" fill="${plate}"/>
${kind === 'oat' ? wheat : cow}
</svg>`;
}

const milkArt = {
  'full-cream': milkBottle({ accent: '#7FB6D9', accentDark: '#5E9CC4', plate: '#EDF6FA', band: '#E3F1F8', kind: 'cow' }),
  skim: milkBottle({ accent: '#F09EB4', accentDark: '#DE7E9B', plate: '#FDF1F4', band: '#FBE3EA', kind: 'cow' }),
  oat: milkBottle({ accent: '#D9A65E', accentDark: '#C08F45', plate: '#F9F4E8', band: '#F5EBD5', kind: 'oat' }),
};

// ---------------------------------------------------------------------------
// 5. Emit the module
// ---------------------------------------------------------------------------
const PROVENANCE = `// Generated by design_ref/build.cjs from design_ref/coffee1.svg (free-license
// vector set, magnific.com coffee-types-set_8466911). Do not edit by hand —
// rerun \`node design_ref/build.cjs\` instead.
//
// coffeeArt.espresso, .macchiato (correto), .long-black (americano),
//   .flat-white, .cappuccino, .cafe-latte  -> verbatim slices from the set
// coffeeArt.piccolo                       -> corretto glass, milk to the brim
// teaArt.*                                -> americano glass, tinted liquids (new)
// milkArt.*                               -> new, set palette
`;

const mod = `${PROVENANCE}
export const coffeeArt = {
${Object.entries(coffeeArt).map(([k, v]) => `  '${k}': ${JSON.stringify(v)},`).join('\n')}
};

export const teaArt = {
${Object.entries(teaArt).map(([k, v]) => `  '${k}': ${JSON.stringify(v)},`).join('\n')}
};

export const milkArt = {
${Object.entries(milkArt).map(([k, v]) => `  '${k}': ${JSON.stringify(v)},`).join('\n')}
};
`;

fs.writeFileSync('src/data/illustrations.js', mod);
console.log('wrote src/data/illustrations.js');
for (const id of Object.keys(coffeeArt)) console.log(`  coffeeArt.${id} (${(coffeeArt[id].length / 1024).toFixed(1)}KB)`);
for (const id of Object.keys(teaArt)) console.log(`  teaArt.${id} (${(teaArt[id].length / 1024).toFixed(1)}KB)`);
for (const id of Object.keys(milkArt)) console.log(`  milkArt.${id} (${(milkArt[id].length / 1024).toFixed(1)}KB)`);
