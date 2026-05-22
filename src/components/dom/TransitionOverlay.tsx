'use client';

import { useEffect, useRef, useState } from 'react';
import { useScrollStore } from '@/hooks/useScrollStore';
import type { SectionId } from '@/types';

type TransitionName =
  | 'crt-collapse'
  | 'safelight-wipe'
  | 'paper-roll'
  | 'dissolve'
  | 'focus-in'
  | 'lights-out';

const TRANSITION_MAP: Record<string, TransitionName> = {
  'hero:filmstrip': 'crt-collapse',
  'filmstrip:office': 'safelight-wipe',
  'office:paper': 'paper-roll',
  'paper:client-wall': 'dissolve',
  'client-wall:cta': 'focus-in',
  'cta:finale': 'lights-out',
};

export function TransitionOverlay() {
  const currentSection = useScrollStore((s) => s.currentSection);
  const previousSection = useScrollStore((s) => s.previousSection);
  const bootPhase = useScrollStore((s) => s.bootPhase);

  const [active, setActive] = useState(false);
  const [transitionType, setTransitionType] = useState<TransitionName>('dissolve');
  const prevRef = useRef<SectionId>(currentSection);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (bootPhase !== 'complete') return;
    if (currentSection === prevRef.current) return;

    const key = `${prevRef.current}:${currentSection}`;
    const name = TRANSITION_MAP[key];
    prevRef.current = currentSection;

    if (!name) return;

    setTransitionType(name);
    setActive(true);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setActive(false);
    }, 700);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentSection, bootPhase]);

  if (bootPhase !== 'complete' || !active) return null;

  return (
    <div className={`transition-overlay transition-${transitionType}`} aria-hidden="true">
      <div className="transition-inner" />
    </div>
  );
}
