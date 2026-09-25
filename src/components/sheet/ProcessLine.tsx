import Panel from './Panel';

const STEPS = [
  { num: '01', name: 'Brief & Discovery', d: 'We start by listening — to you, to the site, to the materials. Before a single line is drawn.' },
  { num: '02', name: 'Concept Design',    d: 'Architectural concepts that interpret your brief with originality and spatial intelligence.' },
  { num: '03', name: 'Development',       d: 'Technical drawings, material selections and specifications that guide flawless construction.' },
  { num: '04', name: 'Build & Deliver',   d: 'We build what we design. On-site management until the vision is real — on time, on budget.' },
];

export default function ProcessLine() {
  return (
    <Panel id="process" width="140vw" sheet="03" label="PROCESS" mm="14 000">
      <div className="pr">
        <div className="pr-idx" data-parallax="0.35">03</div>
        <header className="pr-head paper">
          <p className="eyebrow" data-reveal="up">03 / Process</p>
          <h2 className="h-display" data-reveal="up" data-delay="0.05">From first<br />line to<br /><em>last brick.</em></h2>
        </header>

        <ol className="pr-steps">
          <svg className="pr-svg" viewBox="0 0 1000 260" preserveAspectRatio="none" aria-hidden>
            <path data-draw d="M 0 130 H 1000" stroke="#000" strokeWidth="1.2" fill="none" vectorEffect="non-scaling-stroke" />
            {[6, 256, 506, 756].map((x, i) => (
              <g key={i}>
                <path data-draw d={`M ${x} 130 V ${i % 2 ? 215 : 45}`} stroke="#000" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" />
                <circle cx={x} cy={130} r="5" fill="#fff" stroke="var(--accent)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
              </g>
            ))}
          </svg>
          {STEPS.map((s, i) => (
            <li key={s.num} className={`paper ${i % 2 ? 'below' : 'above'}`} data-reveal="up" data-delay={String(i * 0.06)}>
              <span className="pr-num">{s.num}</span>
              <h3>{s.name}</h3>
              <p>{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </Panel>
  );
}
