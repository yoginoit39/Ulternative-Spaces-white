'use client';
import { useState } from 'react';

export default function Contact() {
  const [emailHovered, setEmailHovered] = useState(false);

  return (
    <section
      id="contact"
      style={{
        backgroundColor: 'transparent',
        padding: '120px 5vw 100px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dark overlay for readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255,255,255,0.6)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Content at zIndex 1 */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Section label */}
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--ember)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: 40,
          }}
        >
          06 / Get In Touch
        </p>

        {/* Massive CTA heading */}
        <h2
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: 'clamp(40px, 6.5vw, 96px)',
            letterSpacing: '-0.04em',
            lineHeight: 0.88,
            margin: '0 0 48px 0',
            color: 'var(--parch)',
          }}
        >
          LET&apos;S BUILD
          <br />
          SOMETHING
          <br />
          <span style={{ color: 'var(--gold)' }}>THAT LASTS.</span>
        </h2>

        {/* Big email link */}
        <a
          href="mailto:sulternative@gmail.com"
          onMouseEnter={() => setEmailHovered(true)}
          onMouseLeave={() => setEmailHovered(false)}
          style={{
            display: 'block',
            marginTop: 48,
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: 'clamp(20px, 3vw, 48px)',
            color: emailHovered ? 'var(--parch)' : 'var(--steel)',
            textDecoration: 'none',
            borderBottom: emailHovered ? '1px solid rgba(0,0,0,0.4)' : '1px solid transparent',
            transition: 'color 0.3s ease, border-bottom-color 0.3s ease',
            letterSpacing: '-0.02em',
          }}
        >
          sulternative@gmail.com{' '}
          <span style={{ color: 'var(--ember)', fontSize: '0.7em' }}>↗</span>
        </a>

        {/* Info row */}
        <div
          style={{
            borderTop: '1px solid rgba(0,0,0,0.06)',
            marginTop: 80,
            paddingTop: 40,
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 24,
          }}
        >
          <InfoBlock label="Email" value="sulternative@gmail.com" href="mailto:sulternative@gmail.com" />
          <InfoBlock label="Phone" value="+256 782 843290" href="tel:+256782843290" />
          <InfoBlock label="Kampala" value="Uganda, East Africa" href={null} />
          <InfoBlock label="Juba" value="South Sudan, East Africa" href={null} />
        </div>

        {/* Vertical side text — desktop only */}
        <div
          className="contact-vertical-text"
          style={{
            position: 'absolute',
            right: 20,
            top: '50%',
            transform: 'translateY(-50%) rotate(-90deg)',
            transformOrigin: 'center center',
            whiteSpace: 'nowrap',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 8,
              color: 'var(--steel)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            KAMPALA · UGANDA · JUBA · SOUTH SUDAN
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .contact-vertical-text { display: none !important; }
        }
      `}</style>
    </section>
  );
}

function InfoBlock({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string | null;
}) {
  return (
    <div>
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--steel)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 8,
          margin: '0 0 8px 0',
        }}
      >
        {label}
      </p>
      {href ? (
        <a
          href={href}
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontWeight: 400,
            fontSize: 14,
            color: 'var(--parch)',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ember)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--parch)')}
        >
          {value}
        </a>
      ) : (
        <p
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontWeight: 400,
            fontSize: 14,
            color: 'var(--parch)',
            margin: 0,
          }}
        >
          {value}
        </p>
      )}
    </div>
  );
}
