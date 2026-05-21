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
        <div id="hero-section" className="sr-section-marker"
          style={{ position: 'absolute', top: '0svh', height: 'calc(100svh * 1.2)', width: '100%', left: 0 }}>
          <HeroSection />
        </div>
        <div id="filmstrip-section" className="sr-section-marker"
          style={{ position: 'absolute', top: 'calc(100svh * 1.5)', height: 'calc(100svh * 1.2)', width: '100%', left: 0 }}>
          <FilmstripSection />
        </div>
        <div id="office-section" className="sr-section-marker"
          style={{ position: 'absolute', top: 'calc(100svh * 3.0)', height: 'calc(100svh * 1.2)', width: '100%', left: 0 }}>
          <OfficeSection />
        </div>
        <div id="paper-section" className="sr-section-marker"
          style={{ position: 'absolute', top: 'calc(100svh * 4.5)', height: 'calc(100svh * 1.3)', width: '100%', left: 0 }}>
          <PaperSection />
        </div>
        <div id="client-wall-section" className="sr-section-marker"
          style={{ position: 'absolute', top: 'calc(100svh * 6.0)', height: 'calc(100svh * 1.0)', width: '100%', left: 0 }}>
          <ClientSection />
        </div>
        <div id="cta-section" className="sr-section-marker"
          style={{ position: 'absolute', top: 'calc(100svh * 7.1)', height: 'calc(100svh * 1.1)', width: '100%', left: 0 }}>
          <CTASection />
        </div>
        <div id="finale-section" className="sr-section-marker"
          style={{ position: 'absolute', top: 'calc(100svh * 7.9)', height: 'calc(100svh * 0.9)', width: '100%', left: 0 }}>
          <FinaleSection />
        </div>
      </div>
    </div>
  );
}
