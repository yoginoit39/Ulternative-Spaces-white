'use client';
import { useState } from 'react';
import Panel from './Panel';

const SERVICES = [
  { num: '01', word: 'ARCHITECTURE', d: 'From concept to construction documents. Buildings that define their surroundings — structurally bold, aesthetically lasting.', tags: ['Residential', 'Commercial', 'Institutional'] },
  { num: '02', word: 'INTERIORS',    d: 'Enclosed space turned into lived experience. Material, light and proportion curated for enduring beauty.', tags: ['Residential', 'Hospitality', 'Office'] },
  { num: '03', word: 'DESIGN-BUILD', d: 'Seamless delivery from first sketch to final handover. One team, zero gaps between vision and construction.', tags: ['Turnkey', 'Renovation', 'Fit-out'] },
];

export default function ServicesWall() {
  const [on, setOn] = useState(0);
  return (
    <Panel id="services" width="100vw" sheet="04" label="SERVICES" mm="12 000">
      <div className="sv">
        <div className="sv-idx" data-parallax="0.35">04</div>
        <header className="sv-head paper">
          <p className="eyebrow" data-reveal="up">04 / Services</p>
          <h2 className="h-display" data-reveal="up" data-delay="0.05">What<br />we <em>build.</em></h2>
        </header>

        <ul className="sv-list">
          {SERVICES.map((s, i) => (
            <li key={s.num} className={i === on ? 'on' : ''} onMouseEnter={() => setOn(i)} onFocus={() => setOn(i)} onClick={() => setOn(i)} tabIndex={0} data-reveal="up" data-delay={String(i * 0.08)}>
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
