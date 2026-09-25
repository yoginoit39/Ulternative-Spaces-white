'use client';
import Image from 'next/image';
import Panel from './Panel';
import TransitionLink from '@/components/TransitionLink';
import { FEATURED } from '@/lib/projects';
import { usePageTransition } from '@/context/transition';

// Rhythm of card widths (vw) — architecture reads better with unequal bays.
const W = [34, 26, 40, 28, 36, 30];
const DIM = ['9 400', '7 200', '11 000', '7 800', '9 900', '8 300'];

export default function WorkStrip() {
  const navigate = usePageTransition();
  return (
    <Panel id="work" width="auto" sheet="02" label="SELECTED WORK" mm="62 600" className="bay-auto">
      <div className="wk">
        <header className="wk-head paper">
          <p className="eyebrow" data-reveal="up">02 / Selected work</p>
          <h2 className="h-display" data-reveal="up" data-delay="0.05">Six<br />buildings,<br /><em>one line.</em></h2>
          <p className="lede" data-reveal="up" data-delay="0.1">Walk the elevation. Each bay is a built project — click to enter.</p>
          <div data-reveal="up" data-delay="0.15">
            <TransitionLink href="/work" className="wk-all">
              Open the full register <span>↗</span>
            </TransitionLink>
          </div>
        </header>

        <div className="wk-row">
          {FEATURED.map((p, i) => (
            <a
              key={p.slug}
              href={`/work/${p.slug}`}
              onClick={(e) => { e.preventDefault(); navigate(`/work/${p.slug}`); }}
              className={`wk-card${i % 2 ? ' low' : ''}`}
              style={{ ['--w' as string]: `${W[i]}vw` }}
            >
              <span className="wk-num" data-parallax="0.28">{p.num}</span>
              <div className="wk-img plate" data-reveal="clip">
                <div className="wk-img-in" data-parallax="0.1">
                  <Image src={p.cover} alt={p.name} fill unoptimized sizes="40vw" style={{ objectFit: 'cover' }} />
                </div>
              </div>
              <div className="wk-meta" data-reveal="up">
                <div className="wk-dim"><i /><span>{DIM[i]}</span><i /></div>
                <h3>{p.name}</h3>
                <p>{p.category} · {p.location} · {p.year}</p>
                <span className="wk-cta">OPEN PROJECT ↗</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </Panel>
  );
}
