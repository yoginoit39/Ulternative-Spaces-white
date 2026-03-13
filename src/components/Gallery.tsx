'use client';
import { useState, useRef, useEffect } from 'react';

const GALLERY_PROJECTS = [
  { num: '01', name: 'Kampala Residence', category: 'Residential', year: '2024', slug: 'kampala-residence' },
  { num: '02', name: 'Commercial Complex', category: 'Commercial', year: '2024', slug: 'commercial-complex' },
  { num: '03', name: 'Interior Suite', category: 'Interiors', year: '2023', slug: 'interior-suite' },
  { num: '04', name: 'Villa Design', category: 'Residential', year: '2023', slug: 'villa-design' },
  { num: '05', name: 'Juba Complex', category: 'Mixed-Use', year: '2022', slug: 'juba-complex' },
  { num: '06', name: 'Urban Pavilion', category: 'Architecture', year: '2022', slug: 'urban-pavilion' },
];

export default function Gallery() {
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

      // Section label reveal
      const label = section.querySelector('.section-label');
      if (label) {
        gsap.from(label, {
          y: 16,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: label,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Row stagger
      const rows = section.querySelectorAll('.gs-row');
      if (rows.length) {
        gsap.from(rows, {
          y: 28,
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
      id="gallery"
      ref={sectionRef}
      style={{
        padding: '160px 5vw',
        backgroundColor: 'transparent',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 60 }}>
        <p
          className="section-label"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--ember)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}
        >
          04 / More Work
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
          Selected
          <br />
          Projects
        </h2>
      </div>

      {/* Project list */}
      <div style={{ padding: '0 0 0 32px' }}>
        {GALLERY_PROJECTS.map((project) => (
          <GalleryRow key={project.slug} project={project} />
        ))}
      </div>

      <style>{`
        @media (max-width: 767px) {
          .gallery-meta { display: none !important; }
          .gallery-arrow { display: block !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </section>
  );
}

function GalleryRow({ project }: { project: (typeof GALLERY_PROJECTS)[number] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={`/work/${project.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="gs-row"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '20px 0',
        borderBottom: hovered ? '1px solid rgba(0,0,0,0.4)' : '1px solid rgba(0,0,0,0.08)',
        textDecoration: 'none',
        transition: 'border-color 0.25s ease',
        cursor: 'pointer',
      }}
    >
      {/* Number */}
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--ember)',
          letterSpacing: '0.15em',
          width: 22,
          flexShrink: 0,
        }}
      >
        {project.num}
      </span>

      {/* Name */}
      <span
        style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 400,
          fontSize: 'clamp(16px, 2.2vw, 34px)',
          color: 'var(--parch)',
          flex: 1,
          transform: hovered ? 'translateX(10px)' : 'translateX(0)',
          transition: 'transform 0.35s var(--ease-out)',
          lineHeight: 1,
          letterSpacing: '-0.01em',
        }}
      >
        {project.name}
      </span>

      {/* Category / Year */}
      <span
        className="gallery-meta"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: hovered ? 'var(--ember)' : 'var(--steel)',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          transition: 'color 0.25s ease',
          flexShrink: 0,
        }}
      >
        {project.category} / {project.year}
      </span>

      {/* Arrow */}
      <span
        className="gallery-arrow"
        style={{
          color: 'var(--ember)',
          fontSize: 14,
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateX(0)' : 'translateX(-6px)',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
          flexShrink: 0,
        }}
      >
        ↗
      </span>
    </a>
  );
}
