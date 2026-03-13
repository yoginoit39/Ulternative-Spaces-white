'use client';
import { useState, useRef, useEffect } from 'react';
import { PROJECTS } from '@/lib/projects';
import { usePageTransition } from '@/context/transition';

const WORK_PROJECTS = PROJECTS.slice(0, 6);

export default function Work() {
  const [activeIdx, setActiveIdx] = useState(0);
  const navigate = usePageTransition();
  const sectionRef = useRef<HTMLElement>(null);

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

      const heading = section.querySelector('h2');
      if (heading) {
        gsap.from(heading, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        });
      }

      const rows = section.querySelectorAll('.gs-row');
      if (rows.length) {
        gsap.from(rows, {
          x: -24,
          opacity: 0,
          stagger: 0.07,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: rows[0],
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        });
      }
    })();

    return () => { isMounted = false; };
  }, []);

  return (
    <section
      id="work"
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: 'transparent',
        padding: '160px 5vw 60px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '80vh' }}>
        {/* Header */}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--ember)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            02 / Selected Work
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 600,
              fontSize: 'clamp(20px, 2.5vw, 36px)',
              color: 'var(--parch)',
              letterSpacing: '-0.01em',
              lineHeight: 0.95,
              margin: 0,
            }}
          >
            Selected Work
          </h2>
        </div>

        {/* Project list */}
        <div style={{ marginTop: 'auto', paddingTop: 60, maxWidth: 720 }}>
          <div style={{ padding: '32px 0' }}>
            {WORK_PROJECTS.map((project, i) => (
              <ProjectRow
                key={project.slug}
                project={project}
                isActive={activeIdx === i}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(0)}
                onClick={() => navigate(`/work/${project.slug}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectRow({
  project,
  isActive,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: {
  project: (typeof WORK_PROJECTS)[number];
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="gs-row"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        padding: '18px 0',
        borderBottom: isActive ? '1px solid rgba(0,0,0,0.5)' : '1px solid rgba(0,0,0,0.08)',
        cursor: 'pointer',
        transition: 'border-color 0.3s ease',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--ember)',
          letterSpacing: '0.15em',
          flexShrink: 0,
          width: 28,
        }}
      >
        {project.num}
      </span>

      <span
        style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 400,
          fontSize: 'clamp(16px, 2.2vw, 34px)',
          color: isActive ? 'var(--gold)' : 'var(--parch)',
          flex: 1,
          lineHeight: 1,
          letterSpacing: '-0.01em',
          transition: 'color 0.3s ease, transform 0.3s ease',
          transform: isActive ? 'translateX(8px)' : 'translateX(0)',
        }}
      >
        {project.name}
      </span>

      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--steel)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          marginLeft: 'auto',
          flexShrink: 0,
        }}
        className="work-row-meta"
      >
        {project.category} · {project.year}
      </span>

      <span
        style={{
          color: 'var(--ember)',
          fontSize: 14,
          opacity: isActive ? 1 : 0,
          transform: isActive ? 'translateX(0)' : 'translateX(-6px)',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
          flexShrink: 0,
        }}
      >
        ↗
      </span>
    </div>
  );
}
