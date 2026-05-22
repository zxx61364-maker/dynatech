'use client';

import { useScrollStore } from '@/hooks/useScrollStore';
import { HeroCRTScene } from './scenes/HeroCRTScene';
import { FilmstripScene } from './scenes/FilmstripScene';
import { OfficeScene } from './scenes/OfficeScene';
import { PaperScene } from './scenes/PaperScene';
import { ClientWallScene } from './scenes/ClientWallScene';
import { CTAScene } from './scenes/CTAScene';
import { FinaleScene } from './scenes/FinaleScene';
import { EffectComposer } from './post/EffectComposer';

// Only client-wall→cta uses dual-render for smooth overlap.
// cta→finale uses a phased approach instead: CTA retreats → dark → Finale reveals.
const TRANSITION_ZONES = [
  { from: 'client-wall', to: 'cta', boundary: 0.78, pad: 0.025 },
];

export function SceneManager() {
  const bootPhase = useScrollStore((s) => s.bootPhase);
  const globalProgress = useScrollStore((s) => s.globalProgress);
  const currentSection = useScrollStore((s) => s.currentSection);

  if (bootPhase !== 'complete') return null;

  // During transition zones, render both scenes to avoid a blank frame.
  // The CSS overlay masks any visual discontinuity.
  const renderScenes = new Set<string>();
  renderScenes.add(currentSection);

  for (const zone of TRANSITION_ZONES) {
    const d = Math.abs(globalProgress - zone.boundary);
    if (d < zone.pad) {
      renderScenes.add(zone.from);
      renderScenes.add(zone.to);
    }
  }

  return (
    <>
      {renderScenes.has('hero') && <HeroCRTScene />}
      {renderScenes.has('filmstrip') && <FilmstripScene />}
      {renderScenes.has('office') && <OfficeScene />}
      {renderScenes.has('paper') && <PaperScene />}
      {renderScenes.has('client-wall') && <ClientWallScene />}
      {renderScenes.has('cta') && <CTAScene />}
      {renderScenes.has('finale') && <FinaleScene />}
      <EffectComposer />
    </>
  );
}
