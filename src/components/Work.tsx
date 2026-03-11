'use client';
import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const PROJECTS = [
  {
    slug: 'kampala-residence',
    num: '01',
    name: 'Kampala Residence',
    category: 'Residential',
    year: '2024',
    cover: '/images/Image from Facebook (1).jpg',
  },
  {
    slug: 'commercial-complex',
    num: '02',
    name: 'Commercial Complex',
    category: 'Commercial',
    year: '2024',
    cover: '/images/Image from Facebook (6).jpg',
  },
  {
    slug: 'interior-suite',
    num: '03',
    name: 'Interior Suite',
    category: 'Interiors',
    year: '2023',
    cover: '/images/Image from Facebook (11).jpg',
  },
  {
    slug: 'villa-design',
    num: '04',
    name: 'Villa Design',
    category: 'Residential',
    year: '2023',
    cover: '/images/Image from Facebook (15).jpg',
  },
  {
    slug: 'juba-complex',
    num: '05',
    name: 'Juba Complex',
    category: 'Mixed-Use',
    year: '2022',
    cover: '/images/Image from Facebook (19).jpg',
  },
  {
    slug: 'urban-pavilion',
    num: '06',
    name: 'Urban Pavilion',
    category: 'Architecture',
    year: '2022',
    cover: '/images/Image from Facebook (24).jpg',
  },
  {
    slug: 'luxury-home',
    num: '07',
    name: 'Luxury Home',
    category: 'Residential',
    year: '2022',
    cover: '/images/Image from Facebook (20).jpg',
  },
  {
    slug: 'retail-flagship',
    num: '08',
    name: 'Retail Flagship',
    category: 'Commercial',
    year: '2021',
    cover: '/images/Image from Facebook (21).jpg',
  },
  {
    slug: 'studio-interior',
    num: '09',
    name: 'Studio Interior',
    category: 'Interiors',
    year: '2021',
    cover: '/images/Image from Facebook (22).jpg',
  },
  {
    slug: 'garden-house',
    num: '10',
    name: 'Garden House',
    category: 'Residential',
    year: '2021',
    cover: '/images/Image from Facebook (23).jpg',
  },
];

export default function Work() {
  const trackRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const dragDelta = useRef(0);

  // Mouse drag handlers (desktop)
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (trackRef.current?.offsetLeft ?? 0);
    scrollLeft.current = trackRef.current?.scrollLeft ?? 0;
    dragDelta.current = 0;
    if (trackRef.current) trackRef.current.style.cursor = 'grabbing';
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    dragDelta.current = Math.abs(walk);
    trackRef.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = 'grab';
  }, []);

  const onMouseLeave = useCallback(() => {
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = 'grab';
  }, []);

  // Touch drag handlers (mobile)
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].pageX;
    scrollLeft.current = trackRef.current?.scrollLeft ?? 0;
    dragDelta.current = 0;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!trackRef.current) return;
    const x = e.touches[0].pageX;
    const walk = (x - startX.current) * 1;
    dragDelta.current = Math.abs(walk);
    trackRef.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  const onTouchEnd = useCallback(() => {
    // dragDelta persists for handleCardClick
  }, []);

  const handleCardClick = useCallback(
    (slug: string) => {
      if (dragDelta.current < 8) {
        router.push(`/work/${slug}`);
      }
    },
    [router]
  );

  return (
    <section
      id="work"
      style={{
        padding: '100px 0 0',
        backgroundColor: 'var(--ink)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ padding: '0 5vw', marginBottom: 40 }}>
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
          02 / Selected Work
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: 'clamp(40px, 6vw, 90px)',
            color: 'var(--parch)',
            letterSpacing: '-0.03em',
            lineHeight: 0.95,
            margin: '0 0 16px 0',
          }}
        >
          EXPLORE WORK
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--steel)',
            letterSpacing: '0.1em',
          }}
        >
          ← swipe or drag →
        </p>
      </div>

      {/* Drag / swipe track */}
      <div
        ref={trackRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          display: 'flex',
          gap: 20,
          overflowX: 'auto',
          paddingLeft: '5vw',
          paddingRight: '5vw',
          paddingBottom: 80,
          cursor: 'grab',
          userSelect: 'none',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
        }}
        className="work-track"
      >
        {PROJECTS.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            onClick={() => handleCardClick(project.slug)}
          />
        ))}
      </div>

      <style>{`
        .work-track::-webkit-scrollbar { display: none; }
        .work-track { touch-action: pan-x; scroll-snap-type: x proximity; }
        .work-card { scroll-snap-align: start; }

        @media (max-width: 767px) {
          .work-card { width: clamp(260px, 75vw, 340px) !important; }
        }
      `}</style>
    </section>
  );
}

function ProjectCard({
  project,
  onClick,
}: {
  project: (typeof PROJECTS)[number];
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className="work-card"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 'clamp(320px, 30vw, 420px)',
        flexShrink: 0,
        cursor: 'pointer',
      }}
    >
      {/* Image container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '3/4',
          overflow: 'hidden',
        }}
      >
        <Image
          src={project.cover}
          alt={project.name}
          fill
          unoptimized
          style={{
            objectFit: 'cover',
            filter: 'saturate(0.8) brightness(0.88)',
            transform: hovered ? 'scale(1)' : 'scale(1.06)',
            transition: 'transform 0.6s var(--ease-out)',
          }}
        />
        {/* VIEW overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(7,5,4,0.45)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'white',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              border: '1px solid rgba(255,255,255,0.5)',
              padding: '10px 20px',
            }}
          >
            VIEW
          </span>
        </div>
      </div>

      {/* Card info */}
      <div style={{ padding: '16px 0' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--ember)',
            letterSpacing: '0.12em',
          }}
        >
          {project.num}
        </span>
        <h3
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: 'clamp(20px, 2.5vw, 28px)',
            color: 'var(--parch)',
            margin: '6px 0 4px',
            lineHeight: 1.1,
          }}
        >
          {project.name}
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--steel)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          {project.category} · {project.year}
        </p>
      </div>
    </article>
  );
}
