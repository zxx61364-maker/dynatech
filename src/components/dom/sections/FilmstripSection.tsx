'use client';

import { useScrollStore } from '@/hooks/useScrollStore';
import { useDomVisibility } from '@/hooks/useDomVisibility';
import { PROJECTS } from '@/lib/constants';

export function FilmstripSection() {
  const currentSection = useScrollStore((s) => s.currentSection);
  const { visible, opacity } = useDomVisibility('filmstrip');

  if (currentSection !== 'filmstrip') return null;

  return (
    <>
      <div className="filmstrip-overlay" style={{ opacity: visible ? opacity : 0 }}>
        <h2 className="filmstrip-heading">SELECTED WORK</h2>
        <p className="filmstrip-sub">Browse our project carousel</p>
      </div>

      <section className="a11y-sr" aria-label="Selected Work">
        <h2>Selected Work</h2>
        <ul>
          {PROJECTS.map((p) => (
            <li key={p.id}><span>{p.title}</span> — <span>{p.subtitle}</span></li>
          ))}
        </ul>
      </section>
    </>
  );
}
