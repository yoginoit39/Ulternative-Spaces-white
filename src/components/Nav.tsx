'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import TransitionLink from '@/components/TransitionLink';
import { gotoPanel } from '@/components/sheet/useSheetScroll';

const NAV_LINKS = [
  { href: '/#studio', label: 'Studio' },
  { href: '/#work', label: 'Work' },
  { href: '/#process', label: 'Process' },
  { href: '/#services', label: 'Services' },
  { href: '/philosophy', label: 'Philosophy' },
  { href: '/contact', label: 'Contact' },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // On the home sheet, hash links jump horizontally instead of reloading.
  useEffect(() => {
    if (pathname !== '/') return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (!href.startsWith('/#')) return;
      e.preventDefault();
      const id = href.slice(2);
      history.replaceState(null, '', `#${id}`);
      gotoPanel(id);
      setMenuOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [pathname]);

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
          backgroundColor: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,0,0,0.15)',
          height: 64,
          padding: '0 5vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <TransitionLink href="/" onClick={() => { closeMenu(); if (pathname === '/') gotoPanel('cover'); }} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <Image
            src="/images/logo.svg"
            alt="Ulternative Spaces"
            width={32}
            height={32}
            unoptimized
            style={{ borderRadius: '50%', flexShrink: 0 }}
          />
          <span
            style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 800,
              fontSize: 20,
              letterSpacing: '-0.02em',
              color: 'var(--ember)',
            }}
          >
            U.S
          </span>
        </TransitionLink>

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
                borderBottom: '1px solid rgba(0,0,0,0.07)',
                transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: menuOpen ? 1 : 0,
                transition: `transform 0.5s var(--ease-out) ${i * 60}ms, opacity 0.5s ease ${i * 60}ms`,
              }}
            >
              <TransitionLink
                href={link.href}
                onClick={closeMenu}
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-syne)',
                  fontWeight: 500,
                  fontSize: 'clamp(26px, 7vw, 44px)',
                  color: 'var(--parch)',
                  textDecoration: 'none',
                  padding: '14px 0',
                  letterSpacing: '-0.01em',
                  lineHeight: 1,
                }}
              >
                {link.label}
              </TransitionLink>
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
        .nav-hamburger { display: none !important; }
        .nav-overlay { display: none !important; }

        @media (max-width: 767px) {
          .nav-center-links { display: none !important; }
          .nav-cta-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .nav-overlay { display: flex !important; }
        }
      `}</style>
    </>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <TransitionLink
      href={href}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: '0.15em',
        color: hovered ? 'var(--accent)' : 'rgba(0,0,0,0.7)',
        textDecoration: 'none',
        textTransform: 'uppercase',
        transition: 'color 0.2s ease',
        display: 'inline-block',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </TransitionLink>
  );
}

function CTAButton() {
  const [hovered, setHovered] = useState(false);
  return (
    <TransitionLink
      href="/contact"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: hovered ? '1px solid var(--ember)' : '1px solid rgba(0,0,0,0.2)',
        borderRadius: hovered ? 999 : 0,
        padding: '8px 16px',
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: hovered ? 'white' : 'var(--parch)',
        backgroundColor: hovered ? 'var(--ember)' : 'transparent',
        textDecoration: 'none',
        transition: 'all 0.3s var(--ease-out)',
        whiteSpace: 'nowrap',
      }}
    >
      Start a Project ↗
    </TransitionLink>
  );
}
