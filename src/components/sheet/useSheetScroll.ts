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
 * Also wires: [data-reveal] entrance tweens, [data-parallax] scrubbed drift,
 * [data-draw] SVG stroke drawing, and 'sheet:goto' jumps.
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

        const scrub = gsap.to(track, {
          x: () => -getMax(),
          ease: 'none',
          scrollTrigger: {
            trigger: wrap,
            start: 'top top',
            end: () => `+=${getMax()}`,
            pin: true,
            scrub: 0.25,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const maxX = getMax();
              const x = -self.progress * maxX;
              // active = last panel whose left edge has crossed 45% of viewport
              let active = 0;
              const probe = -x + window.innerWidth * 0.45;
              panels.forEach((p, i) => { if (p.offsetLeft <= probe) active = i; });
              emit({ progress: self.progress, x, maxX, activeIndex: active });
            },
          },
        });

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
          gsap.fromTo(el, { x: () => -window.innerWidth * f * 0.5 }, {
            x: () => window.innerWidth * f * 0.5,
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
        const jumpTo = (id: string, immediate = false) => {
          const p = track.querySelector<HTMLElement>(`[data-panel="${id}"]`);
          if (!p) return;
          wrap.scrollLeft = 0; // defensive: undo any native anchor jump
          const st = scrub.scrollTrigger;
          const y = (st?.start ?? 0) + Math.min(p.offsetLeft, getMax());
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
            const want = Math.min(target?.offsetLeft ?? 0, getMax());
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
        };
      });

      /* ───────────── MOBILE: vertical stack ───────────── */
      mm.add(`(max-width: ${SHEET_BREAKPOINT - 1}px)`, () => {
        const reveals = track.querySelectorAll<HTMLElement>('[data-reveal]');
        reveals.forEach((el) => {
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
        const onGoto = (e: Event) => {
          const id = (e as CustomEvent<string>).detail;
          const p = track.querySelector<HTMLElement>(`[data-panel="${id}"]`);
          p?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
