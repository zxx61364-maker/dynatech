'use client';

import { useRef, useEffect } from 'react';
import { useScrollStore } from '@/hooks/useScrollStore';
import { SECTION_CONFIGS } from '@/types';
import { HeroSection } from './sections/HeroSection';
import { FilmstripSection } from './sections/FilmstripSection';
import { OfficeSection } from './sections/OfficeSection';
import { PaperSection } from './sections/PaperSection';
import { ClientSection } from './sections/ClientSection';
import { CTASection } from './sections/CTASection';
import { FinaleSection } from './sections/FinaleSection';

export function ScrollContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bootPhase = useScrollStore((s) => s.bootPhase);

  useEffect(() => {
    document.documentElement.style.setProperty('--page-height', String(SECTION_CONFIGS.length));
  }, []);

  if (bootPhase !== 'complete') return null;

  return (
    <div id="scroll-container" ref={containerRef}>
      <a href="#hero-section" className="a11y-sr skip-link">Skip to content</a>

      {/* Screen-reader nav */}
      <nav className="a11y-sr" aria-label="Main navigation">
        <ul>
          {SECTION_CONFIGS.map((s) => (
            <li key={s.id}><a href={`#${s.id}-section`}>{s.label}</a></li>
          ))}
        </ul>
      </nav>

      <div className="scroll-content">
        {/* ── HERO (0 – 0.15) ── */}
        <div
          data-section="hero"
          style={{
            position: 'absolute',
            top: '0svh',
            height: 'calc(100svh * 1.5)',
            width: '100%',
            left: 0,
          }}
        >
          <HeroSection />
        </div>

        {/* ── FILMSTRIP (0.15 – 0.32) ── */}
        <div
          data-section="filmstrip"
          style={{
            position: 'absolute',
            top: 'calc(100svh * 1.8)',
            height: 'calc(100svh * 1.5)',
            width: '100%',
            left: 0,
          }}
        >
          <FilmstripSection />
        </div>

        {/* ── OFFICE (0.32 – 0.48) ── */}
        <div
          data-section="office"
          style={{
            position: 'absolute',
            top: 'calc(100svh * 3.5)',
            height: 'calc(100svh * 1.5)',
            width: '100%',
            left: 0,
          }}
        >
          <OfficeSection />
        </div>

        {/* ── PAPER (0.48 – 0.65) ── */}
        <div
          data-section="paper"
          style={{
            position: 'absolute',
            top: 'calc(100svh * 5.2)',
            height: 'calc(100svh * 1.6)',
            width: '100%',
            left: 0,
          }}
        >
          <PaperSection />
        </div>

        {/* ── CLIENT WALL (0.65 – 0.78) ── */}
        <div
          data-section="client-wall"
          style={{
            position: 'absolute',
            top: 'calc(100svh * 7.0)',
            height: 'calc(100svh * 1.2)',
            width: '100%',
            left: 0,
          }}
        >
          <ClientSection />
        </div>

        {/* ── CTA (0.78 – 0.92) ── */}
        <div
          data-section="cta"
          style={{
            position: 'absolute',
            top: 'calc(100svh * 8.3)',
            height: 'calc(100svh * 1.3)',
            width: '100%',
            left: 0,
          }}
        >
          <CTASection />
        </div>

        {/* ── FINALE (0.92 – 1.0) ── */}
        <div
          data-section="finale"
          style={{
            position: 'absolute',
            top: 'calc(100svh * 9.5)',
            height: 'calc(100svh * 1.0)',
            width: '100%',
            left: 0,
          }}
        >
          <FinaleSection />
        </div>
      </div>
    </div>
  );
}
