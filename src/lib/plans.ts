/**
 * Illustrative property drawings (plan view and isometric) for four property types.
 * Pure string builders: they run at build time for the first paint and in the browser when the picker changes.
 * Zones: ent = entrances, park = outdoor and parking, com = common areas, rec = recording room.
 * All drawings are illustrative, not to scale, and not real client sites.
 */
export type PropertyType = 'building' | 'society' | 'home' | 'shop';
export type Zone = 'ent' | 'park' | 'com' | 'rec';
/** flat = plan view, iso = polished isometric (style A), blue = blueprint line art (style B). */
export type PlanStyle = 'flat' | 'iso' | 'blue';

interface Labels {
  bf: string;
  cap: string;
  ent: string;
  com: string;
  rec: string;
  cor: string;
  park: string;
}

type Pt = [number, number];
type Pt3 = [number, number, number?];

export const LABELS: Record<PropertyType, Labels> = {
  building: { bf: 'builders and new buildings', cap: 'New building project', ent: 'Main entrance', com: 'Lobby', rec: 'Control room', cor: 'Corridor', park: 'Parking' },
  society: { bf: 'housing societies', cap: 'Housing society', ent: 'Main gate', com: 'Clubhouse', rec: 'Security cabin', cor: 'Internal road', park: 'Visitor parking' },
  home: { bf: 'homes and villas', cap: 'Home or villa', ent: 'Front door', com: 'Living area', rec: 'Utility', cor: 'Garden', park: 'Driveway' },
  shop: { bf: 'shops and offices', cap: 'Shop or office', ent: 'Shop entrance', com: 'Sales floor', rec: 'Back office', cor: 'Counter', park: 'Parking' },
};

export const PROPERTY_TYPES: { v: PropertyType; label: string; icon: string }[] = [
  { v: 'building', label: 'Building', icon: 'M4 21V6l8-3 8 3v15M4 21h16M9 9h2M13 9h2M9 13h2M13 13h2M10 21v-4h4v4' },
  { v: 'society', label: 'Housing society', icon: 'M3 21V10l5-3 5 3v11M13 21V4l8 3v14M3 21h18M6 12h4M6 16h4M16 10h2M16 14h2' },
  { v: 'home', label: 'Home', icon: 'M3 11l9-8 9 8M5 9.5V21h14V9.5M10 21v-6h4v6' },
  { v: 'shop', label: 'Shop or office', icon: 'M3 9l1.5-5h15L21 9M3 9c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3M5 12v9h14v-9M10 21v-5h4v5' },
];

export const LEGEND: { k: Zone; label: string }[] = [
  { k: 'ent', label: 'Entrances and exits' },
  { k: 'park', label: 'Outdoor and parking' },
  { k: 'com', label: 'Common areas' },
  { k: 'rec', label: 'Recording room' },
];

/* ---------- shared helpers ---------- */
let gid = 0;
let idPrefix = 'cg';
const r1 = (n: number): number => +n.toFixed(1);

function wedge(z: Zone, a: Pt, p1In: Pt, p2In: Pt, k: number): string {
  const sh = (q: Pt): Pt => [r1(a[0] + (q[0] - a[0]) * 0.94), r1(a[1] + (q[1] - a[1]) * 0.94)];
  const p1 = sh(p1In);
  const p2 = sh(p2In);
  const mx = (p1[0] + p2[0]) / 2;
  const my = (p1[1] + p2[1]) / 2;
  const cx = a[0] + (mx - a[0]) * 1.18;
  const cy = a[1] + (my - a[1]) * 1.18;
  const r = Math.max(Math.hypot(p1[0] - a[0], p1[1] - a[1]), Math.hypot(p2[0] - a[0], p2[1] - a[1]), Math.hypot(mx - a[0], my - a[1]) * 1.15).toFixed(1);
  const id = `${idPrefix}${++gid}`;
  return (
    `<g class="sw" data-z="${z}" style="--k:${k};transform-origin:${a[0]}px ${a[1]}px">` +
    `<radialGradient id="${id}" class="z-${z}" gradientUnits="userSpaceOnUse" cx="${a[0]}" cy="${a[1]}" r="${r}">` +
    `<stop offset="0" style="stop-color:var(--f)" stop-opacity=".62"/><stop offset="1" style="stop-color:var(--f)" stop-opacity=".1"/></radialGradient>` +
    `<path class="cone z-${z}" fill="url(#${id})" d="M${a.join(' ')}L${p1.join(' ')}Q${r1(cx)} ${r1(cy)} ${p2.join(' ')}Z"/></g>`
  );
}

function camg(z: Zone, x: number, y: number, sc = 1.2): string {
  return (
    `<g data-z="${z}" transform="translate(${x} ${y}) scale(${sc})"><circle class="camring" r="8.5"/><circle class="cam" r="8.5"/>` +
    `<circle class="recdot" cx="6.6" cy="-6.6" r="2.6"/>` +
    `<path class="camp" d="M-4.6 -2.4h6a1.2 1.2 0 0 1 1.2 1.2v2.4a1.2 1.2 0 0 1-1.2 1.2h-6a1.2 1.2 0 0 1-1.2-1.2v-2.4a1.2 1.2 0 0 1 1.2-1.2zM2.6 -.5L5.8 -2.2v4.4L2.6 .5"/></g>`
  );
}

/* ---------- plan view ---------- */
const cone = (z: Zone, p: [Pt, Pt, Pt], k: number): string => wedge(z, p[0], p[1], p[2], k);
const dot = (z: Zone, x: number, y: number): string => camg(z, x, y);
const area = (z: Zone, x: number, y: number, w: number, h: number): string => `<rect class="area z-${z}" data-z="${z}" x="${x}" y="${y}" width="${w}" height="${h}" rx="3"/>`;
const bld = (x: number, y: number, w: number, h: number): string => `<rect class="bld" x="${x}" y="${y}" width="${w}" height="${h}" rx="3"/>`;
const wl = (d: string): string => `<path class="wall" d="${d}"/>`;
const door = (z: Zone, x: number, y: number, w: number, h: number): string => `<rect class="door z-${z}" data-z="${z}" x="${x}" y="${y}" width="${w}" height="${h}" rx="2"/>`;
const lb = (x: number, y: number, t: string, z: Zone, sm = false): string => `<text class="lab${sm ? ' sm' : ''}" data-z="${z}" x="${x}" y="${y}">${t}</text>`;
const two = (x: number, y: number): string => `<g class="tw" transform="translate(${x} ${y})"><rect class="two" x="-3.5" y="-9" width="7" height="18" rx="3.5"/><path class="twoh" d="M-6 -4.5H6"/></g>`;
function bikes(x: number, y: number, cols: number, rows: number, dx: number, dy: number): string {
  let o = '';
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) o += two(x + i * dx, y + j * dy);
  return o;
}
const pier = (x: number, y: number): string => `<rect class="pier" x="${x - 3}" y="${y - 5}" width="6" height="10" rx="1"/>`;
const cw = (d: string): string => `<path class="cwall" d="${d}"/>`;
const rick = (x: number, y: number): string => `<g transform="translate(${x} ${y})"><rect class="car" x="-11" y="-6" width="22" height="12" rx="5"/><path class="twoh" d="M5 -6V6"/></g>`;

function wrapFlat(v: PropertyType, inner: string): string {
  const L = LABELS[v];
  return `<svg viewBox="0 0 360 226" role="img" aria-label="Illustrative plan view of a ${L.cap.toLowerCase()}. Cameras cover the ${L.ent.toLowerCase()}, ${L.com.toLowerCase()}, ${L.rec.toLowerCase()} and ${L.park.toLowerCase()}.">${inner}</svg>`;
}

const FLAT: Record<PropertyType, (L: Labels) => string> = {
  building: (L) =>
    cw('M42 214H8V8H352V214H98') + pier(44, 214) + pier(96, 214) + area('park', 265, 30, 82, 170) + bikes(290, 50, 2, 5, 34, 25) + bld(20, 20, 230, 170) + wl('M160 20V110M20 110H250M120 110V190') +
    cone('ent', [[70, 182], [30, 122], [110, 122]], 0) + cone('com', [[90, 28], [35, 108], [145, 108]], 1) + cone('com', [[240, 150], [128, 126], [128, 186]], 2) + cone('rec', [[205, 28], [168, 96], [242, 96]], 3) + cone('park', [[268, 115], [346, 36], [346, 196]], 4) +
    door('ent', 50, 186, 40, 7) + dot('ent', 70, 182) + dot('com', 90, 28) + dot('com', 240, 150) + dot('rec', 205, 28) + dot('park', 268, 115) +
    lb(52, 206, L.ent, 'ent') + lb(28, 37, L.com, 'com') + lb(166, 54, L.rec, 'rec', true) + lb(130, 176, L.cor, 'com', true) + lb(272, 194, L.park, 'park'),
  society: (L) =>
    '<path class="road" d="M150 206V100H300M26 100H150"/><path class="roadc" d="M150 206V100H300M26 100H150"/>' +
    wl('M10 10H350V206H10Z') + pier(128, 206) + pier(172, 206) + bld(28, 26, 72, 50) + bld(118, 26, 72, 50) + bld(208, 26, 72, 50) +
    bld(28, 122, 86, 50) + area('com', 28, 122, 86, 50) + area('park', 204, 122, 90, 60) + bikes(216, 136, 5, 2, 15, 24) + bld(168, 170, 32, 24) + area('rec', 168, 170, 32, 24) + rick(84, 100) +
    cone('ent', [[150, 200], [108, 142], [192, 142]], 0) + cone('com', [[154, 76], [122, 98], [186, 98]], 1) + cone('com', [[296, 100], [214, 90], [214, 110]], 2) + cone('com', [[114, 148], [144, 122], [144, 176]], 3) + cone('park', [[248, 122], [206, 178], [290, 178]], 4) +
    door('ent', 132, 203, 36, 6) + dot('ent', 150, 200) + dot('com', 154, 76) + dot('com', 296, 100) + dot('com', 114, 148) + dot('park', 248, 122) + dot('rec', 184, 182) +
    lb(54, 52, 'Block A', 'com', true) + lb(144, 52, 'Block B', 'com', true) + lb(234, 52, 'Block C', 'com', true) + lb(34, 148, L.com, 'com') + lb(210, 138, L.park, 'park', true) + lb(172, 203, L.rec, 'rec', true) + lb(74, 198, L.ent, 'ent') + lb(232, 98, L.cor, 'com', true),
  home: (L) =>
    wl('M10 10H350V206H10Z') + pier(66, 206) + pier(124, 206) + area('park', 250, 36, 90, 164) +
    '<rect class="car" x="270" y="140" width="30" height="52" rx="8"/>' + bikes(274, 62, 3, 1, 22, 0) + '<path class="dash" d="M95 206V146"/>' +
    bld(46, 34, 176, 106) + wl('M134 34V140M134 88H222') + area('rec', 134, 88, 88, 52) +
    cone('ent', [[95, 146], [55, 202], [135, 202]], 0) + cone('com', [[60, 40], [46, 104], [128, 104]], 1) + cone('rec', [[178, 94], [148, 128], [214, 128]], 2) + cone('park', [[232, 100], [346, 48], [346, 194]], 3) +
    door('ent', 78, 137, 34, 6) + door('ent', 70, 203, 50, 5) + dot('ent', 95, 146) + dot('com', 60, 40) + dot('rec', 178, 94) + dot('park', 232, 100) +
    lb(76, 56, L.com, 'com') + lb(142, 48, 'Bedroom', 'com', true) + lb(142, 104, L.rec, 'rec', true) + lb(124, 182, L.ent, 'ent') + lb(256, 52, L.park, 'park') + lb(20, 196, 'Gate', 'ent', true),
  shop: (L) =>
    '<rect class="roadi" x="0" y="206" width="360" height="20"/><path class="roadc" style="stroke-width:1.2" d="M0 216H360"/>' + rick(312, 216) + area('park', 284, 50, 66, 122) + bikes(300, 78, 2, 4, 26, 24) + bld(30, 28, 236, 156) +
    '<rect class="shelf" x="58" y="68" width="124" height="10"/><rect class="shelf" x="58" y="94" width="124" height="10"/><rect class="shelf" x="58" y="120" width="124" height="10"/><rect class="shelf" x="196" y="128" width="58" height="20"/>' +
    wl('M186 28V92M186 92H266') + area('rec', 186, 28, 80, 64) +
    cone('ent', [[132, 178], [84, 132], [180, 132]], 0) + cone('com', [[40, 38], [176, 58], [176, 150]], 1) + cone('com', [[258, 160], [198, 150], [198, 178]], 2) + cone('rec', [[226, 34], [192, 86], [262, 86]], 3) + cone('park', [[276, 118], [348, 56], [348, 180]], 4) +
    door('ent', 96, 181, 72, 7) + '<path class="shut" d="M98 183.2H166M98 185H166M98 186.8H166"/>' + door('park', 263, 102, 6, 32) + dot('ent', 132, 178) + dot('com', 40, 38) + dot('com', 258, 160) + dot('rec', 226, 34) + dot('park', 276, 118) +
    lb(98, 200, L.ent, 'ent') + lb(60, 52, L.com, 'com') + lb(194, 66, L.rec, 'rec', true) + lb(204, 142, L.cor, 'com', true) + lb(288, 64, L.park, 'park', true),
};

/* ---------- isometric ---------- */
const S = 0.62;
const OX = 130;
const OY = 62;
const P = (x: number, y: number, z = 0): Pt => [r1(OX + (x - y) * 0.866 * S), r1(OY + (x + y) * 0.5 * S - z)];
const pj = (p: Pt3): Pt => P(p[0], p[1], p[2] ?? 0);
const poly = (a: Pt3[]): string => a.map((p) => pj(p).join(',')).join(' ');
/* ground shadows are collected while a drawing is built and inserted under the cones, so they never cover buildings */
let shadows: string[] = [];
const pg = (cls: string, a: Pt3[], z?: Zone): string => `<polygon class="${cls}${z ? ` z-${z}` : ''}"${z ? ` data-z="${z}"` : ''} points="${poly(a)}"/>`;
function box(x: number, y: number, w: number, d: number, h: number, o: { z?: number; noroof?: boolean } = {}): string {
  const z0 = o.z ?? 0;
  const H = z0 + h;
  if (z0 === 0 && h >= 9) {
    const dx = h * 0.5;
    const dy = h * 0.32;
    shadows.push(pg('shd', [[x, y], [x + w, y], [x + w + dx, y + dy], [x + w + dx, y + d + dy], [x + dx, y + d + dy], [x, y + d]]));
  }
  return (
    pg('face-l', [[x, y + d, z0], [x + w, y + d, z0], [x + w, y + d, H], [x, y + d, H]]) +
    pg('face-r', [[x + w, y, z0], [x + w, y + d, z0], [x + w, y + d, H], [x + w, y, H]]) +
    (o.noroof ? '' : pg('roof', [[x, y, H], [x + w, y, H], [x + w, y + d, H], [x, y + d, H]]))
  );
}
const zroof = (x: number, y: number, w: number, d: number, H: number, z: Zone): string => pg('area', [[x, y, H], [x + w, y, H], [x + w, y + d, H], [x, y + d, H]], z);
const gnd = (x: number, y: number, w: number, d: number, z: Zone): string => pg('area', [[x, y, 0], [x + w, y, 0], [x + w, y + d, 0], [x, y + d, 0]], z);
const icone = (z: Zone, p: [Pt3, Pt3, Pt3], k: number): string => {
  const q = p.map(pj);
  return wedge(z, q[0], q[1], q[2], k);
};
const idot = (z: Zone, x: number, y: number, h: number): string => {
  const p = P(x, y, h);
  return camg(z, p[0], p[1], 0.95);
};
function ilab(x: number, y: number, t: string, z: Zone, sm = false, zz = 0): string {
  const p = P(x, y, zz);
  return `<text class="lab${sm ? ' sm' : ''}" data-z="${z}" text-anchor="middle" x="${p[0]}" y="${p[1]}">${t}</text>`;
}
const wpath = (d: string): string => `<path class="wall" d="${d}"/>`;
const outline = (x: number, y: number, w: number, d: number, H: number): string =>
  `M${P(x, y, H)} L${P(x + w, y, H)} L${P(x + w, y + d, H)} L${P(x, y + d, H)} Z M${P(x, y + d, H)} L${P(x, y + d)} L${P(x + w, y + d)} L${P(x + w, y)} L${P(x + w, y, H)} M${P(x + w, y + d, H)} L${P(x + w, y + d)}`;
function winsL(x: number, y: number, w: number, d: number, H: number, n: number, rows: number, r0: number): string {
  let o = '';
  const gw = w / n;
  const fh = H / (rows + 1);
  for (let r = r0; r <= rows; r++)
    for (let c = 0; c < n; c++) {
      const p = x + c * gw + gw * 0.22;
      const q = x + c * gw + gw * 0.72;
      const z0 = r * fh + fh * 0.22;
      const z1 = z0 + fh * 0.5;
      o += `<polygon class="win" points="${poly([[p, y + d, z0], [q, y + d, z0], [q, y + d, z1], [p, y + d, z1]])}"/>`;
    }
  return o;
}
function winsR(x: number, y: number, w: number, d: number, H: number, n: number, rows: number, r0: number): string {
  let o = '';
  const gd = d / n;
  const fh = H / (rows + 1);
  for (let r = r0; r <= rows; r++)
    for (let c = 0; c < n; c++) {
      const p = y + c * gd + gd * 0.22;
      const q = y + c * gd + gd * 0.72;
      const z0 = r * fh + fh * 0.22;
      const z1 = z0 + fh * 0.5;
      o += `<polygon class="win" points="${poly([[x + w, p, z0], [x + w, q, z0], [x + w, q, z1], [x + w, p, z1]])}"/>`;
    }
  return o;
}
function bikesI(x: number, y: number, cols: number, rows: number, dx: number, dy: number): string {
  let o = '';
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) o += box(x + i * dx, y + j * dy, 6, 11, 5);
  return o;
}
const shutI = (x0: number, x1: number, y: number, zs: number[]): string => `<path class="shut" d="${zs.map((z) => `M${P(x0, y, z)} L${P(x1, y, z)}`).join(' ')}"/>`;

const ISO: Record<PropertyType, (L: Labels) => string> = {
  building: (L) => {
    const H = 46;
    return (
      gnd(215, 20, 85, 165, 'park') + bikesI(230, 34, 2, 5, 36, 30) + icone('ent', [[75, 140], [32, 206], [122, 206]], 0) + icone('park', [[190, 92], [298, 28], [298, 182]], 1) +
      box(0, 0, 190, 140, H) + zroof(6, 6, 116, 74, H, 'com') + zroof(132, 6, 52, 74, H, 'rec') + box(150, 98, 16, 16, 10, { z: H }) + box(10, 102, 22, 24, 9, { z: H }) +
      pg('door', [[60, 140, 0], [92, 140, 0], [92, 140, 18], [60, 140, 18]], 'ent') + winsL(0, 0, 190, 140, H, 7, 3, 1) + winsR(0, 0, 190, 140, H, 5, 3, 0) +
      wpath(outline(0, 0, 190, 140, H)) + idot('ent', 75, 140, 26) + idot('park', 190, 92, 30) +
      ilab(48, 176, L.ent, 'ent') + ilab(60, 40, 'Common area', 'com', true, H) + ilab(158, 30, 'Recording', 'rec', true, H) + ilab(255, 198, L.park, 'park')
    );
  },
  society: (L) => {
    const H = 50;
    const blk = (x: number): string => box(x, 6, 44, 36, H) + winsL(x, 6, 44, 36, H, 3, 3, 0) + winsR(x, 6, 44, 36, H, 2, 3, 0) + box(x + 4, 10, 12, 12, 9, { z: H });
    return (
      pg('roadi', [[-5, 56], [305, 56], [305, 72], [-5, 72]]) + pg('roadi', [[140, 72], [156, 72], [156, 206], [140, 206]]) +
      gnd(196, 92, 84, 56, 'park') + bikesI(206, 102, 5, 2, 15, 26) +
      icone('ent', [[148, 190], [124, 146], [172, 146]], 0) + icone('com', [[130, 42], [104, 78], [156, 78]], 1) + icone('park', [[196, 120], [280, 100], [280, 142]], 2) +
      blk(8) + blk(108) + blk(208) + box(14, 90, 72, 44, 16) + zroof(14, 90, 72, 44, 16, 'com') + winsL(14, 90, 72, 44, 16, 4, 0, 0) + box(162, 160, 24, 20, 14) + zroof(162, 160, 24, 20, 14, 'rec') +
      box(133, 194, 4, 4, 12) + box(159, 194, 4, 4, 12) + pg('door', [[140, 196, 0], [156, 196, 0], [156, 196, 9], [140, 196, 9]], 'ent') +
      wpath(outline(108, 6, 44, 36, H)) + idot('ent', 148, 190, 16) + idot('com', 130, 42, 30) + idot('park', 196, 120, 8) +
      ilab(92, -14, 'Blocks', 'com', true, H + 6) + ilab(50, 112, L.com, 'com', true, 16) + ilab(92, 214, L.ent, 'ent') + ilab(250, 152, L.park, 'park', true) + ilab(176, 150, 'Security', 'rec', true, 14)
    );
  },
  home: (L) => {
    const H = 38;
    return (
      box(6, -2, 290, 3, 7) + box(6, -2, 3, 202, 7) + gnd(10, 112, 130, 78, 'com') + gnd(170, 60, 110, 130, 'park') + bikesI(190, 76, 3, 1, 30, 0) + box(216, 124, 22, 40, 9) + `<path class="dash" d="M${P(69, 112)} L${P(69, 190)}"/>` +
      icone('ent', [[69, 100], [44, 170], [96, 170]], 0) + icone('park', [[150, 60], [272, 40], [272, 150]], 1) +
      box(100, 4, 40, 16, 12) + zroof(100, 4, 40, 16, 12, 'rec') +
      box(30, 24, 120, 76, H) + winsL(30, 24, 120, 76, H, 4, 1, 0) + winsR(30, 24, 120, 76, H, 3, 1, 0) + box(118, 30, 14, 14, 10, { z: H }) +
      pg('door', [[60, 100, 0], [78, 100, 0], [78, 100, 14], [60, 100, 14]], 'ent') + box(52, 100, 36, 14, 3, { z: 16 }) + box(52, 112, 3, 3, 16) + box(85, 112, 3, 3, 16) +
      wpath(outline(30, 24, 120, 76, H)) + idot('ent', 69, 100, 26) + idot('park', 150, 60, 28) +
      box(6, 198, 38, 3, 7) + box(94, 198, 202, 3, 7) + box(293, -2, 3, 202, 7) +
      ilab(69, 214, L.ent, 'ent') + ilab(34, 132, 'Garden', 'com', true) + ilab(228, 168, L.park, 'park') + ilab(120, 12, L.rec, 'rec', true, 12)
    );
  },
  shop: (L) => {
    const H = 36;
    return (
      gnd(205, 30, 90, 100, 'park') + bikesI(222, 44, 2, 4, 34, 24) + icone('ent', [[86, 120], [50, 186], [132, 186]], 0) + icone('park', [[194, 70], [286, 34], [286, 126]], 1) +
      box(24, 20, 170, 100, H) + zroof(30, 26, 108, 88, H, 'com') + zroof(148, 26, 40, 50, H, 'rec') +
      pg('door', [[52, 120, 0], [120, 120, 0], [120, 120, 13], [52, 120, 13]], 'ent') + shutI(52, 120, 120, [3, 6, 9, 12]) + pg('sign', [[40, 120, 15], [132, 120, 15], [132, 120, 21], [40, 120, 21]]) +
      winsL(24, 20, 170, 100, H, 6, 1, 1) + winsR(24, 20, 170, 100, H, 4, 1, 0) +
      wpath(outline(24, 20, 170, 100, H)) + idot('ent', 86, 120, 28) + idot('park', 194, 70, 30) +
      ilab(86, 146, L.ent, 'ent') + ilab(70, 44, L.com, 'com', true, H) + ilab(170, 40, L.rec, 'rec', true, H) + ilab(250, 138, L.park, 'park')
    );
  },
};

function wrapIso(v: PropertyType, inner: string, blueprint: boolean): string {
  const L = LABELS[v];
  const ground = pg('ground', [[-10, -10], [310, -10], [310, 210], [-10, 210]]);
  const kind = blueprint ? 'Blueprint' : 'Isometric';
  let defs: string;
  let backdrop = '';
  if (blueprint) {
    defs =
      '<defs><pattern id="bpH1" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V5" stroke="#7FD0FF" stroke-opacity=".35" stroke-width="1"/></pattern>' +
      '<pattern id="bpH2" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><path d="M0 0V4" stroke="#7FD0FF" stroke-opacity=".5" stroke-width=".8"/></pattern></defs>';
    let grid = '';
    for (let i = 0; i <= 320; i += 20) grid += `<path class="gridl" d="M${P(i - 10, -10)} L${P(i - 10, 210)}"/><path class="gridl" d="M${P(-10, i - 10)} L${P(310, i - 10)}"/>`;
    backdrop = `<rect class="bg" width="314" height="224"/>${grid}`;
  } else {
    defs =
      '<defs><linearGradient id="isoL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DCE6F8"/><stop offset="1" stop-color="#B9CAEA"/></linearGradient>' +
      '<linearGradient id="isoR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B7C9EB"/><stop offset="1" stop-color="#93AAD6"/></linearGradient>' +
      '<linearGradient id="isoT" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E9F0FC"/></linearGradient></defs>';
  }
  return `<svg viewBox="0 0 314 224" role="img" aria-label="Illustrative ${kind.toLowerCase()} view of a ${L.cap.toLowerCase()}. Cameras cover the ${L.ent.toLowerCase()} and ${L.park.toLowerCase()}.">${defs}${backdrop}${ground}${inner}</svg>`;
}

/** Returns the full SVG markup for a property drawing. `prefix` keeps gradient ids unique per drawing on the page. */
export function renderPlan(style: PlanStyle, v: PropertyType, prefix = 'cg'): string {
  gid = 0;
  idPrefix = prefix;
  const L = LABELS[v];
  if (style === 'flat') return wrapFlat(v, FLAT[v](L));
  shadows = [];
  let inner = ISO[v](L);
  if (style === 'iso') inner = inner.replace('<g class="sw"', `${shadows.join('')}<g class="sw"`);
  return wrapIso(v, inner, style === 'blue');
}

/** Drawing plus its zone legend, exactly as the page and the picker script render it. */
export function planMarkup(style: PlanStyle, v: PropertyType, prefix = 'cg'): string {
  const svg = renderPlan(style, v, prefix);
  if (style === 'blue') return `<div class="plan st-blue">${svg}</div>`;
  const legend = LEGEND.map((i) => `<button type="button" class="lg" data-k="${i.k}" aria-pressed="false"><i class="sw-${i.k}"></i>${i.label}</button>`).join('');
  return `<div class="plan st-${style}">${svg}<div class="legend" role="group" aria-label="Highlight a zone">${legend}</div></div>`;
}
