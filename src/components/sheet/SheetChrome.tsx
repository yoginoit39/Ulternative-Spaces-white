'use client';
import { useEffect, useRef, useState } from 'react';
import { subscribeSheet, gotoPanel, type SheetState } from './useSheetScroll';

export interface Station { id: string; label: string; sheet: string }

/**
 * Fixed drawing-sheet furniture: grid letters along the top, a station
 * ruler along the bottom, and a live title block. Desktop only.
 */
export default function SheetChrome({ stations, trackRef }: {
  stations: Station[];
  trackRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [s, setS] = useState<SheetState>({ progress: 0, x: 0, maxX: 1, activeIndex: 0 });
  const [marks, setMarks] = useState<number[]>([]);
  const lettersRef = useRef<HTMLDivElement>(null);
  const needleRef = useRef<HTMLDivElement>(null);

  useEffect(() => subscribeSheet((st) => {
    setS(st);
    if (lettersRef.current) lettersRef.current.style.transform = `translate3d(${st.x}px,0,0)`;
    if (needleRef.current) needleRef.current.style.left = `${st.progress * 100}%`;
  }), []);

  // Station positions as a fraction of total travel.
  useEffect(() => {
    const compute = () => {
      const track = trackRef.current;
      if (!track) return;
      const max = Math.max(1, track.scrollWidth - window.innerWidth);
      setMarks(stations.map((st) => {
        const p = track.querySelector<HTMLElement>(`[data-panel="${st.id}"]`);
        return p ? Math.min(1, p.offsetLeft / max) : 0;
      }));
    };
    compute();
    const t = setTimeout(compute, 600);
    window.addEventListener('resize', compute);
    return () => { clearTimeout(t); window.removeEventListener('resize', compute); };
  }, [stations, trackRef]);

  const active = stations[s.activeIndex] ?? stations[0];
  const letters = Array.from({ length: 60 }, (_, i) => String.fromCharCode(65 + (i % 26)) + (i >= 26 ? Math.floor(i / 26) : ''));

  return (
    <div className="sheet-chrome" aria-hidden>
      {/* Top grid letters */}
      <div className="sheet-grid-row">
        <div ref={lettersRef} className="sheet-grid-letters">
          {letters.map((l, i) => (
            <span key={i} style={{ left: `${i * 20}vw` }}>{l}</span>
          ))}
        </div>
      </div>

      {/* Left stamp */}
      <div className="sheet-stamp">ULTERNATIVE SPACES · DRAWING SET · 2026 · KAMPALA — JUBA</div>

      {/* Bottom ruler */}
      <div className="sheet-ruler">
        <div className="sheet-ruler-ticks">
          {Array.from({ length: 101 }, (_, i) => (
            <i key={i} className={i % 10 === 0 ? 'maj' : i % 5 === 0 ? 'mid' : ''} style={{ left: `${i}%` }} />
          ))}
        </div>
        <div className="sheet-ruler-fill" style={{ transform: `scaleX(${s.progress})` }} />
        <div ref={needleRef} className="sheet-needle"><span>{String(Math.round(s.progress * 100)).padStart(3, '0')}</span></div>
        {stations.map((st, i) => (
          <button
            key={st.id}
            className={`sheet-station${i === s.activeIndex ? ' on' : ''}`}
            style={{ left: `${(marks[i] ?? 0) * 100}%` }}
            onClick={() => gotoPanel(st.id)}
          >
            <b />
            <span>{st.sheet} {st.label}</span>
          </button>
        ))}
      </div>

      {/* Title block */}
      <div className="sheet-title">
        <div><em>SHEET</em><strong>{active?.sheet} / {String(stations.length).padStart(2, '0')}</strong></div>
        <div><em>DRAWING</em><strong>{active?.label}</strong></div>
        <div><em>SCALE</em><strong>1 : 100</strong></div>
        <div><em>REV</em><strong>A</strong></div>
      </div>

      <style>{`
        .sheet-chrome { position: fixed; inset: 0; pointer-events: none; z-index: 150; font-family: var(--font-mono); }
        .sheet-grid-row { position: absolute; top: 64px; left: 0; right: 0; height: 22px; overflow: hidden; border-bottom: 1px solid rgba(var(--fg-rgb),0.08); }
        .sheet-grid-letters { position: absolute; top: 0; left: 0; height: 100%; width: 1200vw; will-change: transform; }
        .sheet-grid-letters span { position: absolute; top: 0; font-size: 9px; letter-spacing: .2em; color: rgba(var(--fg-rgb),.35); padding-left: 6px; border-left: 1px solid rgba(var(--fg-rgb),.15); height: 100%; line-height: 22px; }
        .sheet-stamp { position: absolute; left: 14px; top: 50%; transform: rotate(-90deg) translateX(-50%); transform-origin: left center; font-size: 8px; letter-spacing: .3em; color: rgba(var(--fg-rgb),.4); white-space: nowrap; }
        .sheet-ruler { position: absolute; left: 0; right: 0; bottom: 0; height: 68px; background: rgba(var(--bg-rgb),.92); backdrop-filter: blur(10px); border-top: 1px solid rgba(var(--fg-rgb),.15); pointer-events: auto; }
        .sheet-ruler-ticks { position: absolute; left: 0; right: 0; top: 0; height: 14px; }
        .sheet-ruler-ticks i { position: absolute; top: 0; width: 1px; height: 5px; background: rgba(var(--fg-rgb),.35); }
        .sheet-ruler-ticks i.mid { height: 8px; }
        .sheet-ruler-ticks i.maj { height: 14px; background: var(--parch); }
        .sheet-ruler-fill { position: absolute; left: 0; top: 0; height: 2px; width: 100%; background: var(--accent); transform-origin: left; }
        .sheet-needle { position: absolute; top: 0; width: 1px; height: 100%; background: var(--accent); transform: translateX(-.5px); transition: none; }
        .sheet-needle span { position: absolute; top: 18px; left: 6px; font-size: 9px; letter-spacing: .15em; color: var(--accent); }
        .sheet-station { position: absolute; top: 0; height: 100%; background: none; border: 0; padding: 0; cursor: pointer; transform: translateX(-4px); font-family: inherit; width: 8px; }
        .sheet-station b { display: block; width: 7px; height: 7px; border: 1px solid var(--parch); background: var(--ink); transform: rotate(45deg); margin-top: 8px; transition: background .3s; }
        .sheet-station span { position: absolute; left: 50%; transform: translateX(-50%); bottom: 7px; font-size: 9px; letter-spacing: .18em; color: rgba(var(--fg-rgb),.62); white-space: nowrap; transition: color .3s; }
        .sheet-station.on b { background: var(--accent); border-color: var(--accent); }
        .sheet-station.on span { color: var(--accent); font-weight: 500; font-size: 10px; letter-spacing: .2em; }
        .sheet-station:hover span { color: var(--accent); }
        .sheet-station:first-of-type { transform: translateX(4px); }
        .sheet-station:first-of-type span { left: -4px; transform: none; }
        .sheet-station:last-of-type { transform: translateX(-12px); }
        .sheet-station:last-of-type span { left: auto; right: -4px; transform: none; }
        .sheet-title { position: absolute; right: 0; bottom: 68px; display: flex; border: 1px solid rgba(var(--fg-rgb),.2); border-right: 0; border-bottom: 0; background: rgba(var(--bg-rgb),.92); }
        .sheet-title > div { padding: 8px 14px; border-right: 1px solid rgba(var(--fg-rgb),.2); display: flex; flex-direction: column; gap: 3px; }
        .sheet-title > div:last-child { border-right: 0; }
        .sheet-title > div:last-child strong { color: var(--accent); }
        .sheet-title em { font-style: normal; font-size: 8px; letter-spacing: .25em; color: rgba(var(--fg-rgb),.6); }
        .sheet-title strong { font-weight: 400; font-size: 10px; letter-spacing: .15em; color: var(--parch); white-space: nowrap; }
        @media (max-width: 899px) { .sheet-chrome { display: none; } }
      `}</style>
    </div>
  );
}
