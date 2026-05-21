'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneProgress } from '@/hooks/useSceneProgress';
import { COLORS } from '@/lib/constants';

function GoldenTie() {
  const tieRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (tieRef.current) tieRef.current.rotation.y += delta * 0.35;
  });

  const goldMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLORS.GOLDEN_ACCENT,
        roughness: 0.12,
        metalness: 0.98,
      }),
    [],
  );

  return (
    <group ref={tieRef} position={[0, 0.15, 0]}>
      {/* Tie knot */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.2, 0.14, 0.1]} />
        <primitive object={goldMat} attach="material" />
      </mesh>
      {/* Tie body */}
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[0.12, 0.05, 0.7, 10, 1]} />
        <primitive object={goldMat} attach="material" />
      </mesh>
      {/* Tie tip */}
      <mesh position={[0, -0.4, 0]}>
        <coneGeometry args={[0.05, 0.1, 10]} />
        <primitive object={goldMat} attach="material" />
      </mesh>
      {/* Collar ring */}
      <mesh position={[0, 0.48, 0]}>
        <torusGeometry args={[0.12, 0.025, 8, 16]} />
        <meshStandardMaterial color="#e8d898" roughness={0.2} metalness={0.95} />
      </mesh>
    </group>
  );
}

export function FinaleScene() {
  const { progress } = useSceneProgress('finale');
  const { camera } = useThree();

  const startPos = useMemo(() => new THREE.Vector3(0, 0.4, 5.5), []);
  const endPos = useMemo(() => new THREE.Vector3(0, 0.05, 2.2), []);
  const lookTarget = useMemo(() => new THREE.Vector3(0, 0.15, 0), []);

  useFrame(() => {
    const t = progress;
    camera.position.lerpVectors(startPos, endPos, t);
    camera.lookAt(lookTarget);
  });

  return (
    <group>
      {/* Minimal ambient */}
      <ambientLight intensity={0.08} color={COLORS.BLACK_VOID} />

      {/* Dramatic spotlight from above */}
      <spotLight
        position={[0, 4, 0]}
        angle={0.45}
        penumbra={0.5}
        intensity={10}
        color="#fff8e0"
        distance={10}
        castShadow
      />

      {/* Warm front fill */}
      <pointLight position={[0, 0.3, 3]} intensity={1.2} color={COLORS.GOLDEN_ACCENT} distance={6} />

      {/* Haze/volumetric planes for god ray hints */}
      <mesh position={[0, -0.2, 1]} rotation={[-0.2, 0, 0]}>
        <planeGeometry args={[3, 3]} />
        <meshBasicMaterial color="#332200" transparent opacity={0.04} depthWrite={false} />
      </mesh>
      <mesh position={[0, -0.2, 1.5]} rotation={[0.1, 0, 0]}>
        <planeGeometry args={[2, 2.5]} />
        <meshBasicMaterial color="#221100" transparent opacity={0.03} depthWrite={false} />
      </mesh>

      <fog attach="fog" args={[COLORS.BLACK_VOID, 2, 9]} />

      {/* The Golden Power Tie */}
      <GoldenTie />

      {/* Pedestal */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.15, 20]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.4} />
      </mesh>
      <mesh position={[0, -0.68, 0]}>
        <cylinderGeometry args={[0.28, 0.22, 0.06, 20]} />
        <meshStandardMaterial color="#111111" roughness={0.3} metalness={0.5} />
      </mesh>
    </group>
  );
}
