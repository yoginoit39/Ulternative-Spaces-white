'use client';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Cursor from '@/components/Cursor';
import Loader from '@/components/Loader';
import Nav from '@/components/Nav';
import SmoothScroll from '@/components/SmoothScroll';
import SheetChrome, { type Station } from '@/components/sheet/SheetChrome';
import { useSheetScroll, subscribeSheet } from '@/components/sheet/useSheetScroll';
import Cover from '@/components/sheet/Cover';
import Studio from '@/components/sheet/Studio';
import WorkStrip from '@/components/sheet/WorkStrip';
import ProcessLine from '@/components/sheet/ProcessLine';
import ServicesWall from '@/components/sheet/ServicesWall';
import ContactEnd from '@/components/sheet/ContactEnd';
import '@/components/sheet/sheet.css';

const ThreeScene = dynamic(() => import('@/components/ThreeScene'), { ssr: false });

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
  const [progress, setProgress] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const ids = useMemo(() => STATIONS.map((s) => s.id), []);
  const onLoaded = useCallback(() => setSiteReady(true), []);

  useSheetScroll(wrapRef, trackRef, ids, siteReady);
  useEffect(() => subscribeSheet((s) => setProgress(s.progress)), []);

  return (
    <SmoothScroll>
      <Cursor />
      <Loader onComplete={onLoaded} />

      {siteReady && <ThreeScene progress={progress} />}

      <Nav />
      <SheetChrome stations={STATIONS} trackRef={trackRef} />

      <div ref={wrapRef} className="sheet-wrap" style={{ position: 'relative', zIndex: 1 }}>
        <div ref={trackRef} className="sheet-track">
          <Cover ready={siteReady} />
          <Studio />
          <WorkStrip />
          <ProcessLine />
          <ServicesWall />
          <ContactEnd />
        </div>
      </div>
    </SmoothScroll>
  );
}
