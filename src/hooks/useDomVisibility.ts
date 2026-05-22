'use client';

import { useScrollStore } from '@/hooks/useScrollStore';
import type { SectionId } from '@/types';
import { SECTION_CONFIGS } from '@/types';

function computeAlpha(section: SectionId, globalProgress: number): { visible: boolean; opacity: number } {
  const cfg = SECTION_CONFIGS.find((s) => s.id === section);
  if (!cfg) return { visible: false, opacity: 0 };

  const { start, end } = cfg;
  const range = end - start;
  if (range <= 0) return { visible: false, opacity: 0 };

  const sectionProgress = Math.max(0, Math.min(1, (globalProgress - start) / range));
  const isFirst = start === 0;
  const isLast = end >= 1;

  let alpha = 0;
  if (isFirst) {
    if (sectionProgress < 0.08) alpha = 1;
    else if (sectionProgress < 0.95) alpha = 1 - (sectionProgress - 0.08) / 0.87;
    else alpha = 0;
  } else if (isLast) {
    if (sectionProgress < 0.02) alpha = 0;
    else if (sectionProgress < 0.12) alpha = (sectionProgress - 0.02) / 0.10;
    else alpha = 1;
  } else {
    if (sectionProgress < 0.02) alpha = 0;
    else if (sectionProgress < 0.10) alpha = (sectionProgress - 0.02) / 0.08;
    else if (sectionProgress < 0.88) alpha = 1;
    else if (sectionProgress < 0.96) alpha = 1 - (sectionProgress - 0.88) / 0.08;
    else alpha = 0;
  }

  return { visible: alpha > 0.01, opacity: alpha };
}

export function useDomVisibility(section: SectionId) {
  const globalProgress = useScrollStore((s) => s.globalProgress);
  return computeAlpha(section, globalProgress);
}
