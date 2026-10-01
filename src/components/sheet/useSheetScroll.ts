'use client';
import { useLayoutEffect, type RefObject } from 'react';
import type {} from '@/components/SmoothScroll';

export const SHEET_BREAKPOINT = 900;

export interface SheetState {
  progress: number;   // 0..1 across the full sheet
  x: number;          // current translateX of the track (px, negative)
  maxX: number;       // total horizontal distance
  activeIndex: number;
}

type Listener = (s: SheetState) => void;
const listeners = new Set<Listener>();
let state: SheetState = { progress: 0, x: 0, maxX: 1, activeIndex: 0 };

export function subscribeSheet(fn: Listener) {
  listeners.add(fn);
  fn(state);
  return () => { listeners.delete(fn); };
}
function emit(next: SheetState) {
  state = next;
  listeners.forEach((l) => l(state));
}

/** Programmatic jump to a panel id (used by Nav, ruler, hash). */
export function gotoPanel(id: string) {
  window.dispatchEvent(new CustomEvent('sheet:goto', { detail: id }));
}

/**
 * Pins the wrapper and translates the track horizontally as the user scrolls
 * vertically. Wheel, trackpad, keyboard, scrollbar and touch all work because
 * we never hijack input — we only map scrollY -> translateX.
 *
 * Also wires: [data-reveal] entrance tweens, [data-draw] SVG stroke drawing,
 * 'sheet:goto' jumps, and the depth effects (all scrubbed to the scroll):
 *   [data-depth]    on a bay: its content sits behind its walls, so it slides
 *                   out from under the previous bay and under the next one
 *   [data-parallax] drift across the viewport at a different speed
 *   [data-drift]    hold still at rest, then lag as the bay leaves
 *   [data-lift]     rise or sink (in % of own height) while passing
 *                   (these three are written as CSS variables and applied as
 *                   `translate`, so they never fight an entrance tween's `transform`)
 *   [data-zoom]     zoom-through intro: before the walk starts, this layer
 *                   grows from the frame it names (a selector) to fill the
 *                   viewport, so the first scroll goes into the picture
 */
export function useSheetScroll(
  wrapRef: RefObject<HTMLDivElement | null>,
  trackRef: RefObject<HTMLDivElement | null>,
  panelIds: string[],
  enabled: boolean,
) {
  // Layout effect so the cleanup (un-pin, restore DOM) runs before React
  // detaches nodes on route change.
  const idsKey = panelIds.join('|');
  useLayoutEffect(() => {
    if (!enabled) return;
    const panelIds = idsKey.split('|');
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    let cancelled = false;
    let teardown: (() => void) | undefined;

    (async () => {
      const gsapModule = await import('gsap');
      const gsap = gsapModule.default || gsapModule.gsap;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled) return;

      const mm = gsap.matchMedia();

      /* ───────────── DESKTOP: horizontal sheet ───────────── */
      mm.add(`(min-width: ${SHEET_BREAKPOINT}px)`, () => {
        const getMax = () => Math.max(1, track.scrollWidth - window.innerWidth);
        const panels = panelIds
          .map((id) => track.querySelector<HTMLElement>(`[data-panel="${id}"]`))
          .filter(Boolean) as HTMLElement[];

        // Zoom-through intro. The walk itself must stay linear (everything
        // inside is timed against it), so the intro gets its own stretch of
        // scroll in front: one trigger pins the sheet for lead + walk, and the
        // walk's trigger starts `lead` pixels in.
        const zoomEl = track.querySelector<HTMLElement>('[data-zoom]');
        const zoomFrame = zoomEl?.dataset.zoom ? track.querySelector<HTMLElement>(zoomEl.dataset.zoom) : null;
        const zooming = !!zoomEl && !!zoomFrame && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const lead = () => (zooming ? Math.round(window.innerHeight * 1.15) : 0);
        const pin = zooming ? ScrollTrigger.create({
          trigger: wrap,
          start: 'top top',
          end: () => `+=${lead() + getMax()}`,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }) : null;

        const scrub = gsap.to(track, {
          x: () => -getMax(),
          ease: 'none',
          scrollTrigger: {
            trigger: wrap,
            start: pin ? () => pin.start + lead() : 'top top',
            end: pin ? () => pin.start + lead() + getMax() : () => `+=${getMax()}`,
            pin: !pin,
            scrub: 0.25,
            anticipatePin: pin ? 0 : 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => report(self.progress),
            // also on (re)measure: a sheet reached from another sheet must not
            // inherit that one's position
            onRefresh: (self) => report(self.progress),
          },
        });
        function report(progress: number) {
          const maxX = getMax();
          const x = -progress * maxX;
          // active = last panel whose left edge has crossed 45% of viewport
          let active = 0;
          const probe = -x + window.innerWidth * 0.45;
          panels.forEach((p, i) => { if (p.offsetLeft <= probe) active = i; });
          emit({ progress, x, maxX, activeIndex: active });
        }
        report(0);

        const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Sliding walls: a bay's content is a layer behind its paper edges. It
        // moves slower than the walls, emerging from under the previous bay
        // and disappearing under the next (the bay clips it). Created before
        // the reveals so their triggers are measured with the layer in place.
        if (!calm) track.querySelectorAll<HTMLElement>('[data-depth]').forEach((bay) => {
          const depth = Number(bay.dataset.depth || 1);
          const layers = Array.from(bay.children).filter((c) => !c.classList.contains('bay-dim'));
          const D = () => window.innerWidth * 0.09 * depth;
          if (bay.offsetLeft === 0) {
            // First bay rests at scroll 0: hold until its far wall arrives, then lag.
            const held = (p: number) => {
              const from = Math.max(0, 1 - window.innerWidth / bay.offsetWidth);
              return p <= from ? 0 : (p - from) / (1 - from);
            };
            gsap.fromTo(layers, { x: 0 }, {
              x: D, ease: held,
              scrollTrigger: { trigger: bay, containerAnimation: scrub, start: 'left left', end: 'right left', scrub: true },
            });
            return;
          }
          // -D while entering, 0 while both walls are off-screen, +D while leaving.
          const held = (p: number) => {
            const vw = window.innerWidth, w = bay.offsetWidth;
            const p1 = vw / (vw + w), p2 = w / (vw + w);
            if (p2 <= p1) return p;                       // narrower than the viewport: one pass
            const shift = p < p1 ? p / p1 - 1 : p > p2 ? (p - p2) / (1 - p2) : 0;
            return (shift + 1) / 2;
          };
          gsap.fromTo(layers, { x: () => -D() }, {
            x: D, ease: held,
            scrollTrigger: { trigger: bay, containerAnimation: scrub, start: 'left right', end: 'right left', scrub: true },
          });
        });

        if (pin && zoomEl && zoomFrame) {
          const bay = zoomEl.closest<HTMLElement>('[data-panel]') ?? track;
          // The frame's box inside its bay, from layout offsets (transforms ignored).
          const box = () => {
            let x = 0, y = 0;
            for (let n: HTMLElement | null = zoomFrame; n && n !== bay; n = n.offsetParent as HTMLElement | null) { x += n.offsetLeft; y += n.offsetTop; }
            return { left: x, top: y, width: zoomFrame.offsetWidth, height: zoomFrame.offsetHeight };
          };
          zoomEl.classList.add('zoom-live');
          const tl = gsap.timeline({
            scrollTrigger: { trigger: wrap, start: () => pin.start, end: () => pin.start + lead(), scrub: 0.25, invalidateOnRefresh: true },
          });
          tl.fromTo(zoomEl,
            { left: () => box().left, top: () => box().top, width: () => box().width, height: () => box().height },
            // ends as wide as its bay, not just the viewport: once we are in, the
            // walk pans across the rest of the picture until the next wall covers it
            { left: 0, top: 0, width: () => Math.max(window.innerWidth, bay.offsetWidth), height: () => window.innerHeight, ease: 'power2.inOut', duration: 1 }, 0);
          // anything marked [data-zoom-in] inside (a title card) arrives once we are in
          const card = zoomEl.querySelectorAll('[data-zoom-in]');
          if (card.length) tl.fromTo(card, { opacity: 0, y: 24 }, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.35, stagger: 0.06 }, 0.62);
        }

        // Entrance reveals as elements slide in from the right.
        const reveals = track.querySelectorAll<HTMLElement>('[data-reveal]');
        reveals.forEach((el) => {
          const kind = el.dataset.reveal || 'up';
          const from: gsap.TweenVars =
            kind === 'clip'  ? { clipPath: 'inset(0 100% 0 0)' } :
            kind === 'right' ? { x: 60, opacity: 0 } :
            kind === 'scale' ? { scale: 0.92, opacity: 0 } :
            kind === 'line'  ? { scaleX: 0, transformOrigin: 'left center' } :
                               { y: 40, opacity: 0 };
          const vars: gsap.TweenVars = {
            ...from,
            duration: kind === 'clip' ? 1.2 : 0.9,
            ease: kind === 'clip' ? 'power4.out' : 'power3.out',
            delay: Number(el.dataset.delay || 0),
          };
          // Already on screen at load (first bay): a containerAnimation
          // trigger whose start is before progress 0 never fires, so play now.
          const inView = el.getBoundingClientRect().left < window.innerWidth * 0.88;
          if (inView) {
            gsap.from(el, { ...vars, delay: Number(el.dataset.delay || 0) + 0.2 });
          } else {
            gsap.from(el, {
              ...vars,
              scrollTrigger: {
                trigger: el,
                containerAnimation: scrub,
                start: 'left 88%',
                toggleActions: 'play none none none',
              },
            });
          }
        });

        // Parallax drift: layers move at different horizontal speeds.
        const paras = track.querySelectorAll<HTMLElement>('[data-parallax]');
        paras.forEach((el) => {
          const f = Number(el.dataset.parallax || 0.2);
          gsap.fromTo(el, { '--tx': () => `${-window.innerWidth * f * 0.5}px` }, {
            '--tx': () => `${window.innerWidth * f * 0.5}px`,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              containerAnimation: scrub,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          });
        });

        // Drift: sits exactly where it was drawn while its bay is at rest, then
        // falls behind as the bay leaves. Different factors shear lines apart.
        if (!calm) track.querySelectorAll<HTMLElement>('[data-drift]').forEach((el) => {
          const f = Number(el.dataset.drift || 0.1);
          gsap.fromTo(el, { '--tx': '0px' }, {
            '--tx': () => `${window.innerWidth * f}px`,
            ease: 'none',
            scrollTrigger: { trigger: el.closest('[data-panel]') ?? el, containerAnimation: scrub, start: 'left left', end: 'right left', scrub: true },
          });
        });

        // Lift: vertical travel driven by the horizontal walk, in % of own height.
        if (!calm) track.querySelectorAll<HTMLElement>('[data-lift]').forEach((el) => {
          const v = Number(el.dataset.lift || 4);
          gsap.fromTo(el, { '--ty': `${v}%` }, {
            '--ty': `${-v}%`,
            ease: 'none',
            scrollTrigger: { trigger: el, containerAnimation: scrub, start: 'left right', end: 'right left', scrub: true },
          });
        });

        // SVG stroke drawing.
        const draws = track.querySelectorAll<SVGPathElement | SVGLineElement>('[data-draw]');
        draws.forEach((el) => {
          const len = (el as SVGGeometryElement).getTotalLength?.() ?? 1000;
          gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
          gsap.to(el, {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              containerAnimation: scrub,
              start: 'left 85%',
              end: 'right 60%',
              scrub: true,
            },
          });
        });

        // Counters.
        const counters = track.querySelectorAll<HTMLElement>('[data-count]');
        counters.forEach((el) => {
          const target = Number(el.dataset.count || 0);
          const suffix = el.dataset.suffix || '';
          const obj = { v: 0 };
          gsap.to(obj, {
            v: target,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: () => { el.textContent = Math.round(obj.v) + suffix; },
            scrollTrigger: { trigger: el, containerAnimation: scrub, start: 'left 85%' },
          });
        });

        // Programmatic jump: scrollY == panel.offsetLeft because the pin
        // starts at document top and the tween is linear.
        // The first panel sits at the very top (before any zoom intro);
        // every other one is its offset into the walk.
        const yOf = (p: HTMLElement) => (p.offsetLeft === 0 && pin
          ? pin.start
          : (scrub.scrollTrigger?.start ?? 0) + Math.min(p.offsetLeft, getMax()));
        const jumpTo = (id: string, immediate = false) => {
          const p = track.querySelector<HTMLElement>(`[data-panel="${id}"]`);
          if (!p) return;
          wrap.scrollLeft = 0; // defensive: undo any native anchor jump
          const y = yOf(p);
          const lenis = window.__lenis;
          if (lenis) lenis.scrollTo(y, immediate ? { immediate: true, force: true } : { duration: 0.9 });
          else window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' });
        };
        const onGoto = (e: Event) => jumpTo((e as CustomEvent<string>).detail);
        window.addEventListener('sheet:goto', onGoto);
        const onHash = () => { const h = window.location.hash.replace('#', ''); if (h) jumpTo(h); };
        window.addEventListener('hashchange', onHash);

        // Hash on load (/#work from another page): wait for layout + pin, then jump.
        const hash = window.location.hash.replace('#', '');
        let hashTimer = 0;
        if (hash) {
          const target = track.querySelector<HTMLElement>(`[data-panel="${hash}"]`);
          const tryJump = (attempt: number) => {
            ScrollTrigger.refresh();
            window.__lenis?.resize();
            jumpTo(hash, true);
            const want = target ? yOf(target) : 0;
            if (attempt < 5 && Math.abs(window.scrollY - want) > 5) {
              hashTimer = window.setTimeout(() => tryJump(attempt + 1), 300);
            }
          };
          hashTimer = window.setTimeout(() => tryJump(0), 250);
        }

        // Images loading can change scrollWidth.
        const ro = new ResizeObserver(() => ScrollTrigger.refresh());
        ro.observe(track);

        return () => {
          window.removeEventListener('sheet:goto', onGoto);
          window.removeEventListener('hashchange', onHash);
          clearTimeout(hashTimer);
          ro.disconnect();
          zoomEl?.classList.remove('zoom-live');
        };
      });

      /* ───────────── MOBILE: vertical stack ───────────── */
      mm.add(`(max-width: ${SHEET_BREAKPOINT - 1}px)`, () => {
        // The address bar sliding away is not a real resize; re-measuring
        // mid-page would read bays that are currently stuck.
        ScrollTrigger.config({ ignoreMobileResize: true });
        const bays = Array.from(track.querySelectorAll<HTMLElement>('[data-panel]'));

        // Sliding sheets: each bay holds at the bottom of the screen once it
        // has been read (CSS sticky, see sheet.css) and the next one slides
        // up over it. CSS needs each bay's height to know when to hold.
        // Triggers are measured with the sheets back in normal flow.
        const unstick = () => track.classList.add('is-measuring');
        const restick = () => track.classList.remove('is-measuring');
        ScrollTrigger.addEventListener('refreshInit', unstick);
        ScrollTrigger.addEventListener('refresh', restick);
        const sizer = new ResizeObserver((entries) => {
          entries.forEach((e) => (e.target as HTMLElement).style.setProperty('--bay-h', `${(e.target as HTMLElement).offsetHeight}px`));
        });
        bays.forEach((b) => sizer.observe(b));
        // ...and falls into shadow as it is covered.
        const shades = bays.slice(0, -1).filter((bay) => getComputedStyle(bay).position === 'sticky').map((bay) => {
          const i = bays.indexOf(bay);
          const shade = document.createElement('i');
          shade.className = 'bay-shade';
          bay.appendChild(shade);
          gsap.fromTo(shade, { opacity: 0 }, { opacity: 0.3, ease: 'none',
            scrollTrigger: { trigger: bays[i + 1], start: 'top bottom', end: 'top top', scrub: true } });
          return shade;
        });
        // A bay's place in the page, from heights (a stuck bay misreports its own offset).
        const topOf = (p: HTMLElement) => bays.slice(0, bays.indexOf(p)).reduce((y, b) => y + b.offsetHeight, wrap.offsetTop);

        const reveals = track.querySelectorAll<HTMLElement>('[data-reveal]');
        reveals.forEach((el) => {
          if (el.hasAttribute('data-zoom')) return;   // the full-screen cover is simply there
          gsap.from(el, {
            y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%' },
          });
        });
        const draws = track.querySelectorAll<SVGPathElement>('[data-draw]');
        draws.forEach((el) => {
          const len = el.getTotalLength?.() ?? 1000;
          gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
          gsap.to(el, { strokeDashoffset: 0, ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 40%', scrub: true } });
        });
        const counters = track.querySelectorAll<HTMLElement>('[data-count]');
        counters.forEach((el) => {
          const target = Number(el.dataset.count || 0);
          const suffix = el.dataset.suffix || '';
          const obj = { v: 0 };
          gsap.to(obj, { v: target, duration: 1.8, ease: 'power2.out',
            onUpdate: () => { el.textContent = Math.round(obj.v) + suffix; },
            scrollTrigger: { trigger: el, start: 'top 85%' } });
        });
        // Depth on a vertical sheet: photographs move inside their frames like
        // a view through a window.
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          track.querySelectorAll<HTMLElement>('.plate-in, .wk-img-in').forEach((el) => {
            gsap.fromTo(el, { yPercent: -4.5 }, { yPercent: 4.5, ease: 'none',
              scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
          });
        }
        // A spine that draws itself down the list as it is read ([data-spine]),
        // lighting each item it reaches.
        track.querySelectorAll<HTMLElement>('[data-spine]').forEach((list) => {
          // (lines sit low on the screen: a bay stops moving once its foot
          // reaches the foot of the screen, so its last items never rise further)
          gsap.fromTo(list, { '--spine': 0 }, { '--spine': 1, ease: 'none',
            scrollTrigger: { trigger: list, start: 'top 85%', end: 'bottom 96%', scrub: true } });
          Array.from(list.children).forEach((item) => {
            ScrollTrigger.create({
              trigger: item, start: 'top 84%',
              onEnter: () => item.classList.add('lit'),
              onLeaveBack: () => item.classList.remove('lit'),
            });
          });
        });

        const onGoto = (e: Event) => {
          const id = (e as CustomEvent<string>).detail;
          const p = track.querySelector<HTMLElement>(`[data-panel="${id}"]`);
          if (!p) return;
          const y = topOf(p);
          if (window.__lenis) window.__lenis.scrollTo(y, { duration: 0.9 });
          else window.scrollTo({ top: y, behavior: 'smooth' });
        };
        window.addEventListener('sheet:goto', onGoto);
        const onScroll = () => {
          const h = document.documentElement.scrollHeight - window.innerHeight;
          emit({ progress: h > 0 ? window.scrollY / h : 0, x: 0, maxX: 1, activeIndex: 0 });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
          window.removeEventListener('sheet:goto', onGoto);
          window.removeEventListener('scroll', onScroll);
          sizer.disconnect();
          ScrollTrigger.removeEventListener('refreshInit', unstick);
          ScrollTrigger.removeEventListener('refresh', restick);
          restick();
          shades.forEach((s) => s.remove());
          bays.forEach((b) => b.style.removeProperty('--bay-h'));
        };
      });

      teardown = () => mm.revert();
    })();

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [wrapRef, trackRef, idsKey, enabled]);
}
