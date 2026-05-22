'use client';

import { useScrollStore } from '@/hooks/useScrollStore';
import { useDomVisibility } from '@/hooks/useDomVisibility';
import { CLIENTS } from '@/lib/constants';

export function ClientSection() {
  const currentSection = useScrollStore((s) => s.currentSection);
  const { visible, opacity } = useDomVisibility('client-wall');

  if (currentSection !== 'client-wall') return null;

  return (
    <>
      <div className="client-tags-overlay" style={{ opacity: visible ? opacity * 0.7 : 0 }}>
        {CLIENTS.map((c, i) => (
          <span
            key={c.id}
            className="client-tag"
            style={{
              top: `${12 + (i % 4) * 20}%`,
              left: i < 4 ? '3%' : '85%',
              borderColor: c.color + '22',
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
