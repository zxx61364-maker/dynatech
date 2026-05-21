'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Instances, Instance } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneProgress } from '@/hooks/useSceneProgress';
import { COLORS } from '@/lib/constants';

function DeskCluster({ x, z, rot }: { x: number; z: number; rot: number }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      {/* Desk */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <boxGeometry args={[1.3, 0.05, 0.75]} />
        <meshStandardMaterial color="#c4b898" roughness={0.7} metalness={0.03} />
      </mesh>
      {/* Desk legs */}
      <mesh position={[-0.55, 0.18, 0.3]}>
        <boxGeometry args={[0.04, 0.38, 0.04]} />
        <meshStandardMaterial color="#888" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0.55, 0.18, 0.3]}>
        <boxGeometry args={[0.04, 0.38, 0.04]} />
        <meshStandardMaterial color="#888" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[-0.55, 0.18, -0.3]}>
        <boxGeometry args={[0.04, 0.38, 0.04]} />
        <meshStandardMaterial color="#888" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0.55, 0.18, -0.3]}>
        <boxGeometry args={[0.04, 0.38, 0.04]} />
        <meshStandardMaterial color="#888" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Partition wall */}
      <mesh position={[-0.68, 0.75, 0]} castShadow>
        <boxGeometry args={[0.03, 0.8, 0.75]} />
        <meshStandardMaterial color="#c8c0b0" roughness={0.8} />
      </mesh>
      {/* Small CRT on desk */}
      <mesh position={[0.15, 0.6, -0.12]}>
        <boxGeometry args={[0.4, 0.32, 0.28]} />
        <meshStandardMaterial color={COLORS.OFFICE_BEIGE} roughness={0.6} metalness={0.04} />
      </mesh>
      <mesh position={[0.15, 0.6, 0.03]}>
        <planeGeometry args={[0.3, 0.22]} />
        <meshStandardMaterial color="#0a1a0a" emissive="#113311" emissiveIntensity={0.5} roughness={0.3} />
      </mesh>
      {/* Papers on desk */}
      <mesh position={[-0.25, 0.42, 0.15]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.22, 0.008, 0.3]} />
        <meshStandardMaterial color="#fafaf0" roughness={0.9} />
      </mesh>
      {/* Coffee mug */}
      <mesh position={[-0.4, 0.45, -0.15]}>
        <cylinderGeometry args={[0.06, 0.06, 0.1, 8]} />
        <meshStandardMaterial color="#e0d8c8" roughness={0.45} />
      </mesh>
    </group>
  );
}

export function OfficeScene() {
  const { progress } = useSceneProgress('office');
  const { camera } = useThree();

  const startPos = useMemo(() => new THREE.Vector3(0, 3.5, 6), []);
  const endPos = useMemo(() => new THREE.Vector3(0.3, 2.0, 2.5), []);
  const lookStart = useMemo(() => new THREE.Vector3(0, 1.0, -1.5), []);
  const lookEnd = useMemo(() => new THREE.Vector3(0.3, 1.0, -1.5), []);

  useFrame(() => {
    const t = progress;
    camera.position.lerpVectors(startPos, endPos, t);
    const lookTgt = new THREE.Vector3().lerpVectors(lookStart, lookEnd, t);
    camera.lookAt(lookTgt);
  });

  const desks = useMemo(() => {
    const arr: { x: number; z: number; rot: number }[] = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        arr.push({ x: (col - 1.5) * 1.8, z: row * -1.4, rot: 0 });
      }
    }
    return arr;
  }, []);

  return (
    <group>
      {/* Fluorescent ambience */}
      <ambientLight intensity={0.4} color={COLORS.FLUORESCENT} />

      {/* Overhead fluorescent panels */}
      {[-1.5, 0, 1.5].map((x) =>
        [-0.7, -2.1, -3.5].map((z) => (
          <group key={`fl-${x}-${z}`}>
            <pointLight position={[x, 3.2, z]} intensity={3.5} color="#e8f0e0" distance={5} />
            <mesh position={[x, 3.3, z]} rotation={[0, 0, 0]}>
              <planeGeometry args={[1.2, 0.08]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        )),
      )}

      {/* Floor — office carpet */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, -2.5]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#6b5e4a" roughness={0.95} />
      </mesh>

      {/* Desks */}
      {desks.map((d, i) => (
        <DeskCluster key={i} {...d} />
      ))}

      {/* Potted plant */}
      <mesh position={[3.2, 0.35, -4]}>
        <cylinderGeometry args={[0.18, 0.22, 0.55, 8]} />
        <meshStandardMaterial color="#4a3a2a" roughness={0.8} />
      </mesh>
      <mesh position={[3.2, 0.9, -4]}>
        <sphereGeometry args={[0.45, 8, 5]} />
        <meshStandardMaterial color="#3a5a2a" roughness={0.7} />
      </mesh>

      {/* Wall clock */}
      <mesh position={[-3.5, 2.0, -4.5]}>
        <circleGeometry args={[0.25, 16]} />
        <meshStandardMaterial color="#fafaf0" roughness={0.6} />
      </mesh>
      <Text
        position={[-3.5, 2.0, -4.45]}
        fontSize={0.08}
        color="#333"
        anchorX="center"
        anchorY="middle"
      >
        4:52 PM
      </Text>

      <fog attach="fog" args={[COLORS.FLUORESCENT, 4, 14]} />
    </group>
  );
}
