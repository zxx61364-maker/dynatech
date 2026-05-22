'use client';

import { useScrollStore } from '@/hooks/useScrollStore';
import { useDomVisibility } from '@/hooks/useDomVisibility';

export function PaperSection() {
  const currentSection = useScrollStore((s) => s.currentSection);
  const { visible, opacity } = useDomVisibility('paper');

  if (currentSection !== 'paper') return null;

  return (
    <>
      <div className="paper-overlay" style={{ opacity: visible ? opacity : 0 }}>
        <div className="paper-surface">
          <div className="paper-stamp">MEMORANDUM</div>
          <div className="paper-top-rule" />

          <h2>MAKING BUSINESS<br />MORE BUSINESS-LIKE</h2>

          <p className="paper-subtitle">A Statement of Corporate Philosophy</p>

          <p className="paper-body">
            Dynatech Corporation has pioneered enterprise solutions since 1982,
            leveraging cross-functional synergies to maximize stakeholder value
            across every vertical integration point.
          </p>

          <div className="paper-footer">
            <span>DYNATECH CORPORATION</span>
            <span className="paper-page-num">P. 427</span>
          </div>
        </div>
      </div>

      <section className="a11y-sr" aria-label="Corporate Manifesto">
        <h2>Making Business More Business-Like</h2>
        <p>Dynatech Corporation has pioneered enterprise solutions since 1982.</p>
      </section>
    </>
  );
}
