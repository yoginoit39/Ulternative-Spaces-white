'use client';
import { useRef, useState, useEffect } from 'react';

const SERVICES = [
  {
    num: '01',
    word: 'ARCHITECTURE',
    description:
      'From concept to construction documents. We design buildings that define their surroundings — structurally bold, aesthetically lasting.',
    tags: ['Residential', 'Commercial', 'Institutional'],
  },
  {
    num: '02',
    word: 'INTERIORS',
    description:
      'Transforming enclosed space into lived experience. Materials, light, and proportion curated for enduring beauty.',
    tags: ['Residential', 'Hospitality', 'Office'],
  },
  {
    num: '03',
    word: 'DESIGN-BUILD',
    description:
      'Seamless delivery from first sketch to final handover. One team, zero gaps between vision and construction.',
    tags: ['Turnkey', 'Renovation', 'Fit-out'],
  },
];

export default function Services() {
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ticker = tickerRef.current;
    if (!ticker) return;
    let x = 0;
    let raf: number;
    const speed = 0.4;
    const animate = () => {
      const w = ticker.scrollWidth / 2;
      x -= speed;
      if (Math.abs(x) >= w) x = 0;
      ticker.style.transform = `translateX(${x}px)`;
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const tickerText = 'ARCHITECTURE · INTERIOR DESIGN · DESIGN-BUILD · ';

  return (
    <section
      id="services"
      style={{
        backgroundColor: 'transparent',
        padding: '120px 0 100px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Full-section dark overlay for readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(7,5,4,0.55)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Content at zIndex 1 */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ padding: '0 5vw', marginBottom: 60 }}>
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
              fontSize: 'clamp(36px, 5vw, 72px)',
              color: 'var(--parch)',
              letterSpacing: '-0.03em',
              lineHeight: 0.9,
              margin: 0,
            }}
          >
            WHAT WE BUILD
          </h2>
        </div>

        {/* Service rows */}
        {SERVICES.map((service) => (
          <ServiceRow key={service.num} service={service} />
        ))}

        {/* Bottom marquee */}
        <div
          style={{
            overflow: 'hidden',
            borderTop: '1px solid rgba(242,232,211,0.06)',
            padding: '16px 0',
            marginTop: 40,
            whiteSpace: 'nowrap',
          }}
        >
          <div ref={tickerRef} style={{ display: 'inline-flex', willChange: 'transform' }}>
            {[tickerText, tickerText].map((t, i) => (
              <span
                key={i}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  color: 'var(--steel)',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  paddingRight: '2em',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceRow({ service }: { service: (typeof SERVICES)[number] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        padding: '32px 5vw',
        borderTop: hovered
          ? '1px solid rgba(232,82,10,0.3)'
          : '1px solid rgba(242,232,211,0.06)',
        transition: 'border-top-color 0.4s ease',
      }}
    >
      {/* Number — top right */}
      <span
        style={{
          position: 'absolute',
          top: 40,
          right: '5vw',
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--ember)',
          letterSpacing: '0.15em',
          opacity: 0.8,
        }}
      >
        {service.num}
      </span>

      {/* The big word */}
      <div
        style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 800,
          fontSize: 'clamp(28px, 3.8vw, 56px)',
          letterSpacing: '-0.04em',
          lineHeight: 1,
          color: hovered ? 'var(--parch)' : 'rgba(242,232,211,0.15)',
          transition: 'color 0.4s ease',
          userSelect: 'none',
        }}
      >
        {service.word}
      </div>

      {/* Tags */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginTop: 12,
          flexWrap: 'wrap',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}
      >
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

      {/* Description */}
      <div
        className="service-description"
        style={{
          position: 'absolute',
          right: '5vw',
          top: '50%',
          transform: hovered
            ? 'translateY(-50%) translateX(0)'
            : 'translateY(-50%) translateX(20px)',
          maxWidth: 380,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.4s ease, transform 0.4s ease',
          pointerEvents: 'none',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontWeight: 300,
            fontSize: 18,
            color: 'var(--steel)',
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {service.description}
        </p>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .service-description { display: none !important; }
        }
      `}</style>
    </div>
  );
}
