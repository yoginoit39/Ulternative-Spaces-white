/**
 * Procedural architectural drawing: a building section on the left, a floor
 * plan on the right, plus datums, grid bubbles, hatching, dimension strings
 * and annotations. Every stroke carries a [t0, t1] window on the 0..1 sheet
 * progress so the whole thing is drawn in drafter order as the user scrolls.
 *
 * Coordinate space is a 1600 x 900 sheet.
 */

export interface Stroke {
  d: string;
  t0: number;
  t1: number;
  layer: 'grid' | 'drawing' | 'hatch' | 'dim' | 'note';
  w?: number;          // stroke width
  dash?: string;       // dasharray for dashed datums
  fill?: string;       // filled shapes (north arrow)
}
export interface Label {
  x: number; y: number; text: string; t: number;
  size?: number; anchor?: 'start' | 'middle' | 'end'; rotate?: number; layer: Stroke['layer'];
}
export interface Drawing { strokes: Stroke[]; labels: Label[] }

const ROOMS: Record<string, [string, string, string, string]> = {
  Residential:  ['LIVING', 'KITCHEN', 'BED 01', 'TERRACE'],
  Commercial:   ['LOBBY', 'RETAIL', 'OFFICE', 'PLAZA'],
  Interiors:    ['LOUNGE', 'DINING', 'SUITE', 'BATH'],
  'Mixed-Use':  ['RETAIL', 'OFFICE', 'APARTMENT', 'COURT'],
  Architecture: ['GALLERY', 'FOYER', 'STUDIO', 'GARDEN'],
};

function seeded(seed: number) {
  let s = seed >>> 0 || 1;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

/** Spread a list of strokes evenly over a progress window, with overlap so the pen never stalls. */
function stage(list: Omit<Stroke, 't0' | 't1'>[], T0: number, T1: number, overlap = 0.35): Stroke[] {
  const n = list.length;
  const span = (T1 - T0) / (n - (n - 1) * overlap);
  return list.map((s, i) => {
    const t0 = T0 + i * span * (1 - overlap);
    return { ...s, t0, t1: Math.min(T1, t0 + span) };
  });
}

const L = (x1: number, y1: number, x2: number, y2: number) => `M ${x1} ${y1} L ${x2} ${y2}`;
const R = (x: number, y: number, w: number, h: number) => `M ${x} ${y} h ${w} v ${h} h ${-w} Z`;

export function buildDrawing(category = 'Residential', seed = 7): Drawing {
  const rnd = seeded(seed * 7919 + category.length);
  const floors = 3 + Math.floor(rnd() * 4);          // 3..6
  const rooms = ROOMS[category] ?? ROOMS.Residential;

  const strokes: Stroke[] = [];
  const labels: Label[] = [];

  /* ── geometry constants ── */
  const GY = 700;                 // ground line
  const FH = Math.min(96, (GY - 150) / floors); // floor height
  const SL = 14;                  // slab thickness
  const SX0 = 160, SX1 = 780;     // section walls (outer faces)
  const WT = 12;                  // wall thickness
  const gridX = [SX0, 300, 460, 620, SX1];

  /* ── 1. grid & datums ── */
  const grid: Omit<Stroke, 't0' | 't1'>[] = [];
  gridX.forEach((x) => {
    grid.push({ d: L(x, 120, x, 770), layer: 'grid', w: 0.6, dash: '6 6' });
    grid.push({ d: `M ${x - 14} 106 a 14 14 0 1 0 28 0 a 14 14 0 1 0 -28 0`, layer: 'grid', w: 0.8 });
  });
  for (let f = 0; f <= floors; f++) {
    const y = GY - f * FH;
    grid.push({ d: L(100, y, 880, y), layer: 'grid', w: 0.6, dash: '10 6 2 6' });
  }
  strokes.push(...stage(grid, 0.0, 0.14));
  gridX.forEach((x, i) => labels.push({ x, y: 110, text: String.fromCharCode(65 + i), t: 0.04 + i * 0.02, anchor: 'middle', layer: 'grid' }));
  for (let f = 0; f <= floors; f++) labels.push({ x: 92, y: GY - f * FH - 4, text: f === 0 ? '±0.00' : `+${(f * 3.2).toFixed(2)}`, t: 0.06 + f * 0.012, anchor: 'end', size: 9, layer: 'grid' });

  /* ── 2. section outline ── */
  const sec: Omit<Stroke, 't0' | 't1'>[] = [];
  sec.push({ d: L(60, GY, 900, GY), layer: 'drawing', w: 1.6 });                         // ground
  sec.push({ d: R(SX0 - WT, GY - floors * FH, WT, floors * FH), layer: 'drawing', w: 1.1 }); // left wall
  sec.push({ d: R(SX1, GY - floors * FH, WT, floors * FH), layer: 'drawing', w: 1.1 });      // right wall
  for (let f = 1; f <= floors; f++) {
    const y = GY - f * FH;
    sec.push({ d: R(SX0 - WT, y, SX1 - SX0 + 2 * WT, SL), layer: 'drawing', w: 1.1 });      // slab
  }
  const roofY = GY - floors * FH;
  sec.push({ d: L(SX0 - WT - 40, roofY, SX1 + WT + 40, roofY), layer: 'drawing', w: 1.4 });   // roof overhang
  sec.push({ d: R(SX0 - WT, roofY - 26, WT, 26), layer: 'drawing', w: 1 });                    // parapets
  sec.push({ d: R(SX1, roofY - 26, WT, 26), layer: 'drawing', w: 1 });
  strokes.push(...stage(sec, 0.08, 0.38));

  /* ── 3. section details ── */
  const det: Omit<Stroke, 't0' | 't1'>[] = [];
  // columns on grid lines
  [300, 460].forEach((x) => {
    for (let f = 0; f < floors; f++) {
      const y = GY - (f + 1) * FH + SL;
      det.push({ d: R(x - 5, y, 10, FH - SL), layer: 'drawing', w: 0.8 });
    }
  });
  // stair zigzag between 620 and 740
  for (let f = 0; f < floors; f++) {
    const yb = GY - f * FH, yt = yb - FH + SL;
    const steps = 9;
    let d = `M 640 ${yb}`;
    for (let s = 1; s <= steps; s++) {
      const x = 640 + (s / steps) * 100, y = yb - (s / steps) * (yb - yt);
      d += ` L ${x - 100 / steps} ${y} L ${x} ${y}`;
    }
    det.push({ d, layer: 'drawing', w: 0.9 });
  }
  // balconies on right, alternating floors
  for (let f = 1; f < floors; f += 1) {
    if (f % 2 === (floors % 2)) continue;
    const y = GY - f * FH;
    det.push({ d: R(SX1 + WT, y, 64, SL), layer: 'drawing', w: 1 });
    det.push({ d: L(SX1 + WT + 62, y, SX1 + WT + 62, y - 40), layer: 'drawing', w: 0.8 });
    det.push({ d: L(SX1 + WT, y - 40, SX1 + WT + 62, y - 40), layer: 'drawing', w: 0.8 });
    for (let i = 1; i < 6; i++) det.push({ d: L(SX1 + WT + i * 10, y, SX1 + WT + i * 10, y - 40), layer: 'drawing', w: 0.5 });
  }
  // glazing lines on left face (windows) — double line per floor
  for (let f = 0; f < floors; f++) {
    const y = GY - f * FH - 20;
    det.push({ d: L(SX0 - WT - 2, y, SX0 - WT - 2, y - FH + SL + 34), layer: 'drawing', w: 0.5 });
    det.push({ d: L(SX0 - WT + 2, y, SX0 - WT + 2, y - FH + SL + 34), layer: 'drawing', w: 0.5 });
  }
  strokes.push(...stage(det, 0.24, 0.5));

  /* ── 4. plan ── */
  const PX0 = 940, PY0 = 230, PW = 560, PH = 470;
  const PX1 = PX0 + PW, PY1 = PY0 + PH;
  const mx = PX0 + Math.round(PW * (0.4 + rnd() * 0.12));   // partition x
  const my = PY0 + Math.round(PH * (0.58 + rnd() * 0.08));  // partition y
  const plan: Omit<Stroke, 't0' | 't1'>[] = [];
  plan.push({ d: R(PX0, PY0, PW, PH), layer: 'drawing', w: 1.4 });
  plan.push({ d: R(PX0 + 10, PY0 + 10, PW - 20, PH - 20), layer: 'drawing', w: 1.4 });
  plan.push({ d: L(mx, PY0 + 10, mx, my), layer: 'drawing', w: 1.1 });
  plan.push({ d: L(mx + 8, PY0 + 10, mx + 8, my), layer: 'drawing', w: 1.1 });
  plan.push({ d: L(PX0 + 10, my, PX1 - 10, my), layer: 'drawing', w: 1.1 });
  plan.push({ d: L(PX0 + 10, my + 8, PX1 - 10, my + 8), layer: 'drawing', w: 1.1 });
  strokes.push(...stage(plan, 0.3, 0.56));

  const pd: Omit<Stroke, 't0' | 't1'>[] = [];
  // doors: swing arcs
  const door = (x: number, y: number, r: number, dir: 1 | -1, vertical = false) => {
    if (vertical) {
      pd.push({ d: L(x, y, x + dir * r, y), layer: 'drawing', w: 0.8 });
      pd.push({ d: `M ${x + dir * r} ${y} A ${r} ${r} 0 0 ${dir === 1 ? 0 : 1} ${x} ${y + r}`, layer: 'drawing', w: 0.6 });
    } else {
      pd.push({ d: L(x, y, x, y - dir * r), layer: 'drawing', w: 0.8 });
      pd.push({ d: `M ${x} ${y - dir * r} A ${r} ${r} 0 0 ${dir === 1 ? 1 : 0} ${x + r} ${y}`, layer: 'drawing', w: 0.6 });
    }
  };
  door(mx + 8, PY0 + 60, 56, 1, true);
  door(PX0 + 120, my, 56, 1);
  door(PX0 + 60, PY1 - 10, 60, -1);
  // windows: triple lines across the outer wall
  const win = (x: number, y: number, len: number, horizontal: boolean) => {
    for (let i = 0; i < 3; i++) {
      const o = i * 5;
      pd.push(horizontal
        ? { d: L(x, y + o, x + len, y + o), layer: 'drawing', w: 0.6 }
        : { d: L(x + o, y, x + o, y + len), layer: 'drawing', w: 0.6 });
    }
  };
  win(PX0 + 60, PY0, 110, true); win(PX0 + 260, PY0, 110, true); win(PX1 - 160, PY0, 110, true);
  win(PX1 - 10, PY0 + 80, 100, false); win(PX1 - 10, PY0 + 260, 100, false);
  win(PX0, PY0 + 120, 120, false);
  // furniture hints
  pd.push({ d: `M ${mx + 140} ${PY0 + 140} a 44 44 0 1 0 88 0 a 44 44 0 1 0 -88 0`, layer: 'drawing', w: 0.6 }); // table
  pd.push({ d: R(PX0 + 60, PY0 + 90, 150, 60), layer: 'drawing', w: 0.6 });   // sofa
  pd.push({ d: R(PX0 + 60, my + 60, 120, 150), layer: 'drawing', w: 0.6 });   // bed
  pd.push({ d: L(PX0 + 60, my + 100, PX0 + 180, my + 100), layer: 'drawing', w: 0.5 });
  // terrace dashed outline (open air)
  pd.push({ d: R(mx + 60, my + 40, PX1 - mx - 110, PH - (my - PY0) - 80), layer: 'drawing', w: 0.7, dash: '4 4' });
  strokes.push(...stage(pd, 0.44, 0.72));
  labels.push(
    { x: PX0 + 40, y: PY0 + 50, text: rooms[0], t: 0.6, layer: 'drawing' },
    { x: mx + 40, y: PY0 + 50, text: rooms[1], t: 0.63, layer: 'drawing' },
    { x: PX0 + 40, y: my + 46, text: rooms[2], t: 0.66, layer: 'drawing' },
    { x: mx + 90, y: my + 46, text: rooms[3], t: 0.69, layer: 'drawing' },
  );

  /* ── 5. hatching ── */
  const hatch: Omit<Stroke, 't0' | 't1'>[] = [];
  for (let f = 1; f <= floors; f++) {
    const y = GY - f * FH;
    for (let x = SX0 - WT; x < SX1 + WT - SL; x += 9) hatch.push({ d: L(x, y + SL, x + SL, y), layer: 'hatch', w: 0.5 });
  }
  for (let x = 60; x < 900; x += 12) hatch.push({ d: L(x, GY + 18, x + 18, GY), layer: 'hatch', w: 0.5 });
  // plan outer wall hatch (poché) — short diagonals along the top wall
  for (let x = PX0; x < PX1 - 10; x += 8) hatch.push({ d: L(x, PY0 + 10, x + 10, PY0), layer: 'hatch', w: 0.45 });
  for (let y = PY0; y < PY1 - 10; y += 8) hatch.push({ d: L(PX0, y + 10, PX0 + 10, y), layer: 'hatch', w: 0.45 });
  strokes.push(...stage(hatch, 0.58, 0.82, 0.8));

  /* ── 6. dimensions ── */
  const dim: Omit<Stroke, 't0' | 't1'>[] = [];
  const tick = (x: number, y: number) => L(x - 4, y + 4, x + 4, y - 4);
  dim.push({ d: L(SX0 - WT, 790, SX1 + WT, 790), layer: 'dim', w: 0.7 });
  gridX.forEach((x) => dim.push({ d: tick(x, 790), layer: 'dim', w: 0.9 }));
  dim.push({ d: L(SX0 - WT, 822, SX1 + WT, 822), layer: 'dim', w: 0.7 });
  dim.push({ d: tick(SX0 - WT, 822), layer: 'dim', w: 0.9 });
  dim.push({ d: tick(SX1 + WT, 822), layer: 'dim', w: 0.9 });
  dim.push({ d: L(SX1 + 110, GY, SX1 + 110, roofY), layer: 'dim', w: 0.7 });
  for (let f = 0; f <= floors; f++) dim.push({ d: tick(SX1 + 110, GY - f * FH), layer: 'dim', w: 0.9 });
  dim.push({ d: L(PX0, PY0 - 40, PX1, PY0 - 40), layer: 'dim', w: 0.7 });
  [PX0, mx + 4, PX1].forEach((x) => dim.push({ d: tick(x, PY0 - 40), layer: 'dim', w: 0.9 }));
  dim.push({ d: L(PX1 + 40, PY0, PX1 + 40, PY1), layer: 'dim', w: 0.7 });
  [PY0, my + 4, PY1].forEach((y) => dim.push({ d: tick(PX1 + 40, y), layer: 'dim', w: 0.9 }));
  strokes.push(...stage(dim, 0.7, 0.9));
  for (let i = 0; i < gridX.length - 1; i++) {
    labels.push({ x: (gridX[i] + gridX[i + 1]) / 2, y: 784, text: `${((gridX[i + 1] - gridX[i]) * 27).toLocaleString('en').replace(',', ' ')}`, t: 0.76 + i * 0.02, anchor: 'middle', size: 9, layer: 'dim' });
  }
  labels.push({ x: (SX0 + SX1) / 2, y: 816, text: `${((SX1 - SX0 + 2 * WT) * 27).toLocaleString('en').replace(',', ' ')}`, t: 0.84, anchor: 'middle', size: 9, layer: 'dim' });
  labels.push({ x: SX1 + 118, y: GY - (floors * FH) / 2, text: `${(floors * 3.2).toFixed(1)} m`, t: 0.86, anchor: 'start', size: 9, layer: 'dim' });
  labels.push({ x: (PX0 + mx) / 2, y: PY0 - 46, text: `${((mx - PX0) * 27).toLocaleString('en').replace(',', ' ')}`, t: 0.86, anchor: 'middle', size: 9, layer: 'dim' });
  labels.push({ x: (mx + PX1) / 2, y: PY0 - 46, text: `${((PX1 - mx) * 27).toLocaleString('en').replace(',', ' ')}`, t: 0.87, anchor: 'middle', size: 9, layer: 'dim' });
  labels.push({ x: PX1 + 46, y: (PY0 + my) / 2, text: `${((my - PY0) * 27).toLocaleString('en').replace(',', ' ')}`, t: 0.88, anchor: 'start', size: 9, rotate: 90, layer: 'dim' });

  /* ── 7. annotations ── */
  const note: Omit<Stroke, 't0' | 't1'>[] = [];
  // leaders
  note.push({ d: `M ${SX0 + 120} ${GY - 2 * FH + 4} L ${SX0 + 60} ${GY - 2 * FH - 60} L ${SX0 - 20} ${GY - 2 * FH - 60}`, layer: 'note', w: 0.6 });
  note.push({ d: `M ${SX1 + 6} ${GY - FH * 0.5} L ${SX1 + 60} ${GY - FH * 0.5 + 50} L ${SX1 + 140} ${GY - FH * 0.5 + 50}`, layer: 'note', w: 0.6 });
  // north arrow
  note.push({ d: `M ${PX1 - 30} 150 a 26 26 0 1 0 52 0 a 26 26 0 1 0 -52 0`, layer: 'note', w: 0.8 });
  note.push({ d: `M ${PX1 - 4} 128 L ${PX1 + 8} 166 L ${PX1 - 4} 158 L ${PX1 - 16} 166 Z`, layer: 'note', w: 0.8, fill: 'rgba(0,0,0,.25)' });
  // scale bar
  const sbx = PX0, sby = PY1 + 70;
  note.push({ d: L(sbx, sby, sbx + 200, sby), layer: 'note', w: 1 });
  [0, 40, 80, 120, 200].forEach((o) => note.push({ d: L(sbx + o, sby - 5, sbx + o, sby + 5), layer: 'note', w: 0.8 }));
  note.push({ d: R(sbx, sby - 3, 40, 3), layer: 'note', w: 0.3, fill: 'rgba(0,0,0,.3)' });
  note.push({ d: R(sbx + 80, sby - 3, 40, 3), layer: 'note', w: 0.3, fill: 'rgba(0,0,0,.3)' });
  // revision cloud around a plan window
  let cloud = `M ${PX1 - 176} ${PY0 - 18}`;
  for (let i = 0; i < 8; i++) cloud += ` a 12 12 0 0 1 20 0`;
  cloud += ` a 12 12 0 0 1 0 22 a 12 12 0 0 1 0 22`;
  for (let i = 0; i < 8; i++) cloud += ` a 12 12 0 0 1 -20 0`;
  cloud += ` a 12 12 0 0 1 0 -22 a 12 12 0 0 1 0 -22`;
  note.push({ d: cloud, layer: 'note', w: 0.7 });
  // section cut marker on plan
  note.push({ d: L(PX0 - 30, PY0 + 200, PX0 - 6, PY0 + 200), layer: 'note', w: 1.2 });
  note.push({ d: L(PX1 + 6, PY0 + 200, PX1 + 30, PY0 + 200), layer: 'note', w: 1.2 });
  note.push({ d: L(PX0 - 30, PY0 + 200, PX0 - 30, PY0 + 214), layer: 'note', w: 1.2 });
  note.push({ d: L(PX1 + 30, PY0 + 200, PX1 + 30, PY0 + 214), layer: 'note', w: 1.2 });
  strokes.push(...stage(note, 0.8, 1.0));
  labels.push(
    { x: SX0 - 24, y: GY - 2 * FH - 66, text: 'RC SLAB · 200 THK', t: 0.84, anchor: 'end', size: 9, layer: 'note' },
    { x: SX1 + 144, y: GY - FH * 0.5 + 46, text: 'STONE CLADDING', t: 0.86, anchor: 'start', size: 9, layer: 'note' },
    { x: PX1 - 4, y: 188, text: 'N', t: 0.88, anchor: 'middle', size: 10, layer: 'note' },
    { x: sbx, y: sby + 18, text: '0', t: 0.9, anchor: 'middle', size: 8, layer: 'note' },
    { x: sbx + 80, y: sby + 18, text: '2', t: 0.9, anchor: 'middle', size: 8, layer: 'note' },
    { x: sbx + 200, y: sby + 18, text: '5 m', t: 0.9, anchor: 'middle', size: 8, layer: 'note' },
    { x: PX0 - 34, y: PY0 + 230, text: 'A', t: 0.92, anchor: 'middle', size: 10, layer: 'note' },
    { x: PX1 + 30, y: PY0 + 230, text: 'A', t: 0.92, anchor: 'middle', size: 10, layer: 'note' },
    { x: (SX0 + SX1) / 2, y: 862, text: 'SECTION A-A  ·  1 : 100', t: 0.94, anchor: 'middle', size: 10, layer: 'note' },
    { x: PX0 + PW / 2, y: 862, text: `${category.toUpperCase()}  ·  GROUND FLOOR PLAN  ·  1 : 100`, t: 0.96, anchor: 'middle', size: 10, layer: 'note' },
    { x: PX1 - 176, y: PY0 - 30, text: 'REV A', t: 0.98, anchor: 'end', size: 8, layer: 'note' },
  );

  return { strokes, labels };
}
