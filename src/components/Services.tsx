'use client';
import { useState } from 'react';
import Image from 'next/image';

const SERVICES = [
  {
    num: '01',
    name: 'Architecture',
    image: '/images/Image from Facebook (1).jpg',
    description:
      'From concept to construction documents. Buildings that define their surroundings with structural integrity and lasting aesthetic vision.',
    tags: ['Residential', 'Commercial', 'Institutional'],
  },
  {
    num: '02',
    name: 'Interior Design',
    image: '/images/Image from Facebook (11).jpg',
    description:
      'Transforming enclosed space into lived experience. Every material, light source, and proportion curated for environments of lasting beauty.',
    tags: ['Residential', 'Hospitality', 'Office'],
  },
  {
    num: '03',
    name: 'Design-Build',
    image: '/images/Image from Facebook (19).jpg',
    description:
      'Seamless delivery from first sketch to final handover. Our integrated approach eliminates gaps between design and construction.',
    tags: ['Turnkey', 'Renovation', 'Fit-out'],
  },
];

export default function Services() {
  return (
    <section
      id="services"
      style={{
        padding: '140px 5vw',
        backgroundColor: 'var(--mid)',
      }}
    >
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
          03 / Services
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
          WHAT WE BUILD
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
        }}
        className="services-grid"
      >
        {SERVICES.map((service) => (
          <ServiceCard key={service.name} service={service} />
        ))}
      </div>

      <style>{`
        @media (min-width: 900px) {
          .services-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}

function ServiceCard({ service }: { service: (typeof SERVICES)[number] }) {
  const [flipped, setFlipped] = useState(false);

  const handleClick = () => {
    // Toggle on tap (touch devices) — hover handles desktop
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
      setFlipped((f) => !f);
    }
  };

  return (
    <div
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={handleClick}
      style={{
        height: 480,
        perspective: 1000,
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.55s var(--ease-out)',
        }}
      >
        {/* Front face */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            backgroundColor: 'rgba(242,232,211,0.03)',
            border: '1px solid rgba(242,232,211,0.08)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '18px 20px 12px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                color: 'var(--ember)',
                letterSpacing: '0.12em',
              }}
            >
              {service.num}
            </span>
          </div>

          <div
            style={{
              position: 'relative',
              height: 300,
              flex: '0 0 300px',
              overflow: 'hidden',
            }}
          >
            <Image
              src={service.image}
              alt={service.name}
              fill
              unoptimized
              style={{ objectFit: 'cover' }}
            />
          </div>

          <div style={{ padding: '20px 20px 16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <h3
              style={{
                fontFamily: 'var(--font-syne)',
                fontWeight: 800,
                fontSize: 20,
                color: 'var(--parch)',
                margin: 0,
              }}
            >
              {service.name}
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                color: 'var(--steel)',
                letterSpacing: '0.1em',
                marginTop: 8,
              }}
            >
              tap or hover to explore →
            </p>
          </div>
        </div>

        {/* Back face */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            backgroundColor: 'var(--ink)',
            border: '1px solid rgba(232,82,10,0.25)',
            padding: '36px 28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-syne)',
                fontWeight: 800,
                fontSize: 24,
                color: 'var(--parch)',
                marginBottom: 20,
              }}
            >
              {service.name}
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontWeight: 300,
                fontSize: 17,
                color: 'var(--steel)',
                lineHeight: 1.65,
                marginBottom: 28,
              }}
            >
              {service.description}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 8,
                    color: 'var(--ember)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    border: '1px solid rgba(232,82,10,0.3)',
                    padding: '4px 10px',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <a
            href="/#contact"
            onClick={(e) => e.stopPropagation()}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--ember)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(232,82,10,0.4)',
              paddingBottom: 4,
              alignSelf: 'flex-start',
            }}
          >
            Start a project →
          </a>
        </div>
      </div>
    </div>
  );
}
