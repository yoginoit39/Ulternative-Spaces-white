'use client';
import { useEffect, useRef, useState } from 'react';
import Photo from '@/components/Photo';
import Panel from './Panel';
import TransitionLink from '@/components/TransitionLink';
import { FEATURED, catClass } from '@/lib/projects';
import { usePageTransition } from '@/context/transition';

// Rhythm of card widths (vw) — architecture reads better with unequal bays.
const W = [34, 26, 40, 28, 36, 30, 38];
const DIM = ['9 400', '7 200', '11 000', '7 800', '9 900', '8 300', '10 600'];
const WORDS = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];

export default function WorkStrip() {
  const navigate = usePageTransition();
  const rowRef = useRef<HTMLDivElement>(null);
  const [bay, setBay] = useState(0);
  // Mobile: the row is a horizontal swipe strip; track which bay is centred.
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const onScroll = () => {
      const cards = Array.from(row.children) as HTMLElement[];
      const mid = row.scrollLeft + row.clientWidth / 2;
      let best = 0, d = Infinity;
      cards.forEach((c, i) => { const cd = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (cd < d) { d = cd; best = i; } });
      setBay(best);
    };
    row.addEventListener('scroll', onScroll, { passive: true });
    return () => row.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <Panel id="work" width="auto" sheet="02" label="SELECTED WORK" mm="62 600" className="bay-auto" mat="white" depth={1}>
      <div className="wk">
        <header className="wk-head paper">
          <p className="eyebrow" data-reveal="up">02 / Selected work</p>
          <h2 className="h-display" data-reveal="up" data-delay="0.05" data-parallax="0.05">{WORDS[FEATURED.length] ?? FEATURED.length}<br />buildings,<br /><em>one line.</em></h2>
          <p className="lede" data-reveal="up" data-delay="0.1">Walk the elevation. Each bay is a built project — click to enter.</p>
          <div data-reveal="up" data-delay="0.15">
            <TransitionLink href="/work" className="wk-all">
              View all projects <span>↗</span>
            </TransitionLink>
          </div>
        </header>

        <div className="wk-mcount" aria-hidden>
          <span><b>{String(bay + 1).padStart(2, '0')}</b> / {String(FEATURED.length).padStart(2, '0')}</span>
          <i />
          <span>Swipe the elevation →</span>
        </div>
        <div className="wk-row" ref={rowRef}>
          {FEATURED.map((p, i) => (
            <a
              key={p.slug}
              href={`/work/${p.slug}`}
              onClick={(e) => { e.preventDefault(); navigate(`/work/${p.slug}`, e.currentTarget.querySelector<HTMLElement>('.plate')); }}
              className={`wk-card ${catClass(p.category)}${i % 2 ? ' low' : ''}`}
              style={{ ['--w' as string]: `${W[i % W.length]}vw` }}
              data-lift={i % 2 ? -3 : 3}
            >
              <span className="wk-num" data-parallax="0.28">{p.num}</span>
              <div className="wk-img plate" data-reveal="clip" data-photo={p.cover}>
                <div className="wk-img-in" data-parallax="0.1">
                  <Photo src={p.cover} alt={p.name} sizes="(max-width: 899px) 85vw, 42vw" priority={i === 0} />
                </div>
              </div>
              <div className="wk-meta" data-reveal="up">
                <div className="wk-dim"><i /><span>{DIM[i % DIM.length]}</span><i /></div>
                <h3>{p.name}</h3>
                <p><i className="wk-chip" />{p.category} · {p.location} · {p.year}</p>
                <span className="wk-cta">OPEN PROJECT ↗</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </Panel>
  );
}
