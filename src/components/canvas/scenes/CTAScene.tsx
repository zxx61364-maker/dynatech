'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneProgress } from '@/hooks/useSceneProgress';
import { COLORS } from '@/lib/constants';

export function CTAScene() {
  const { progress } = useSceneProgress('cta');
  const { camera } = useThree();

  const startPos = useMemo(() => new THREE.Vector3(0, 0.3, 7), []);
  const endPos = useMemo(() => new THREE.Vector3(0, 0.05, 3.5), []);
  const lookTarget = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame(() => {
    camera.position.lerpVectors(startPos, endPos, progress);
    camera.lookAt(lookTarget);
  });

  return (
    <group>
      {/* Dark warm atmosphere */}
      <ambientLight intensity={0.15} color="#1a1008" />

      {/* Golden spotlight */}
      <spotLight
        position={[0, 3, 0]}
        angle={0.7}
        penumbra={0.5}
        intensity={6}
        color="#fff8e0"
        distance={10}
      />

      {/* Warm rim lights */}
      <pointLight position={[3, 1, 3]} intensity={2} color={COLORS.GOLDEN_ACCENT} distance={8} />
      <pointLight position={[-3, -1, 2]} intensity={1} color={COLORS.CREAM_PAPER} distance={6} />

      {/* Dark backdrop */}
      <mesh position={[0, -0.5, 0]}>
        <planeGeometry args={[10, 12]} />
        <meshStandardMaterial color="#080808" roughness={0.9} />
      </mesh>

      {/* Large decorative scissors silhouette */}
      <mesh position={[2.8, 0.6, 0.02]} rotation={[0, 0, 0.3]}>
        <planeGeometry args={[0.6, 0.6]} />
        <meshBasicMaterial color={COLORS.GOLDEN_ACCENT} transparent opacity={0.08} />
      </mesh>

      <fog attach="fog" args={['#080808', 3, 10]} />
    </group>
  );
}
