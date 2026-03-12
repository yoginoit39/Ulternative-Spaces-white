'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';

/* ─── reusable reveal hook ─────────────────────────── */
function useReveal(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── main page ────────────────────────────────────── */
export default function PhilosophyClient() {
  return (
    <SmoothScroll>
      <Nav />
      <main style={{ backgroundColor: 'var(--ink)', overflowX: 'hidden' }}>
        <HeroSection />
        <MarkSection />
        <DualitySection />
        <PrinciplesSection />
        <ProcessSection />
        <ManifestoSection />
      </main>
      <Footer />

      {/* Grain overlay */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: 0.04,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: '300px 300px',
        }}
      />
    </SmoothScroll>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION 1 — HERO
═══════════════════════════════════════════════════════ */
function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 5vw 80px',
        position: 'relative',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Radial glow behind logo */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,0,0,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Logo mark */}
      <div
        style={{
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'scale(1)' : 'scale(0.85)',
          transition: 'opacity 1.2s ease, transform 1.2s var(--ease-out)',
          marginBottom: 48,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Image
          src="/images/logo.svg"
          alt="Ulternative Spaces mark"
          width={160}
          height={160}
          unoptimized
          style={{ borderRadius: '50%' }}
        />
      </div>

      {/* Thin gold rule */}
      <div
        style={{
          width: 48,
          height: 1,
          backgroundColor: 'var(--gold)',
          marginBottom: 32,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 1s ease 0.4s',
        }}
      />

      {/* Page label */}
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          letterSpacing: '0.25em',
          color: 'var(--ember)',
          textTransform: 'uppercase',
          marginBottom: 24,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 1s ease 0.6s',
        }}
      >
        The Mark · The Method · The Belief
      </p>

      {/* Main heading */}
      <h1
        style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 800,
          fontSize: 'clamp(52px, 9vw, 140px)',
          letterSpacing: '-0.04em',
          lineHeight: 0.88,
          color: 'var(--parch)',
          margin: 0,
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 1s ease 0.7s, transform 1s var(--ease-out) 0.7s',
        }}
      >
        DESIGN
        <br />
        <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>&amp;</span>
        <br />
        PHILOSOPHY
      </h1>

      {/* Scroll hint */}
      <p
        style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--steel)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 1s ease 1.4s',
        }}
      >
        SCROLL ↓
      </p>

      {/* Large faint background text */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: -20,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'var(--font-syne)',
          fontWeight: 800,
          fontSize: 'clamp(100px, 20vw, 260px)',
          color: 'rgba(0,0,0,0.025)',
          letterSpacing: '-0.06em',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        ∞
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION 2 — THE MARK (animated SVG infinity)
═══════════════════════════════════════════════════════ */
function MarkSection() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(false);
  const { ref: textRef, visible: textVisible } = useReveal(0.2);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setDrawn(true); obs.disconnect(); } },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      style={{
        padding: '140px 5vw',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '80px',
        alignItems: 'center',
        backgroundColor: 'var(--ink)',
        position: 'relative',
      }}
      className="mark-section-grid"
    >
      {/* Gold decorative rule top */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '5vw',
          right: '5vw',
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.3), transparent)',
        }}
      />

      {/* SVG — left */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <svg
          ref={svgRef}
          viewBox="0 0 560 240"
          style={{ width: '100%', maxWidth: 480, overflow: 'visible' }}
          aria-hidden
        >
          {/* Background glow */}
          <defs>
            <radialGradient id="circleGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="168" cy="120" rx="90" ry="90" fill="url(#circleGlow)"
            style={{ opacity: drawn ? 1 : 0, transition: 'opacity 0.8s ease 1.8s' }} />
          <ellipse cx="392" cy="120" rx="90" ry="90" fill="url(#circleGlow)"
            style={{ opacity: drawn ? 1 : 0, transition: 'opacity 0.8s ease 1.8s' }} />

          {/* Filled circles (behind stroke) */}
          <circle cx="168" cy="120" r="60"
            fill="#ffffff"
            style={{ opacity: drawn ? 0.9 : 0, transition: 'opacity 0.6s ease 2.1s' }}
          />
          <circle cx="392" cy="120" r="60"
            fill="#ffffff"
            style={{ opacity: drawn ? 0.9 : 0, transition: 'opacity 0.6s ease 2.1s' }}
          />

          {/* Infinity path — animated stroke */}
          <path
            d="M 280,120
               C 280,56 222,12 168,12
               C 100,12 58,58 58,120
               C 58,182 100,228 168,228
               C 222,228 280,184 280,120
               C 280,56 338,12 392,12
               C 460,12 502,58 502,120
               C 502,182 460,228 392,228
               C 338,228 280,184 280,120"
            fill="none"
            stroke="#ffffff"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 1320,
              strokeDashoffset: drawn ? 0 : 1320,
              transition: 'stroke-dashoffset 2.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />

          {/* Center crossing dot */}
          <circle cx="280" cy="120" r="4" fill="var(--ink)"
            style={{ opacity: drawn ? 1 : 0, transition: 'opacity 0.3s ease 2.4s' }} />
        </svg>
      </div>

      {/* Text — right */}
      <div
        ref={textRef}
        style={{
          opacity: textVisible ? 1 : 0,
          transform: textVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'opacity 0.9s ease, transform 0.9s var(--ease-out)',
        }}
      >
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--ember)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: 24,
        }}>
          The Mark
        </p>

        <blockquote style={{
          fontFamily: 'var(--font-cormorant)',
          fontStyle: 'italic',
          fontSize: 'clamp(28px, 3.5vw, 48px)',
          color: 'var(--parch)',
          lineHeight: 1.2,
          borderLeft: '2px solid var(--gold)',
          paddingLeft: 24,
          margin: '0 0 36px 0',
        }}>
          "Two circles,<br />one unbroken line."
        </blockquote>

        <p style={{
          fontFamily: 'var(--font-cormorant)',
          fontWeight: 300,
          fontSize: 18,
          color: 'var(--steel)',
          lineHeight: 1.75,
          marginBottom: 20,
        }}>
          The lemniscate — mathematics' symbol for infinity — forms the foundation of our
          mark. It is not a decorative choice. It is a declaration: the work we do has no
          terminus. Design leads to construction leads to living leads to refinement leads
          to design again. An endless, self-renewing cycle.
        </p>

        <p style={{
          fontFamily: 'var(--font-cormorant)',
          fontWeight: 300,
          fontSize: 18,
          color: 'var(--steel)',
          lineHeight: 1.75,
        }}>
          Within each loop, a circle — solid, complete, resolved. The left: pure design.
          The right: precise execution. Separate in practice, inseparable in philosophy.
          United by the single line that runs through both without interruption.
        </p>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .mark-section-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION 3 — THE DUALITY (Design | Build)
═══════════════════════════════════════════════════════ */
function DualitySection() {
  const { ref: leftRef, visible: leftVisible } = useReveal(0.15);
  const { ref: rightRef, visible: rightVisible } = useReveal(0.15);

  const panelStyle = (visible: boolean, direction: 'left' | 'right') => ({
    padding: 'clamp(60px, 8vw, 100px) clamp(32px, 5vw, 80px)',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'flex-end',
    minHeight: '70vh',
    opacity: visible ? 1 : 0,
    transform: visible
      ? 'translateX(0)'
      : direction === 'left' ? 'translateX(-40px)' : 'translateX(40px)',
    transition: 'opacity 1s ease, transform 1s var(--ease-out)',
  });

  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        position: 'relative',
      }}
      className="duality-grid"
    >
      {/* Center divider line */}
      <div style={{
        position: 'absolute',
        top: '10%',
        bottom: '10%',
        left: '50%',
        width: 1,
        background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.5), transparent)',
        zIndex: 2,
      }} className="duality-divider" />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: 'var(--gold)',
        zIndex: 3,
      }} className="duality-divider" />

      {/* LEFT — Design */}
      <div
        ref={leftRef}
        style={{
          ...panelStyle(leftVisible, 'left'),
          backgroundColor: 'var(--mid)',
          borderRight: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        {/* Circle ornament */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          border: '1.5px solid rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 32,
        }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.1)' }} />
        </div>

        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--ember)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}>
          Circle One
        </p>

        <h2 style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 800,
          fontSize: 'clamp(52px, 7vw, 96px)',
          color: 'var(--parch)',
          letterSpacing: '-0.04em',
          lineHeight: 0.88,
          margin: '0 0 32px 0',
        }}>
          DESIGN
        </h2>

        <p style={{
          fontFamily: 'var(--font-cormorant)',
          fontWeight: 300,
          fontSize: 18,
          color: 'var(--steel)',
          lineHeight: 1.7,
          maxWidth: 380,
          marginBottom: 20,
        }}>
          Every project begins with a question, not a drawing. What should this place
          make you feel? How should light move through it? What does it owe to its
          landscape, its occupants, its era?
        </p>

        <p style={{
          fontFamily: 'var(--font-cormorant)',
          fontWeight: 300,
          fontSize: 18,
          color: 'var(--steel)',
          lineHeight: 1.7,
          maxWidth: 380,
        }}>
          Design is the long, patient translation of those answers into form. It demands
          restraint — knowing what to leave out is as important as knowing what to put in.
        </p>
      </div>

      {/* RIGHT — Build */}
      <div
        ref={rightRef}
        style={{
          ...panelStyle(rightVisible, 'right'),
          backgroundColor: 'var(--ink)',
        }}
      >
        {/* Circle ornament */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          border: '1.5px solid rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 32,
        }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.1)' }} />
        </div>

        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--ember)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}>
          Circle Two
        </p>

        <h2 style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 800,
          fontSize: 'clamp(52px, 7vw, 96px)',
          color: 'var(--parch)',
          letterSpacing: '-0.04em',
          lineHeight: 0.88,
          margin: '0 0 32px 0',
        }}>
          BUILD
        </h2>

        <p style={{
          fontFamily: 'var(--font-cormorant)',
          fontWeight: 300,
          fontSize: 18,
          color: 'var(--steel)',
          lineHeight: 1.7,
          maxWidth: 380,
          marginBottom: 20,
        }}>
          Construction is not the end of design. It is design's ultimate test. Every
          detail resolved on paper must survive contact with material reality — with
          timber, concrete, steel, and the hands that shape them.
        </p>

        <p style={{
          fontFamily: 'var(--font-cormorant)',
          fontWeight: 300,
          fontSize: 18,
          color: 'var(--steel)',
          lineHeight: 1.7,
          maxWidth: 380,
        }}>
          We control this process entirely. Because the greatest failure in architecture
          is a good design poorly built. The second circle closes only when the last
          detail is right.
        </p>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .duality-grid { grid-template-columns: 1fr !important; }
          .duality-divider { display: none !important; }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION 4 — PRINCIPLES
═══════════════════════════════════════════════════════ */
const PRINCIPLES = [
  {
    num: '01',
    title: 'Form Follows Feeling',
    body: 'We believe architecture begins not with a programme, but with an emotion. What should this space make you feel? The answer to that question dictates every decision that follows — from the angle of a wall to the weight of a door handle.',
  },
  {
    num: '02',
    title: 'The Infinite Detail',
    body: 'Perfection is not achieved when there is nothing left to add. It is achieved when every detail has been considered, reconsidered, and resolved. There is no detail too small to deserve the full weight of our attention.',
  },
  {
    num: '03',
    title: 'Rooted in Place',
    body: 'Every structure we design belongs specifically to its land, its climate, its culture. Architecture that could exist anywhere exists nowhere. We build for East Africa — for its light, its heat, its spirit — and for no other place.',
  },
  {
    num: '04',
    title: 'Design and Build as One',
    body: 'The separation of design and construction is the source of most architectural failure. When the person who designs a thing is not responsible for building it, something is always lost in translation. We refuse that gap. We are one.',
  },
];

function PrinciplesSection() {
  const { ref: headerRef, visible: headerVisible } = useReveal(0.2);

  return (
    <section
      style={{
        padding: '140px 5vw',
        backgroundColor: 'var(--ink)',
        position: 'relative',
      }}
    >
      {/* Top rule */}
      <div style={{
        width: '100%',
        height: 1,
        background: 'linear-gradient(90deg, rgba(0,0,0,0.3), transparent)',
        marginBottom: 80,
      }} />

      {/* Header */}
      <div
        ref={headerRef}
        style={{
          marginBottom: 80,
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.9s ease, transform 0.9s var(--ease-out)',
        }}
      >
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--ember)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: 16,
        }}>
          04 / What We Believe
        </p>
        <h2 style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 800,
          fontSize: 'clamp(48px, 7vw, 110px)',
          color: 'var(--parch)',
          letterSpacing: '-0.03em',
          lineHeight: 0.9,
          margin: 0,
        }}>
          PRINCIPLES
        </h2>
      </div>

      {/* Principles list */}
      <div>
        {PRINCIPLES.map((p, i) => (
          <PrincipleRow key={p.num} principle={p} index={i} />
        ))}
      </div>
    </section>
  );
}

function PrincipleRow({
  principle,
  index,
}: {
  principle: (typeof PRINCIPLES)[number];
  index: number;
}) {
  const { ref, visible } = useReveal(0.15);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '80px 1fr 2fr',
        gap: '40px',
        padding: '48px 0',
        borderBottom: hovered
          ? '1px solid rgba(0,0,0,0.3)'
          : '1px solid rgba(0,0,0,0.06)',
        transition: 'border-color 0.3s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transitionProperty: 'opacity, transform, border-color',
        transitionDuration: '0.8s',
        transitionDelay: `${index * 100}ms`,
        transitionTimingFunction: 'var(--ease-out)',
        cursor: 'default',
        alignItems: 'start',
      }}
      className="principle-row"
    >
      {/* Large faint number */}
      <div style={{
        fontFamily: 'var(--font-syne)',
        fontWeight: 800,
        fontSize: 'clamp(36px, 4vw, 56px)',
        color: hovered ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)',
        lineHeight: 1,
        transition: 'color 0.3s ease',
        paddingTop: 4,
      }}>
        {principle.num}
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: 'var(--font-syne)',
        fontWeight: 800,
        fontSize: 'clamp(20px, 2.5vw, 32px)',
        color: 'var(--parch)',
        letterSpacing: '-0.02em',
        lineHeight: 1.1,
        margin: 0,
        paddingTop: 4,
        transform: hovered ? 'translateX(8px)' : 'translateX(0)',
        transition: 'transform 0.3s var(--ease-out)',
      }}>
        {principle.title}
      </h3>

      {/* Body */}
      <p style={{
        fontFamily: 'var(--font-cormorant)',
        fontWeight: 300,
        fontSize: 18,
        color: 'var(--steel)',
        lineHeight: 1.7,
        margin: 0,
      }}>
        {principle.body}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION 5 — THE CYCLE (process as continuous loop)
═══════════════════════════════════════════════════════ */
const CYCLE_STEPS = [
  { num: '01', title: 'Enquiry', desc: 'Every project begins with a conversation — understanding your vision, your site, your life.' },
  { num: '02', title: 'Concept', desc: 'We translate that vision into bold spatial ideas. One clear direction, rigorously interrogated.' },
  { num: '03', title: 'Design', desc: 'From concept to complete construction documentation. Every detail drawn, considered, resolved.' },
  { num: '04', title: 'Approvals', desc: 'Full navigation of planning permissions, structural certifications, and regulatory requirements.' },
  { num: '05', title: 'Build', desc: 'We manage construction from the first excavation to the final fitting. Our people, our standards.' },
  { num: '06', title: 'Deliver', desc: 'Handover is not the end. We remain partners through the life of the building and beyond.' },
];

function ProcessSection() {
  const { ref: headerRef, visible: headerVisible } = useReveal(0.2);
  const { ref: gridRef, visible: gridVisible } = useReveal(0.15);

  return (
    <section
      style={{
        padding: '140px 5vw',
        backgroundColor: 'var(--mid)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Large faint ∞ background */}
      <div aria-hidden style={{
        position: 'absolute',
        top: '50%',
        right: '-10%',
        transform: 'translateY(-50%)',
        fontFamily: 'var(--font-syne)',
        fontWeight: 800,
        fontSize: '60vw',
        color: 'rgba(0,0,0,0.02)',
        lineHeight: 1,
        userSelect: 'none',
        pointerEvents: 'none',
      }}>
        ∞
      </div>

      {/* Header */}
      <div
        ref={headerRef}
        style={{
          marginBottom: 80,
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.9s ease, transform 0.9s var(--ease-out)',
        }}
      >
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--ember)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: 16,
        }}>
          05 / How We Work
        </p>
        <h2 style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 800,
          fontSize: 'clamp(48px, 7vw, 110px)',
          color: 'var(--parch)',
          letterSpacing: '-0.03em',
          lineHeight: 0.9,
          margin: 0,
        }}>
          THE CYCLE
        </h2>
      </div>

      {/* Steps grid */}
      <div
        ref={gridRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '0',
          position: 'relative',
          zIndex: 2,
        }}
        className="cycle-grid"
      >
        {CYCLE_STEPS.map((step, i) => (
          <CycleStep key={step.num} step={step} index={i} visible={gridVisible} />
        ))}
      </div>

      {/* Closing note */}
      <div style={{ marginTop: 80, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 32, height: 1, backgroundColor: 'var(--gold)' }} />
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--steel)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}>
          The cycle never ends — Deliver becomes Enquiry for the next project.
        </p>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .cycle-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}

function CycleStep({
  step,
  index,
  visible,
}: {
  step: (typeof CYCLE_STEPS)[number];
  index: number;
  visible: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '40px 36px',
        border: '1px solid rgba(0,0,0,0.05)',
        borderTop: index < 3 ? '1px solid rgba(0,0,0,0.05)' : 'none',
        backgroundColor: hovered ? 'rgba(0,0,0,0.04)' : 'transparent',
        transition: 'background-color 0.3s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transitionProperty: 'opacity, transform, background-color',
        transitionDuration: '0.8s',
        transitionDelay: `${index * 80}ms`,
        transitionTimingFunction: 'var(--ease-out)',
        cursor: 'default',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
      }}>
        {/* Small gold circle */}
        <div style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: '1.5px solid rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: hovered ? 'rgba(0,0,0,0.08)' : 'transparent',
          transition: 'background-color 0.3s ease',
          flexShrink: 0,
        }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'var(--gold)',
            opacity: hovered ? 1 : 0.4,
            transition: 'opacity 0.3s ease',
          }} />
        </div>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--ember)',
          letterSpacing: '0.15em',
        }}>
          {step.num}
        </span>
      </div>

      <h3 style={{
        fontFamily: 'var(--font-syne)',
        fontWeight: 800,
        fontSize: 22,
        color: 'var(--parch)',
        margin: '0 0 12px 0',
        letterSpacing: '-0.01em',
      }}>
        {step.title}
      </h3>

      <p style={{
        fontFamily: 'var(--font-cormorant)',
        fontWeight: 300,
        fontSize: 17,
        color: 'var(--steel)',
        lineHeight: 1.65,
        margin: 0,
      }}>
        {step.desc}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION 6 — MANIFESTO CLOSE
═══════════════════════════════════════════════════════ */
function ManifestoSection() {
  const { ref, visible } = useReveal(0.25);

  return (
    <section
      style={{
        padding: '160px 5vw',
        backgroundColor: 'var(--ink)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top rule */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '5vw',
        right: '5vw',
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.3), transparent)',
      }} />

      {/* Logo mark watermark */}
      <div
        ref={ref}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'opacity 1.2s ease, transform 1.2s var(--ease-out)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 740,
          width: '100%',
        }}
      >
        {/* Small logo */}
        <Image
          src="/images/logo.svg"
          alt=""
          width={64}
          height={64}
          unoptimized
          style={{ borderRadius: '50%', marginBottom: 40, opacity: 0.8 }}
        />

        {/* Gold rule */}
        <div style={{
          width: 48,
          height: 1,
          backgroundColor: 'var(--gold)',
          marginBottom: 40,
        }} />

        {/* Quote */}
        <blockquote style={{
          fontFamily: 'var(--font-cormorant)',
          fontStyle: 'italic',
          fontSize: 'clamp(30px, 5vw, 64px)',
          color: 'var(--parch)',
          lineHeight: 1.2,
          margin: '0 0 48px 0',
          fontWeight: 300,
        }}>
          "We do not build for this moment.
          <br />
          We build for the next
          <br />
          <span style={{ color: 'var(--gold)' }}>hundred years.</span>"
        </blockquote>

        {/* Attribution */}
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--steel)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: 64,
        }}>
          Ulternative Spaces · Kampala &amp; Juba
        </p>

        {/* CTA row */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <CTALink href="/work">View Our Work ↗</CTALink>
          <CTALink href="/#contact" variant="outline">Start a Project →</CTALink>
        </div>
      </div>
    </section>
  );
}

function CTALink({
  href,
  children,
  variant = 'solid',
}: {
  href: string;
  children: React.ReactNode;
  variant?: 'solid' | 'outline';
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-block',
        padding: '14px 28px',
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        transition: 'all 0.25s ease',
        ...(variant === 'solid'
          ? {
              backgroundColor: hovered ? 'var(--ember)' : 'var(--gold)',
              color: 'var(--ink)',
              border: 'none',
            }
          : {
              backgroundColor: 'transparent',
              color: hovered ? 'var(--parch)' : 'var(--steel)',
              border: hovered
                ? '1px solid rgba(0,0,0,0.4)'
                : '1px solid rgba(0,0,0,0.1)',
            }),
      }}
    >
      {children}
    </a>
  );
}
