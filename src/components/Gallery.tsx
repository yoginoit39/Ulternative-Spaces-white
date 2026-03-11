'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';

const GALLERY_PROJECTS = [
  {
    num: '01',
    name: 'Kampala Residence',
    category: 'Residential',
    year: '2024',
    slug: 'kampala-residence',
    cover: '/images/Image from Facebook (1).jpg',
  },
  {
    num: '02',
    name: 'Commercial Complex',
    category: 'Commercial',
    year: '2024',
    slug: 'commercial-complex',
    cover: '/images/Image from Facebook (6).jpg',
  },
  {
    num: '03',
    name: 'Interior Suite',
    category: 'Interiors',
    year: '2023',
    slug: 'interior-suite',
    cover: '/images/Image from Facebook (11).jpg',
  },
  {
    num: '04',
    name: 'Villa Design',
    category: 'Residential',
    year: '2023',
    slug: 'villa-design',
    cover: '/images/Image from Facebook (15).jpg',
  },
  {
    num: '05',
    name: 'Juba Complex',
    category: 'Mixed-Use',
    year: '2022',
    slug: 'juba-complex',
    cover: '/images/Image from Facebook (19).jpg',
  },
  {
    num: '06',
    name: 'Urban Pavilion',
    category: 'Architecture',
    year: '2022',
    slug: 'urban-pavilion',
    cover: '/images/Image from Facebook (24).jpg',
  },
];

export default function Gallery() {
  const [activePreview, setActivePreview] = useState<string | null>(null);
  const previewSrc = useRef<string>('');

  const handleEnter = (src: string) => {
    previewSrc.current = src;
    setActivePreview(src);
  };

  const handleLeave = () => {
    setActivePreview(null);
  };

  return (
    <section
      id="gallery"
      style={{
        padding: '120px 5vw 160px',
        backgroundColor: 'var(--ink)',
        position: 'relative',
      }}
    >
      {/* Hover preview image — desktop only */}
      <div
        className="gallery-preview"
        style={{
          position: 'fixed',
          right: '5vw',
          top: '50%',
          transform: 'translateY(-50%)',
          width: 'clamp(220px, 22vw, 340px)',
          aspectRatio: '4/3',
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 50,
          opacity: activePreview ? 1 : 0,
          transition: 'opacity 0.35s ease',
        }}
      >
        {previewSrc.current && (
          <Image
            src={previewSrc.current}
            alt="Preview"
            fill
            unoptimized
            style={{ objectFit: 'cover' }}
          />
        )}
      </div>

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

      {/* Project list */}
      <div>
        {GALLERY_PROJECTS.map((project) => (
          <GalleryRow
            key={project.slug}
            project={project}
            onEnter={() => handleEnter(project.cover)}
            onLeave={handleLeave}
          />
        ))}
      </div>

      <style>{`
        @media (max-width: 767px) {
          .gallery-preview { display: none !important; }
          .gallery-meta { display: none !important; }
          .gallery-arrow { display: block !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </section>
  );
}

function GalleryRow({
  project,
  onEnter,
  onLeave,
}: {
  project: (typeof GALLERY_PROJECTS)[number];
  onEnter: () => void;
  onLeave: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const handleEnter = () => {
    setHovered(true);
    onEnter();
  };

  const handleLeave = () => {
    setHovered(false);
    onLeave();
  };

  return (
    <a
      href={`/work/${project.slug}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '26px 0',
        borderBottom: hovered
          ? '1px solid rgba(232,82,10,0.4)'
          : '1px solid rgba(242,232,211,0.08)',
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

      {/* Category / Year — hidden on mobile */}
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
