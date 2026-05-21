'use client';

import { useScrollStore } from '@/hooks/useScrollStore';
import type { SectionId } from '@/types';

export function useSceneProgress(section: SectionId) {
  const progress = useScrollStore((s) => s.sectionProgress[section]);
  const velocity = useScrollStore((s) => s.globalVelocity);
  const currentSection = useScrollStore((s) => s.currentSection);
  const isActive = currentSection === section;
  return { progress, velocity, isActive, currentSection };
}
