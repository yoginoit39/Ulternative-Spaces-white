'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Nav from '@/components/Nav';
import SmoothScroll from '@/components/SmoothScroll';
import Panel from '@/components/sheet/Panel';
import SheetChrome, { type Station } from '@/components/sheet/SheetChrome';
import { useSheetScroll } from '@/components/sheet/useSheetScroll';
import { usePageTransition } from '@/context/transition';
import { PROJECTS, CATEGORIES, YEARS, storeysOf, type Project } from '@/lib/projects';
import '@/components/sheet/sheet.css';
import './archive.css';

/* Plate widths (vw) on the elevation, by building type. */
const WIDTH: Record<string, number> = {
  Residential: 21, Interiors: 15, Commercial: 26, 'Mixed-Use': 30, Architecture: 23,
};
const LEVEL_MM = 3600; // one storey, in millimetres, for the level labels
const MAX_LEVELS = 4;

const fmt = (mm: number) => `+${(mm / 1000).toFixed(3).replace('.', ',')}`;

export default function ArchiveClient() {
  const [cat, setCat] = useState<string | null>(null);
  // Street order: newest year first, featured buildings first within a year.
  const list = useMemo(() => PROJECTS
    .filter((p) => !cat || p.category === cat)
    .sort((a, b) => Number(b.year) - Number(a.year) || Number(!!b.featured) - Number(!!a.featured)), [cat]);
  const years = useMemo(() => {
    const m = new Map<string, Project[]>();
    list.forEach((p) => { m.set(p.year, [...(m.get(p.year) ?? []), p]); });
    return Array.from(m.entries()).sort((a, b) => Number(b[0]) - Number(a[0]));
  }, [list]);

  return (
    <SmoothScroll>
      <Nav />
      {/* Persistent legend / filter so the street can be re-cut mid-walk */}
      <div className="el-legend" role="tablist" aria-label="Filter the elevation">
        <span className="el-legend-k">Key</span>
        <button type="button" role="tab" aria-selected={!cat} className={!cat ? 'on' : ''} onClick={() => setCat(null)}>
          All <sup>{String(PROJECTS.length).padStart(2, '0')}</sup>
        </button>
        {CATEGORIES.map((c) => (
          <button key={c} type="button" role="tab" aria-selected={cat === c} className={cat === c ? 'on' : ''} onClick={() => setCat(cat === c ? null : c)}>
            {c} <sup>{String(PROJECTS.filter((p) => p.category === c).length).padStart(2, '0')}</sup>
          </button>
        ))}
      </div>

      <Street key={cat ?? 'all'} years={years} list={list} cat={cat} setCat={setCat} />
    </SmoothScroll>
  );
}

/* The whole street re-mounts when the filter changes so the sheet engine re-measures. */
function Street({ years, list, cat, setCat }: {
  years: [string, Project[]][]; list: Project[]; cat: string | null; setCat: (c: string | null) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const navigate = usePageTransition();

  const stations: Station[] = useMemo(() => [
    { id: 'title', label: 'TITLE SHEET', sheet: 'A-000' },
    ...years.map(([y], i) => ({ id: `y${y}`, label: `${y}`, sheet: `A-${String(i + 1).padStart(3, '0')}` })),
    { id: 'end', label: 'NEXT LOT', sheet: `A-${String(years.length + 1).padStart(3, '0')}` },
  ], [years]);
  const ids = useMemo(() => stations.map((s) => s.id), [stations]);

  useSheetScroll(wrapRef, trackRef, ids, true);

  // A re-cut street starts from its title sheet.
  useEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, []);

  const go = (href: string) => (e: React.MouseEvent) => { e.preventDefault(); navigate(href); };
  const total = PROJECTS.length;
  const span = `${YEARS[YEARS.length - 1]} – ${YEARS[0]}`;
  const totalStoreys = list.reduce((n, p) => n + storeysOf(p), 0);
  const cities = Array.from(new Set(PROJECTS.map((p) => p.location.split(',')[0])));
  const numOf = new Map(list.map((p, i) => [p.slug, i + 1])); // running index along the street

  return (
    <>
      <SheetChrome stations={stations} trackRef={trackRef} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div ref={wrapRef} className="sheet-wrap">
        <div ref={trackRef} className="sheet-track el-track">

          {/* ── A-000 · Title sheet ── */}
          <Panel id="title" width="118vw" sheet="A-000" label="STREET ELEVATION" mm="00 000">
            <div className="el-title">
              <div className="el-title-text paper">
                <p className="eyebrow" data-reveal="up">A-000 · Street elevation · {span}</p>
                <h1 className="el-h1" data-reveal="up" data-delay="0.05">
                  The whole<br /><em>street.</em>
                </h1>
                <p className="lede" data-reveal="up" data-delay="0.1">
                  Every building we have drawn, stood side by side on one ground line.
                  <strong> {list.length} of {total} projects</strong>{cat ? ` · ${cat}` : ''}. Walk east.
                  Height is real: one level per storey. Grid lines are years. Click any building to open its drawing set.
                </p>

                <table className="pj-block el-block" data-reveal="up" data-delay="0.18">
                  <tbody>
                    <tr><th>Projects</th><td>{String(total).padStart(2, '0')}</td><th>Storeys</th><td>{String(totalStoreys).padStart(2, '0')}</td></tr>
                    <tr><th>Cities</th><td>{cities.join(' · ')}</td><th>Span</th><td>{span}</td></tr>
                    <tr><th>Datum</th><td>±0,000</td><th>Level</th><td>{fmt(LEVEL_MM)}</td></tr>
                  </tbody>
                </table>
              </div>

              {/* Key: how to read the drawing */}
              <div className="el-key paper" data-reveal="up" data-delay="0.22">
                <p className="el-key-h">Key</p>
                <ul className="el-key-list">
                  {CATEGORIES.map((c) => (
                    <li key={c}>
                      <button type="button" className={cat === c ? 'on' : ''} onClick={() => setCat(cat === c ? null : c)}>
                        <i style={{ height: 6 + 5 * (storeysOf({ category: c } as Project)), width: WIDTH[c] * 0.9 }} />
                        <span>{c}</span>
                        <em>{String(PROJECTS.filter((p) => p.category === c).length).padStart(2, '0')}</em>
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="el-key-notes">
                  <span><b className="el-key-grid" />Grid line = year</span>
                  <span><b className="el-key-lvl" />Level = 1 storey · {fmt(LEVEL_MM)}</span>
                  <span><b className="el-key-ground" />Ground = ±0,000</span>
                </div>
              </div>

              <svg className="el-north" viewBox="0 0 60 60" aria-hidden>
                <circle cx="30" cy="30" r="28" fill="none" stroke="currentColor" strokeWidth="1" />
                <path d="M30 6 L36 34 L30 30 L24 34 Z" fill="currentColor" />
                <text x="30" y="52" textAnchor="middle" fontSize="8" fill="currentColor" fontFamily="var(--font-mono)" letterSpacing="2">E →</text>
              </svg>
            </div>
          </Panel>

          {/* ── One bay per year ── */}
          {years.map(([year, items], yi) => (
            <Panel
              key={year}
              id={`y${year}`}
              width="auto"
              className="bay-auto el-bay"
              sheet={`A-${String(yi + 1).padStart(3, '0')}`}
              label={`${year} · ${String(items.length).padStart(2, '0')} ${items.length === 1 ? 'BUILDING' : 'BUILDINGS'}`}
              mm={`${String(items.reduce((n, p) => n + WIDTH[p.category], 0) * 100).padStart(2, '0').replace(/(\d)(?=(\d{3})$)/, '$1 ')}`}
            >
              {/* levels behind the buildings */}
              <div className="el-levels" aria-hidden>
                {Array.from({ length: MAX_LEVELS }, (_, i) => (
                  <div key={i} className="el-lvl" style={{ ['--n' as string]: i + 1 }}>
                    <span>LVL {String(i + 1).padStart(2, '0')} · {fmt(LEVEL_MM * (i + 1))}</span>
                  </div>
                ))}
              </div>

              {/* year grid line + bubble */}
              <div className="el-gridline" aria-hidden>
                <span className="el-bubble">{year}</span>
              </div>

              <p className="el-year-m" aria-hidden>{year}</p>
              <div className="el-street">
                {items.map((p) => {
                  const n = storeysOf(p);
                  return (
                    <a
                      key={p.slug}
                      href={`/work/${p.slug}`}
                      onClick={go(`/work/${p.slug}`)}
                      className={`el-bld${p.featured ? ' featured' : ''}`}
                      style={{ ['--w' as string]: `${WIDTH[p.category]}vw`, ['--n' as string]: n }}
                    >
                      <span className="el-ht" data-reveal="up" data-delay="0.2">
                        <i /><b>{fmt(LEVEL_MM * n)}</b>
                      </span>

                      <div className="el-mass plate" data-reveal="clip">
                        <div className="el-mass-in" data-parallax="0.06">
                          <Image src={p.cover} alt={p.name} fill unoptimized sizes="30vw" style={{ objectFit: 'cover' }} />
                        </div>
                        <span className="el-floors" aria-hidden>
                          {Array.from({ length: n - 1 }, (_, i) => <i key={i} style={{ bottom: `calc(${i + 1} * var(--lvl))` }} />)}
                        </span>
                        <span className="el-door" aria-hidden />
                      </div>

                      <span className="el-base" data-reveal="up" data-delay="0.1">
                        <span className="el-num">A-{String(numOf.get(p.slug)).padStart(2, '0')}{p.featured && <em> ★</em>}</span>
                        <span className="el-name">{p.name}</span>
                        <span className="el-meta">{p.category} · {p.location.split(',')[0]}</span>
                      </span>

                      <span className="el-callout" aria-hidden>
                        <span className="el-callout-line" />
                        <span className="el-callout-box">
                          <b>{p.name}</b>
                          <span>{n} {n === 1 ? 'storey' : 'storeys'} · {p.status} · {p.year}</span>
                          <span className="el-callout-cta">Open drawing set ↗</span>
                        </span>
                      </span>
                    </a>
                  );
                })}
              </div>

              {/* ground: drawn as you walk, earth hatch beneath */}
              <div className="el-ground" aria-hidden>
                <svg className="el-ground-svg" preserveAspectRatio="none" viewBox="0 0 1000 2">
                  <line data-draw x1="0" y1="1" x2="1000" y2="1" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                </svg>
                <span className="el-ground-hatch" />
                <span className="el-datum">±0,000</span>
              </div>
            </Panel>
          ))}

          {/* ── Next lot ── */}
          <Panel id="end" width="96vw" sheet={`A-${String(years.length + 1).padStart(3, '0')}`} label="NEXT LOT" mm="00 000">
            <div className="el-end">
              <div className="el-levels" aria-hidden>
                {Array.from({ length: MAX_LEVELS }, (_, i) => <div key={i} className="el-lvl" style={{ ['--n' as string]: i + 1 }} />)}
              </div>
              <div className="el-end-text paper">
                <p className="eyebrow" data-reveal="up">A-{String(total + 1).padStart(2, '0')} · Vacant lot</p>
                <h2 className="el-h1" data-reveal="up" data-delay="0.05">The next<br /><em>lot is yours.</em></h2>
                <p className="lede" data-reveal="up" data-delay="0.1">Tell us what you want to build and we will put it on the street.</p>
                <div className="el-end-links" data-reveal="up" data-delay="0.15">
                  <a href="/contact" onClick={go('/contact')} className="ct-btn">Start a project ↗</a>
                  <a href="/" onClick={go('/')}>← Back to cover</a>
                </div>
              </div>
              {/* the empty plot: dashed outline waiting on the ground line */}
              <div className="el-plot" aria-hidden data-reveal="up" data-delay="0.2">
                <span>?</span>
              </div>
              <div className="el-ground" aria-hidden>
                <svg className="el-ground-svg" preserveAspectRatio="none" viewBox="0 0 1000 2">
                  <line data-draw x1="0" y1="1" x2="1000" y2="1" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                </svg>
                <span className="el-ground-hatch" />
              </div>
            </div>
          </Panel>

        </div>
        </div>
      </div>
    </>
  );
}
