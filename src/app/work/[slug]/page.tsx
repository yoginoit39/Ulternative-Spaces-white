import { notFound } from 'next/navigation';
import { getProject, PROJECTS } from '@/lib/projects';
import type { Metadata } from 'next';
import Image from 'next/image';
import ProjectNavClient from './ProjectNavClient';
import ProjectCTAClient from './ProjectCTAClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: 'Project Not Found' };
  return {
    title: `${project.name} — Ulternative Spaces`,
    description: project.description,
  };
}

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const META_ITEMS = [
    { label: 'Category', value: project.category },
    { label: 'Year', value: project.year },
    { label: 'Location', value: project.location },
    { label: 'Status', value: project.status },
  ];

  return (
    <div style={{ backgroundColor: 'var(--ink)', minHeight: '100vh' }}>
      {/* Project Nav — client component for hover states */}
      <ProjectNavClient />

      {/* Hero image */}
      <div
        style={{
          position: 'relative',
          height: '80vh',
          overflow: 'hidden',
        }}
      >
        <Image
          src={project.cover}
          alt={project.name}
          fill
          unoptimized
          priority
          style={{
            objectFit: 'cover',
            filter: 'brightness(0.8)',
          }}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '55%',
            background: 'linear-gradient(to top, var(--ink) 0%, transparent 100%)',
          }}
        />
      </div>

      {/* Project header */}
      <div style={{ padding: '60px 5vw 0' }}>
        <div style={{ marginBottom: 20 }}>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--ember)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            {project.num} / {project.category}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--steel)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            {project.year} · {project.location}
          </p>
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: 'clamp(48px, 8vw, 120px)',
            color: 'var(--parch)',
            letterSpacing: '-0.03em',
            lineHeight: 0.9,
            margin: '0 0 60px 0',
          }}
        >
          {project.name}
        </h1>

        {/* Meta bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 32,
            padding: '32px 0',
            borderTop: '1px solid rgba(0,0,0,0.1)',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            marginBottom: 72,
          }}
        >
          {META_ITEMS.map((item) => (
            <div key={item.label}>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  color: 'var(--steel)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                {item.label}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontWeight: 400,
                  fontSize: 18,
                  color: 'var(--parch)',
                  margin: 0,
                }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Description */}
        <p
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontWeight: 300,
            fontSize: 'clamp(18px, 2vw, 24px)',
            color: 'var(--steel)',
            lineHeight: 1.7,
            maxWidth: 780,
            marginBottom: 100,
          }}
        >
          {project.description}
        </p>
      </div>

      {/* Gallery — asymmetric grid */}
      {project.gallery.length >= 5 && (
        <div
          style={{
            padding: '0 5vw 100px',
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 16,
          }}
        >
          {/* Image 1: 7/12 cols */}
          <div
            style={{
              gridColumn: 'span 7',
              position: 'relative',
              aspectRatio: '16/10',
              overflow: 'hidden',
            }}
            className="project-gallery-item"
          >
            <Image
              src={project.gallery[0]}
              alt={`${project.name} — Image 1`}
              fill
              unoptimized
              style={{ objectFit: 'cover', transition: 'transform 0.5s var(--ease-out)' }}
              className="gallery-img"
            />
          </div>

          {/* Image 2: 5/12 cols */}
          <div
            style={{
              gridColumn: 'span 5',
              position: 'relative',
              aspectRatio: '3/4',
              overflow: 'hidden',
            }}
            className="project-gallery-item"
          >
            <Image
              src={project.gallery[1]}
              alt={`${project.name} — Image 2`}
              fill
              unoptimized
              style={{ objectFit: 'cover', transition: 'transform 0.5s var(--ease-out)' }}
              className="gallery-img"
            />
          </div>

          {/* Image 3: 5/12 cols */}
          <div
            style={{
              gridColumn: 'span 5',
              position: 'relative',
              aspectRatio: '3/4',
              overflow: 'hidden',
            }}
            className="project-gallery-item"
          >
            <Image
              src={project.gallery[2]}
              alt={`${project.name} — Image 3`}
              fill
              unoptimized
              style={{ objectFit: 'cover', transition: 'transform 0.5s var(--ease-out)' }}
              className="gallery-img"
            />
          </div>

          {/* Image 4: 7/12 cols */}
          <div
            style={{
              gridColumn: 'span 7',
              position: 'relative',
              aspectRatio: '16/10',
              overflow: 'hidden',
            }}
            className="project-gallery-item"
          >
            <Image
              src={project.gallery[3]}
              alt={`${project.name} — Image 4`}
              fill
              unoptimized
              style={{ objectFit: 'cover', transition: 'transform 0.5s var(--ease-out)' }}
              className="gallery-img"
            />
          </div>

          {/* Image 5: 12/12 cols */}
          <div
            style={{
              gridColumn: 'span 12',
              position: 'relative',
              aspectRatio: '21/9',
              overflow: 'hidden',
            }}
            className="project-gallery-item"
          >
            <Image
              src={project.gallery[4]}
              alt={`${project.name} — Image 5`}
              fill
              unoptimized
              style={{ objectFit: 'cover', transition: 'transform 0.5s var(--ease-out)' }}
              className="gallery-img"
            />
          </div>
        </div>
      )}

      {/* CTA — uses client component for hover states */}
      <ProjectCTAClient />

      {/* Footer */}
      <footer
        style={{
          padding: '28px 5vw',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid rgba(0,0,0,0.08)',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--steel)',
            letterSpacing: '0.08em',
            margin: 0,
          }}
        >
          © 2026 Ulternative Spaces · Kampala · Juba
        </p>
        <a
          href="/"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--steel)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          ← Back to site
        </a>
      </footer>

      <style>{`
        .project-gallery-item:hover .gallery-img {
          transform: scale(1.04);
        }
        @media (max-width: 640px) {
          .project-gallery-item {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </div>
  );
}
