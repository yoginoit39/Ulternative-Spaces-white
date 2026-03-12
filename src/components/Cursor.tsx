'use client';
import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let rafId: number;
    let isHoveringInteractive = false;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onEnterInteractive = () => {
      isHoveringInteractive = true;
      if (ring) ring.style.transform = `translate(${ringX - 22}px, ${ringY - 22}px) scale(2.5)`;
    };

    const onLeaveInteractive = () => {
      isHoveringInteractive = false;
    };

    const loop = () => {
      // Dot: zero lag
      dot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;

      // Ring: lerp
      ringX += (mouseX - ringX) * 0.1;
      ringY += (mouseY - ringY) * 0.1;

      if (!isHoveringInteractive) {
        ring.style.transform = `translate(${ringX - 22}px, ${ringY - 22}px) scale(1)`;
      } else {
        ring.style.transform = `translate(${ringX - 22}px, ${ringY - 22}px) scale(2.5)`;
      }

      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove);
    rafId = requestAnimationFrame(loop);

    // Add hover detection for interactive elements
    const addInteractiveListeners = () => {
      const interactives = document.querySelectorAll<HTMLElement>('a, button');
      interactives.forEach((el) => {
        el.addEventListener('mouseenter', onEnterInteractive);
        el.addEventListener('mouseleave', onLeaveInteractive);
      });
    };

    addInteractiveListeners();

    // Re-scan on DOM changes
    const observer = new MutationObserver(addInteractiveListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
      observer.disconnect();
      document.querySelectorAll<HTMLElement>('a, button').forEach((el) => {
        el.removeEventListener('mouseenter', onEnterInteractive);
        el.removeEventListener('mouseleave', onLeaveInteractive);
      });
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="custom-cursor"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'var(--gold)',
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
          mixBlendMode: 'difference',
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="custom-cursor"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: '1px solid rgba(0,0,0,0.5)',
          pointerEvents: 'none',
          zIndex: 99998,
          willChange: 'transform',
          transition: 'transform 0.15s ease',
        }}
      />
      <style>{`
        @media (hover: none) {
          .custom-cursor { display: none !important; }
        }
        * { cursor: none !important; }
        @media (hover: none) { * { cursor: auto !important; } }
      `}</style>
    </>
  );
}
