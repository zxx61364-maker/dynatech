'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneProgress } from '@/hooks/useSceneProgress';
import { COLORS } from '@/lib/constants';

function DeskCluster({ x, z, rot }: { x: number; z: number; rot: number }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      {/* Desk surface */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <boxGeometry args={[1.3, 0.05, 0.75]} />
        <meshStandardMaterial color="#c4b898" roughness={0.7} metalness={0.03} />
      </mesh>

      {/* Desk legs */}
      {[[-0.55, 0.3], [0.55, 0.3], [-0.55, -0.3], [0.55, -0.3]].map(([lx, lz], i) => (
        <mesh key={`leg-${i}`} position={[lx, 0.18, lz]}>
          <boxGeometry args={[0.04, 0.38, 0.04]} />
          <meshStandardMaterial color="#777" roughness={0.5} metalness={0.35} />
        </mesh>
      ))}

      {/* Partition wall */}
      <mesh position={[-0.68, 0.75, 0]} castShadow>
        <boxGeometry args={[0.03, 0.8, 0.75]} />
        <meshStandardMaterial color="#c8c0b0" roughness={0.8} />
      </mesh>

      {/* Small CRT monitor */}
      <mesh position={[0.15, 0.6, -0.12]}>
        <boxGeometry args={[0.4, 0.32, 0.28]} />
        <meshStandardMaterial color={COLORS.OFFICE_BEIGE} roughness={0.6} metalness={0.04} />
      </mesh>
      <mesh position={[0.15, 0.6, 0.03]}>
        <planeGeometry args={[0.3, 0.22]} />
        <meshStandardMaterial color="#0a1a0a" emissive="#113311" emissiveIntensity={0.6} roughness={0.3} />
      </mesh>

      {/* Keyboard */}
      <mesh position={[0.2, 0.42, 0.12]}>
        <boxGeometry args={[0.3, 0.02, 0.1]} />
        <meshStandardMaterial color="#d0c8b8" roughness={0.7} />
      </mesh>

      {/* Papers */}
      <mesh position={[-0.25, 0.42, 0.15]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.22, 0.008, 0.3]} />
        <meshStandardMaterial color="#fafaf0" roughness={0.9} />
      </mesh>

      {/* Coffee mug */}
      <mesh position={[-0.4, 0.45, -0.15]}>
        <cylinderGeometry args={[0.06, 0.06, 0.1, 8]} />
        <meshStandardMaterial color="#e0d8c8" roughness={0.45} />
      </mesh>
      <mesh position={[-0.33, 0.48, -0.15]}>
        <torusGeometry args={[0.07, 0.01, 6, 8]} />
        <meshStandardMaterial color="#e0d8c8" roughness={0.4} />
      </mesh>

      {/* Desk nameplate */}
      <mesh position={[0.15, 0.42, -0.3]}>
        <boxGeometry args={[0.2, 0.008, 0.04]} />
        <meshStandardMaterial color="#888" roughness={0.3} metalness={0.5} />
      </mesh>
    </group>
  );
}

export function OfficeScene() {
  const { progress } = useSceneProgress('office');
  const { camera } = useThree();

  // Camera pans through the office floor — from an establishing high shot to a corridor-level view
  const startPos = useMemo(() => new THREE.Vector3(0, 3.5, 7), []);
  const endPos = useMemo(() => new THREE.Vector3(0.5, 1.8, 2.0), []);
  const lookStart = useMemo(() => new THREE.Vector3(0, 1.0, -2), []);
  const lookEnd = useMemo(() => new THREE.Vector3(0.3, 0.8, -2.5), []);

  useFrame(() => {
    const t = progress;
    camera.position.lerpVectors(startPos, endPos, t);
    const lookTgt = new THREE.Vector3().lerpVectors(lookStart, lookEnd, t);
    camera.lookAt(lookTgt);
  });

  const desks = useMemo(() => {
    const arr: { x: number; z: number; rot: number }[] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        arr.push({ x: (col - 1) * 2.0, z: row * -1.6, rot: 0 });
      }
    }
    return arr;
  }, []);

  return (
    <group>
      {/* Fluorescent ambiance */}
      <ambientLight intensity={0.45} color={COLORS.FLUORESCENT} />

      {/* Overhead fluorescent panel lights */}
      {[-1.5, 0, 1.5].map((x) =>
        [-0.7, -2.2, -3.7].map((z, i) => (
          <group key={`fl-${x}-${z}`}>
            <pointLight position={[x, 3.2, z]} intensity={4 + (i % 2) * 1.5} color="#e8f0e0" distance={5.5} />
            <mesh position={[x, 3.3, z]}>
              <planeGeometry args={[1.2, 0.08]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        )),
      )}

      {/* Additional corridor light */}
      <pointLight position={[0, 2.8, -3]} intensity={2} color="#e8f0e0" distance={6} />

      {/* Floor — office carpet */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, -2.8]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#6b5e4a" roughness={0.95} />
      </mesh>

      {/* Desks grid */}
      {desks.map((d, i) => (
        <DeskCluster key={i} {...d} />
      ))}

      {/* Focal corridor — a clear path down the middle */}
      {/* Floor runner/carpet strip */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, -2.8]}>
        <planeGeometry args={[1.5, 8]} />
        <meshStandardMaterial color="#5a4e3a" roughness={0.9} />
      </mesh>

      {/* Potted plant at far end */}
      <mesh position={[3.0, 0.35, -5]}>
        <cylinderGeometry args={[0.18, 0.22, 0.55, 8]} />
        <meshStandardMaterial color="#4a3a2a" roughness={0.8} />
      </mesh>
      <mesh position={[3.0, 0.9, -5]}>
        <sphereGeometry args={[0.5, 8, 5]} />
        <meshStandardMaterial color="#3a5a2a" roughness={0.7} />
      </mesh>

      {/* Water cooler */}
      <mesh position={[-3.5, 0.3, -3]}>
        <cylinderGeometry args={[0.15, 0.2, 0.8, 12]} />
        <meshStandardMaterial color="#d0d8e0" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[-3.5, 0.75, -3]}>
        <cylinderGeometry args={[0.18, 0.15, 0.3, 12]} />
        <meshStandardMaterial color="#e8eef4" roughness={0.2} transparent opacity={0.5} />
      </mesh>

      {/* Wall clock */}
      <mesh position={[-4.0, 2.0, -5.0]}>
        <circleGeometry args={[0.28, 16]} />
        <meshStandardMaterial color="#fafaf0" roughness={0.6} />
      </mesh>
      <mesh position={[-4.0, 2.0, -4.97]}>
        <circleGeometry args={[0.25, 16]} />
        <meshStandardMaterial color="#f4f4ec" roughness={0.5} />
      </mesh>
      {/* Clock hands */}
      <mesh position={[-4.0, 2.06, -4.96]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.005, 0.12, 0.005]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[-4.0, 1.93, -4.96]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.004, 0.16, 0.004]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      {/* Dust particles in fluorescent light */}
      {Array.from({ length: 25 }).map((_, i) => (
        <mesh
          key={`office-dust-${i}`}
          position={[
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.3) * 4 + 1,
            (Math.random() - 0.5) * 8 - 3,
          ]}
        >
          <sphereGeometry args={[0.01 + Math.random() * 0.03, 4, 4]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.02 + Math.random() * 0.04}
            depthWrite={false}
          />
        </mesh>
      ))}

      <fog attach="fog" args={[COLORS.FLUORESCENT, 3, 15]} />
    </group>
  );
}
