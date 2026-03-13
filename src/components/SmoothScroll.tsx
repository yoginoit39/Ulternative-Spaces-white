'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });

    // Fallback RAF until GSAP ticker takes over
    let rafId = 0;
    let gsapConnected = false;

    const fallbackRaf = (time: number) => {
      if (!gsapConnected) {
        lenis.raf(time);
        rafId = requestAnimationFrame(fallbackRaf);
      }
    };
    rafId = requestAnimationFrame(fallbackRaf);

    // Connect Lenis to GSAP ScrollTrigger
    (async () => {
      const gsapModule = await import('gsap');
      const gsap = gsapModule.default || gsapModule.gsap;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
      gsapConnected = true;
      cancelAnimationFrame(rafId);
    })();

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <>{children}</>;
}
