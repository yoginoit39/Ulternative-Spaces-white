'use client';
import { useState, useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';

const listeners = new Set<() => void>();

function readTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}

function setTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem('theme', theme);
  } catch {}
  listeners.forEach((l) => l());
}

export default function ThemeToggle({ style }: { style?: React.CSSProperties }) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => 'light' as Theme);
  const [hovered, setHovered] = useState(false);
  const dark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        padding: 0,
        border: 'none',
        borderRadius: 999,
        background: 'transparent',
        color: hovered ? 'var(--accent)' : 'var(--parch)',
        cursor: 'pointer',
        transition: 'color 0.2s ease, transform 0.4s var(--ease-out)',
        transform: dark ? 'rotate(180deg)' : 'none',
        ...style,
      }}
    >
      {/* Half-filled circle, drafting-style section symbol */}
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
        <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M8 1.5 A6.5 6.5 0 0 1 8 14.5 Z" fill="currentColor" />
      </svg>
    </button>
  );
}
