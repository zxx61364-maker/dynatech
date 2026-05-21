'use client';

import { useEffect, useState } from 'react';
import type { SectionId } from '@/types';
import { SECTION_CONFIGS } from '@/types';

export function useDomVisibility(section: SectionId) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const cfg = SECTION_CONFIGS.find((s) => s.id === section);
    if (!cfg) return;

    const container = document.getElementById('scroll-container');
    if (!container) return;

    const check = () => {
      const maxScroll = container.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const globalProgress = container.scrollTop / maxScroll;
      const start = cfg.start;
      const end = cfg.end;
      const range = end - start;
      const sectionProgress = Math.max(0, Math.min(1, (globalProgress - start) / range));
      // First section: visible from 0. Rest: visible from 0.05 to 0.95
      const isFirst = start === 0;
      setVisible(isFirst ? sectionProgress < 0.95 : sectionProgress > 0.05 && sectionProgress < 0.95);
    };

    check();
    container.addEventListener('scroll', check, { passive: true });
    return () => container.removeEventListener('scroll', check);
  }, [section]);

  return visible;
}
