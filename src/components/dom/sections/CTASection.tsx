'use client';

import { useScrollStore } from '@/hooks/useScrollStore';
import { useDomVisibility } from '@/hooks/useDomVisibility';

export function CTASection() {
  const currentSection = useScrollStore((s) => s.currentSection);
  const { visible, opacity } = useDomVisibility('cta');

  if (currentSection !== 'cta' && currentSection !== 'client-wall' && currentSection !== 'finale') return null;

  return (
    <>
      <div className="cta-whisper" style={{ opacity: visible ? opacity : 0 }}>
        <span className="cta-whisper-line" />
        <p className="cta-whisper-text">The future converges here</p>
        <span className="cta-whisper-line" />
      </div>

      <section className="a11y-sr" aria-label="Contact Dynatech">
        <h2>Contact Dynatech Corporation</h2>
        <p>Call 1-800-DYNATECH or email info@dynatech.example.com</p>
      </section>
    </>
  );
}
