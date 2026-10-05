'use client';
import { useMemo, useRef } from 'react';
import Nav from '@/components/Nav';
import SmoothScroll from '@/components/SmoothScroll';
import Photo from '@/components/Photo';
import Panel from '@/components/sheet/Panel';
import SheetChrome, { type Station } from '@/components/sheet/SheetChrome';
import { useSheetScroll } from '@/components/sheet/useSheetScroll';
import { usePageTransition } from '@/context/transition';
import { TEAM } from '@/lib/team';
import '@/components/sheet/sheet.css';
import './team.css';

const initials = (name: string) => name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

const STATIONS: Station[] = [
  { id: 'title',  label: 'THE TEAM', sheet: 'T-00' },
  { id: 'people', label: 'PEOPLE',   sheet: 'T-01' },
  { id: 'join',   label: 'JOIN',     sheet: 'T-02' },
];
const IDS = ['title', 'people', 'join'];

export default function TeamClient() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const navigate = usePageTransition();
  const ids = useMemo(() => IDS, []);
  useSheetScroll(wrapRef, trackRef, ids, true);
  const go = (href: string) => (e: React.MouseEvent) => { e.preventDefault(); navigate(href); };
  const kampala = TEAM.filter((m) => m.base === 'Kampala').length;
  const juba = TEAM.length - kampala;

  return (
    <SmoothScroll>
      <Nav />
      <SheetChrome stations={STATIONS} trackRef={trackRef} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div ref={wrapRef} className="sheet-wrap">
        <div ref={trackRef} className="sheet-track">

          {/* ── T-00 title sheet ── */}
          <Panel id="title" width="110vw" sheet="T-00" label="THE TEAM" mm="00 000" mat="black" depth={1}>
            <div className="tm-title paper">
              <p className="eyebrow" data-reveal="up">T-000 · The team · Kampala — Juba</p>
              <h1 className="tm-h1" data-reveal="up" data-delay="0.05" data-drift="0.06">One studio,<br /><em>{TEAM.length} people.</em></h1>
              <p className="lede" data-reveal="up" data-delay="0.1">
                Architects, designers and builders under one roof, so the person who draws a wall
                is answerable for the wall. <strong>{kampala} in Kampala, {juba} in Juba.</strong>
              </p>
              <table className="pj-block tm-block" data-reveal="up" data-delay="0.18">
                <tbody>
                  <tr><th>Studio</th><td>Design-Build</td><th>Est.</th><td>Kampala</td></tr>
                  <tr><th>People</th><td>{String(TEAM.length).padStart(2, '0')}</td><th>Offices</th><td>02</td></tr>
                </tbody>
              </table>
            </div>
          </Panel>

          {/* ── T-01 the people: one card per bay along the sheet ── */}
          <Panel id="people" width="auto" sheet="T-01" label={`PEOPLE · ${String(TEAM.length).padStart(2, '0')}`} mm={`${TEAM.length * 7} 000`} className="bay-auto" mat="white" depth={1}>
            <div className="tm-row">
              {TEAM.map((m, i) => (
                <article key={i} className={`tm-card${i % 2 ? ' low' : ''}`} data-lift={i % 2 ? -3 : 3}>
                  <div className="plate tm-plate" data-reveal="clip">
                    <div className="plate-in" data-parallax="0.06">
                      {m.photo
                        ? <Photo src={m.photo} alt={m.name} sizes="(max-width: 899px) 85vw, 24vw" />
                        : <span className="tm-initials" aria-hidden>{initials(m.name)}</span>}
                    </div>
                  </div>
                  <div className="tm-meta" data-reveal="up">
                    <p className="tm-idx">T-{String(i + 1).padStart(2, '0')} · {m.base}</p>
                    <h2 className="tm-name">{m.name}</h2>
                    <p className="tm-role">{m.role}</p>
                    <p className="tm-bio">{m.bio}</p>
                  </div>
                </article>
              ))}
            </div>
          </Panel>

          {/* ── T-02 join ── */}
          <Panel id="join" width="100vw" sheet="T-02" label="JOIN" mm="10 000" mat="orange" depth={1}>
            <div className="tm-join">
              <p className="eyebrow" data-reveal="up">Join the studio</p>
              <h2 className="h-display" data-reveal="up" data-delay="0.05" data-drift="0.05">The next<br /><em>desk</em> is open.</h2>
              <p className="lede" data-reveal="up" data-delay="0.1">
                We hire architects, interior designers and site engineers who want to see
                their drawings built. Send a portfolio and a line about what you want to make.
              </p>
              <div className="pj-next-links" data-reveal="up" data-delay="0.15">
                <a href="mailto:sulternative@gmail.com" className="ct-btn">Send a portfolio ↗</a>
                <a href="/contact" onClick={go('/contact')}>Contact the studio</a>
                <a href="/philosophy" onClick={go('/philosophy')}>Our philosophy</a>
              </div>
              <footer className="ct-foot" data-reveal="up" data-delay="0.2">
                <span><b>U.S</b> Shaping spaces across East Africa</span>
                <span>© 2026 Ulternative Spaces · End of set T</span>
              </footer>
            </div>
          </Panel>

        </div>
        </div>
      </div>
    </SmoothScroll>
  );
}
