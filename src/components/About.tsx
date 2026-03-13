'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';

const METRICS = [
  { target: 50, label: 'Projects', suffix: '+' },
  { target: 8,  label: 'Years',    suffix: '+' },
  { target: 2,  label: 'Countries', suffix: '' },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const counterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasAnimated = useRef(false);
  const imgWrapRef = useRef<HTMLDivElement>(null);

  // GSAP ScrollTrigger animations
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let isMounted = true;

    (async () => {
      const gsapModule = await import('gsap');
      const gsap = gsapModule.default || gsapModule.gsap;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (!isMounted) return;

      // Heading reveal
      const heading = section.querySelector('h2');
      if (heading) {
        gsap.from(heading, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Body paragraphs stagger
      const paras = section.querySelectorAll('.about-body-text');
      if (paras.length) {
        gsap.from(paras, {
          y: 20,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: paras[0],
            start: 'top 84%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Image clip-path reveal
      if (imgWrapRef.current) {
        gsap.from(imgWrapRef.current, {
          clipPath: 'inset(100% 0 0 0)',
          duration: 1.3,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: imgWrapRef.current,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        });
      }
    })();

    return () => { isMounted = false; };
  }, []);

  // Counter animation on scroll into view
  useEffect(() => {
    const metricsEl = metricsRef.current;
    if (!metricsEl) return;

    const animateCounters = async () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;
      const gsapModule = await import('gsap');
      const gsap = gsapModule.default || gsapModule.gsap;
      if (!gsap) return;
      METRICS.forEach((metric, i) => {
        const el = counterRefs.current[i];
        if (!el) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: metric.target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.round(obj.val) + metric.suffix; },
        });
      });
    };

    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) animateCounters(); }); },
      { threshold: 0.3 }
    );
    observer.observe(metricsEl);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{ padding: '160px 5vw', backgroundColor: 'transparent', position: 'relative' }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 60,
          alignItems: 'start',
        }}
        className="about-grid"
      >
        {/* Left column */}
        <div>
          <div style={{ padding: '0 0 40px 0', position: 'relative' }}>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                color: 'var(--ember)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: 24,
              }}
            >
              01 / About
            </p>

            <h2
              style={{
                fontFamily: 'var(--font-syne)',
                fontWeight: 600,
                fontSize: 'clamp(26px, 3.2vw, 48px)',
                color: 'var(--parch)',
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
                marginBottom: 24,
              }}
            >
              We Build for
              <br />
              East Africa.
            </h2>

            <p
              className="about-body-text"
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontWeight: 300,
                fontSize: 18,
                color: 'var(--steel)',
                lineHeight: 1.75,
                marginBottom: 24,
              }}
            >
              Ulternative Spaces is a Design-Build company at the intersection of creative architecture
              and meticulous construction — bringing your vision from blueprint to built reality.
            </p>

            <p
              className="about-body-text"
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontWeight: 300,
                fontSize: 18,
                color: 'var(--steel)',
                lineHeight: 1.75,
                marginBottom: 32,
              }}
            >
              Based in{' '}
              <strong style={{ fontWeight: 600, color: 'var(--parch)' }}>Kampala, Uganda</strong> and{' '}
              <strong style={{ fontWeight: 600, color: 'var(--parch)' }}>Juba, South Sudan</strong>,
              we serve clients across East Africa with spaces that are not only beautiful, but enduring.
            </p>

            <div ref={metricsRef} style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
              {METRICS.map((m, i) => (
                <div key={m.label}>
                  <div
                    ref={(el) => { counterRefs.current[i] = el; }}
                    style={{
                      fontFamily: 'var(--font-syne)',
                      fontWeight: 600,
                      fontSize: 'clamp(28px, 3vw, 42px)',
                      color: 'var(--ember)',
                      lineHeight: 1,
                    }}
                  >
                    0{m.suffix}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9,
                      color: 'var(--steel)',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      marginTop: 6,
                    }}
                  >
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — image */}
        <div style={{ paddingTop: 48 }}>
          <div
            ref={imgWrapRef}
            style={{
              position: 'relative',
              aspectRatio: '4/5',
              width: '100%',
              overflow: 'hidden',
            }}
          >
            <Image
              src="/images/Image from Facebook (17).jpg"
              alt="Ulternative Spaces project"
              fill
              unoptimized
              style={{ objectFit: 'cover' }}
            />
          </div>

          <blockquote
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontStyle: 'italic',
              fontSize: 'clamp(16px, 1.8vw, 22px)',
              color: 'var(--steel)',
              lineHeight: 1.5,
              margin: '24px 0 0 0',
              borderLeft: '2px solid var(--ember)',
              padding: '16px 20px',
            }}
          >
            &ldquo;We don&apos;t just design buildings — we design the quality of your life.&rdquo;
          </blockquote>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .about-grid { grid-template-columns: 60% 40% !important; }
        }
      `}</style>
    </section>
  );
}
