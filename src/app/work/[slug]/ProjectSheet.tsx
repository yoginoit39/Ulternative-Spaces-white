'use client';
import { useRef, useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Cursor from '@/components/Cursor';
import Nav from '@/components/Nav';
import SmoothScroll from '@/components/SmoothScroll';
import Panel from '@/components/sheet/Panel';
import SheetChrome, { type Station } from '@/components/sheet/SheetChrome';
import { useSheetScroll, subscribeSheet, gotoPanel } from '@/components/sheet/useSheetScroll';
import { usePageTransition } from '@/context/transition';
import type { Project } from '@/lib/projects';
import '@/components/sheet/sheet.css';

const ThreeScene = dynamic(() => import('@/components/ThreeScene'), { ssr: false });

// Plate rhythm: width (vw) and vertical placement, cycled across the gallery.
const RHYTHM = [
  { w: 72, pos: 'top' },
  { w: 52, pos: 'bottom' },
  { w: 84, pos: 'mid' },
  { w: 58, pos: 'top' },
  { w: 66, pos: 'bottom' },
];
const DIMS = ['18 400', '12 600', '21 000', '14 200', '16 800'];

export default function ProjectSheet({
  project, next, prev, index, total,
}: {
  project: Project; next: Project; prev: Project; index: number; total: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const navigate = usePageTransition();

  const plates = useMemo(() => project.gallery.slice(0, 5), [project.gallery]);
  const stations: Station[] = useMemo(() => [
    { id: 'title',   label: 'TITLE SHEET', sheet: 'A-00' },
    { id: 'brief',   label: 'BRIEF',       sheet: 'A-01' },
    { id: 'plate-1', label: 'PLATES',      sheet: 'A-02' },
    { id: 'next',    label: 'NEXT',        sheet: 'A-03' },
  ], []);
  const ids = useMemo(() => ['title', 'brief', ...plates.map((_, i) => `plate-${i + 1}`), 'next'], [plates]);

  useSheetScroll(wrapRef, trackRef, ids, true);
  useEffect(() => subscribeSheet((s) => setProgress(s.progress)), []);

  const num = String(index + 1).padStart(2, '0');
  const go = (href: string) => (e: React.MouseEvent) => { e.preventDefault(); navigate(href); };

  return (
    <SmoothScroll>
      <Cursor />
      <ThreeScene progress={progress} />
      <Nav />
      <SheetChrome stations={stations} trackRef={trackRef} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div ref={wrapRef} className="sheet-wrap">
        <div ref={trackRef} className="sheet-track">

          {/* ── A-00 Title sheet ── */}
          <Panel id="title" width="128vw" sheet={num} label={project.name.toUpperCase()} mm="00 000">
            <div className="pj-title">
              <div className="pj-idx" data-parallax="0.3">{num}</div>

              <div className="pj-title-text paper">
                <a href="/#work" onClick={go('/#work')} className="pj-back" data-reveal="up">← ALL WORK</a>
                <p className="eyebrow" data-reveal="up" data-delay="0.05">Project {num} / {String(total).padStart(2, '0')} · {project.category}</p>
                <h1 className="pj-name" data-reveal="up" data-delay="0.1">{splitName(project.name)}</h1>

                <table className="pj-block" data-reveal="up" data-delay="0.2">
                  <tbody>
                    <tr><th>Client</th><td>Private</td><th>Year</th><td>{project.year}</td></tr>
                    <tr><th>Location</th><td>{project.location}</td><th>Status</th><td>{project.status}</td></tr>
                    <tr><th>Scope</th><td>Design-Build</td><th>Set</th><td>{plates.length + 3} sheets</td></tr>
                  </tbody>
                </table>
              </div>

              <figure className="pj-cover" data-reveal="clip">
                <div className="plate pj-cover-plate" data-parallax="0.08">
                  <Image src={project.cover} alt={project.name} fill unoptimized priority sizes="60vw" style={{ objectFit: 'cover' }} />
                </div>
                <figcaption><span>COVER PLATE</span><span>{project.name.toUpperCase()} · 1 : 100</span></figcaption>
              </figure>
            </div>
          </Panel>

          {/* ── A-01 Brief ── */}
          <Panel id="brief" width="120vw" sheet="A-01" label="BRIEF" mm="12 000">
            <div className="pj-brief">
              <div className="pj-idx pj-idx-r" data-parallax="0.3">§</div>
              <header className="pj-brief-head paper">
                <p className="eyebrow" data-reveal="up">A-01 / Brief</p>
                <h2 className="h-display" data-reveal="up" data-delay="0.05">The<br /><em>brief.</em></h2>
              </header>
              <div className="pj-brief-body paper" data-reveal="up" data-delay="0.1">
                <p className="pj-spec-num">1.0 &nbsp; GENERAL</p>
                <p className="lede">{project.description}</p>
                <p className="pj-spec-num">2.0 &nbsp; SITE</p>
                <p className="lede">{project.location}. Designed for equatorial light, seasonal rain and long-term performance under the sun. Delivered by one team from first sketch to handover.</p>
              </div>
              <div className="pj-contents paper" data-reveal="up" data-delay="0.2">
                <p className="pj-spec-num">CONTENTS</p>
                <ol>
                  {plates.map((_, i) => (
                    <li key={i}>
                      <button onClick={() => gotoPanel(`plate-${i + 1}`)}>
                        <span>A-{String(i + 2).padStart(2, '0')}</span>
                        <i />
                        <span>PLATE {String(i + 1).padStart(2, '0')}</span>
                      </button>
                    </li>
                  ))}
                  <li><button onClick={() => gotoPanel('next')}><span>A-{String(plates.length + 2).padStart(2, '0')}</span><i /><span>NEXT PROJECT</span></button></li>
                </ol>
              </div>
            </div>
          </Panel>

          {/* ── Plates ── */}
          {plates.map((src, i) => {
            const r = RHYTHM[i % RHYTHM.length];
            const pl = String(i + 1).padStart(2, '0');
            return (
              <Panel key={src + i} id={`plate-${i + 1}`} width={`${r.w}vw`} sheet={`A-${String(i + 2).padStart(2, '0')}`} label={`PLATE ${pl}`} mm={DIMS[i % DIMS.length]}>
                <div className={`pj-plate pj-plate-${r.pos}`}>
                  <span className="pj-plate-num" data-parallax="0.22">{pl}</span>
                  <figure data-reveal="clip">
                    <div className="plate pj-plate-img" data-parallax="0.06">
                      <Image src={src} alt={`${project.name} — plate ${pl}`} fill unoptimized sizes="70vw" style={{ objectFit: 'cover' }} />
                    </div>
                    <figcaption>
                      <span>PLATE {pl} / {String(plates.length).padStart(2, '0')}</span>
                      <span>{project.name.toUpperCase()} · {project.location.toUpperCase()}</span>
                    </figcaption>
                  </figure>
                </div>
              </Panel>
            );
          })}

          {/* ── Next ── */}
          <Panel id="next" width="100vw" sheet={`A-${String(plates.length + 2).padStart(2, '0')}`} label="NEXT PROJECT" mm="10 000">
            <div className="pj-next">
              <div className="pj-idx" data-parallax="0.3">{String(((index + 1) % total) + 1).padStart(2, '0')}</div>
              <div className="pj-next-text paper">
                <p className="eyebrow" data-reveal="up">Next in the set</p>
                <a href={`/work/${next.slug}`} onClick={go(`/work/${next.slug}`)} className="pj-next-name" data-reveal="up" data-delay="0.05">
                  {splitName(next.name)}<span className="pj-next-arrow">→</span>
                </a>
                <p className="pj-next-meta" data-reveal="up" data-delay="0.1">{next.category} · {next.location} · {next.year}</p>
                <div className="pj-next-links" data-reveal="up" data-delay="0.15">
                  <a href={`/work/${prev.slug}`} onClick={go(`/work/${prev.slug}`)}>← {prev.name}</a>
                  <a href="/#work" onClick={go('/#work')}>All work</a>
                  <a href="/contact" onClick={go('/contact')} className="ct-btn">Start a project ↗</a>
                </div>
              </div>
              <a href={`/work/${next.slug}`} onClick={go(`/work/${next.slug}`)} className="pj-next-fig" data-reveal="clip">
                <div className="plate pj-next-plate" data-parallax="0.08">
                  <Image src={next.cover} alt={next.name} fill unoptimized sizes="40vw" style={{ objectFit: 'cover' }} />
                </div>
              </a>
              <footer className="ct-foot" data-reveal="up" data-delay="0.2">
                <span><b>U.S</b> Shaping spaces across East Africa</span>
                <span>© 2026 Ulternative Spaces · End of set {num}</span>
              </footer>
            </div>
          </Panel>

        </div>
        </div>
      </div>
    </SmoothScroll>
  );
}

function splitName(name: string) {
  const words = name.split(' ');
  if (words.length < 2) return name;
  const last = words.pop();
  return <>{words.join(' ')}<br /><em>{last}</em></>;
}
