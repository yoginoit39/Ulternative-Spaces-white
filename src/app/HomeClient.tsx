'use client';
import { useState, useRef, useMemo, useCallback } from 'react';
import Cursor from '@/components/Cursor';
import Loader from '@/components/Loader';
import Nav from '@/components/Nav';
import SmoothScroll from '@/components/SmoothScroll';
import SheetChrome, { type Station } from '@/components/sheet/SheetChrome';
import { useSheetScroll } from '@/components/sheet/useSheetScroll';
import Cover from '@/components/sheet/Cover';
import Studio from '@/components/sheet/Studio';
import WorkStrip from '@/components/sheet/WorkStrip';
import ProcessLine from '@/components/sheet/ProcessLine';
import ServicesWall from '@/components/sheet/ServicesWall';
import ContactEnd from '@/components/sheet/ContactEnd';
import DrawingScene from '@/components/sheet/DrawingScene';
import '@/components/sheet/sheet.css';

const STATIONS: Station[] = [
  { id: 'cover',    label: 'COVER',         sheet: '00' },
  { id: 'studio',   label: 'THE STUDIO',    sheet: '01' },
  { id: 'work',     label: 'SELECTED WORK', sheet: '02' },
  { id: 'process',  label: 'PROCESS',       sheet: '03' },
  { id: 'services', label: 'SERVICES',      sheet: '04' },
  { id: 'contact',  label: 'CONTACT',       sheet: '05' },
];

export default function HomeClient() {
  const [siteReady, setSiteReady] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const ids = useMemo(() => STATIONS.map((s) => s.id), []);
  const onLoaded = useCallback(() => setSiteReady(true), []);

  useSheetScroll(wrapRef, trackRef, ids, siteReady);

  return (
    <SmoothScroll>
      <Cursor />
      <Loader onComplete={onLoaded} />

      <DrawingScene category="Residential" seed={3} />

      <Nav />
      <SheetChrome stations={STATIONS} trackRef={trackRef} />

      {/* Outer div is owned by React; ScrollTrigger re-parents .sheet-wrap
          into a pin-spacer inside it, so route changes stay safe. */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div ref={wrapRef} className="sheet-wrap">
        <div ref={trackRef} className="sheet-track">
          <Cover ready={siteReady} />
          <Studio />
          <WorkStrip />
          <ProcessLine />
          <ServicesWall />
          <ContactEnd />
        </div>
        </div>
      </div>
    </SmoothScroll>
  );
}
