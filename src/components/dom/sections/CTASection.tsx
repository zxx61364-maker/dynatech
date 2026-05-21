'use client';

import { useDomVisibility } from '@/hooks/useDomVisibility';

export function CTASection() {
  const visible = useDomVisibility('cta');

  return (
    <>
      <div className="cta-dom" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s' }}>
        <div className="cta-card">
          <h2>READY TO LEVERAGE YOUR SYNERGIES?</h2>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: '#555', margin: '0 0 8px 0' }}>
            Our business transformation specialists are standing by.
          </p>
          <p className="fax-number">1-800-DYNATECH</p>
          <p className="checkbox-line">
            ☐ YES! Send me more information about Dynatech Solutions
          </p>
          <p className="fine-print">
            OPERATORS AVAILABLE 9–5 EST MONDAY THROUGH FRIDAY
          </p>
          <a href="mailto:info@dynatech.example.com" className="cta-button">
            REQUEST CONSULTATION ▸
          </a>
        </div>
      </div>

      <section className="a11y-sr" aria-label="Contact Dynatech">
        <h2>Ready to Leverage Your Synergies?</h2>
        <p>Call 1-800-DYNATECH. Operators standing by.</p>
        <a href="mailto:info@dynatech.example.com">Email Dynatech Corporation</a>
      </section>
    </>
  );
}
