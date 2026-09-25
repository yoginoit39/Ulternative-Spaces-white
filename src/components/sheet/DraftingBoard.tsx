'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * The drafting board on the Contact sheet.
 *
 * 1. When the board scrolls into view, a pen draws a building section stroke
 *    by stroke: ground, walls, slabs, roof, stair, windows, dimensions, sun.
 * 2. Then the pen is handed over: a CAD crosshair follows the cursor with
 *    millimetre coordinates, and dragging sketches red lines on the sheet.
 */

type Stroke = { d: string; w?: number; c?: 'ink' | 'accent' | 'faint'; dash?: string; label?: string };

// Drawing in a 640 × 440 sheet. Scale 1 : 100 → 1px = 20mm for the readout.
const GROUND = 360;
const L1 = 280, L2 = 200, RIDGE = 108;
const XL = 140, XR = 460;

const STROKES: Stroke[] = [
  // ground + earth
  { d: `M 36 ${GROUND} H 604`, w: 1.6 },
  { d: Array.from({ length: 34 }, (_, i) => `M ${44 + i * 17} ${GROUND + 2} l -8 9`).join(' '), w: .8, c: 'faint' },
  // walls
  { d: `M ${XL} ${GROUND} V ${L2}`, w: 1.4 },
  { d: `M ${XR} ${GROUND} V ${L2}`, w: 1.4 },
  { d: `M ${XL + 10} ${GROUND} V ${L2 + 10}`, w: .8, c: 'faint' },
  { d: `M ${XR - 10} ${GROUND} V ${L2 + 10}`, w: .8, c: 'faint' },
  // first-floor slab
  { d: `M ${XL} ${L1} H ${XR}`, w: 1.4 },
  { d: `M ${XL} ${L1 + 8} H ${XR}`, w: .9 },
  { d: Array.from({ length: 16 }, (_, i) => `M ${XL + 8 + i * 20} ${L1 + 8} l 8 -8`).join(' '), w: .6, c: 'faint' },
  // roof slab + pitch
  { d: `M ${XL - 22} ${L2} H ${XR + 22}`, w: 1.4 },
  { d: `M ${XL - 22} ${L2} L 300 ${RIDGE} L ${XR + 22} ${L2}`, w: 1.6 },
  { d: `M ${XL - 10} ${L2 - 8} L 300 ${RIDGE + 8} L ${XR + 10} ${L2 - 8}`, w: .8, c: 'faint', dash: '3 4' },
  // openings
  { d: `M 178 ${GROUND} V ${GROUND - 56} H 214 V ${GROUND}`, w: 1 },
  { d: `M 250 ${GROUND - 14} V ${GROUND - 60} H 330 V ${GROUND - 14} Z`, w: 1 },
  { d: `M 250 ${GROUND - 37} H 330 M 290 ${GROUND - 60} V ${GROUND - 14}`, w: .6, c: 'faint' },
  { d: `M 176 ${L1 - 14} V ${L1 - 62} H 250 V ${L1 - 14} Z`, w: 1 },
  { d: `M 300 ${L1 - 14} V ${L1 - 62} H 374 V ${L1 - 14} Z`, w: 1 },
  { d: `M 176 ${L1 - 38} H 250 M 300 ${L1 - 38} H 374`, w: .6, c: 'faint' },
  // stair
  { d: `M 388 ${GROUND} ${Array.from({ length: 8 }, (_, i) => `V ${GROUND - (i + 1) * 10} H ${388 + (i + 1) * 8}`).join(' ')}`, w: 1 },
  { d: `M 388 ${GROUND} L 452 ${GROUND - 80}`, w: .6, c: 'faint', dash: '2 4' },
  // person for scale
  { d: `M 222 ${GROUND} V ${GROUND - 26} M 222 ${GROUND - 26} m -5 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0 M 214 ${GROUND - 22} h 16 M 222 ${GROUND} l -6 0 M 222 ${GROUND} l 6 0`, w: .9, c: 'accent' },
  // tree
  { d: `M 84 ${GROUND} V ${GROUND - 44}`, w: 1 },
  { d: `M 84 ${GROUND - 44} m -26 0 a 26 26 0 1 0 52 0 a 26 26 0 1 0 -52 0`, w: 1, dash: '2 3' },
  // level dimension string
  { d: `M 540 ${GROUND} V ${RIDGE}`, w: .8, c: 'accent' },
  { d: `M 528 ${GROUND} h 24 M 528 ${L1} h 24 M 528 ${L2} h 24 M 528 ${RIDGE} h 24`, w: .8, c: 'accent' },
  { d: `M 536 ${GROUND + 4} l 8 -8 M 536 ${L1 + 4} l 8 -8 M 536 ${L2 + 4} l 8 -8 M 536 ${RIDGE + 4} l 8 -8`, w: 1.2, c: 'accent' },
  // width dimension
  { d: `M ${XL} ${GROUND + 34} H ${XR}`, w: .8, c: 'accent' },
  { d: `M ${XL} ${GROUND + 26} v 16 M ${XR} ${GROUND + 26} v 16 M ${XL - 4} ${GROUND + 38} l 8 -8 M ${XR - 4} ${GROUND + 38} l 8 -8`, w: 1, c: 'accent' },
  // sun path
  { d: `M 380 62 A 150 150 0 0 1 596 210`, w: .8, c: 'accent', dash: '3 5' },
  { d: `M 520 92 m -11 0 a 11 11 0 1 0 22 0 a 11 11 0 1 0 -22 0`, w: 1.2, c: 'accent' },
  { d: `M 520 74 v -8 M 538 92 h 8 M 533 79 l 6 -6 M 507 79 l -6 -6`, w: .9, c: 'accent' },
  // section marker
  { d: `M 72 132 m -12 0 a 12 12 0 1 0 24 0 a 12 12 0 1 0 -24 0 M 72 144 V 168 l -6 -8 M 72 168 l 6 -8`, w: 1 },
];

const LABELS: { x: number; y: number; t: string; anchor?: 'start' | 'end' | 'middle'; accent?: boolean }[] = [
  { x: 556, y: GROUND - 5, t: '±0,000', accent: true },
  { x: 556, y: L1 - 5, t: '+3,600', accent: true },
  { x: 556, y: L2 - 5, t: '+7,200', accent: true },
  { x: 556, y: RIDGE - 5, t: '+11,800', accent: true },
  { x: 300, y: GROUND + 30, t: '16 000', anchor: 'middle', accent: true },
  { x: 72, y: 135, t: 'A', anchor: 'middle' },
  { x: 36, y: 424, t: 'SECTION A-A · 1 : 100 · NEXT PROJECT · REV —' },
  { x: 604, y: 424, t: 'DRAWN LIVE', anchor: 'end' },
];

const TOTAL_MS = 6400;

export default function DraftingBoard() {
  const svgRef = useRef<SVGSVGElement>(null);
  const penRef = useRef<SVGGElement>(null);
  const inkRef = useRef<SVGGElement>(null);
  const crossRef = useRef<SVGGElement>(null);
  const readRef = useRef<HTMLSpanElement>(null);
  const [phase, setPhase] = useState<'idle' | 'drawing' | 'yours' | 'sketched'>('idle');
  const [seed, setSeed] = useState(0); // bump to replay

  /* ── auto-draw ── */
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const paths = Array.from(svg.querySelectorAll<SVGPathElement>('path[data-s]'));
    const texts = Array.from(svg.querySelectorAll<SVGTextElement>('text[data-l]'));
    const lens = paths.map((p) => p.getTotalLength());
    const total = lens.reduce((a, b) => a + b, 0);
    // time budget per stroke ∝ length, with a floor so tiny marks still register
    const dur = lens.map((l) => Math.max(120, (l / total) * TOTAL_MS));
    const starts: number[] = [];
    dur.reduce((acc, d, i) => { starts[i] = acc; return acc + d; }, 0);
    const end = starts[starts.length - 1] + dur[dur.length - 1];

    paths.forEach((p, i) => { p.style.strokeDasharray = `${lens[i]}`; p.style.strokeDashoffset = `${lens[i]}`; });
    texts.forEach((t) => { t.style.opacity = '0'; });
    const pen = penRef.current;
    if (pen) pen.style.opacity = '0';

    let raf = 0, t0 = 0, started = false;
    const frame = (now: number) => {
      if (!t0) t0 = now;
      const t = now - t0;
      let penSet = false;
      paths.forEach((p, i) => {
        const k = Math.min(1, Math.max(0, (t - starts[i]) / dur[i]));
        p.style.strokeDashoffset = `${lens[i] * (1 - k)}`;
        if (!penSet && k > 0 && k < 1 && pen) {
          const pt = p.getPointAtLength(lens[i] * k);
          pen.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
          pen.style.opacity = '1';
          penSet = true;
        }
      });
      texts.forEach((t2) => {
        const at = Number(t2.dataset.l) * end;
        t2.style.opacity = `${Math.min(1, Math.max(0, (t - at) / 400))}`;
      });
      if (t < end + 400) raf = requestAnimationFrame(frame);
      else { if (pen) pen.style.opacity = '0'; setPhase((ph) => (ph === 'drawing' ? 'yours' : ph)); }
    };

    const io = new IntersectionObserver((es) => {
      if (started) return;
      if (es.some((e) => e.isIntersecting)) {
        started = true;
        setPhase('drawing');
        raf = requestAnimationFrame(frame);
        io.disconnect();
      }
    }, { threshold: 0.35 });
    io.observe(svg);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [seed]);

  /* ── your turn: crosshair + sketching ── */
  useEffect(() => {
    const svg = svgRef.current;
    const cross = crossRef.current;
    const ink = inkRef.current;
    if (!svg || !cross || !ink) return;
    let line: SVGPolylineElement | null = null;
    let pts: string[] = [];

    const toSvg = (e: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      const vb = svg.viewBox.baseVal;
      // preserveAspectRatio meet: uniform scale, centred
      const s = Math.min(r.width / vb.width, r.height / vb.height);
      const ox = (r.width - vb.width * s) / 2, oy = (r.height - vb.height * s) / 2;
      return { x: (e.clientX - r.left - ox) / s, y: (e.clientY - r.top - oy) / s };
    };
    const fmt = (v: number) => String(Math.max(0, Math.round(v * 20))).padStart(5, '0').replace(/(\d{2})(\d{3})/, '$1 $2');

    const move = (e: PointerEvent) => {
      const { x, y } = toSvg(e);
      cross.style.opacity = '1';
      cross.setAttribute('transform', `translate(${x} ${y})`);
      if (readRef.current) readRef.current.textContent = `X ${fmt(x)}  Y ${fmt(440 - y)}`;
      if (line) {
        pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
        line.setAttribute('points', pts.join(' '));
      }
    };
    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      svg.setPointerCapture(e.pointerId);
      const { x, y } = toSvg(e);
      pts = [`${x.toFixed(1)},${y.toFixed(1)}`];
      line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      line.setAttribute('points', pts[0]);
      line.setAttribute('class', 'db-you');
      ink.appendChild(line);
      setPhase('sketched');
    };
    const up = () => { line = null; pts = []; };
    const leave = () => { cross.style.opacity = '0'; };

    svg.addEventListener('pointermove', move);
    svg.addEventListener('pointerdown', down);
    svg.addEventListener('pointerup', up);
    svg.addEventListener('pointercancel', up);
    svg.addEventListener('pointerleave', leave);
    return () => {
      svg.removeEventListener('pointermove', move);
      svg.removeEventListener('pointerdown', down);
      svg.removeEventListener('pointerup', up);
      svg.removeEventListener('pointercancel', up);
      svg.removeEventListener('pointerleave', leave);
    };
  }, []);

  const clear = () => {
    inkRef.current?.replaceChildren();
    setPhase('yours');
  };
  const replay = () => {
    inkRef.current?.replaceChildren();
    setSeed((s) => s + 1);
    setPhase('idle');
  };

  return (
    <div className={`db db-${phase}`} aria-hidden>
      <svg ref={svgRef} viewBox="0 0 640 440" preserveAspectRatio="xMidYMid meet" className="db-svg">
        <defs>
          <pattern id="db-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 H 0 V 20" fill="none" stroke="currentColor" strokeWidth=".4" opacity=".18" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="640" height="440" fill="url(#db-grid)" />
        <rect x=".5" y=".5" width="639" height="439" fill="none" stroke="currentColor" strokeWidth=".8" opacity=".4" />
        {/* corner crop marks */}
        <path d="M 14 0 V 14 M 0 14 H 14 M 626 0 V 14 M 640 14 H 626 M 14 440 V 426 M 0 426 H 14 M 626 440 V 426 M 640 426 H 626" stroke="currentColor" strokeWidth=".8" fill="none" opacity=".6" />

        <g className="db-strokes" key={seed}>
          {STROKES.map((s, i) => (
            <path
              key={i}
              data-s
              d={s.d}
              fill="none"
              stroke={s.c === 'accent' ? 'var(--accent)' : 'currentColor'}
              strokeWidth={s.w ?? 1}
              strokeDasharray={s.dash}
              opacity={s.c === 'faint' ? .45 : 1}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {LABELS.map((l, i) => (
            <text
              key={i}
              data-l={(0.35 + (i / LABELS.length) * 0.6).toFixed(2)}
              x={l.x} y={l.y}
              textAnchor={l.anchor ?? 'start'}
              fill={l.accent ? 'var(--accent)' : 'currentColor'}
              fontFamily="var(--font-mono)"
              fontSize={l.t.length === 1 ? 11 : 7.5}
              letterSpacing={l.t.length === 1 ? 0 : 1.6}
            >{l.t}</text>
          ))}
        </g>

        {/* visitor's sketch */}
        <g ref={inkRef} className="db-ink" />

        {/* pen tip */}
        <g ref={penRef} className="db-pen">
          <circle r="2.2" fill="var(--accent)" />
          <circle r="7" fill="none" stroke="var(--accent)" strokeWidth=".6" opacity=".6" />
          <path d="M 0 -14 V -8 M 0 8 V 14 M -14 0 H -8 M 8 0 H 14" stroke="var(--accent)" strokeWidth=".6" />
        </g>

        {/* CAD crosshair */}
        <g ref={crossRef} className="db-cross">
          <path d="M -640 0 H 640 M 0 -440 V 440" stroke="var(--accent)" strokeWidth=".5" opacity=".55" />
          <rect x="-5" y="-5" width="10" height="10" fill="none" stroke="var(--accent)" strokeWidth=".8" />
        </g>
      </svg>

      <div className="db-bar">
        <span ref={readRef} className="db-read">X 00 000  Y 00 000</span>
        <span className="db-hint">
          {phase === 'drawing' && 'Drawing…'}
          {phase === 'yours' && 'Your turn — drag to sketch'}
          {phase === 'sketched' && <button type="button" onClick={clear}>Clear sketch</button>}
          {phase !== 'drawing' && <button type="button" onClick={replay}>Redraw</button>}
        </span>
      </div>
    </div>
  );
}
