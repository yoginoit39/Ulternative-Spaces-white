'use client';
import { useEffect, useRef, useContext, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { TransitionContext } from '@/context/transition';
import imageLoader from '@/lib/imageLoader';

const HIDDEN = 'M 0 100 V 100 Q 50 100 100 100 V 100 z';
const ARCH   = 'M 0 100 V 50 Q 50 0 100 50 V 100 z';
const FULL   = 'M 0 100 V 0 Q 50 0 100 0 V 100 z';

const loadGsap = async () => { const m = await import('gsap'); return m.default || m.gsap; };

export default function PageTransition() {
  const pathRef  = useRef<SVGPathElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);   // the photograph in flight between pages
  const router   = useRouter();
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const busy     = useRef(false);
  const carrying = useRef(false);                  // a photo transition is mid-flight
  const { navigateRef } = useContext(TransitionContext);

  // Shared exit animation — called both on pathname change AND same-page reclick
  const playExit = useCallback(async () => {
    const path = pathRef.current;
    if (!path) { busy.current = false; return; }
    const gsap = await loadGsap();
    gsap.timeline({ onComplete: () => { busy.current = false; } })
      .set(path, { attr: { d: FULL } })
      .to(path, { attr: { d: ARCH   }, duration: 0.35, ease: 'power2.in' })
      .to(path, { attr: { d: HIDDEN }, duration: 0.45, ease: 'power2.out' });
  }, []);

  // Photo transition, leaving: the plate's photograph lifts off the page and
  // grows until it is the whole screen; the route changes underneath it.
  const carryPhoto = useCallback(async (href: string, from: HTMLElement, img: HTMLImageElement) => {
    const box = photoRef.current!;
    const inner = box.firstElementChild as HTMLElement;
    const [lo, hi] = Array.from(inner.children) as HTMLImageElement[];
    const gsap = await loadGsap();

    // Start exactly on the plate, showing exactly the crop it shows (the
    // image is usually larger than its frame and offset by parallax).
    const r = from.getBoundingClientRect(), i = img.getBoundingClientRect();
    lo.src = img.currentSrc || img.src;
    hi.style.opacity = '0';
    hi.onload = () => { hi.style.opacity = '1'; };
    hi.src = imageLoader({ src: from.dataset.photo || '', width: Math.min(1920, window.innerWidth * window.devicePixelRatio) }) || lo.src;
    gsap.set(inner, {
      left: `${((i.left - r.left) / r.width) * 100}%`, top: `${((i.top - r.top) / r.height) * 100}%`,
      width: `${(i.width / r.width) * 100}%`, height: `${(i.height / r.height) * 100}%`,
    });
    gsap.set(box, { display: 'block', opacity: 1, left: r.left, top: r.top, width: r.width, height: r.height });
    // a plate printed in mono (the archive street) comes into colour as it lifts off
    const tint = getComputedStyle(img).filter;
    if (tint && tint !== 'none') gsap.fromTo(box, { filter: tint }, { filter: 'grayscale(0) contrast(1) brightness(1)', duration: 0.6, ease: 'power1.out', clearProps: 'filter' });

    carrying.current = true;
    gsap.to(inner, { left: '0%', top: '0%', width: '100%', height: '100%', duration: 0.8, ease: 'power3.inOut' });
    gsap.to(box, {
      left: 0, top: 0, width: window.innerWidth, height: window.innerHeight,
      duration: 0.8, ease: 'power3.inOut',
      onComplete: () => router.push(href),
    });
  }, [router]);

  // Photo transition, arriving: wait for the new page's cover plate, settle
  // the photograph into it, then hand over to the real thing.
  const landPhoto = useCallback(async () => {
    const box = photoRef.current;
    if (!box) { busy.current = false; return; }
    const gsap = await loadGsap();
    const arrived = performance.now();
    const done = () => {
      gsap.to(box, { opacity: 0, duration: 0.35, ease: 'power1.out', onComplete: () => { gsap.set(box, { display: 'none' }); busy.current = false; } });
    };
    const settle = () => {
      const target = Array.from(document.querySelectorAll<HTMLElement>('[data-photo-target]')).find((el) => el.getClientRects().length);
      if (!target) {
        if (performance.now() - arrived < 1500) requestAnimationFrame(settle); else done();
        return;
      }
      const t = target.getBoundingClientRect();
      // A cover that already fills the screen (phones): we are in. Just let go.
      if (t.width >= window.innerWidth * 0.95 && t.height >= window.innerHeight * 0.8) { gsap.delayedCall(0.25, done); return; }
      gsap.to(box, {
        left: t.left, top: t.top, width: t.width, height: t.height,
        duration: 0.9, ease: 'power3.inOut',
        // hold on the plate until its own entrance reveal has finished underneath
        onComplete: () => { gsap.delayedCall(Math.max(0, 1.75 - (performance.now() - arrived) / 1000), done); },
      });
    };
    // let the new page lay out before measuring
    gsap.delayedCall(0.2, settle);
  }, []);

  // Register navigate function with the context
  useEffect(() => {
    navigateRef.current = async (href: string, from?: HTMLElement | null) => {
      if (busy.current) return;
      busy.current = true;

      const img = from?.querySelector('img');
      const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (from && img && photoRef.current && !calm) { carryPhoto(href, from, img); return; }

      const path = pathRef.current;
      if (!path) { router.push(href); busy.current = false; return; }

      const gsap = await loadGsap();

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
  }, [router, navigateRef, playExit, carryPhoto]);

  // Exit animation when a different page has loaded
  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;
    if (carrying.current) { carrying.current = false; landPhoto(); }
    else playExit();
  }, [pathname, playExit, landPhoto]);

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
        {/* an orange wall rises between pages */}
        <path ref={pathRef} d={HIDDEN} fill="rgb(232,120,42)" />
      </svg>

      {/* photograph in flight: a sharp copy fades in over the plate's own (smaller) file */}
      <div ref={photoRef} style={{ position: 'fixed', display: 'none', overflow: 'hidden', background: '#111' }}>
        <div style={{ position: 'absolute' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity .3s ease' }} />
        </div>
      </div>
    </div>
  );
}
