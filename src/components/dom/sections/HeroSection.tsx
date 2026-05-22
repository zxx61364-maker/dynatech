'use client';

import { useScrollStore } from '@/hooks/useScrollStore';
import { useDomVisibility } from '@/hooks/useDomVisibility';

export function HeroSection() {
  const currentSection = useScrollStore((s) => s.currentSection);
  const { visible, opacity } = useDomVisibility('hero');

  // Only render overlay when hero is active or about to be
  if (currentSection !== 'hero' && currentSection !== 'filmstrip') return null;

  return (
    <>
      <div className="hero-overlay" style={{ opacity: visible ? opacity : 0 }}>
        <div className="hero-text-block">
          <h1 className="hero-masthead">
            BUSINESS
            <br />
            SOLUTIONS
            <br />
            FOR THE
            <br />
            MODERN
            <br />
            ENTERPRISE
          </h1>
          <p className="hero-subtitle">Dynatech Corporation — Est. 1982</p>
          <p className="hero-scroll-hint">▼ Insert Disk to Continue</p>
        </div>
        <div className="hero-spacer" />
      </div>

      <section className="a11y-sr" aria-label="Hero">
        <h1>Dynatech Corporation — Business Solutions for the Modern Enterprise</h1>
        <p>Since 1982, pioneering enterprise workflow solutions for the digital age.</p>
      </section>
    </>
  );
}
