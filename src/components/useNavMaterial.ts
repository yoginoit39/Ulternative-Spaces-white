'use client';
import { useEffect } from 'react';

/**
 * Vertical pages: the fixed nav takes the material of whichever
 * `[data-mat]` section is under it, via data-mat on <html>
 * (the sheet pages do the same from SheetChrome).
 */
export function useNavMaterial() {
  useEffect(() => {
    const root = document.documentElement;
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main [data-mat], main[data-mat]'));
    const apply = () => {
      let mat = sections[0]?.dataset.mat ?? '';
      sections.forEach((s) => { if (s.getBoundingClientRect().top <= 64) mat = s.dataset.mat ?? mat; });
      if (mat && root.dataset.mat !== mat) root.dataset.mat = mat;
    };
    apply();
    window.addEventListener('scroll', apply, { passive: true });
    window.addEventListener('resize', apply);
    return () => {
      window.removeEventListener('scroll', apply);
      window.removeEventListener('resize', apply);
      delete root.dataset.mat;
    };
  }, []);
}
