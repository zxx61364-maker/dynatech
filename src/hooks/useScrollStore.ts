'use client';

import { create } from 'zustand';
import type { SectionId, ScrollState } from '@/types';
import { SECTION_CONFIGS } from '@/types';

function computeCurrentSection(progress: number): SectionId {
  for (const cfg of SECTION_CONFIGS) {
    if (progress >= cfg.start && progress < cfg.end) return cfg.id;
  }
  return 'finale';
}

function computeSectionProgress(
  progress: number,
  section: SectionId,
): number {
  const cfg = SECTION_CONFIGS.find((s) => s.id === section);
  if (!cfg) return 0;
  const range = cfg.end - cfg.start;
  if (range <= 0) return 0;
  return Math.max(0, Math.min(1, (progress - cfg.start) / range));
}

function computeAllSectionProgress(progress: number): Record<SectionId, number> {
  const result = {} as Record<SectionId, number>;
  for (const cfg of SECTION_CONFIGS) {
    result[cfg.id] = computeSectionProgress(progress, cfg.id);
  }
  return result;
}

interface ScrollStore extends ScrollState {
  setGlobalProgress: (v: number) => void;
  setGlobalVelocity: (v: number) => void;
  setBootPhase: (p: ScrollState['bootPhase']) => void;
  setLenis: (l: unknown) => void;
  setIsLocked: (v: boolean) => void;
}

const initialSectionProgress = computeAllSectionProgress(0);

export const useScrollStore = create<ScrollStore>((set) => ({
  lenis: null,
  bootPhase: 'idle',
  globalProgress: 0,
  globalVelocity: 0,
  currentSection: 'hero',
  previousSection: 'hero',
  sectionProgress: initialSectionProgress,
  isLocked: false,

  setGlobalProgress: (v) =>
    set((state) => {
      const nextSection = computeCurrentSection(v);
      return {
        globalProgress: v,
        previousSection: state.currentSection !== nextSection ? state.currentSection : state.previousSection,
        currentSection: nextSection,
        sectionProgress: computeAllSectionProgress(v),
      };
    }),

  setGlobalVelocity: (v) => set({ globalVelocity: v }),

  setBootPhase: (p) => set({ bootPhase: p }),

  setLenis: (l) => set({ lenis: l }),

  setIsLocked: (v) => set({ isLocked: v }),
}));
