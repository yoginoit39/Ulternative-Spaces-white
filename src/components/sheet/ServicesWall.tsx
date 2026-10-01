'use client';
import { useEffect, useRef, useState } from 'react';
import Panel from './Panel';

const SERVICES = [
  { num: '01', word: 'ARCHITECTURE', d: 'From concept to construction documents. Buildings that define their surroundings — structurally bold, aesthetically lasting.', tags: ['Residential', 'Commercial', 'Institutional'] },
  { num: '02', word: 'INTERIORS',    d: 'Enclosed space turned into lived experience. Material, light and proportion curated for enduring beauty.', tags: ['Residential', 'Hospitality', 'Office'] },
  { num: '03', word: 'DESIGN-BUILD', d: 'Seamless delivery from first sketch to final handover. One team, zero gaps between vision and construction.', tags: ['Turnkey', 'Renovation', 'Fit-out'] },
];

export default function ServicesWall() {
  const [on, setOn] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  // Phones have no hover: each word lights as it crosses the middle of the
  // screen, so the list reads itself while the sheet slides in. Tap still picks.
  useEffect(() => {
    const list = listRef.current;
    if (!list || !window.matchMedia('(max-width: 899px)').matches) return;
    const items = Array.from(list.children);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setOn(items.indexOf(e.target)); });
    }, { rootMargin: '-55% 0px -44% 0px' });
    items.forEach((li) => io.observe(li));
    return () => io.disconnect();
  }, []);
  return (
    <Panel id="services" width="100vw" sheet="04" label="SERVICES" mm="12 000" mat="ochre" depth={1}>
      <div className="sv">
        <div className="sv-idx" data-parallax="0.35">04</div>
        <header className="sv-head paper">
          <p className="eyebrow" data-reveal="up">04 / Services</p>
          <h2 className="h-display" data-reveal="up" data-delay="0.05">What<br />we <em>build.</em></h2>
        </header>

        <ul className="sv-list" ref={listRef}>
          {SERVICES.map((s, i) => (
            <li key={s.num} className={i === on ? 'on' : ''} onMouseEnter={() => setOn(i)} onFocus={() => setOn(i)} onClick={() => setOn(i)} tabIndex={0} data-reveal="up" data-delay={String(i * 0.08)} data-parallax={String(0.04 + i * 0.05)}>
              <span className="sv-num">{s.num}</span>
              <span className="sv-word">{s.word}</span>
            </li>
          ))}
        </ul>

        <div className="sv-detail paper" data-reveal="right">
          {SERVICES.map((s, i) => (
            <div key={s.num} className={`sv-detail-item${i === on ? ' on' : ''}`}>
              <p>{s.d}</p>
              <div className="sv-tags">{s.tags.map((t) => <span key={t}>{t}</span>)}</div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}
