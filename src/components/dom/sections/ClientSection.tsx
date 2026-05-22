'use client';

import { useScrollStore } from '@/hooks/useScrollStore';
import { useDomVisibility } from '@/hooks/useDomVisibility';
import { CLIENTS } from '@/lib/constants';

export function ClientSection() {
  const currentSection = useScrollStore((s) => s.currentSection);
  const { visible, opacity } = useDomVisibility('client-wall');

  if (currentSection !== 'client-wall' && currentSection !== 'paper' && currentSection !== 'cta') return null;

  return (
    <>
      <div className="client-tags-overlay" style={{ opacity: visible ? opacity : 0 }}>
        {CLIENTS.map((c, i) => (
          <span
            key={c.id}
            className="client-tag"
            style={{
              top: `${15 + (i % 4) * 18}%`,
              left: i < 4 ? '8%' : '78%',
              borderColor: c.color + '33',
            }}
          >
            {c.name}
          </span>
        ))}
      </div>

      <section className="a11y-sr" aria-label="Valued Partners">
        <h2>Our Valued Partners</h2>
        <ul>{CLIENTS.map((c) => <li key={c.id}>{c.name}</li>)}</ul>
      </section>
    </>
  );
}
