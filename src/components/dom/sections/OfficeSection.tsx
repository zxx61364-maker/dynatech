'use client';

import { useDomVisibility } from '@/hooks/useDomVisibility';

export function OfficeSection() {
  const visible = useDomVisibility('office');

  return (
    <>
      <div className="office-dom" style={{ opacity: visible ? 1 : 0.08, transition: 'opacity 0.5s' }}>
        <h2>ABOUT DYNATECH</h2>
        <p>A CORPORATE PHILOSOPHY FILM</p>
      </div>

      <section className="a11y-sr" aria-label="About Dynatech">
        <h2>About Dynatech Corporation</h2>
        <p>Dynatech Corporation has been at the forefront of enterprise solutions since 1982.</p>
      </section>
    </>
  );
}
