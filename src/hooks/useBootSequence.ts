'use client';

import { useState, useEffect, useCallback } from 'react';
import { BOOT_DURATION_MS } from '@/lib/constants';

interface BootState {
  phase: 'idle' | 'booting' | 'complete';
  progress: number;
  bootText: string[];
  visibleText: number;
}

const BOOT_LINES = [
  'DYNATECH CORPORATION',
  'SYSTEM INITIALIZATION',
  'BIOS v2.4 — (C) 1987 DYNATECH INDUSTRIES',
  'MEMORY CHECK: 640K OK',
  'INITIALIZING DISPLAY ADAPTER...',
  'LOADING EXECUTIVE DASHBOARD...',
];

export function useBootSequence() {
  const [state, setState] = useState<BootState>({
    phase: 'idle',
    progress: 0,
    bootText: BOOT_LINES,
    visibleText: 0,
  });

  const start = useCallback(() => {
    setState((s) => ({ ...s, phase: 'booting', progress: 0, visibleText: 0 }));
  }, []);

  useEffect(() => {
    if (state.phase !== 'booting') return;

    const startTime = performance.now();
    let frame: number;

    const tick = () => {
      const elapsed = performance.now() - startTime;
      const rawProgress = Math.min(elapsed / BOOT_DURATION_MS, 1);
      // Ease: slow start, quick middle, slow end
      const eased =
        rawProgress < 0.3
          ? rawProgress * 0.3
          : rawProgress < 0.8
            ? 0.09 + (rawProgress - 0.3) * 1.6
            : 1;

      setState((s) => ({
        ...s,
        progress: eased,
        visibleText: Math.min(
          Math.floor(rawProgress * BOOT_LINES.length * 1.2),
          BOOT_LINES.length,
        ),
      }));

      if (rawProgress >= 1) {
        setState((s) => ({ ...s, phase: 'complete', progress: 1, visibleText: BOOT_LINES.length }));
      } else {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [state.phase]);

  return { ...state, start };
}
