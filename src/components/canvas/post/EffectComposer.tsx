'use client';

import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { EffectComposer as EC, Vignette, Bloom, Noise, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useScrollStore } from '@/hooks/useScrollStore';
import { POST_PRESETS } from '@/types';
import type { SectionId } from '@/types';

export function EffectComposer() {
  const currentSection = useScrollStore((s) => s.currentSection);
  const globalProgress = useScrollStore((s) => s.globalProgress);
  const { gl } = useThree();

  // Smoothly interpolate between presets
  const presetKey = (currentSection === 'boot' ? 'hero' : currentSection) as Exclude<SectionId, 'boot'>;
  const preset = POST_PRESETS[presetKey];

  // Disable when transitioning (reduce flicker)
  const enabled = true;

  return (
    <EC enabled={enabled} multisampling={0}>
      <ChromaticAberration
        offset={[preset.rgbShift * 0.05, preset.rgbShift * 0.03]}
        blendFunction={BlendFunction.NORMAL}
      />
      <Bloom
        intensity={preset.bloom * 0.35}
        luminanceThreshold={0.7}
        luminanceSmoothing={0.3}
        mipmapBlur
      />
      <Noise
        premultiply
        opacity={preset.grain * 0.5}
        blendFunction={BlendFunction.NORMAL}
      />
      <Vignette
        offset={0.3}
        darkness={preset.vignette * 0.4}
        blendFunction={BlendFunction.NORMAL}
      />
    </EC>
  );
}
