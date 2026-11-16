/**
 * Illustration system: four property types x two views (plan view, isometric).
 * Pure string builders so the default view renders at build time and the
 * picker can render the others in the browser. Ported from the approved prototype.
 */
export type PropertyType = 'building' | 'society' | 'home' | 'shop';
export type Zone = 'ent' | 'park' | 'com' | 'rec';

interface Labels { cap: string; ent: string; com: string; rec: string; cor: string; park: string }

export const LABELS: Record<PropertyType, Labels> = {
  building: { cap: 'New building project', ent: 'Main entrance', com: 'Lobby', rec: 'Control room', cor: 'Corridor', park: 'Parking' },
  society: { cap: 'Housing society', ent: 'Main gate', com: 'Clubhouse', rec: 'Security room', cor: 'Internal road', park: 'Visitor parking' },
  home: { cap: 'Home or villa', ent: 'Front door', com: 'Living area', rec: 'Utility', cor: 'Garden', park: 'Driveway' },
  shop: { cap: 'Shop or office', ent: 'Shop entrance', com: 'Sales floor', rec: 'Back office', cor: 'Counter', park: 'Loading bay' },
};

export const LEGEND: [Zone, string][] = [
  ['ent', 'Entrances and exits'],
  ['park', 'Outdoor and parking'],
  ['com', 'Common areas'],
  ['rec', 'Recording room'],
];

type Pt = number[];
const pts = (a: Pt[]) => a.map((p) => p.join(',')).join(' ');

/* ---------- plan view helpers ---------- */
const cone = (z: Zone, c: Pt, p: Pt[], k: number) =>
  `<g class="sw" data-z="${z}" data-k="${k}" style="transform-origin:${c[0]}px ${c[1]}px"><polygon class="cone z-${z}" points="${pts(p)}"/></g>`;
const dot = (z: Zone, x: number, y: number) => `<g data-z="${z}"><circle class="cam" cx="${x}" cy="${y}" r="4.5"/></g>`;
const area = (z: Zone, x: number, y: number, w: number, h: number) =>
  `<rect class="area z-${z}" data-z="${z}" x="${x}" y="${y}" width="${w}" height="${h}" rx="3"/>`;
const bld = (x: number, y: number, w: number, h: number, r = 3) =>
  `<rect class="bld" pathLength="1" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`;
const wl = (d: string) => `<path class="wall" pathLength="1" d="${d}"/>`;
const door = (z: Zone, x: number, y: number, w: number, h: number) =>
  `<rect class="door z-${z}" data-z="${z}" x="${x}" y="${y}" width="${w}" height="${h}" rx="2"/>`;
const lb = (x: number, y: number, t: string, z: Zone, sm = false) =>
  `<text class="lab${sm ? ' sm' : ''}" data-z="${z}" x="${x}" y="${y}">${t}</text>`;
const tb = (x: number) =>
  `<rect class="tb" x="${x}" y="206" width="124" height="15" rx="1"/><text class="tbt" x="${x + 6}" y="216.5">Illustrative · not to scale</text>`;
const slotsFlat = (x: number, y: number, w: number, h: number) => {
  let s = '';
  for (let i = 1; i < 5; i++) s += `<path class="slot" d="M${x + 8} ${y + (i * h) / 5}H${x + w - 8}"/>`;
  return s;
};
const wrapFlat = (v: PropertyType, inner: string) => {
  const L = LABELS[v];
  return `<svg viewBox="0 0 360 226" role="img" aria-label="Illustrative plan view of a ${L.cap.toLowerCase()}. Cameras cover the ${L.ent.toLowerCase()}, ${L.com.toLowerCase()}, ${L.rec.toLowerCase()} and ${L.park.toLowerCase()}.">${inner}</svg>`;
};

const FLAT: Record<PropertyType, (L: Labels) => string> = {
  building: (L) =>
    area('park', 265, 30, 82, 170) + bld(20, 20, 230, 170) + wl('M160 20V110M20 110H250M120 110V190') +
    cone('ent', [70, 182], [[70, 182], [30, 122], [110, 122]], 0) + cone('com', [90, 28], [[90, 28], [35, 108], [145, 108]], 1) +
    cone('com', [240, 150], [[240, 150], [128, 126], [128, 186]], 2) + cone('rec', [205, 28], [[205, 28], [168, 96], [242, 96]], 3) +
    cone('park', [268, 115], [[268, 115], [346, 36], [346, 196]], 4) +
    door('ent', 50, 186, 40, 7) + dot('ent', 70, 182) + dot('com', 90, 28) + dot('com', 240, 150) + dot('rec', 205, 28) + dot('park', 268, 115) +
    lb(52, 206, L.ent, 'ent') + lb(28, 37, L.com, 'com') + lb(168, 37, L.rec, 'rec', true) + lb(130, 176, L.cor, 'com', true) + lb(272, 192, L.park, 'park') + tb(228),
  society: (L) =>
    '<path class="road" d="M150 206V100H300M26 100H150"/><path class="roadc" d="M150 206V100H300M26 100H150"/>' +
    wl('M10 10H350V206H10Z') + bld(28, 26, 72, 50) + bld(118, 26, 72, 50) + bld(208, 26, 72, 50) +
    bld(28, 122, 86, 50) + area('com', 28, 122, 86, 50) + area('park', 204, 122, 90, 60) + slotsFlat(204, 122, 90, 60) + bld(168, 170, 32, 24) + area('rec', 168, 170, 32, 24) +
    cone('ent', [150, 200], [[150, 200], [108, 142], [192, 142]], 0) + cone('com', [154, 76], [[154, 76], [122, 98], [186, 98]], 1) +
    cone('com', [296, 100], [[296, 100], [214, 90], [214, 110]], 2) + cone('com', [114, 148], [[114, 148], [144, 122], [144, 176]], 3) +
    cone('park', [248, 122], [[248, 122], [206, 178], [290, 178]], 4) +
    door('ent', 132, 203, 36, 6) + dot('ent', 150, 200) + dot('com', 154, 76) + dot('com', 296, 100) + dot('com', 114, 148) + dot('park', 248, 122) + dot('rec', 184, 182) +
    lb(54, 52, 'Block A', 'com', true) + lb(144, 52, 'Block B', 'com', true) + lb(234, 52, 'Block C', 'com', true) + lb(34, 148, L.com, 'com') +
    lb(210, 138, L.park, 'park', true) + lb(172, 203, L.rec, 'rec', true) + lb(74, 198, L.ent, 'ent') + lb(232, 98, L.cor, 'com', true) + tb(228),
  home: (L) =>
    wl('M10 10H350V206H10Z') + area('park', 250, 36, 90, 164) +
    '<rect class="car" x="270" y="140" width="30" height="52" rx="8"/><path class="dash" d="M95 206V146"/>' +
    bld(46, 34, 176, 106) + wl('M134 34V140M134 88H222') + area('rec', 134, 88, 88, 52) +
    cone('ent', [95, 146], [[95, 146], [55, 202], [135, 202]], 0) + cone('com', [60, 40], [[60, 40], [46, 104], [128, 104]], 1) +
    cone('rec', [178, 94], [[178, 94], [148, 128], [214, 128]], 2) + cone('park', [232, 100], [[232, 100], [346, 48], [346, 194]], 3) +
    door('ent', 78, 137, 34, 6) + door('ent', 70, 203, 50, 5) + dot('ent', 95, 146) + dot('com', 60, 40) + dot('rec', 178, 94) + dot('park', 232, 100) +
    lb(54, 52, L.com, 'com') + lb(142, 48, 'Bedroom', 'com', true) + lb(142, 104, L.rec, 'rec', true) + lb(124, 182, L.ent, 'ent') + lb(256, 52, L.park, 'park') + lb(20, 196, 'Gate', 'ent', true) + tb(228),
  shop: (L) =>
    area('park', 284, 50, 66, 122) + bld(30, 28, 236, 156) +
    '<rect class="shelf" x="58" y="68" width="124" height="10"/><rect class="shelf" x="58" y="94" width="124" height="10"/><rect class="shelf" x="58" y="120" width="124" height="10"/><rect class="shelf" x="196" y="128" width="58" height="20"/>' +
    wl('M186 28V92M186 92H266') + area('rec', 186, 28, 80, 64) +
    cone('ent', [132, 178], [[132, 178], [84, 132], [180, 132]], 0) + cone('com', [40, 38], [[40, 38], [176, 58], [176, 150]], 1) +
    cone('com', [258, 160], [[258, 160], [198, 150], [198, 178]], 2) + cone('rec', [226, 34], [[226, 34], [192, 86], [262, 86]], 3) +
    cone('park', [276, 118], [[276, 118], [348, 56], [348, 180]], 4) +
    door('ent', 96, 181, 72, 7) + door('park', 263, 102, 6, 32) + dot('ent', 132, 178) + dot('com', 40, 38) + dot('com', 258, 160) + dot('rec', 226, 34) + dot('park', 276, 118) +
    lb(98, 203, L.ent, 'ent') + lb(38, 44, L.com, 'com') + lb(194, 44, L.rec, 'rec', true) + lb(204, 142, L.cor, 'com', true) + lb(288, 66, L.park, 'park', true) + tb(228),
};

export const flat = (v: PropertyType) => wrapFlat(v, FLAT[v](LABELS[v]));

/* ---------- isometric helpers ---------- */
const S = 0.62, OX = 130, OY = 44;
const P = (x: number, y: number, z = 0): [number, number] => [+(OX + (x - y) * 0.866 * S).toFixed(1), +(OY + (x + y) * 0.5 * S - z).toFixed(1)];
const poly = (a: Pt[]) => a.map((p) => P(p[0], p[1], p[2]).join(',')).join(' ');
const pg = (cls: string, a: Pt[], z?: Zone) => `<polygon class="${cls}${z ? ' z-' + z : ''}"${z ? ` data-z="${z}"` : ''} points="${poly(a)}"/>`;
const box = (x: number, y: number, w: number, d: number, h: number, o: { z?: number; noroof?: boolean } = {}) => {
  const z0 = o.z || 0, H = z0 + h;
  return pg('face-l', [[x, y + d, z0], [x + w, y + d, z0], [x + w, y + d, H], [x, y + d, H]]) +
    pg('face-r', [[x + w, y, z0], [x + w, y + d, z0], [x + w, y + d, H], [x + w, y, H]]) +
    (o.noroof ? '' : pg('roof', [[x, y, H], [x + w, y, H], [x + w, y + d, H], [x, y + d, H]]));
};
const zroof = (x: number, y: number, w: number, d: number, H: number, z: Zone) => pg('area', [[x, y, H], [x + w, y, H], [x + w, y + d, H], [x, y + d, H]], z);
const gnd = (x: number, y: number, w: number, d: number, z: Zone) => pg('area', [[x, y, 0], [x + w, y, 0], [x + w, y + d, 0], [x, y + d, 0]], z);
const icone = (z: Zone, c: Pt, p: Pt[], k: number) => {
  const o = P(c[0], c[1]);
  return `<g class="sw" data-z="${z}" data-k="${k}" style="transform-origin:${o[0]}px ${o[1]}px"><polygon class="cone z-${z}" points="${poly(p)}"/></g>`;
};
const idot = (z: Zone, x: number, y: number, h: number) => {
  const p = P(x, y, h);
  return `<g data-z="${z}"><circle class="cam" cx="${p[0]}" cy="${p[1]}" r="4.5"/></g>`;
};
const ilab = (x: number, y: number, t: string, z: Zone, sm = false, zz = 0) => {
  const p = P(x, y, zz);
  return `<text class="lab${sm ? ' sm' : ''}" data-z="${z}" text-anchor="middle" x="${p[0]}" y="${p[1]}">${t}</text>`;
};
const wpath = (d: string) => `<path class="wall" pathLength="1" d="${d}"/>`;
const outline = (x: number, y: number, w: number, d: number, H: number) =>
  `M${P(x, y, H)} L${P(x + w, y, H)} L${P(x + w, y + d, H)} L${P(x, y + d, H)} Z M${P(x, y + d, H)} L${P(x, y + d)} L${P(x + w, y + d)} L${P(x + w, y)} L${P(x + w, y, H)} M${P(x + w, y + d, H)} L${P(x + w, y + d)}`;
const slotsIso = (x: number, y: number, w: number, d: number, n: number) => {
  let s = '';
  for (let i = 1; i < n; i++) {
    const yy = y + (i * d) / n;
    s += `<path class="slot" d="M${P(x + 8, yy).join(',')} L${P(x + w - 8, yy).join(',')}"/>`;
  }
  return s;
};
const itb = (x: number) =>
  `<rect class="tb" x="${x}" y="207" width="124" height="15" rx="1"/><text class="tbt" x="${x + 6}" y="217.5">Illustrative · not to scale</text>`;
const G = pg('ground', [[-10, -10], [310, -10], [310, 210], [-10, 210]]);
const wrapIso = (v: PropertyType, inner: string) => {
  const L = LABELS[v];
  return `<svg viewBox="0 0 314 224" role="img" aria-label="Illustrative isometric view of a ${L.cap.toLowerCase()}. Cameras cover the ${L.ent.toLowerCase()} and ${L.park.toLowerCase()}.">${G}${inner}</svg>`;
};

const ISO: Record<PropertyType, (L: Labels) => string> = {
  building: (L) => { const H = 24;
    return gnd(215, 20, 85, 165, 'park') + slotsIso(215, 20, 85, 165, 6) + icone('ent', [75, 140], [[75, 140], [32, 206], [122, 206]], 0) + icone('park', [190, 92], [[190, 92], [298, 28], [298, 182]], 1) +
      box(0, 0, 190, 140, H) + zroof(6, 6, 116, 74, H, 'com') + zroof(132, 6, 52, 74, H, 'rec') + pg('door', [[60, 140, 0], [92, 140, 0], [92, 140, 16], [60, 140, 16]], 'ent') +
      wpath(outline(0, 0, 190, 140, H)) + idot('ent', 75, 140, H - 5) + idot('park', 190, 92, H - 5) +
      ilab(48, 176, L.ent, 'ent') + ilab(60, 40, 'Common area', 'com', true, H) + ilab(158, 30, 'Recording', 'rec', true, H) + ilab(255, 198, L.park, 'park') + itb(186); },
  society: (L) => { const H = 30;
    return pg('roadi', [[-5, 56], [305, 56], [305, 72], [-5, 72]]) + pg('roadi', [[140, 72], [156, 72], [156, 206], [140, 206]]) +
      gnd(196, 92, 84, 56, 'park') + slotsIso(196, 92, 84, 56, 5) +
      icone('ent', [148, 190], [[148, 190], [124, 146], [172, 146]], 0) + icone('com', [130, 42], [[130, 42], [104, 78], [156, 78]], 1) + icone('park', [196, 120], [[196, 120], [280, 100], [280, 142]], 2) +
      box(8, 6, 44, 36, H) + box(108, 6, 44, 36, H) + box(208, 6, 44, 36, H) + box(14, 90, 72, 44, 16) + zroof(14, 90, 72, 44, 16, 'com') + box(162, 160, 24, 20, 14) + zroof(162, 160, 24, 20, 14, 'rec') +
      pg('door', [[140, 196, 0], [156, 196, 0], [156, 196, 9], [140, 196, 9]], 'ent') +
      wpath(outline(108, 6, 44, 36, H)) + idot('ent', 148, 190, 10) + idot('com', 130, 42, H - 4) + idot('park', 196, 120, 6) +
      ilab(130, 22, 'Blocks', 'com', true, H) + ilab(50, 112, L.com, 'com', true, 16) + ilab(120, 206, L.ent, 'ent') + ilab(250, 152, L.park, 'park', true) + ilab(176, 150, 'Security', 'rec', true, 14) + itb(186); },
  home: (L) => { const H = 24, R = 16;
    return gnd(10, 112, 130, 78, 'com') + gnd(170, 60, 110, 130, 'park') + `<path class="dash" d="M${P(69, 112)} L${P(69, 190)}" />` +
      icone('ent', [69, 100], [[69, 100], [44, 170], [96, 170]], 0) + icone('park', [150, 60], [[150, 60], [272, 40], [272, 150]], 1) +
      box(100, 2, 40, 18, 12) + zroof(100, 2, 40, 18, 12, 'rec') +
      box(30, 24, 120, 76, H, { noroof: true }) + pg('roof', [[30, 62, H + R], [150, 62, H + R], [150, 100, H], [30, 100, H]]) + pg('face-r', [[150, 24, H], [150, 100, H], [150, 62, H + R]]) +
      pg('door', [[60, 100, 0], [78, 100, 0], [78, 100, 14], [60, 100, 14]], 'ent') +
      wpath(`M${P(30, 100, H)} L${P(30, 62, H + R)} L${P(150, 62, H + R)} L${P(150, 100, H)} Z M${P(30, 100, H)} L${P(30, 100)} L${P(150, 100)} L${P(150, 24)} L${P(150, 24, H)} L${P(150, 62, H + R)}`) +
      idot('ent', 69, 100, H - 6) + idot('park', 150, 60, H - 4) +
      ilab(69, 198, L.ent, 'ent') + ilab(34, 132, 'Garden', 'com', true) + ilab(228, 168, L.park, 'park') + ilab(120, 10, L.rec, 'rec', true, 12) + itb(186); },
  shop: (L) => { const H = 28;
    return gnd(205, 30, 90, 100, 'park') + icone('ent', [86, 120], [[86, 120], [50, 186], [132, 186]], 0) + icone('park', [194, 70], [[194, 70], [286, 34], [286, 126]], 1) +
      box(24, 20, 170, 100, H) + zroof(30, 26, 108, 88, H, 'com') + zroof(148, 26, 40, 50, H, 'rec') +
      pg('door', [[52, 120, 0], [120, 120, 0], [120, 120, 18], [52, 120, 18]], 'ent') + pg('door', [[194, 50, 0], [194, 92, 0], [194, 92, 18], [194, 50, 18]], 'park') +
      wpath(outline(24, 20, 170, 100, H)) + idot('ent', 86, 120, H - 4) + idot('park', 194, 70, H - 4) +
      ilab(86, 146, L.ent, 'ent') + ilab(70, 44, L.com, 'com', true, H) + ilab(170, 40, L.rec, 'rec', true, H) + ilab(250, 138, L.park, 'park') + itb(186); },
};

export const iso = (v: PropertyType) => wrapIso(v, ISO[v](LABELS[v]));

/** Full plan block: drawing plus the legend (real buttons). */
export function renderPlan(style: 'flat' | 'iso', v: PropertyType): string {
  const legend = LEGEND.map(([k, t]) => `<button type="button" class="lg" data-k="${k}" aria-pressed="false"><i class="sw-${k}"></i>${t}</button>`).join('');
  return `<div class="plan st-${style}" data-style="${style}">${style === 'iso' ? iso(v) : flat(v)}<div class="legend" role="group" aria-label="Highlight a zone">${legend}</div></div>`;
}

export const captionHtml = (v: PropertyType) => `<span>Example: <b>${LABELS[v].cap}</b></span><span>Illustrative · not to scale</span>`;
