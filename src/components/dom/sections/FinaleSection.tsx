'use client';

import { useDomVisibility } from '@/hooks/useDomVisibility';

export function FinaleSection() {
  const visible = useDomVisibility('finale');

  return (
    <>
      <div className="finale-dom" style={{ opacity: visible ? 1 : 0.05, transition: 'opacity 0.8s' }}>
        <h2>DYNATECH CORPORATION</h2>
        <p className="est">EST. 1982</p>
        <p className="tagline">THE FUTURE OF BUSINESS IS BUSINESS</p>
      </div>

      <section className="a11y-sr" aria-label="Dynatech Corporation">
        <h2>Dynatech Corporation</h2>
        <p>Established 1982. The Future of Business is Business.</p>
      </section>
    </>
  );
}
