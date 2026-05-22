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

// Strict single-scene rendering.
// Only the active section's 3D scene mounts at any time.
// CSS transition overlays (TransitionOverlay.tsx) handle all chapter bridges.
// This eliminates visual overlap where two scenes compete for the same center.

export function SceneManager() {
  const bootPhase = useScrollStore((s) => s.bootPhase);
  const currentSection = useScrollStore((s) => s.currentSection);

  if (bootPhase !== 'complete') return null;

  return (
    <>
      {currentSection === 'hero' && <HeroCRTScene />}
      {currentSection === 'filmstrip' && <FilmstripScene />}
      {currentSection === 'office' && <OfficeScene />}
      {currentSection === 'paper' && <PaperScene />}
      {currentSection === 'client-wall' && <ClientWallScene />}
      {currentSection === 'cta' && <CTAScene />}
      {currentSection === 'finale' && <FinaleScene />}
      <EffectComposer />
    </>
  );
}
