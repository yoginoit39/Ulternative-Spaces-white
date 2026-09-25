'use client';
import Panel from './Panel';
import { usePageTransition } from '@/context/transition';

export default function ContactEnd() {
  const navigate = usePageTransition();
  return (
    <Panel id="contact" width="100vw" sheet="05" label="CONTACT" mm="10 000">
      <div className="ct">
        <div className="ct-idx" data-parallax="0.35">05</div>
        <p className="eyebrow" data-reveal="up">05 / Start a project</p>
        <h2 className="ct-title paper" data-reveal="up" data-delay="0.05">
          Let’s draw<br />the <em>next one</em><br />together.
        </h2>

        <a className="ct-mail" href="mailto:sulternative@gmail.com" data-reveal="up" data-delay="0.1">
          sulternative@gmail.com
        </a>

        <div className="ct-grid paper" data-reveal="up" data-delay="0.15">
          <div><em>KAMPALA</em><span>Uganda</span><span>+256 000 000 000</span></div>
          <div><em>JUBA</em><span>South Sudan</span><span>+211 000 000 000</span></div>
          <div><em>HOURS</em><span>Mon — Fri</span><span>08:00 — 18:00 EAT</span></div>
          <div>
            <em>BRIEF US</em>
            <a href="/contact" onClick={(e) => { e.preventDefault(); navigate('/contact'); }} className="ct-btn">Contact form ↗</a>
          </div>
        </div>

        <footer className="ct-foot" data-reveal="up" data-delay="0.2">
          <span><b>U.S</b> Shaping spaces across East Africa</span>
          <span>© 2026 Ulternative Spaces · End of drawing set</span>
        </footer>
      </div>
    </Panel>
  );
}
