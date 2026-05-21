'use client';

import { useEffect, useState } from 'react';
import { useScrollStore } from '@/hooks/useScrollStore';
import { useBootSequence } from '@/hooks/useBootSequence';
import { createLenis } from '@/lib/lenis';

export function BootOverlay() {
  const bootPhase = useScrollStore((s) => s.bootPhase);
  const setBootPhase = useScrollStore((s) => s.setBootPhase);
  const { phase, progress, bootText, visibleText, start } = useBootSequence();
  const [fadeOut, setFadeOut] = useState(false);

  // Auto-start boot on mount
  useEffect(() => {
    if (bootPhase === 'idle') {
      setBootPhase('booting');
      start();
    }
  }, [bootPhase, setBootPhase, start]);

  // When boot animation completes
  useEffect(() => {
    if (phase === 'complete' && bootPhase === 'booting') {
      // Start fade out after brief hold
      const t1 = setTimeout(() => setFadeOut(true), 400);
      // Mark boot complete and initialize Lenis
      const t2 = setTimeout(() => {
        setBootPhase('complete');
        // Initialize Lenis after boot
        requestAnimationFrame(() => {
          try {
            const lenis = createLenis();
            useScrollStore.getState().setLenis(lenis);
            // Pump Lenis RAF
            function raf(time: number) {
              lenis.raf(time);
              requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
          } catch (e) {
            console.warn('Lenis init failed, using native scroll:', e);
          }
        });
      }, 900);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [phase, bootPhase, setBootPhase]);

  if (bootPhase === 'complete' && fadeOut) return null;

  return (
    <div className={`boot-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="crt-face">
        {bootText.slice(0, visibleText).map((line, i) => (
          <div
            key={i}
            className="boot-line"
            style={{
              animationDelay: `${i * 0.25}s`,
              opacity: i < visibleText ? undefined : 0,
            }}
          >
            {i === 0 ? (
              <span style={{ fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 700, letterSpacing: '0.15em' }}>
                {line}
              </span>
            ) : (
              line
            )}
          </div>
        ))}
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
