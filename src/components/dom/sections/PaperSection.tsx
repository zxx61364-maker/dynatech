'use client';

import { useDomVisibility } from '@/hooks/useDomVisibility';
import { CORPORATE_MANIFESTO } from '@/lib/constants';

export function PaperSection() {
  const visible = useDomVisibility('paper');

  return (
    <>
      <div className="paper-dom" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s' }}>
        <div className="paper-card">
          <h2>{CORPORATE_MANIFESTO.heading}</h2>
          <p className="subtitle">{CORPORATE_MANIFESTO.subheading}</p>
          <div className="columns">
            <div>
              <p>{CORPORATE_MANIFESTO.paragraphs[0]}</p>
              <p>{CORPORATE_MANIFESTO.paragraphs[2]}</p>
            </div>
            <div>
              <p>{CORPORATE_MANIFESTO.paragraphs[1]}</p>
              <p>{CORPORATE_MANIFESTO.paragraphs[3]}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="a11y-sr" aria-label="Corporate Manifesto">
        <h2>{CORPORATE_MANIFESTO.heading}</h2>
        {CORPORATE_MANIFESTO.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
      </section>
    </>
  );
}
