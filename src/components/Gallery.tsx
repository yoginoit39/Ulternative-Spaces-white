'use client';
import { useState } from 'react';

const GALLERY_PROJECTS = [
  {
    num: '01',
    name: 'Kampala Residence',
    category: 'Residential',
    year: '2024',
    slug: 'kampala-residence',
  },
  {
    num: '02',
    name: 'Commercial Complex',
    category: 'Commercial',
    year: '2024',
    slug: 'commercial-complex',
  },
  {
    num: '03',
    name: 'Interior Suite',
    category: 'Interiors',
    year: '2023',
    slug: 'interior-suite',
  },
  {
    num: '04',
    name: 'Villa Design',
    category: 'Residential',
    year: '2023',
    slug: 'villa-design',
  },
  {
    num: '05',
    name: 'Juba Complex',
    category: 'Mixed-Use',
    year: '2022',
    slug: 'juba-complex',
  },
  {
    num: '06',
    name: 'Urban Pavilion',
    category: 'Architecture',
    year: '2022',
    slug: 'urban-pavilion',
  },
];

export default function Gallery() {
  return (
    <section
      id="gallery"
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
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
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
            fontWeight: 800,
            fontSize: 'clamp(48px, 7vw, 110px)',
            color: 'var(--parch)',
            letterSpacing: '-0.03em',
            lineHeight: 0.9,
            margin: 0,
          }}
        >
          SELECTED
          <br />
          PROJECTS
        </h2>
      </div>

      {/* Glass panel wrapping the project list */}
      <div
        style={{
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          padding: '0 32px',
        }}
      >
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

function GalleryRow({
  project,
}: {
  project: (typeof GALLERY_PROJECTS)[number];
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={`/work/${project.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '26px 0',
        borderBottom: hovered
          ? '1px solid rgba(0,0,0,0.4)'
          : '1px solid rgba(0,0,0,0.08)',
        textDecoration: 'none',
        transition: 'border-color 0.25s ease',
        cursor: 'pointer',
      }}
    >
      {/* Number */}
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
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
          fontWeight: 800,
          fontSize: 'clamp(22px, 3.5vw, 54px)',
          color: 'var(--parch)',
          flex: 1,
          transform: hovered ? 'translateX(10px)' : 'translateX(0)',
          transition: 'transform 0.3s var(--ease-out)',
          lineHeight: 1,
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
          fontSize: 18,
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
