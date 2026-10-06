'use client';
import { useEffect, useRef, useContext, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { TransitionContext } from '@/context/transition';
import imageLoader from '@/lib/imageLoader';
import { PROJECTS } from '@/lib/projects';

const HIDDEN = 'M 0 100 V 100 Q 50 100 100 100 V 100 z';
const ARCH   = 'M 0 100 V 50 Q 50 0 100 50 V 100 z';
const FULL   = 'M 0 100 V 0 Q 50 0 100 0 V 100 z';

const loadGsap = async () => { const m = await import('gsap'); return m.default || m.gsap; };

// The sheet we are going to, as it would be stamped on a title block.
const sheetOf = (href: string): [string, string] => {
  const path = (href.split('?')[0].split('#')[0] || '/').replace(/\/$/, '') || '/';
  if (path === '/') return ['00', 'Cover'];
  if (path === '/work') return ['A-000', 'Street elevation'];
  if (path.startsWith('/work/')) { const p = PROJECTS.find((x) => x.slug === path.slice(6)); return p ? [`A-${p.num}`, p.name] : ['A-00', 'Drawing set']; }
  if (path === '/philosophy') return ['P-00', 'Design & philosophy'];
  if (path === '/team') return ['T-00', 'The team'];
  if (path === '/contact') return ['C-00', 'Start a project'];
  return ['—', path.slice(1)];
};

export default function PageTransition() {
  const pathRef  = useRef<SVGPathElement>(null);   // the orange wall
  const inkRef   = useRef<SVGPathElement>(null);   // the black edge that leads it
  const markRef  = useRef<SVGPathElement>(null);   // the lemniscate drawn on the wall
  const stampRef = useRef<HTMLDivElement>(null);   // sheet number + name
  const photoRef = useRef<HTMLDivElement>(null);   // the photograph in flight between pages
  const router   = useRouter();
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const busy     = useRef(false);
  const carrying = useRef(false);                  // a photo transition is mid-flight
  const { navigateRef } = useContext(TransitionContext);

  // Shared exit animation — called both on pathname change AND same-page reclick
  const playExit = useCallback(async () => {
    const path = pathRef.current, ink = inkRef.current, stamp = stampRef.current;
    if (!path || !ink) { busy.current = false; return; }
    const gsap = await loadGsap();
    gsap.timeline({ onComplete: () => { busy.current = false; } })
      .set([path, ink], { attr: { d: FULL } })
      .to(stamp, { opacity: 0, y: -10, duration: 0.25, ease: 'power2.in' }, 0)
      // the orange drops away first, the black beneath it a beat later
      .to(path, { attr: { d: ARCH   }, duration: 0.35, ease: 'power2.in' }, 0.05)
      .to(path, { attr: { d: HIDDEN }, duration: 0.45, ease: 'power2.out' })
      .to(ink,  { attr: { d: ARCH   }, duration: 0.35, ease: 'power2.in' }, 0.17)
      .to(ink,  { attr: { d: HIDDEN }, duration: 0.45, ease: 'power2.out' }, '>');
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

      const ink = inkRef.current!, mark = markRef.current!, stamp = stampRef.current!;
      const [num, name] = sheetOf(href);
      stamp.querySelector('b')!.textContent = num;
      stamp.querySelector('span')!.textContent = name;
      const len = mark.getTotalLength();
      gsap.timeline()
        .set([path, ink], { attr: { d: HIDDEN } })
        .set(mark, { strokeDasharray: len, strokeDashoffset: len })
        .set(stamp, { opacity: 0, y: 10 })
        .to(ink,  { attr: { d: ARCH }, duration: 0.45, ease: 'power2.in' }, 0)
        .to(ink,  { attr: { d: FULL }, duration: 0.35, ease: 'power2.out' })
        .to(path, { attr: { d: ARCH }, duration: 0.45, ease: 'power2.in' }, 0.12)
        .to(path, { attr: { d: FULL }, duration: 0.35, ease: 'power2.out' })
        // on the wall: the mark draws itself and the destination is stamped
        .to(mark, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' }, 0.55)
        .to(stamp, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.8)
        .add(() => {
          router.push(href);
          if (isSamePage) playExit();
        }, 1.35);
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
        {/* an orange wall rises between pages. A black layer beneath it leads
            the way in (a band ahead of the orange) and lingers on the way out
            (a band behind it). */}
        <path ref={inkRef} d={HIDDEN} fill="#1a1816" />
        <path ref={pathRef} d={HIDDEN} fill="rgb(242,174,74)" />
      </svg>

      {/* drawn on the wall while it is up */}
      <div ref={stampRef} className="pt-stamp" style={{ opacity: 0 }}>
        <svg viewBox="0 0 560 240" className="pt-mark" aria-hidden>
          <path
            ref={markRef}
            d="M 280,120 C 280,56 222,12 168,12 C 100,12 58,58 58,120 C 58,182 100,228 168,228 C 222,228 280,184 280,120 C 280,56 338,12 392,12 C 460,12 502,58 502,120 C 502,182 460,228 392,228 C 338,228 280,184 280,120"
            fill="none" stroke="#1a1816" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
        <p><b>00</b><i /><span>Cover</span></p>
      </div>

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
