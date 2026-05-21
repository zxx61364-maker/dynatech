'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneProgress } from '@/hooks/useSceneProgress';
import { COLORS } from '@/lib/constants';

export function ClientWallScene() {
  const { progress } = useSceneProgress('client-wall');
  const { camera } = useThree();

  const startPos = useMemo(() => new THREE.Vector3(0, 0.8, 7), []);
  const endPos = useMemo(() => new THREE.Vector3(0, 0.2, 4.5), []);
  const lookTarget = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame(() => {
    camera.position.lerpVectors(startPos, endPos, progress);
    camera.lookAt(lookTarget);
  });

  return (
    <group>
      {/* Warm ambient */}
      <ambientLight intensity={0.35} color="#3a3020" />
      <pointLight position={[2, 1.5, 4]} intensity={1.8} color="#ffe8d0" distance={10} />

      {/* Dark backdrop */}
      <mesh position={[0, -0.3, 0]}>
        <planeGeometry args={[10, 12]} />
        <meshStandardMaterial color="#0d0a08" roughness={0.9} />
      </mesh>

      {/* Golden decorative accent lines */}
      <mesh position={[0, -0.1, 0.01]}>
        <boxGeometry args={[6, 0.005, 0.005]} />
        <meshBasicMaterial color={COLORS.GOLDEN_ACCENT} transparent opacity={0.3} />
      </mesh>
      <mesh position={[0, -0.15, 0.01]}>
        <boxGeometry args={[6, 0.005, 0.005]} />
        <meshBasicMaterial color={COLORS.GOLDEN_ACCENT} transparent opacity={0.2} />
      </mesh>

      <fog attach="fog" args={['#0d0a08', 4, 14]} />
    </group>
  );
}
