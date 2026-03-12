'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Cursor from '@/components/Cursor';
import Loader from '@/components/Loader';
import SmoothScroll from '@/components/SmoothScroll';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Work from '@/components/Work';
import Services from '@/components/Services';
import Gallery from '@/components/Gallery';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const ThreeScene = dynamic(() => import('@/components/ThreeScene'), { ssr: false });

export default function HomeClient() {
  const [siteReady, setSiteReady] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track scroll progress
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? window.scrollY / total : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track active section via IntersectionObserver
  useEffect(() => {
    if (!siteReady) return;
    const sections = ['hero', 'about', 'work', 'services', 'gallery', 'contact'];
    const observers: IntersectionObserver[] = [];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [siteReady]);

  return (
    <>
      <Cursor />
      <Loader onComplete={() => setSiteReady(true)} />

      {/* Three.js canvas — fixed behind everything */}
      {siteReady && (
        <ThreeScene activeSection={activeSection} scrollProgress={scrollProgress} />
      )}

      {/* HTML content — normal flow over the canvas */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <SmoothScroll>
          <Nav />
          <Hero siteReady={siteReady} />
          <About />
          <Work />
          <Services />
          <Gallery />
          <Contact />
          <Footer />
        </SmoothScroll>
      </div>
    </>
  );
}
