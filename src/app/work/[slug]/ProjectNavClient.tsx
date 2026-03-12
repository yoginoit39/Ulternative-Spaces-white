'use client';
import { useState } from 'react';

export default function ProjectNavClient() {
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        padding: '20px 5vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <BackLink />

      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--steel)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}
      >
        U.S · ULTERNATIVE SPACES
      </span>

      <CTALink />
    </nav>
  );
}

function BackLink() {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href="/"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        color: hovered ? 'var(--parch)' : 'var(--steel)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        transition: 'color 0.2s ease',
      }}
    >
      ← All Work
    </a>
  );
}

function CTALink() {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href="mailto:sulternative@gmail.com"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: hovered ? 'white' : 'var(--parch)',
        textDecoration: 'none',
        border: hovered ? '1px solid var(--ember)' : '1px solid rgba(0,0,0,0.2)',
        backgroundColor: hovered ? 'var(--ember)' : 'transparent',
        padding: '8px 16px',
        transition: 'all 0.2s ease',
      }}
    >
      Start a Project ↗
    </a>
  );
}
