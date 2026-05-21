'use client';

import { useDomVisibility } from '@/hooks/useDomVisibility';
import { PROJECTS } from '@/lib/constants';

export function FilmstripSection() {
  const visible = useDomVisibility('filmstrip');

  return (
    <>
      <div className="filmstrip-dom" style={{ opacity: visible ? 1 : 0.08, transition: 'opacity 0.5s' }}>
        <h2 className="filmstrip-heading">SELECTED WORK</h2>
        <p className="filmstrip-sub">BROWSE OUR PROJECT CAROUSEL TO EXPLORE OUR SELECTED WORK</p>
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
