'use client';
import { useEffect, useRef, useState } from 'react';
import imageLoader from '@/lib/imageLoader';

/**
 * Click any `.plate[data-lightbox="<group>"]` (with data-src, optional
 * data-caption) and its photograph lifts out of the frame to fill the
 * screen; close and it settles back into the frame. Plates sharing a group
 * page with ← → / swipe. Esc, backdrop or ✕ closes.
 */
type Item = { el: HTMLElement; src: string; caption: string };

const loadGsap = async () => { const m = await import('gsap'); return m.default || m.gsap; };
const fit = (w: number, h: number) => {
  // letterbox inside the viewport with a margin, like a print pinned to a wall
  const mw = Math.min(window.innerWidth, 1800) * (window.innerWidth < 900 ? 1 : 0.9);
  const mh = window.innerHeight - (window.innerWidth < 900 ? 120 : 160);
  const s = Math.min(mw / w, mh / h);
  const W = w * s, H = h * s;
  return { left: (window.innerWidth - W) / 2, top: (window.innerHeight - H) / 2 - (window.innerWidth < 900 ? 12 : 8), width: W, height: H };
};

export default function Lightbox() {
  const boxRef = useRef<HTMLDivElement>(null);     // the frame in flight
  const innerRef = useRef<HTMLDivElement>(null);   // the photograph inside it (can be larger than the frame)
  const imgRef = useRef<HTMLImageElement>(null);
  const hiRef = useRef<HTMLImageElement>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [index, setIndex] = useState(-1);
  const [shown, setShown] = useState(false);       // chrome (caption, buttons) visible
  const busy = useRef(false);
  const cur = useRef({ items: [] as Item[], index: -1, ratio: 1 });

  useEffect(() => {
    const box = boxRef.current!, inner = innerRef.current!, img = imgRef.current!, hi = hiRef.current!;

    const show = async (src: string) => {
      hi.style.opacity = '0';
      hi.onload = () => { hi.style.opacity = '1'; };
      hi.src = imageLoader({ src, width: Math.min(1920, window.innerWidth * window.devicePixelRatio) }) || src;
    };

    const open = async (list: Item[], i: number) => {
      if (busy.current) return;
      busy.current = true;
      const gsap = await loadGsap();
      const it = list[i];
      const plateImg = it.el.querySelector('img');
      if (!plateImg) { busy.current = false; return; }
      cur.current = { items: list, index: i, ratio: plateImg.naturalWidth && plateImg.naturalHeight ? plateImg.naturalWidth / plateImg.naturalHeight : 4 / 3 };
      setItems(list); setIndex(i);

      // start exactly on the plate, showing exactly the crop it shows
      const r = it.el.getBoundingClientRect(), p = plateImg.getBoundingClientRect();
      img.src = plateImg.currentSrc || plateImg.src;
      show(it.src);
      gsap.set(inner, {
        left: `${((p.left - r.left) / r.width) * 100}%`, top: `${((p.top - r.top) / r.height) * 100}%`,
        width: `${(p.width / r.width) * 100}%`, height: `${(p.height / r.height) * 100}%`,
      });
      gsap.set(box, { display: 'block', left: r.left, top: r.top, width: r.width, height: r.height, opacity: 1 });
      document.documentElement.classList.add('lb-open');
      window.__lenis?.stop();

      const to = fit(cur.current.ratio, 1);
      gsap.timeline({ onComplete: () => { busy.current = false; setShown(true); } })
        .to(inner, { left: '0%', top: '0%', width: '100%', height: '100%', duration: 0.75, ease: 'power3.inOut' }, 0)
        .to(box, { ...to, duration: 0.75, ease: 'power3.inOut' }, 0);
    };

    const close = async () => {
      if (busy.current || cur.current.index < 0) return;
      busy.current = true;
      setShown(false);
      const gsap = await loadGsap();
      const { items: list, index: i } = cur.current;
      const it = list[i];
      const plateImg = it?.el.querySelector('img');
      const r = it?.el.getBoundingClientRect();
      const onScreen = r && plateImg && r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
      const done = () => {
        gsap.set(box, { display: 'none' });
        document.documentElement.classList.remove('lb-open');
        window.__lenis?.start();
        cur.current.index = -1; setIndex(-1);
        busy.current = false;
      };
      if (onScreen && r && plateImg) {
        const p = plateImg.getBoundingClientRect();
        gsap.timeline({ onComplete: done })
          .to(inner, {
            left: `${((p.left - r.left) / r.width) * 100}%`, top: `${((p.top - r.top) / r.height) * 100}%`,
            width: `${(p.width / r.width) * 100}%`, height: `${(p.height / r.height) * 100}%`,
            duration: 0.65, ease: 'power3.inOut',
          }, 0)
          .to(box, { left: r.left, top: r.top, width: r.width, height: r.height, duration: 0.65, ease: 'power3.inOut' }, 0);
      } else {
        gsap.to(box, { opacity: 0, scale: 0.96, duration: 0.35, ease: 'power2.in', onComplete: () => { gsap.set(box, { scale: 1 }); done(); } });
      }
    };

    const step = async (dir: 1 | -1) => {
      const { items: list, index: i } = cur.current;
      if (busy.current || list.length < 2) return;
      busy.current = true;
      const gsap = await loadGsap();
      const n = (i + dir + list.length) % list.length;
      const next = list[n];
      const plateImg = next.el.querySelector('img');
      const ratio = plateImg?.naturalWidth && plateImg.naturalHeight ? plateImg.naturalWidth / plateImg.naturalHeight : cur.current.ratio;
      // slide the old print out, bring the next in from the same side
      await new Promise<void>((res) => gsap.to(inner, { xPercent: -8 * dir, opacity: 0, duration: 0.28, ease: 'power2.in', onComplete: res }));
      cur.current = { items: list, index: n, ratio };
      setIndex(n);
      img.src = plateImg?.currentSrc || plateImg?.src || '';
      show(next.src);
      gsap.set(inner, { xPercent: 8 * dir, left: '0%', top: '0%', width: '100%', height: '100%' });
      gsap.to(box, { ...fit(ratio, 1), duration: 0.45, ease: 'power3.inOut' });
      gsap.to(inner, { xPercent: 0, opacity: 1, duration: 0.45, ease: 'power3.out', onComplete: () => { busy.current = false; } });
    };

    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>('[data-lightbox]');
      if (!el || el.closest('a') || !el.dataset.src) return;
      e.preventDefault();
      const group = el.dataset.lightbox || '';
      const list = Array.from(document.querySelectorAll<HTMLElement>(`[data-lightbox="${CSS.escape(group)}"]`))
        .filter((p) => p.dataset.src && p.getClientRects().length)
        .map((p) => ({ el: p, src: p.dataset.src!, caption: p.dataset.caption || '' }));
      open(list, Math.max(0, list.findIndex((it) => it.el === el)));
    };
    const onKey = (e: KeyboardEvent) => {
      if (cur.current.index < 0) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    const onResize = () => { if (cur.current.index >= 0 && !busy.current) Object.assign(box.style, Object.fromEntries(Object.entries(fit(cur.current.ratio, 1)).map(([k, v]) => [k, `${v}px`]))); };
    // swipe
    let x0 = 0, y0 = 0;
    const onDown = (e: PointerEvent) => { x0 = e.clientX; y0 = e.clientY; };
    const onUp = (e: PointerEvent) => {
      if (cur.current.index < 0) return;
      const dx = e.clientX - x0, dy = e.clientY - y0;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
      else if (dy > 80 && Math.abs(dy) > Math.abs(dx) * 1.5) close();
    };
    // wheel while open: no scrolling underneath
    const onWheel = (e: WheelEvent) => { if (cur.current.index >= 0) e.preventDefault(); };

    document.addEventListener('click', onClick);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    box.addEventListener('pointerdown', onDown);
    box.addEventListener('pointerup', onUp);
    window.addEventListener('wheel', onWheel, { passive: false });
    (box as HTMLDivElement & { __close?: () => void; __step?: (d: 1 | -1) => void }).__close = close;
    (box as HTMLDivElement & { __step?: (d: 1 | -1) => void }).__step = step;
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      box.removeEventListener('pointerdown', onDown);
      box.removeEventListener('pointerup', onUp);
      window.removeEventListener('wheel', onWheel);
    };
  }, []);

  const api = () => boxRef.current as (HTMLDivElement & { __close?: () => void; __step?: (d: 1 | -1) => void }) | null;
  const item = items[index];
  const openNow = index >= 0;

  return (
    <div className={`lb${openNow ? ' lb-on' : ''}${shown ? ' lb-shown' : ''}`} aria-hidden={!openNow}>
      <div className="lb-back" onClick={() => api()?.__close?.()} />

      <div ref={boxRef} className="lb-box" style={{ display: 'none' }}>
        <div ref={innerRef} className="lb-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={imgRef} alt="" className="lb-img" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={hiRef} alt="" className="lb-img lb-hi" />
        </div>
        <span className="lb-marks" aria-hidden />
      </div>

      <div className="lb-chrome">
        <div className="lb-bar">
          <span className="lb-count">{openNow ? `${String(index + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}` : ''}</span>
          <span className="lb-caption">{item?.caption}</span>
          <button type="button" className="lb-close" onClick={() => api()?.__close?.()} aria-label="Close">✕</button>
        </div>
        {items.length > 1 && (
          <>
            <button type="button" className="lb-arrow lb-prev" onClick={() => api()?.__step?.(-1)} aria-label="Previous">←</button>
            <button type="button" className="lb-arrow lb-next" onClick={() => api()?.__step?.(1)} aria-label="Next">→</button>
          </>
        )}
      </div>
    </div>
  );
}
