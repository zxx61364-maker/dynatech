'use client';

import { useDomVisibility } from '@/hooks/useDomVisibility';

export function HeroSection() {
  const visible = useDomVisibility('hero');

  return (
    <>
      <div className="hero-dom" style={{ opacity: visible ? 1 : 0.08, transition: 'opacity 0.5s' }}>
        <h1>
          BUSINESS SOLUTIONS
          <br />
          FOR THE MODERN
          <br />
          ENTERPRISE
        </h1>
        <p>▼ INSERT DISK TO CONTINUE</p>
      </div>

      <section className="a11y-sr" aria-label="Hero">
        <h1>Dynatech Corporation — Business Solutions for the Modern Enterprise</h1>
        <p>Since 1982, pioneering enterprise workflow solutions for the digital age.</p>
      </section>
    </>
  );
}
