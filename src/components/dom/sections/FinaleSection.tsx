'use client';

import { useMemo } from 'react';
import { useScrollStore } from '@/hooks/useScrollStore';
import { useDomVisibility } from '@/hooks/useDomVisibility';

export function FinaleSection() {
  const currentSection = useScrollStore((s) => s.currentSection);
  const { visible } = useDomVisibility('finale');
  const finaleProgress = useScrollStore((s) => s.sectionProgress['finale']);

  // Delay appearance: only show DOM title after CTA elements have fully retreated.
  // The dark-collapse CSS transition handles the bridge.
  const delayedOpacity = useMemo(() => {
    if (finaleProgress < 0.06) return 0;
    if (finaleProgress < 0.16) return (finaleProgress - 0.06) / 0.10;
    return 1;
  }, [finaleProgress]);

  if (currentSection !== 'finale') return null;

  return (
    <>
      <div className="finale-overlay" style={{ opacity: visible ? delayedOpacity : 0 }}>
        <h2 className="finale-title">DYNATECH</h2>
        <div className="finale-rule" />
      </div>

      <section className="a11y-sr" aria-label="Dynatech Corporation">
        <h2>Dynatech Corporation</h2>
        <p>Established 1982. The Future of Business is Business.</p>
      </section>
    </>
  );
}
