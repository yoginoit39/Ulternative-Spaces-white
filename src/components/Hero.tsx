'use client';
import { useEffect, useRef, useState } from 'react';

const FILTER_BUTTONS = ['ALL WORK', 'RESIDENTIAL', 'COMMERCIAL', 'INTERIORS'] as const;

export default function Hero({ siteReady }: { siteReady: boolean }) {
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<string>('ALL WORK');
  const [mouseX, setMouseX] = useState(0);

  // GSAP entrance
  useEffect(() => {
    if (!siteReady) return;

    const run = async () => {
      const gsapModule = await import('gsap');
      const gsap = gsapModule.default || gsapModule.gsap;
      if (!gsap) return;

      gsap.set(line1Ref.current, { y: '110%' });
      gsap.set(line2Ref.current, { y: '110%' });
      gsap.set(ruleRef.current, { scaleX: 0, transformOrigin: 'left center' });
      gsap.set(infoRef.current, { opacity: 0, y: 20 });
      gsap.set(tickerRef.current, { opacity: 0 });

      const tl = gsap.timeline({ delay: 0.1 });
      tl.to(line1Ref.current, { y: '0%', duration: 1.1, ease: 'power4.out' })
        .to(ruleRef.current, { scaleX: 1, duration: 0.8, ease: 'power3.inOut' }, '-=0.6')
        .to(line2Ref.current, { y: '0%', duration: 1.1, ease: 'power4.out' }, '-=0.8')
        .to(infoRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
        .to(tickerRef.current, { opacity: 1, duration: 0.6 }, '-=0.2');
    };

    run();
  }, [siteReady]);

  // Mouse parallax
  useEffect(() => {
    if (!siteReady) return;
    const onMouseMove = (e: MouseEvent) => setMouseX(e.clientX);
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [siteReady]);

  // Ticker animation
  useEffect(() => {
    const ticker = tickerRef.current;
    if (!ticker) return;
    let x = 0;
    let raf: number;
    const speed = 0.5;
    const animate = () => {
      const tickerWidth = ticker.scrollWidth / 2;
      x -= speed;
      if (Math.abs(x) >= tickerWidth) x = 0;
      ticker.style.transform = `translateX(${x}px)`;
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const parallaxOffset =
    typeof window !== 'undefined' ? (mouseX / (window.innerWidth || 1) - 0.5) : 0;

  const tickerText =
    'ARCHITECTURE · INTERIOR DESIGN · CONSTRUCTION · KAMPALA, UGANDA · JUBA, SOUTH SUDAN · DESIGN-BUILD · ULTERNATIVE SPACES · ';

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        position: 'relative',
        backgroundColor: 'transparent',
        overflowX: 'clip',
      }}
    >
      {/* Bottom gradient overlay for text readability */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60%',
          background: 'linear-gradient(to top, rgba(7,5,4,0.7) 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Top-left corner label */}
      <span
        style={{
          position: 'absolute',
          top: 100,
          left: '5vw',
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--steel)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          zIndex: 2,
        }}
      >
        DESIGN-BUILD · EST. KAMPALA
      </span>

      {/* Top-right corner label */}
      <span
        style={{
          position: 'absolute',
          top: 100,
          right: '5vw',
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--steel)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          zIndex: 2,
        }}
      >
        28.4°N 36.8°E
      </span>

      {/* Center content */}
      <div
        style={{
          padding: '0 5vw',
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        {/* Line 1: ULTERNATIVE */}
        <div style={{ overflow: 'hidden' }}>
          <div
            ref={line1Ref}
            style={{
              transform: siteReady ? undefined : 'translateY(110%)',
              transition: 'transform 0.6s ease',
              willChange: 'transform',
            }}
          >
            <div
              style={{
                transform: siteReady ? `translateX(${parallaxOffset * -14}px)` : 'none',
                transition: 'transform 0.6s ease',
              }}
            >
              <h1
                style={{
                  fontFamily: 'var(--font-syne)',
                  fontWeight: 800,
                  fontSize: 'clamp(52px, 7.5vw, 110px)',
                  letterSpacing: '-0.04em',
                  lineHeight: 0.88,
                  color: 'var(--parch)',
                  margin: 0,
                }}
              >
                ULTERNATIVE
              </h1>
            </div>
          </div>
        </div>

        {/* Gold rule */}
        <div
          ref={ruleRef}
          style={{
            width: '60%',
            height: 1,
            background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
            marginLeft: '5%',
            margin: '16px 0 16px 5%',
            willChange: 'transform',
          }}
        />

        {/* Line 2: SPACES. */}
        <div style={{ overflow: 'hidden' }}>
          <div ref={line2Ref} style={{ willChange: 'transform' }}>
            <div
              style={{
                transform: siteReady ? `translateX(${parallaxOffset * 10}px)` : 'none',
                transition: 'transform 0.6s ease',
              }}
            >
              <h1
                style={{
                  fontFamily: 'var(--font-syne)',
                  fontWeight: 800,
                  fontSize: 'clamp(52px, 7.5vw, 110px)',
                  letterSpacing: '-0.04em',
                  lineHeight: 0.88,
                  color: 'var(--parch)',
                  margin: 0,
                }}
              >
                SPACES<span style={{ color: 'var(--ember)' }}>.</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Info row */}
        <div ref={infoRef} style={{ marginTop: 40 }}>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--steel)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 24,
            }}
          >
            Architecture · Interior Design · Design-Build
          </p>

          {/* Filter buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {FILTER_BUTTONS.map((btn) => (
              <FilterButton
                key={btn}
                label={btn}
                active={activeFilter === btn}
                onClick={() => setActiveFilter(btn)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 48,
          left: 0,
          right: 0,
          padding: '0 5vw',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--steel)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          SCROLL ↓
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--ember)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          50+ Projects Built
        </span>
      </div>

      {/* Bottom scrolling ticker */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          overflow: 'hidden',
          borderTop: '1px solid rgba(242,232,211,0.06)',
          backgroundColor: 'rgba(14,12,10,0.6)',
          padding: '10px 0',
          whiteSpace: 'nowrap',
          zIndex: 2,
        }}
      >
        <div ref={tickerRef} style={{ display: 'inline-flex', willChange: 'transform' }}>
          {[tickerText, tickerText].map((text, i) => (
            <span
              key={i}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                color: 'var(--steel)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                paddingRight: '2em',
              }}
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: active || hovered ? '1px solid var(--ember)' : '1px solid rgba(242,232,211,0.15)',
        padding: '6px 12px',
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: active || hovered ? 'var(--parch)' : 'var(--steel)',
        backgroundColor: active ? 'rgba(232,82,10,0.12)' : 'transparent',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: active ? '0 0 12px rgba(232,82,10,0.2)' : 'none',
      }}
    >
      {label}
    </button>
  );
}
