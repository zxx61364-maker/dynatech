'use client';

import { useDomVisibility } from '@/hooks/useDomVisibility';
import { CLIENTS } from '@/lib/constants';

export function ClientSection() {
  const visible = useDomVisibility('client-wall');

  return (
    <>
      <div className="client-dom" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s' }}>
        <div className="client-card">
          <h2>OUR VALUED PARTNERS</h2>
          <div className="logo-grid">
            {CLIENTS.map((c) => (
              <div key={c.id} className="logo-item" style={{ borderColor: c.color + '44' }}>
                {c.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="a11y-sr" aria-label="Valued Partners">
        <h2>Our Valued Partners</h2>
        <ul>{CLIENTS.map((c) => <li key={c.id}>{c.name}</li>)}</ul>
      </section>
    </>
  );
}
