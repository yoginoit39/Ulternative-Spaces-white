'use client';
import { useEffect, useRef } from 'react';
import Panel from './Panel';

export default function Cover({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready || !ref.current) return;
    const root = ref.current;
    (async () => {
      const gsapModule = await import('gsap');
      const gsap = gsapModule.default || gsapModule.gsap;
      const chars = root.querySelectorAll('.cv-char');
      const tl = gsap.timeline({ delay: 0.15 });
      tl.fromTo(chars, { y: '110%', rotate: 4 }, { y: '0%', rotate: 0, duration: 1.1, stagger: 0.035, ease: 'power4.out' })
        .fromTo(root.querySelectorAll('.cv-meta'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, '-=0.6')
        .fromTo(root.querySelector('.cv-arrow'), { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'power3.inOut' }, '-=0.5');
    })();
  }, [ready]);

  const word = (w: string) => w.split('').map((c, i) => (
    <span key={i} className="cv-mask"><span className="cv-char">{c}</span></span>
  ));

  return (
    <Panel id="cover" width="110vw" sheet="00" label="COVER" mm="00 000">
      <div ref={ref} className="cv">
        <div className="cv-meta cv-tl">DESIGN-BUILD STUDIO<br />EST. KAMPALA</div>
        <div className="cv-meta cv-tr">0°19′N 32°35′E<br />4°51′N 31°36′E</div>

        <h1 className="cv-title">
          <span className="cv-line">{word('ULTERNATIVE')}</span>
          <span className="cv-line cv-line-2">{word('SPACES')}<span className="cv-mask"><span className="cv-char cv-dot">.</span></span></span>
        </h1>

        <div className="cv-meta cv-sub">
          <p>Architecture · Interiors · Construction.<br />One studio, from first line to last brick.</p>
        </div>

        <div className="cv-meta cv-hint">
          <span>READ THE SECTION</span>
          <i className="cv-arrow" />
          <span>→</span>
        </div>

        <div className="cv-meta cv-count"><b>50+</b> PROJECTS BUILT ACROSS EAST AFRICA</div>
      </div>
    </Panel>
  );
}
