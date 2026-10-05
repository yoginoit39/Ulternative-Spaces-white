'use client';
import { useMemo, useRef } from 'react';
import Image from 'next/image';
import Nav from '@/components/Nav';
import SmoothScroll from '@/components/SmoothScroll';
import Panel from '@/components/sheet/Panel';
import SheetChrome, { type Station } from '@/components/sheet/SheetChrome';
import { useSheetScroll } from '@/components/sheet/useSheetScroll';
import { usePageTransition } from '@/context/transition';
import '@/components/sheet/sheet.css';
import './philosophy.css';

const PRINCIPLES = [
  { num: '01', title: 'Form Follows Feeling', body: 'Architecture begins not with a programme, but with an emotion. What should this space make you feel? The answer dictates every decision that follows — from the angle of a wall to the weight of a door handle.' },
  { num: '02', title: 'The Infinite Detail', body: 'Perfection is not achieved when there is nothing left to add. It is achieved when every detail has been considered, reconsidered, and resolved. No detail is too small for the full weight of our attention.' },
  { num: '03', title: 'Rooted in Place', body: 'Every structure we design belongs to its land, its climate, its culture. Architecture that could exist anywhere exists nowhere. We build for East Africa — its light, its heat, its spirit — and for no other place.' },
  { num: '04', title: 'Design and Build as One', body: 'The separation of design and construction is the source of most architectural failure. When the person who designs a thing is not responsible for building it, something is lost in translation. We refuse that gap.' },
];

const CYCLE = [
  { num: '01', title: 'Enquiry',   desc: 'Every project begins with a conversation — your vision, your site, your life.' },
  { num: '02', title: 'Concept',   desc: 'That vision becomes bold spatial ideas. One clear direction, rigorously interrogated.' },
  { num: '03', title: 'Design',    desc: 'From concept to complete construction documentation. Every detail drawn and resolved.' },
  { num: '04', title: 'Approvals', desc: 'Planning permissions, structural certifications and regulatory requirements, handled.' },
  { num: '05', title: 'Build',     desc: 'Construction from the first excavation to the final fitting. Our people, our standards.' },
  { num: '06', title: 'Deliver',   desc: 'Handover is not the end. We remain partners through the life of the building.' },
];

// One station per bay (the chrome indexes them together).
const STATIONS: Station[] = [
  { id: 'cover',      label: 'COVER',      sheet: 'P-00' },
  { id: 'mark',       label: 'THE MARK',   sheet: 'P-01' },
  { id: 'design',     label: 'DESIGN',     sheet: 'P-02' },
  { id: 'build',      label: 'BUILD',      sheet: 'P-02' },
  { id: 'principles', label: 'PRINCIPLES', sheet: 'P-03' },
  { id: 'cycle',      label: 'THE CYCLE',  sheet: 'P-04' },
  { id: 'manifesto',  label: 'MANIFESTO',  sheet: 'P-05' },
];
const IDS = STATIONS.map((s) => s.id);

export default function PhilosophyClient() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const navigate = usePageTransition();
  const ids = useMemo(() => IDS, []);
  useSheetScroll(wrapRef, trackRef, ids, true);
  const go = (href: string) => (e: React.MouseEvent) => { e.preventDefault(); navigate(href); };

  return (
    <SmoothScroll>
      <Nav />
      <SheetChrome stations={STATIONS} trackRef={trackRef} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div ref={wrapRef} className="sheet-wrap">
        <div ref={trackRef} className="sheet-track">

          {/* ── P-00 cover ── */}
          <Panel id="cover" width="100vw" sheet="P-00" label="DESIGN & PHILOSOPHY" mm="00 000" mat="black" depth={1}>
            <div className="ph-cover">
              <Image src="/images/logo.svg" alt="Ulternative Spaces mark" width={120} height={120} unoptimized className="ph-logo" data-reveal="scale" />
              <p className="eyebrow" data-reveal="up" data-delay="0.1">The mark · The method · The belief</p>
              <h1 className="ph-h1" data-reveal="up" data-delay="0.15" data-drift="0.06">Design<br /><em>&amp;</em><br />Philosophy</h1>
              <p className="cv-meta ph-hint" data-reveal="up" data-delay="0.3">Read the section <i className="cv-arrow" /> →</p>
            </div>
          </Panel>

          {/* ── P-01 the mark ── */}
          <Panel id="mark" width="130vw" sheet="P-01" label="THE MARK" mm="12 000" mat="paper" depth={1}>
            <div className="ph-mark">
              <svg className="ph-mark-svg" viewBox="0 0 560 240" aria-hidden data-reveal="up">
                <circle cx="168" cy="120" r="60" fill="var(--accent)" />
                <circle cx="392" cy="120" r="60" fill="var(--accent)" />
                <path
                  data-draw
                  d="M 280,120 C 280,56 222,12 168,12 C 100,12 58,58 58,120 C 58,182 100,228 168,228 C 222,228 280,184 280,120 C 280,56 338,12 392,12 C 460,12 502,58 502,120 C 502,182 460,228 392,228 C 338,228 280,184 280,120"
                  fill="none" stroke="var(--parch)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"
                />
                <circle cx="280" cy="120" r="4" fill="var(--parch)" />
              </svg>
              <div className="ph-mark-text paper">
                <p className="eyebrow" data-reveal="up">P-01 / The mark</p>
                <h2 className="h-display" data-reveal="up" data-delay="0.05" data-parallax="0.05">Two circles,<br /><em>one line.</em></h2>
                <p className="lede" data-reveal="up" data-delay="0.1">
                  The lemniscate — mathematics’ symbol for infinity — is the foundation of our mark. It is a
                  declaration: the work we do has no terminus. Design leads to construction leads to living
                  leads to refinement leads to design again.
                </p>
                <p className="lede" data-reveal="up" data-delay="0.15">
                  Within each loop, a circle — solid, complete, resolved. The left: pure design. The right:
                  precise execution. Separate in practice, inseparable in philosophy.
                </p>
              </div>
            </div>
          </Panel>

          {/* ── P-02 design | build ── */}
          <Panel id="design" width="62vw" sheet="P-02" label="CIRCLE ONE" mm="6 000" mat="paper" depth={1}>
            <div className="ph-half paper">
              <span className="ph-ring" data-reveal="scale"><i /></span>
              <p className="eyebrow" data-reveal="up">Circle one</p>
              <h2 className="ph-big" data-reveal="up" data-delay="0.05" data-parallax="0.04">Design</h2>
              <p className="lede" data-reveal="up" data-delay="0.1">
                Every project begins with a question, not a drawing. What should this place make you feel?
                How should light move through it? What does it owe to its landscape, its occupants, its era?
              </p>
              <p className="lede" data-reveal="up" data-delay="0.15">
                Design is the long, patient translation of those answers into form. It demands restraint —
                knowing what to leave out is as important as knowing what to put in.
              </p>
            </div>
          </Panel>
          <Panel id="build" width="62vw" sheet="P-02" label="CIRCLE TWO" mm="6 000" mat="black" depth={1}>
            <div className="ph-half paper">
              <span className="ph-ring" data-reveal="scale"><i /></span>
              <p className="eyebrow" data-reveal="up">Circle two</p>
              <h2 className="ph-big" data-reveal="up" data-delay="0.05" data-parallax="0.04">Build</h2>
              <p className="lede" data-reveal="up" data-delay="0.1">
                Construction is not the end of design. It is design’s ultimate test. Every detail resolved on
                paper must survive contact with material reality — timber, concrete, steel, and the hands that shape them.
              </p>
              <p className="lede" data-reveal="up" data-delay="0.15">
                We control this process entirely. The greatest failure in architecture is a good design poorly
                built. The second circle closes only when the last detail is right.
              </p>
            </div>
          </Panel>

          {/* ── P-03 principles ── */}
          <Panel id="principles" width="160vw" sheet="P-03" label="PRINCIPLES" mm="16 000" mat="white" depth={1}>
            <div className="ph-principles">
              <header className="ph-head paper">
                <p className="eyebrow" data-reveal="up">P-03 / What we believe</p>
                <h2 className="h-display" data-reveal="up" data-delay="0.05" data-parallax="0.05">Four<br /><em>principles.</em></h2>
              </header>
              <ol className="ph-plist">
                {PRINCIPLES.map((p, i) => (
                  <li key={p.num} className="paper" data-reveal="up" data-delay={String(i * 0.06)} data-lift={i % 2 ? 6 : -6}>
                    <span className="ph-num">{p.num}</span>
                    <h3>{p.title}</h3>
                    <p>{p.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Panel>

          {/* ── P-04 the cycle ── */}
          <Panel id="cycle" width="150vw" sheet="P-04" label="THE CYCLE" mm="14 000" mat="black" depth={1}>
            <div className="ph-cycle">
              <header className="ph-head paper">
                <p className="eyebrow" data-reveal="up">P-04 / How we work</p>
                <h2 className="h-display" data-reveal="up" data-delay="0.05" data-parallax="0.05">The<br /><em>cycle.</em></h2>
                <p className="lede" data-reveal="up" data-delay="0.1">Deliver becomes Enquiry for the next project. The loop never closes.</p>
              </header>
              <ol className="ph-steps">
                <svg className="ph-steps-line" viewBox="0 0 1000 10" preserveAspectRatio="none" aria-hidden>
                  <path data-draw d="M 0 5 H 1000" stroke="var(--accent)" strokeWidth="1.2" fill="none" vectorEffect="non-scaling-stroke" />
                </svg>
                {CYCLE.map((s, i) => (
                  <li key={s.num} className="paper" data-reveal="up" data-delay={String(i * 0.05)}>
                    <span className="ph-dot" />
                    <span className="ph-num">{s.num}</span>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Panel>

          {/* ── P-05 manifesto ── */}
          <Panel id="manifesto" width="100vw" sheet="P-05" label="MANIFESTO" mm="10 000" mat="orange" depth={1}>
            <div className="ph-manifesto">
              <p className="eyebrow" data-reveal="up">P-05 / Manifesto</p>
              <blockquote className="ph-quote" data-reveal="up" data-delay="0.05" data-drift="0.05">
                “We do not build for this moment.<br />We build for the next <em>hundred years.</em>”
              </blockquote>
              <p className="cv-meta" data-reveal="up" data-delay="0.1">Ulternative Spaces · Kampala &amp; Juba</p>
              <div className="pj-next-links" data-reveal="up" data-delay="0.15">
                <a href="/work" onClick={go('/work')} className="ct-btn">View all projects ↗</a>
                <a href="/contact" onClick={go('/contact')}>Start a project →</a>
                <a href="/team" onClick={go('/team')}>Meet the team</a>
              </div>
              <footer className="ct-foot" data-reveal="up" data-delay="0.2">
                <span><b>U.S</b> Shaping spaces across East Africa</span>
                <span>© 2026 Ulternative Spaces · End of set P</span>
              </footer>
            </div>
          </Panel>

        </div>
        </div>
      </div>
    </SmoothScroll>
  );
}
