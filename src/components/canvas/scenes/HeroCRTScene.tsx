'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneProgress } from '@/hooks/useSceneProgress';
import { COLORS } from '@/lib/constants';

function DetailedCRT() {
  const groupRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  const ledRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (screenRef.current) {
      const mat = screenRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.55 + Math.sin(Date.now() * 0.007) * 0.04 + Math.random() * 0.015;
    }
    if (ledRef.current) {
      (ledRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.7 + Math.sin(Date.now() * 0.003) * 0.3;
    }
    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.08 + Math.sin(Date.now() * 0.005) * 0.02;
    }
  });

  const beigeMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: COLORS.OFFICE_BEIGE, roughness: 0.65, metalness: 0.05 }),
    [],
  );
  const darkPlastic = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.5, metalness: 0.1 }),
    [],
  );

  return (
    <group ref={groupRef} position={[1.2, 0.1, 0]}>
      {/* Main housing — rounded beige box */}
      <mesh castShadow>
        <boxGeometry args={[3.2, 2.5, 0.7]} />
        <primitive object={beigeMat} attach="material" />
      </mesh>

      {/* Dark inner bezel */}
      <mesh position={[0, 0, 0.32]}>
        <boxGeometry args={[2.5, 1.95, 0.06]} />
        <primitive object={darkPlastic} attach="material" />
      </mesh>

      {/* Screen glass — curved impression via slightly smaller geometry */}
      <mesh ref={screenRef} position={[0, 0, 0.37]}>
        <planeGeometry args={[2.3, 1.75]} />
        <meshStandardMaterial
          color="#08082a"
          emissive="#14145a"
          emissiveIntensity={0.55}
          roughness={0.15}
          metalness={0.05}
        />
      </mesh>

      {/* Screen glow halo */}
      <mesh ref={glowRef} position={[0, 0, 0.36]}>
        <planeGeometry args={[2.5, 1.95]} />
        <meshBasicMaterial
          color={COLORS.CRT_GLOW_BLUE}
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Screen text */}
      <Text
        position={[0, 0.2, 0.39]}
        fontSize={0.42}
        color={COLORS.TEXT_WARM_WHITE}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
       
      >
        DYNATECH
      </Text>

      <Text
        position={[0, -0.25, 0.39]}
        fontSize={0.09}
        color="rgba(248,244,230,0.5)"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
       
      >
        BUSINESS SOLUTIONS
      </Text>

      {/* LED indicator */}
      <mesh ref={ledRef} position={[0.9, -1.15, 0.37]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color="#ff3300" emissive="#ff3300" emissiveIntensity={0.7} roughness={0.2} />
      </mesh>

      {/* LED label */}
      <Text
        position={[0.65, -1.15, 0.39]}
        fontSize={0.04}
        color="#666666"
        anchorX="right"
        anchorY="middle"
       
      >
        POWER
      </Text>

      {/* Top ventilation ridges */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`vent-${i}`} position={[-1.0 + i * 0.28, 1.26, 0.1]}>
          <boxGeometry args={[0.2, 0.04, 0.06]} />
          <meshStandardMaterial color="#b0a080" roughness={0.5} metalness={0.1} />
        </mesh>
      ))}

      {/* Base stand */}
      <mesh position={[0, -1.4, 0]} castShadow>
        <boxGeometry args={[1.4, 0.12, 0.5]} />
        <primitive object={beigeMat} attach="material" />
      </mesh>

      {/* Neck connecting base to monitor */}
      <mesh position={[0, -1.3, -0.1]}>
        <boxGeometry args={[0.3, 0.18, 0.3]} />
        <primitive object={beigeMat} attach="material" />
      </mesh>

      {/* Floppy disk drive slot */}
      <mesh position={[0.6, -1.0, 0.37]}>
        <boxGeometry args={[0.25, 0.03, 0.02]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.3} />
      </mesh>
    </group>
  );
}

export function HeroCRTScene() {
  const { progress } = useSceneProgress('hero');
  const { camera } = useThree();

  const startPos = useMemo(() => new THREE.Vector3(-3.5, -0.8, 4.5), []);
  const endPos = useMemo(() => new THREE.Vector3(-1.2, 0.1, 2.3), []);
  const lookTarget = useMemo(() => new THREE.Vector3(1.2, 0, 0), []);

  useFrame(() => {
    camera.position.lerpVectors(startPos, endPos, progress);
    camera.lookAt(lookTarget);
  });

  return (
    <group>
      {/* Deep blue ambient */}
      <ambientLight intensity={0.25} color={COLORS.CRT_GLOW_BLUE} />

      {/* Key light — warm, from above-right */}
      <spotLight
        position={[4, 3, 3]}
        angle={0.6}
        penumbra={0.5}
        intensity={3}
        color="#ffe8d0"
        distance={12}
        castShadow
      />

      {/* Blue rim light from left */}
      <pointLight position={[-4, 0, 1]} intensity={2} color={COLORS.CRT_GLOW_BLUE} distance={10} />

      {/* Screen bounce light — blue glow on the desk */}
      <pointLight position={[1.2, 0, 0.5]} intensity={1.5} color="#2222aa" distance={4} />

      {/* Fog for depth and atmosphere */}
      <fog attach="fog" args={[COLORS.BLACK_VOID, 2.5, 16]} />

      {/* The CRT Monitor */}
      <DetailedCRT />

      {/* Desk surface under monitor */}
      <mesh position={[0, -1.55, -0.3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 3]} />
        <meshStandardMaterial color="#1a1a18" roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Smoke/haze particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <mesh
          key={`haze-${i}`}
          position={[
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 6 - 2,
          ]}
        >
          <sphereGeometry args={[0.03 + Math.random() * 0.08, 4, 4]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? COLORS.CRT_GLOW_BLUE : '#444466'}
            transparent
            opacity={0.04 + Math.random() * 0.06}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Subtle floor reflection */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color={COLORS.BLACK_VOID}
          roughness={1}
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
