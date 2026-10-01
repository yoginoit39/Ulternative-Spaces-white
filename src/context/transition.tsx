'use client';
import { createContext, useContext, useRef } from 'react';

/**
 * Navigate with the page transition. Pass `from` (a plate holding a photo,
 * with data-photo set to the photo's src) to have that photograph carry the
 * visitor into the next page instead of the wipe.
 */
type NavigateFn = (href: string, from?: HTMLElement | null) => void;

interface TransitionCtx {
  navigateRef: React.MutableRefObject<NavigateFn>;
}

export const TransitionContext = createContext<TransitionCtx>({
  navigateRef: { current: () => {} },
});

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const navigateRef = useRef<NavigateFn>(() => {});
  return (
    <TransitionContext.Provider value={{ navigateRef }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function usePageTransition(): NavigateFn {
  const { navigateRef } = useContext(TransitionContext);
  return (href, from) => navigateRef.current(href, from);
}
