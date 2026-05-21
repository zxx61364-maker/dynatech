'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { SceneManager } from './SceneManager';

export function CanvasRoot() {
  return (
    <div id="canvas-mount">
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: 3, // ACESFilmic
          outputColorSpace: 'srgb',
        }}
        camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 100 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <SceneManager />
        </Suspense>
      </Canvas>
    </div>
  );
}
