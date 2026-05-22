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

  const startPos = useMemo(() => new THREE.Vector3(0, 0.7, 7.0), []);
  const endPos = useMemo(() => new THREE.Vector3(0, 0.15, 4.2), []);
  const lookTarget = useMemo(() => new THREE.Vector3(0, -0.05, 0), []);

  useFrame(() => {
    const t = progress * progress;
    camera.position.lerpVectors(startPos, endPos, t);
    camera.lookAt(lookTarget);
  });

  return (
    <group ref={groupRef}>
      {/* Brighter ambient — well-lit reading room */}
      <ambientLight intensity={0.9} color="#4a3028" />

      {/* Main warm desk lamp from above-left — much stronger */}
      <spotLight
        position={[-3, 3.5, 5]}
        angle={0.65}
        penumbra={0.45}
        intensity={12}
        color="#fff4e4"
        distance={14}
        castShadow
      />

      {/* Warm fill from right */}
      <pointLight position={[3, 0.3, 2.5]} intensity={3.0} color="#d4b090" distance={9} />

      {/* Bottom accent for desk separation */}
      <pointLight position={[0, -1.2, 3]} intensity={1.2} color="#5a3a20" distance={8} />

      {/* === DESK SURFACE — warm wood, visible grain === */}
      <mesh position={[0, -0.85, 0]} rotation={[-0.02, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 18]} />
        <meshStandardMaterial color="#3a2818" roughness={0.8} metalness={0.02} />
      </mesh>

      {/* === DESK FRONT EDGE — spatial depth marker === */}
      <mesh position={[0, -0.87, -6.5]} receiveShadow>
        <boxGeometry args={[14, 0.16, 0.4]} />
        <meshStandardMaterial color="#2a1a10" roughness={0.65} metalness={0.05} />
      </mesh>

      {/* === DESK GROOVE LINE — visual separation === */}
      <mesh position={[0, -0.77, -0.1]}>
        <boxGeometry args={[10, 0.005, 0.005]} />
        <meshBasicMaterial color="#3a2820" transparent opacity={0.3} />
      </mesh>

      {/* === PAPER SHEET — bright, clearly visible document === */}
      <mesh position={[0, -0.05, 0.03]} rotation={[0.005, 0.005, 0.003]}>
        <planeGeometry args={[6.5, 8.5]} />
        <meshStandardMaterial
          color="#fdf9f0"
          roughness={0.4}
          metalness={0}
          transparent
          opacity={0.55}
        />
      </mesh>

      {/* Paper drop shadow — more defined */}
      <mesh position={[0.05, -0.08, 0.01]}>
        <planeGeometry args={[6.8, 8.8]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.14} depthWrite={false} />
      </mesh>

      {/* === DESK PROPS === */}
      {/* Gold fountain pen */}
      <mesh position={[2.3, 0.0, -2.5]} rotation={[0, 0, 0.35]}>
        <cylinderGeometry args={[0.025, 0.025, 0.6, 8]} />
        <meshStandardMaterial color={COLORS.GOLDEN_ACCENT} roughness={0.15} metalness={0.96} />
      </mesh>

      {/* Red wax seal stamp */}
      <mesh position={[-2.3, -0.03, -2.3]} rotation={[0, 0, 0.1]}>
        <cylinderGeometry args={[0.14, 0.14, 0.04, 20]} />
        <meshStandardMaterial color={COLORS.RED_ACCENT} roughness={0.25} metalness={0.15} />
      </mesh>
      <mesh position={[-2.3, 0.0, -2.3]}>
        <cylinderGeometry args={[0.06, 0.08, 0.1, 12]} />
        <meshStandardMaterial color="#8a6642" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Brass paperweight */}
      <mesh position={[2.1, -0.01, 1.8]}>
        <cylinderGeometry args={[0.12, 0.15, 0.07, 20]} />
        <meshStandardMaterial color="#4a3a2a" roughness={0.25} metalness={0.7} />
      </mesh>

      {/* === DUST MOTES === */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh
          key={`mote-${i}`}
          position={[
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.2) * 3 + 0.6,
            (Math.random() - 0.5) * 3 - 0.5,
          ]}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
        >
          <planeGeometry args={[0.05 + Math.random() * 0.08, 0.03 + Math.random() * 0.06]} />
          <meshBasicMaterial
            color="#fff8e8"
            transparent
            opacity={0.02 + Math.random() * 0.03}
            depthWrite={false}
          />
        </mesh>
      ))}

      <fog attach="fog" args={['#2a1c14', 6.0, 28]} />
    </group>
  );
}
