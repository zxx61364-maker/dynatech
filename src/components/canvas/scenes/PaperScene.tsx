'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneProgress } from '@/hooks/useSceneProgress';
import { COLORS } from '@/lib/constants';

export function PaperScene() {
  const { progress } = useSceneProgress('paper');
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  const startPos = useMemo(() => new THREE.Vector3(0, 0.5, 8), []);
  const endPos = useMemo(() => new THREE.Vector3(0, 0.2, 5), []);
  const lookTarget = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame(() => {
    camera.position.lerpVectors(startPos, endPos, progress);
    camera.lookAt(lookTarget);
  });

  return (
    <group ref={groupRef}>
      {/* Warm, dim lighting — the DOM card provides the bright paper feel */}
      <ambientLight intensity={0.55} color="#4a3830" />
      <pointLight position={[2, 2, 4]} intensity={1.5} color="#ffe8d0" distance={10} />
      <pointLight position={[-2, -1, 2]} intensity={0.6} color="#4a3020" distance={8} />

      {/* Large dark void */}
      <mesh position={[0, -0.5, 0]} rotation={[-0.05, 0, 0]}>
        <planeGeometry args={[12, 16]} />
        <meshStandardMaterial
          color="#0a0808"
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      {/* Subtle paper texture hint — scattered faint rectangles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={`paper-flake-${i}`}
          position={[
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 4 - 1,
            0.02,
          ]}
          rotation={[0, 0, Math.random() * Math.PI]}
        >
          <planeGeometry args={[0.3 + Math.random() * 0.5, 0.2 + Math.random() * 0.4]} />
          <meshBasicMaterial
            color={COLORS.CREAM_PAPER}
            transparent
            opacity={0.04 + Math.random() * 0.05}
            depthWrite={false}
          />
        </mesh>
      ))}

      <fog attach="fog" args={['#0a0808', 5, 18]} />
    </group>
  );
}
