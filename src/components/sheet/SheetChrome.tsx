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

  // Mobile: which sheet is on screen (the track is a vertical stack there).
  const [mActive, setMActive] = useState(0);
  const [indexOpen, setIndexOpen] = useState(false);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const panels = stations
      .map((st) => track.querySelector<HTMLElement>(`[data-panel="${st.id}"]`))
      .filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) setMActive(panels.indexOf(e.target as HTMLElement)); });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    panels.forEach((p) => io.observe(p));
    return () => io.disconnect();
  }, [stations, trackRef]);
  useEffect(() => {
    document.documentElement.classList.toggle('index-open', indexOpen);
    return () => document.documentElement.classList.remove('index-open');
  }, [indexOpen]);
  const mSt = stations[mActive] ?? stations[0];

  const active = stations[s.activeIndex] ?? stations[0];
  const letters = Array.from({ length: 60 }, (_, i) => String.fromCharCode(65 + (i % 26)) + (i >= 26 ? Math.floor(i / 26) : ''));

  return (
    <>
    {/* ── Mobile title block (bottom) + index sheet ── */}
    <div className="sheet-mchrome">
      <div className="sheet-mprog" style={{ transform: `scaleX(${s.progress})` }} />
      <button type="button" className="sheet-mtitle" onClick={() => setIndexOpen(true)} aria-label="Open sheet index">
        <span className="sheet-mnum">{mSt?.sheet}</span>
        <span className="sheet-mlabel">{mSt?.label}</span>
        <span className="sheet-mcount">{String(mActive + 1).padStart(2, '0')} / {String(stations.length).padStart(2, '0')}</span>
        <span className="sheet-mindex">Index</span>
      </button>
      <div className={`sheet-mindex-sheet${indexOpen ? ' open' : ''}`} role="dialog" aria-label="Sheet index">
        <div className="sheet-mindex-head">
          <span>Drawing index</span>
          <button type="button" onClick={() => setIndexOpen(false)} aria-label="Close">✕</button>
        </div>
        <ol>
          {stations.map((st, i) => (
            <li key={st.id} className={i === mActive ? 'on' : ''}>
              <button type="button" onClick={() => { setIndexOpen(false); setTimeout(() => gotoPanel(st.id), 60); }}>
                <b>{st.sheet}</b><span>{st.label}</span><i />
              </button>
            </li>
          ))}
        </ol>
        <div className="sheet-mindex-foot">ULTERNATIVE SPACES · DRAWING SET · KAMPALA — JUBA</div>
      </div>
    </div>

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

        /* ── mobile chrome ── */
        .sheet-mchrome { display: none; }
        @media (max-width: 899px) {
          .sheet-mchrome { display: block; position: fixed; left: 0; right: 0; bottom: 0; z-index: 180; font-family: var(--font-mono); }
          .sheet-mprog { position: absolute; left: 0; top: 0; height: 2px; width: 100%; background: var(--accent); transform-origin: left; z-index: 2; }
          .sheet-mtitle { width: 100%; display: grid; grid-template-columns: auto 1fr auto auto; align-items: center; gap: 12px; padding: 12px 20px calc(12px + env(safe-area-inset-bottom)); background: rgba(var(--bg-rgb),.9); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 0; border-top: 1px solid rgba(var(--fg-rgb),.18); color: var(--parch); text-align: left; cursor: pointer; }
          .sheet-mnum { font-size: 10px; letter-spacing: .2em; color: var(--accent); }
          .sheet-mlabel { font-size: 10px; letter-spacing: .2em; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .sheet-mcount { font-size: 9px; letter-spacing: .15em; color: rgba(var(--fg-rgb),.5); }
          .sheet-mindex { font-size: 9px; letter-spacing: .2em; text-transform: uppercase; border: 1px solid rgba(var(--fg-rgb),.3); padding: 5px 9px; }
          .sheet-mindex-sheet { position: fixed; inset: 0; z-index: 190; background: var(--ink); color: var(--parch); padding: 20px 20px calc(20px + env(safe-area-inset-bottom)); display: flex; flex-direction: column; overflow-y: auto; -webkit-overflow-scrolling: touch; transform: translateY(100%); transition: transform .55s var(--ease-out); }
          html.index-open, html.index-open body { overflow: hidden; }
          .sheet-mindex-sheet.open { transform: none; }
          .sheet-mindex-head { display: flex; justify-content: space-between; align-items: center; font-size: 9px; letter-spacing: .3em; text-transform: uppercase; color: rgba(var(--fg-rgb),.6); padding-bottom: 14px; border-bottom: 1px solid rgba(var(--fg-rgb),.3); }
          .sheet-mindex-head button { background: none; border: 1px solid rgba(var(--fg-rgb),.3); color: var(--parch); width: 36px; height: 36px; font-size: 14px; cursor: pointer; }
          .sheet-mindex-sheet ol { list-style: none; margin: 0; padding: 0; flex: 1; display: flex; flex-direction: column; justify-content: center; min-height: 0; }
          .sheet-mindex-sheet li button { width: 100%; display: flex; align-items: center; gap: 14px; background: none; border: 0; border-bottom: 1px solid rgba(var(--fg-rgb),.14); padding: clamp(9px, 1.6vh, 16px) 0; color: var(--parch); cursor: pointer; text-align: left; }
          .sheet-mindex-sheet li b { font-weight: 400; font-size: 10px; letter-spacing: .2em; color: rgba(var(--fg-rgb),.5); min-width: 44px; }
          .sheet-mindex-sheet li span { font-family: var(--font-syne); font-weight: 600; font-size: clamp(19px, min(6vw, 3.6vh), 30px); letter-spacing: -0.02em; text-transform: none; }
          .sheet-mindex-sheet li i { flex: 1; height: 1px; background: rgba(var(--fg-rgb),.2); }
          .sheet-mindex-sheet li.on b, .sheet-mindex-sheet li.on span { color: var(--accent); }
          .sheet-mindex-sheet li.on i { background: var(--accent); }
          .sheet-mindex-foot { font-size: 8px; letter-spacing: .3em; color: rgba(var(--fg-rgb),.45); padding-top: 16px; }
        }
      `}</style>
    </div>
    </>
  );
}
