'use client';
import { useEffect, useRef, useContext, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { TransitionContext } from '@/context/transition';

const HIDDEN = 'M 0 100 V 100 Q 50 100 100 100 V 100 z';
const ARCH   = 'M 0 100 V 50 Q 50 0 100 50 V 100 z';
const FULL   = 'M 0 100 V 0 Q 50 0 100 0 V 100 z';

export default function PageTransition() {
  const pathRef  = useRef<SVGPathElement>(null);
  const router   = useRouter();
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const busy     = useRef(false);
  const { navigateRef } = useContext(TransitionContext);

  // Shared exit animation — called both on pathname change AND same-page reclick
  const playExit = useCallback(async () => {
    const path = pathRef.current;
    if (!path) { busy.current = false; return; }
    const gsapModule = await import('gsap');
    const gsap = gsapModule.default || gsapModule.gsap;
    gsap.timeline({ onComplete: () => { busy.current = false; } })
      .set(path, { attr: { d: FULL } })
      .to(path, { attr: { d: ARCH   }, duration: 0.35, ease: 'power2.in' })
      .to(path, { attr: { d: HIDDEN }, duration: 0.45, ease: 'power2.out' });
  }, []);

  // Register navigate function with the context
  useEffect(() => {
    navigateRef.current = async (href: string) => {
      if (busy.current) return;
      busy.current = true;

      const path = pathRef.current;
      if (!path) { router.push(href); busy.current = false; return; }

      const gsapModule = await import('gsap');
      const gsap = gsapModule.default || gsapModule.gsap;

      // Detect same-page navigation — pathname won't change so exit must be triggered manually
      const targetPath = href.split('?')[0].split('#')[0] || '/';
      const isSamePage = targetPath === window.location.pathname;

      gsap.timeline()
        .set(path, { attr: { d: HIDDEN } })
        .to(path, { attr: { d: ARCH }, duration: 0.45, ease: 'power2.in' })
        .to(path, {
          attr: { d: FULL },
          duration: 0.35,
          ease: 'power2.out',
          onComplete: () => {
            router.push(href);
            if (isSamePage) playExit();
          },
        });
    };
  }, [router, navigateRef, playExit]);

  // Exit animation when a different page has loaded
  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;
    playExit();
  }, [pathname, playExit]);

  return (
    <div
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none' }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <path ref={pathRef} d={HIDDEN} fill="#000000" />
      </svg>
    </div>
  );
}
