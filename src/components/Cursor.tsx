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
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    };

    let ringScale = 1;
    const onEnterInteractive = () => { isHoveringInteractive = true; };

    const onLeaveInteractive = () => {
      isHoveringInteractive = false;
    };

    const loop = () => {
      // Dot: zero lag
      dot.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;

      // Ring: tight follow, scale eased in the same loop
      ringX += (mouseX - ringX) * 0.42;
      ringY += (mouseY - ringY) * 0.42;
      ringScale += ((isHoveringInteractive ? 2.2 : 1) - ringScale) * 0.25;
      ring.style.transform = `translate3d(${ringX - 16}px, ${ringY - 16}px, 0) scale(${ringScale})`;

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
          background: 'var(--accent)',
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
          opacity: 0,
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
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '1px solid rgba(var(--fg-rgb),0.55)',
          pointerEvents: 'none',
          zIndex: 99998,
          willChange: 'transform',
          opacity: 0,
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
