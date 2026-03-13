import type { Metadata } from 'next';
import { Playfair_Display, Cormorant_Garamond, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { TransitionProvider } from '@/context/transition';
import PageTransition from '@/components/PageTransition';

const playfair = Playfair_Display({
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ulternative Spaces — Design-Build · Kampala · Juba',
  description:
    'Ulternative Spaces is a Design-Build company at the intersection of creative architecture and meticulous construction. Based in Kampala, Uganda and Juba, South Sudan.',
  openGraph: {
    title: 'Ulternative Spaces — Design-Build · Kampala · Juba',
    description: 'Architecture & Interior Design across East Africa.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable} ${jetbrains.variable}`}>
      <body style={{ fontFamily: 'var(--font-cormorant), serif' }} suppressHydrationWarning>
        <TransitionProvider>
          <PageTransition />
          {children}
        </TransitionProvider>
      </body>
    </html>
  );
}
