'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';

declare global {
  interface Window { __lenis?: Lenis }
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.16, smoothWheel: true, wheelMultiplier: 2.4, touchMultiplier: 2.4 });
    window.__lenis = lenis;

    let rafId = 0;
    let gsapConnected = false;
    const fallbackRaf = (time: number) => {
      if (!gsapConnected) {
        lenis.raf(time);
        rafId = requestAnimationFrame(fallbackRaf);
      }
    };
    rafId = requestAnimationFrame(fallbackRaf);

    let tickerFn: ((time: number) => void) | undefined;
    (async () => {
      const gsapModule = await import('gsap');
      const gsap = gsapModule.default || gsapModule.gsap;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll', ScrollTrigger.update);
      tickerFn = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);
      gsapConnected = true;
      cancelAnimationFrame(rafId);
    })();

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
      if (window.__lenis === lenis) delete window.__lenis;
      import('gsap').then((m) => { if (tickerFn) (m.default || m.gsap).ticker.remove(tickerFn); });
    };
  }, []);

  return <>{children}</>;
}
