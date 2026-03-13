'use client';
import { createContext, useContext, useRef } from 'react';

type NavigateFn = (href: string) => void;

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
  return (href: string) => navigateRef.current(href);
}
