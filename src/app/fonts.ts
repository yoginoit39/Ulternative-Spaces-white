import { Outfit, Figtree, DM_Mono } from 'next/font/google';

/**
 * Brand fonts: Kruisel (display) + Colasta (body) are licensed files that
 * must be supplied. Set HAVE_BRAND_FONTS to true once they are in src/fonts/
 * (see src/fonts/README.md). Until then the closest free stand-ins are used:
 * Outfit (geometric, heavy, rounded) for Kruisel, Figtree (soft geometric)
 * for Colasta.
 */
export const HAVE_BRAND_FONTS = false;

const outfit = Outfit({
  weight: ['300', '500', '700', '800'],
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

const figtree = Figtree({
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const mono = DM_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const display = outfit;
export const body = figtree;
