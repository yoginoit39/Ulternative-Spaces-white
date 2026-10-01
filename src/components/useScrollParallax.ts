'use client';
import { useEffect } from 'react';

/**
 * Depth for the vertical pages, scrubbed to the scroll:
 *   [data-py="f"]       crosses the viewport faster (f > 0) or slower (f < 0) than the page
 *   [data-px="f"]       slides sideways while it crosses (f < 0: leftwards)
 *   [data-py-exit="f"]  rests where it was set, then falls behind as its section leaves
 * Put these on elements that carry no transform of their own (wrap if needed).
 */
export function useScrollParallax() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let cancelled = false;
    let revert: (() => void) | undefined;

    (async () => {
      const gsapModule = await import('gsap');
      const gsap = gsapModule.default || gsapModule.gsap;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled) return;

      const ctx = gsap.context(() => {
        const crossing = (el: HTMLElement) => ({ trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true });
        document.querySelectorAll<HTMLElement>('[data-py]').forEach((el) => {
          const f = Number(el.dataset.py || 0.1);
          gsap.fromTo(el, { y: () => window.innerHeight * f * 0.5 }, { y: () => -window.innerHeight * f * 0.5, ease: 'none', scrollTrigger: crossing(el) });
        });
        document.querySelectorAll<HTMLElement>('[data-px]').forEach((el) => {
          const f = Number(el.dataset.px || 0.1);
          gsap.fromTo(el, { x: () => -window.innerWidth * f * 0.5 }, { x: () => window.innerWidth * f * 0.5, ease: 'none', scrollTrigger: crossing(el) });
        });
        document.querySelectorAll<HTMLElement>('[data-py-exit]').forEach((el) => {
          const f = Number(el.dataset.pyExit || 0.2);
          gsap.fromTo(el, { y: 0 }, { y: () => window.innerHeight * f, ease: 'none',
            scrollTrigger: { trigger: el.closest('section') ?? el, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
        });
      });
      revert = () => ctx.revert();
    })();

    return () => { cancelled = true; revert?.(); };
  }, []);
}
