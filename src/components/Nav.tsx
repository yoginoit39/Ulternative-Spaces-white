'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const NAV_LINKS = [
  { href: '/#about', label: 'About' },
  { href: '/#work', label: 'Work' },
  { href: '/#gallery', label: 'Gallery' },
  { href: '/#services', label: 'Services' },
  { href: '/philosophy', label: 'Philosophy' },
  { href: '/#contact', label: 'Contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          backgroundColor: 'rgba(7,5,4,0.6)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(242,232,211,0.06)',
          padding: '20px 5vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link href="/" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <Image
            src="/images/logo.svg"
            alt="Ulternative Spaces"
            width={28}
            height={28}
            unoptimized
            style={{ borderRadius: '50%', flexShrink: 0 }}
          />
          <span
            style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 800,
              fontSize: 14,
              color: 'var(--ember)',
            }}
          >
            U.S
          </span>
          <span style={{ color: 'var(--steel)', fontSize: 12 }}>·</span>
          <span
            className="nav-wordmark"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              letterSpacing: '0.2em',
              color: 'var(--parch)',
              textTransform: 'uppercase',
            }}
          >
            ULTERNATIVE SPACES
          </span>
        </Link>

        {/* Center nav links — desktop only */}
        <ul
          className="nav-center-links"
          style={{
            display: 'flex',
            gap: 32,
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
        >
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <NavLink href={link.href} label={link.label} />
            </li>
          ))}
        </ul>

        {/* CTA — desktop only */}
        <div className="nav-cta-desktop">
          <CTAButton />
        </div>

        {/* Hamburger — mobile only */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 5,
            width: 32,
            height: 32,
          }}
        >
          <span
            style={{
              display: 'block',
              width: menuOpen ? 22 : 22,
              height: 1.5,
              backgroundColor: 'var(--parch)',
              transformOrigin: 'center',
              transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none',
              transition: 'transform 0.3s var(--ease-out)',
            }}
          />
          <span
            style={{
              display: 'block',
              width: 22,
              height: 1.5,
              backgroundColor: 'var(--parch)',
              opacity: menuOpen ? 0 : 1,
              transition: 'opacity 0.2s ease',
            }}
          />
          <span
            style={{
              display: 'block',
              width: menuOpen ? 22 : 14,
              height: 1.5,
              backgroundColor: 'var(--parch)',
              transformOrigin: 'center',
              transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
              transition: 'transform 0.3s var(--ease-out), width 0.3s ease',
            }}
          />
        </button>
      </nav>

      {/* Mobile full-screen overlay */}
      <div
        className="nav-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 190,
          backgroundColor: 'var(--ink)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 8vw 60px',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'all' : 'none',
          transition: 'opacity 0.4s var(--ease-out)',
        }}
      >
        {/* Nav items */}
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, marginBottom: 48 }}>
          {NAV_LINKS.map((link, i) => (
            <li
              key={link.href}
              style={{
                borderBottom: '1px solid rgba(242,232,211,0.07)',
                transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: menuOpen ? 1 : 0,
                transition: `transform 0.5s var(--ease-out) ${i * 60}ms, opacity 0.5s ease ${i * 60}ms`,
              }}
            >
              <a
                href={link.href}
                onClick={closeMenu}
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-syne)',
                  fontWeight: 800,
                  fontSize: 'clamp(36px, 10vw, 56px)',
                  color: 'var(--parch)',
                  textDecoration: 'none',
                  padding: '16px 0',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div
          style={{
            transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
            opacity: menuOpen ? 1 : 0,
            transition: `transform 0.5s var(--ease-out) 350ms, opacity 0.5s ease 350ms`,
          }}
        >
          <a
            href="mailto:sulternative@gmail.com"
            onClick={closeMenu}
            style={{
              display: 'inline-block',
              border: '1px solid var(--ember)',
              padding: '14px 28px',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--parch)',
              textDecoration: 'none',
              marginBottom: 32,
            }}
          >
            Start a Project ↗
          </a>

          <div style={{ display: 'flex', gap: 24 }}>
            <a
              href="tel:+256000000000"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                color: 'var(--steel)',
                letterSpacing: '0.1em',
                textDecoration: 'none',
              }}
            >
              Kampala · UG
            </a>
            <a
              href="tel:+211000000000"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                color: 'var(--steel)',
                letterSpacing: '0.1em',
                textDecoration: 'none',
              }}
            >
              Juba · SS
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .nav-hamburger { display: none; }
        .nav-overlay { display: none; }

        @media (max-width: 767px) {
          .nav-center-links { display: none !important; }
          .nav-cta-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .nav-overlay { display: flex !important; }
          .nav-wordmark { display: none !important; }
        }
      `}</style>
    </>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        letterSpacing: '0.15em',
        color: hovered ? 'var(--parch)' : 'var(--steel)',
        textDecoration: 'none',
        textTransform: 'uppercase',
        transition: 'color 0.2s ease',
      }}
    >
      {label}
    </a>
  );
}

function CTAButton() {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href="mailto:sulternative@gmail.com"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: hovered ? '1px solid var(--ember)' : '1px solid rgba(242,232,211,0.2)',
        padding: '8px 16px',
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: hovered ? 'white' : 'var(--parch)',
        backgroundColor: hovered ? 'var(--ember)' : 'transparent',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
      }}
    >
      Start a Project ↗
    </a>
  );
}
