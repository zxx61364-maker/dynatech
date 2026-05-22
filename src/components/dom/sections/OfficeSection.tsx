'use client';

import { useScrollStore } from '@/hooks/useScrollStore';
import { useDomVisibility } from '@/hooks/useDomVisibility';

export function OfficeSection() {
  const currentSection = useScrollStore((s) => s.currentSection);
  const { visible, opacity } = useDomVisibility('office');

  if (currentSection !== 'office' && currentSection !== 'filmstrip' && currentSection !== 'paper') return null;

  return (
    <>
      <div className="office-overlay" style={{ opacity: visible ? opacity : 0 }}>
        <h2>ABOUT DYNATECH</h2>
        <p className="office-subtitle">A Corporate Philosophy Film</p>
        <div className="office-stats">
          <div className="office-stat">
            <div className="office-stat-value">1982</div>
            <div className="office-stat-label">Established</div>
          </div>
          <div className="office-stat">
            <div className="office-stat-value">40+</div>
            <div className="office-stat-label">Years Combined XP</div>
          </div>
          <div className="office-stat">
            <div className="office-stat-value">12pt</div>
            <div className="office-stat-label">Excellence Matrix</div>
          </div>
        </div>
      </div>

      <section className="a11y-sr" aria-label="About Dynatech">
        <h2>About Dynatech Corporation</h2>
        <p>Dynatech Corporation has been at the forefront of enterprise solutions since 1982.</p>
      </section>
    </>
  );
}
