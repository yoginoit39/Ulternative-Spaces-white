'use client';
import { useEffect, useMemo, useRef } from 'react';
import { buildDrawing } from './drawing';
import { subscribeSheet } from './useSheetScroll';

const PARALLAX: Record<string, number> = { grid: 0.03, drawing: 0.06, hatch: 0.06, dim: 0.09, note: 0.11 };
const INK: Record<string, string> = {
  grid: 'rgba(0,0,0,.32)', drawing: 'rgba(0,0,0,.55)', hatch: 'rgba(0,0,0,.26)', dim: 'rgba(0,0,0,.5)', note: 'rgba(0,0,0,.58)',
};

/**
 * Fixed SVG behind the sheet. Strokes are drawn with stroke-dashoffset as the
 * sheet progress advances; a pen tip follows the stroke currently being drawn.
 * Pure DOM updates on scroll — no React re-render per frame.
 */
export default function DrawingScene({ category = 'Residential', seed = 7 }: { category?: string; seed?: number }) {
  const { strokes, labels } = useMemo(() => buildDrawing(category, seed), [category, seed]);
  const svgRef = useRef<SVGSVGElement>(null);
  const penRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const paths = Array.from(svg.querySelectorAll<SVGPathElement>('path[data-i]'));
    const lens = paths.map((p) => p.getTotalLength());
    paths.forEach((p, i) => {
      p.style.strokeDasharray = `${lens[i]}`;
      p.style.strokeDashoffset = `${lens[i]}`;
    });
    const texts = Array.from(svg.querySelectorAll<SVGTextElement>('text[data-t]'));
    const layers = Array.from(svg.querySelectorAll<SVGGElement>('g[data-layer]'));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let target = 0;
    let current = -1;
    const pen = penRef.current;

    const render = () => {
      raf = 0;
      // ease toward target so the pen glides rather than jumps on fast wheels
      const p = reduce ? 1 : current < 0 ? target : current + (target - current) * 0.18;
      if (Math.abs(p - current) < 0.0005 && current >= 0) { current = p; return; }
      current = p;

      let penX = -1, penY = -1, penBest = -1;
      strokes.forEach((s, i) => {
        const k = Math.min(1, Math.max(0, (p - s.t0) / (s.t1 - s.t0)));
        paths[i].style.strokeDashoffset = `${lens[i] * (1 - k)}`;
        if (s.fill) paths[i].style.fillOpacity = `${k}`;
        if (k > 0 && k < 1 && s.t0 > penBest) {
          penBest = s.t0;
          const pt = paths[i].getPointAtLength(lens[i] * k);
          penX = pt.x; penY = pt.y;
        }
      });
      texts.forEach((t) => {
        const t0 = Number(t.dataset.t);
        const k = Math.min(1, Math.max(0, (p - t0) / 0.04));
        t.style.opacity = `${k}`;
      });
      layers.forEach((g) => {
        const f = PARALLAX[g.dataset.layer || ''] ?? 0;
        g.setAttribute('transform', `translate(${-(p - 0.5) * 1600 * f} 0)`);
      });
      if (pen) {
        if (penX >= 0) {
          const f = PARALLAX[strokes.find((s) => s.t0 === penBest)?.layer || 'drawing'] ?? 0;
          pen.setAttribute('transform', `translate(${penX - (p - 0.5) * 1600 * f} ${penY})`);
          pen.style.opacity = '1';
        } else {
          pen.style.opacity = '0';
        }
      }
      if (Math.abs(target - current) > 0.0005) raf = requestAnimationFrame(render);
    };

    const unsub = subscribeSheet((s) => {
      target = s.progress;
      if (!raf) raf = requestAnimationFrame(render);
    });
    raf = requestAnimationFrame(render);
    return () => { unsub(); cancelAnimationFrame(raf); };
  }, [strokes]);

  const byLayer = (layer: string) => strokes.map((s, i) => ({ s, i })).filter(({ s }) => s.layer === layer);
  const LAYERS = ['grid', 'drawing', 'hatch', 'dim', 'note'];

  return (
    <svg
      ref={svgRef}
      className="drawing-scene"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', background: '#fff' }}
    >
      {LAYERS.map((layer) => (
        <g key={layer} data-layer={layer} fill="none" stroke={INK[layer]} strokeLinecap="round" strokeLinejoin="round">
          {byLayer(layer).map(({ s, i }) => (
            <path
              key={i}
              data-i={i}
              d={s.d}
              strokeWidth={s.w ?? 0.8}
              strokeDasharray={s.dash}
              fill={s.fill ?? 'none'}
              style={{ fillOpacity: 0, vectorEffect: 'non-scaling-stroke' } as React.CSSProperties}
            />
          ))}
          {labels.filter((l) => l.layer === layer).map((l, j) => (
            <text
              key={j}
              data-t={l.t}
              x={l.x}
              y={l.y}
              fontSize={l.size ?? 10}
              textAnchor={l.anchor ?? 'start'}
              transform={l.rotate ? `rotate(${l.rotate} ${l.x} ${l.y})` : undefined}
              fill={INK[layer]}
              stroke="none"
              style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.18em', opacity: 0 }}
            >
              {l.text}
            </text>
          ))}
        </g>
      ))}
      {/* pen tip */}
      <g ref={penRef} style={{ opacity: 0, transition: 'opacity .3s' }}>
        <circle r="3.2" fill="#000" />
        <circle r="11" fill="none" stroke="rgba(0,0,0,.35)" strokeWidth="0.8" />
        <path d="M -18 0 H -13 M 13 0 H 18 M 0 -18 V -13 M 0 13 V 18" stroke="rgba(0,0,0,.5)" strokeWidth="0.8" />
      </g>
    </svg>
  );
}
