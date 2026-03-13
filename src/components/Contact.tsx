'use client';
import { useState, useRef, useEffect } from 'react';

export default function Contact() {
  const [emailHovered, setEmailHovered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let isMounted = true;

    (async () => {
      const gsapModule = await import('gsap');
      const gsap = gsapModule.default || gsapModule.gsap;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (!isMounted) return;

      // Heading word-by-word reveal
      const heading = headingRef.current;
      if (heading) {
        const words = (heading.innerText || '').trim().split(/\s+/);
        heading.innerHTML = words
          .map(
            (w) =>
              `<span style="display:inline-block;overflow:hidden;vertical-align:bottom;margin-right:0.25em"><span class="cw-inner" style="display:inline-block;transform:translateY(105%)">${w}</span></span>`
          )
          .join('');
        // Re-apply gold color to last two words
        const inners = heading.querySelectorAll<HTMLElement>('.cw-inner');
        if (inners.length >= 2) {
          inners[inners.length - 2].style.color = 'var(--gold)';
          inners[inners.length - 1].style.color = 'var(--gold)';
        }

        ScrollTrigger.create({
          trigger: heading,
          start: 'top 85%',
          onEnter: () => {
            gsap.to(heading.querySelectorAll('.cw-inner'), {
              y: '0%',
              duration: 0.95,
              stagger: 0.09,
              ease: 'power4.out',
            });
          },
        });
      }

      // Email link reveal
      if (emailRef.current) {
        gsap.from(emailRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: emailRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Info blocks stagger
      const infoBlocks = section.querySelectorAll('.contact-info-block');
      if (infoBlocks.length) {
        gsap.from(infoBlocks, {
          y: 20,
          opacity: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: infoBlocks[0],
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }
    })();

    return () => { isMounted = false; };
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{
        backgroundColor: 'transparent',
        padding: '120px 5vw 100px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255,255,255,0.6)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--ember)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: 40,
          }}
        >
          06 / Get In Touch
        </p>

        <h2
          ref={headingRef}
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 700,
            fontSize: 'clamp(28px, 4vw, 62px)',
            letterSpacing: '-0.01em',
            lineHeight: 0.95,
            margin: '0 0 48px 0',
            color: 'var(--parch)',
          }}
        >
          Let&apos;s Build
          {' '}Something
          {' '}<span style={{ color: 'var(--gold)' }}>That Lasts.</span>
        </h2>

        <a
          ref={emailRef}
          href="mailto:sulternative@gmail.com"
          onMouseEnter={() => setEmailHovered(true)}
          onMouseLeave={() => setEmailHovered(false)}
          style={{
            display: 'block',
            marginTop: 48,
            fontFamily: 'var(--font-syne)',
            fontWeight: 400,
            fontSize: 'clamp(14px, 1.8vw, 28px)',
            color: emailHovered ? 'var(--parch)' : 'var(--steel)',
            textDecoration: 'none',
            borderBottom: emailHovered ? '1px solid rgba(0,0,0,0.4)' : '1px solid transparent',
            transition: 'color 0.3s ease, border-bottom-color 0.3s ease',
            letterSpacing: '-0.01em',
          }}
        >
          sulternative@gmail.com{' '}
          <span style={{ color: 'var(--ember)', fontSize: '0.7em' }}>↗</span>
        </a>

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
    <div className="contact-info-block">
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--steel)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
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
