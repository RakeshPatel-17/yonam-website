import type { PropertyType, Zone } from './plans';

/** 3D scene descriptions in the same grid units as the isometric drawings (x, y on the ground, h upwards). Illustrative, not to scale. */
export interface BoxDef {
  x: number;
  y: number;
  w: number;
  d: number;
  h: number;
  /** base height, for things standing on roofs or slabs */
  z?: number;
  kind: 'mass' | 'low' | 'cabin' | 'pier' | 'wall' | 'tank' | 'slab' | 'car';
  /** number of storeys, drawn as bands on the facade */
  floors?: number;
}
export interface CamDef {
  zone: Exclude<Zone, 'rec'>;
  x: number;
  y: number;
  h: number;
  /** ground points the coverage wedge spans */
  to: [[number, number], [number, number]];
}
export interface PadDef {
  x: number;
  y: number;
  w: number;
  d: number;
  zone: Zone;
}
export interface SceneDef {
  roads: [number, number, number, number][];
  pads: PadDef[];
  boxes: BoxDef[];
  bikes: { x: number; y: number; cols: number; rows: number; dx: number; dy: number }[];
  cams: CamDef[];
}

const tower = (x: number, y: number): BoxDef[] => [
  { x, y, w: 44, d: 36, h: 50, kind: 'mass', floors: 4 },
  { x: x + 4, y: y + 10, w: 12, d: 12, h: 9, z: 50, kind: 'tank' },
];

export const SCENES: Record<PropertyType, SceneDef> = {
  building: {
    roads: [],
    pads: [{ x: 215, y: 20, w: 85, d: 165, zone: 'park' }],
    boxes: [
      { x: 0, y: 0, w: 190, d: 140, h: 46, kind: 'mass', floors: 4 },
      { x: 150, y: 98, w: 16, d: 16, h: 10, z: 46, kind: 'tank' },
      { x: 10, y: 102, w: 22, d: 24, h: 9, z: 46, kind: 'low' },
    ],
    bikes: [{ x: 230, y: 34, cols: 2, rows: 5, dx: 36, dy: 30 }],
    cams: [
      { zone: 'ent', x: 75, y: 140, h: 26, to: [[32, 206], [122, 206]] },
      { zone: 'park', x: 190, y: 92, h: 30, to: [[298, 28], [298, 182]] },
    ],
  },
  society: {
    roads: [[-5, 56, 305, 72], [140, 72, 156, 206]],
    pads: [{ x: 196, y: 92, w: 84, d: 56, zone: 'park' }],
    boxes: [
      ...tower(8, 6),
      ...tower(108, 6),
      ...tower(208, 6),
      { x: 14, y: 90, w: 72, d: 44, h: 16, kind: 'low', floors: 1 },
      { x: 162, y: 160, w: 24, d: 20, h: 14, kind: 'cabin' },
      { x: 133, y: 194, w: 4, d: 4, h: 12, kind: 'pier' },
      { x: 159, y: 194, w: 4, d: 4, h: 12, kind: 'pier' },
    ],
    bikes: [{ x: 206, y: 102, cols: 5, rows: 2, dx: 15, dy: 26 }],
    cams: [
      { zone: 'ent', x: 148, y: 190, h: 16, to: [[124, 146], [172, 146]] },
      { zone: 'com', x: 130, y: 42, h: 30, to: [[104, 78], [156, 78]] },
      { zone: 'park', x: 196, y: 120, h: 8, to: [[280, 100], [280, 142]] },
    ],
  },
  home: {
    roads: [],
    pads: [
      { x: 10, y: 112, w: 130, d: 78, zone: 'com' },
      { x: 170, y: 60, w: 110, d: 130, zone: 'park' },
    ],
    boxes: [
      { x: 6, y: -2, w: 290, d: 3, h: 7, kind: 'wall' },
      { x: 6, y: -2, w: 3, d: 202, h: 7, kind: 'wall' },
      { x: 293, y: -2, w: 3, d: 202, h: 7, kind: 'wall' },
      { x: 6, y: 198, w: 38, d: 3, h: 7, kind: 'wall' },
      { x: 94, y: 198, w: 202, d: 3, h: 7, kind: 'wall' },
      { x: 100, y: 4, w: 40, d: 16, h: 12, kind: 'low' },
      { x: 30, y: 24, w: 120, d: 76, h: 38, kind: 'mass', floors: 2 },
      { x: 118, y: 30, w: 14, d: 14, h: 10, z: 38, kind: 'tank' },
      { x: 52, y: 100, w: 36, d: 14, h: 3, z: 16, kind: 'slab' },
      { x: 52, y: 112, w: 3, d: 3, h: 16, kind: 'pier' },
      { x: 85, y: 112, w: 3, d: 3, h: 16, kind: 'pier' },
      { x: 216, y: 124, w: 22, d: 40, h: 9, kind: 'car' },
    ],
    bikes: [{ x: 190, y: 76, cols: 3, rows: 1, dx: 30, dy: 0 }],
    cams: [
      { zone: 'ent', x: 69, y: 100, h: 26, to: [[44, 170], [96, 170]] },
      { zone: 'park', x: 150, y: 60, h: 28, to: [[272, 40], [272, 150]] },
    ],
  },
  shop: {
    roads: [],
    pads: [{ x: 205, y: 30, w: 90, d: 100, zone: 'park' }],
    boxes: [
      { x: 24, y: 20, w: 170, d: 100, h: 36, kind: 'mass', floors: 2 },
      { x: 40, y: 121, w: 92, d: 2, h: 6, z: 15, kind: 'pier' },
    ],
    bikes: [{ x: 222, y: 44, cols: 2, rows: 4, dx: 34, dy: 24 }],
    cams: [
      { zone: 'ent', x: 86, y: 120, h: 28, to: [[50, 186], [132, 186]] },
      { zone: 'park', x: 194, y: 70, h: 30, to: [[286, 34], [286, 126]] },
    ],
  },
};
