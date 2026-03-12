'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PROJECTS } from '@/lib/projects';

// Use only the first 6 projects
const WORK_PROJECTS = PROJECTS.slice(0, 6);

export default function Work() {
  const [activeIdx, setActiveIdx] = useState(0);
  const router = useRouter();

  return (
    <section
      id="work"
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: 'transparent',
        padding: '160px 5vw 60px',
      }}
    >
      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '80vh',
        }}
      >
        {/* Header */}
        <div>
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
              fontSize: 'clamp(48px, 7vw, 110px)',
              color: 'var(--parch)',
              letterSpacing: '-0.03em',
              lineHeight: 0.9,
              margin: 0,
            }}
          >
            SELECTED WORK
          </h2>
        </div>

        {/* Glass panel wrapping the project list */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: 60,
            maxWidth: 720,
          }}
        >
          <div
            style={{
              background: 'rgba(7,5,4,0.6)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              padding: '32px 40px',
            }}
          >
            {WORK_PROJECTS.map((project, i) => (
              <ProjectRow
                key={project.slug}
                project={project}
                isActive={activeIdx === i}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(0)}
                onClick={() => router.push(`/work/${project.slug}`)}
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
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        padding: '20px 0',
        borderBottom: isActive
          ? '1px solid rgba(232,82,10,0.5)'
          : '1px solid rgba(242,232,211,0.08)',
        cursor: 'pointer',
        transition: 'border-color 0.3s ease',
      }}
    >
      {/* Number */}
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--ember)',
          letterSpacing: '0.15em',
          flexShrink: 0,
          width: 28,
        }}
      >
        {project.num}
      </span>

      {/* Name */}
      <span
        style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 800,
          fontSize: 'clamp(28px, 3.5vw, 52px)',
          color: isActive ? 'var(--gold)' : 'var(--parch)',
          flex: 1,
          lineHeight: 1,
          transition: 'color 0.3s ease',
          transform: isActive ? 'translateX(8px)' : 'translateX(0)',
        }}
      >
        {project.name}
      </span>

      {/* Category · Year */}
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

      {/* Arrow */}
      <span
        style={{
          color: 'var(--ember)',
          fontSize: 18,
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
