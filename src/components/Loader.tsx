'use client';
import { useEffect, useState } from 'react';

type LoaderState = 'drawing' | 'revealing' | 'done';

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [state, setState] = useState<LoaderState>('drawing');
  const [circlesVisible, setCirclesVisible] = useState(false);
  const [slideUp, setSlideUp] = useState(false);
  const [unmounted, setUnmounted] = useState(false);

  useEffect(() => {
    // Check session storage for return visits
    if (typeof window !== 'undefined' && sessionStorage.getItem('ul-loaded')) {
      const t = setTimeout(() => onComplete(), 50);
      setUnmounted(true);
      return () => clearTimeout(t);
    }

    sessionStorage.setItem('ul-loaded', '1');

    // State machine with timeouts
    const t1 = setTimeout(() => {
      setState('revealing');
      setCirclesVisible(true);
    }, 2000);

    const t2 = setTimeout(() => {
      setState('done');
      setSlideUp(true);
    }, 2600);

    const t3 = setTimeout(() => {
      onComplete();
      setUnmounted(true);
    }, 3500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  if (unmounted) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'var(--ink)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        transform: slideUp ? 'translateY(-100%)' : 'translateY(0)',
        transition: slideUp ? 'transform 0.9s cubic-bezier(0.76, 0, 0.24, 1)' : 'none',
        pointerEvents: state === 'done' ? 'none' : 'all',
      }}
    >
      {/* SVG Infinity Mark */}
      <svg
        viewBox="0 0 560 240"
        width={220}
        height={94}
        style={{ overflow: 'visible' }}
      >
        {/* Two gold filled circles */}
        <circle
          cx={168}
          cy={120}
          r={60}
          fill="#000000"
          style={{
            opacity: circlesVisible ? 0.9 : 0,
            transition: circlesVisible ? 'opacity 0.5s ease' : 'none',
          }}
        />
        <circle
          cx={392}
          cy={120}
          r={60}
          fill="#000000"
          style={{
            opacity: circlesVisible ? 0.9 : 0,
            transition: circlesVisible ? 'opacity 0.5s ease 0.1s' : 'none',
          }}
        />
        {/* Infinity path */}
        <path
          d="M 280,120 C 280,56 222,12 168,12 C 100,12 58,58 58,120 C 58,182 100,228 168,228 C 222,228 280,184 280,120 C 280,56 338,12 392,12 C 460,12 502,58 502,120 C 502,182 460,228 392,228 C 338,228 280,184 280,120"
          stroke="#000000"
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: 1320,
            strokeDashoffset: 1320,
            animation: 'loaderDraw 1.8s ease forwards',
          }}
        />
      </svg>

      {/* Brand label */}
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          letterSpacing: '0.25em',
          color: 'var(--steel)',
          textTransform: 'uppercase',
          margin: 0,
          opacity: 0,
          animation: 'loaderFadeIn 0.6s ease 0.5s forwards',
        }}
      >
        ULTERNATIVE SPACES
      </p>

      <style>{`
        @keyframes loaderDraw {
          from { stroke-dashoffset: 1320; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes loaderFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
