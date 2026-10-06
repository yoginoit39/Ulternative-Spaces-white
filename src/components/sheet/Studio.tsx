import Photo from '@/components/Photo';
import Panel from './Panel';

const METRICS = [
  { v: 50, s: '+', l: 'Projects delivered' },
  { v: 8,  s: '+', l: 'Years practising' },
  { v: 2,  s: '',  l: 'Countries' },
];

export default function Studio() {
  return (
    <Panel id="studio" width="125vw" sheet="01" label="THE STUDIO" mm="15 000" mat="paper" depth={1}>
      <div className="st">
        <div className="st-idx" data-parallax="0.35">01</div>

        <div className="st-text paper">
          <p className="eyebrow" data-reveal="up">01 / The studio</p>
          <h2 className="h-display" data-reveal="up" data-delay="0.05" data-parallax="0.05">
            We build<br />for East<br /><em>Africa.</em>
          </h2>
          <p className="lede" data-reveal="up" data-delay="0.1">
            Ulternative Spaces is a design-build practice at the intersection of creative
            architecture and meticulous construction. We take a project from blueprint to
            built reality with a single accountable team.
          </p>
          <p className="lede" data-reveal="up" data-delay="0.15">
            Based in <strong>Kampala, Uganda</strong> and <strong>Juba, South Sudan</strong>,
            we design for equatorial light, hard rain, and the way people actually live.
          </p>
        </div>

        <div className="st-metrics paper" data-reveal="up" data-delay="0.2" data-parallax="-0.04">
          {METRICS.map((m) => (
            <div key={m.l} className="st-metric">
              <div className="st-metric-v" data-count={m.v} data-suffix={m.s}>0{m.s}</div>
              <div className="st-metric-l">{m.l}</div>
            </div>
          ))}
        </div>

        <figure className="st-fig" data-reveal="clip">
          <div className="st-img plate" data-parallax="0.12" data-lightbox="studio" data-src="/images/site-visit-1.jpg" data-caption="Site inspection, Kampala · apartments under construction">
            <div className="plate-in" data-parallax="0.08">
              <Photo src="/images/site-visit-1.jpg" alt="The Ulternative Spaces team on site in Kampala" sizes="(max-width: 899px) 100vw, 55vw" />
            </div>
          </div>
          <figcaption>PLATE 01 — SITE INSPECTION, KAMPALA · APARTMENTS UNDER CONSTRUCTION</figcaption>
          <blockquote className="st-quote" data-reveal="up">
            “We don’t just design buildings — we design the quality of your life.”
          </blockquote>
        </figure>
      </div>
    </Panel>
  );
}
