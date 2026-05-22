'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneProgress } from '@/hooks/useSceneProgress';
import { COLORS } from '@/lib/constants';

function CRTMonitor() {
  const groupRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  const ledRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const scanlineRef = useRef<THREE.Mesh>(null);

  const housingMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#d4c8a8', roughness: 0.55, metalness: 0.06 }),
    [],
  );
  const darkBezelMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#1a1a1c', roughness: 0.4, metalness: 0.12 }),
    [],
  );
  const ventMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#b8a888', roughness: 0.5, metalness: 0.1 }),
    [],
  );

  useFrame((_, delta) => {
    if (screenRef.current) {
      const mat = screenRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.5 + Math.sin(Date.now() * 0.006) * 0.06 + Math.random() * 0.02;
    }
    if (ledRef.current) {
      (ledRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.65 + Math.sin(Date.now() * 0.004) * 0.3;
    }
    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.06 + Math.sin(Date.now() * 0.005) * 0.025;
    }
  });

  return (
    <group ref={groupRef} position={[2.5, -0.2, 0]}>
      {/* === MONITOR HOUSING === */}
      {/* Main body — large rounded beige box */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <boxGeometry args={[3.6, 2.8, 0.75]} />
        <primitive object={housingMat} attach="material" />
      </mesh>

      {/* Housing side panels — slightly inset */}
      <mesh position={[1.82, 0.05, 0]}>
        <boxGeometry args={[0.04, 2.6, 0.55]} />
        <meshStandardMaterial color="#c0b090" roughness={0.6} metalness={0.05} />
      </mesh>
      <mesh position={[-1.82, 0.05, 0]}>
        <boxGeometry args={[0.04, 2.6, 0.55]} />
        <meshStandardMaterial color="#c0b090" roughness={0.6} metalness={0.05} />
      </mesh>

      {/* === SCREEN BEZEL (dark frame around screen) === */}
      <mesh position={[0, 0.05, 0.34]}>
        <boxGeometry args={[2.8, 2.15, 0.06]} />
        <primitive object={darkBezelMat} attach="material" />
      </mesh>

      {/* Inner bezel border — slightly lighter */}
      <mesh position={[0, 0.05, 0.38]}>
        <boxGeometry args={[2.6, 2.0, 0.02]} />
        <meshStandardMaterial color="#252528" roughness={0.35} metalness={0.1} />
      </mesh>

      {/* === SCREEN GLASS === */}
      <mesh ref={screenRef} position={[0, 0.05, 0.4]}>
        <planeGeometry args={[2.35, 1.8]} />
        <meshStandardMaterial
          color="#08082a"
          emissive="#14145a"
          emissiveIntensity={0.5}
          roughness={0.12}
          metalness={0.04}
        />
      </mesh>

      {/* Screen inner content glow */}
      <mesh position={[0, 0.05, 0.41]} ref={glowRef}>
        <planeGeometry args={[2.2, 1.65]} />
        <meshBasicMaterial
          color="#1a1a6e"
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Screen text — brand name inside CRT */}
      <Text
        position={[0, 0.25, 0.43]}
        fontSize={0.48}
        color="#f8f4e6"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
        font={undefined}
      >
        DYNATECH
      </Text>
      <Text
        position={[0, -0.15, 0.43]}
        fontSize={0.1}
        color="#f8f4e6"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
        fillOpacity={0.45}
        font={undefined}
      >
        ENTERPRISE SOLUTIONS v2.4
      </Text>

      {/* Fake scanlines on screen */}
      <mesh ref={scanlineRef} position={[0, 0.05, 0.42]}>
        <planeGeometry args={[2.3, 1.75]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.06} depthWrite={false} />
      </mesh>

      {/* === MANUFACTURER BADGE === */}
      <mesh position={[0, -1.15, 0.39]}>
        <boxGeometry args={[0.9, 0.08, 0.01]} />
        <meshStandardMaterial color="#b0a080" roughness={0.4} metalness={0.15} />
      </mesh>
      <Text
        position={[0, -1.15, 0.41]}
        fontSize={0.05}
        color="#666"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.08}
        font={undefined}
      >
        DYNATECH INDUSTRIES INC.
      </Text>

      {/* === LED INDICATORS === */}
      {/* Power LED */}
      <mesh ref={ledRef} position={[0.5, -1.3, 0.38]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#22cc22" emissive="#22cc22" emissiveIntensity={0.6} roughness={0.2} />
      </mesh>
      <Text position={[0.28, -1.3, 0.41]} fontSize={0.035} color="#777" anchorX="right" anchorY="middle" font={undefined}>
        POWER
      </Text>

      {/* HDD activity LED */}
      <mesh position={[-0.15, -1.3, 0.38]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={0.3} roughness={0.2} />
      </mesh>
      <Text position={[-0.35, -1.3, 0.41]} fontSize={0.035} color="#777" anchorX="right" anchorY="middle" font={undefined}>
        HDD
      </Text>

      {/* === FLOPPY DISK DRIVE === */}
      <mesh position={[0.85, -0.9, 0.39]}>
        <boxGeometry args={[0.26, 0.04, 0.03]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.25} metalness={0.1} />
      </mesh>
      {/* Floppy disk partially inserted */}
      <mesh position={[0.85, -0.88, 0.36]}>
        <boxGeometry args={[0.2, 0.01, 0.18]} />
        <meshStandardMaterial color="#222" roughness={0.5} />
      </mesh>

      {/* === VENTILATION GRILLE (top) === */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={`vent-top-${i}`} position={[-1.2 + i * 0.27, 1.4, 0.15]}>
          <boxGeometry args={[0.2, 0.03, 0.08]} />
          <primitive object={ventMat} attach="material" />
        </mesh>
      ))}

      {/* === VENTILATION GRILLE (side) === */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh key={`vent-side-${i}`} position={[1.78, -0.4 + i * 0.18, 0]}>
          <boxGeometry args={[0.06, 0.12, 0.06]} />
          <primitive object={ventMat} attach="material" />
        </mesh>
      ))}

      {/* === BASE / STAND === */}
      <mesh position={[0, -1.55, 0]} castShadow>
        <boxGeometry args={[1.8, 0.14, 0.65]} />
        <meshStandardMaterial color="#b8a080" roughness={0.55} metalness={0.08} />
      </mesh>

      {/* Base tilt-swivel ring */}
      <mesh position={[0, -1.48, 0]}>
        <cylinderGeometry args={[0.35, 0.38, 0.1, 20]} />
        <meshStandardMaterial color="#a09070" roughness={0.4} metalness={0.15} />
      </mesh>

      {/* Stand neck */}
      <mesh position={[0, -1.48, -0.05]}>
        <boxGeometry args={[0.35, 0.22, 0.3]} />
        <meshStandardMaterial color="#c0a880" roughness={0.5} metalness={0.08} />
      </mesh>

      {/* === POWER SWITCH (rocker) === */}
      <mesh position={[-1.6, -1.15, 0.38]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.12, 0.06, 0.02]} />
        <meshStandardMaterial color="#333" roughness={0.3} />
      </mesh>
      <Text position={[-1.82, -1.15, 0.41]} fontSize={0.03} color="#666" anchorX="right" anchorY="middle" font={undefined}>
        ON / OFF
      </Text>
    </group>
  );
}

export function HeroCRTScene() {
  const { progress } = useSceneProgress('hero');
  const { camera } = useThree();

  // Cinematic camera: starts wide left, pushes in toward the monitor
  const startPos = useMemo(() => new THREE.Vector3(-4.5, -0.5, 5.5), []);
  const endPos = useMemo(() => new THREE.Vector3(-1.0, 0.0, 3.2), []);
  const lookStart = useMemo(() => new THREE.Vector3(1.5, -0.3, 0), []);
  const lookEnd = useMemo(() => new THREE.Vector3(2.0, -0.15, 0), []);

  useFrame(() => {
    const t = progress;
    // Eased push-in
    const et = t < 0.3 ? t * 0.7 / 0.3 : 0.7 + (t - 0.3) * 0.3 / 0.7;
    camera.position.lerpVectors(startPos, endPos, et);
    const lookTgt = new THREE.Vector3().lerpVectors(lookStart, lookEnd, et);
    camera.lookAt(lookTgt);
  });

  return (
    <group>
      {/* Ambient — low blue, enough to reveal shapes */}
      <ambientLight intensity={0.3} color="#1a1a3a" />

      {/* Key light — warm tungsten, from above-right-front */}
      <spotLight
        position={[5, 3.5, 3]}
        angle={0.55}
        penumbra={0.4}
        intensity={4.5}
        color="#ffe4cc"
        distance={14}
        castShadow
      />

      {/* Rim light — cool blue from left-rear */}
      <pointLight position={[-5, 0.5, 1]} intensity={3} color={COLORS.CRT_GLOW_BLUE} distance={12} />

      {/* Screen bounce — blue glow spilling onto desk */}
      <pointLight position={[2.5, 0, 1.2]} intensity={2.5} color="#3030cc" distance={5} />

      {/* Subtle under-desk fill */}
      <pointLight position={[0, -1.8, 0.5]} intensity={0.5} color="#332200" distance={4} />

      {/* Fog for depth */}
      <fog attach="fog" args={[COLORS.BLACK_VOID, 2.5, 18]} />

      {/* The detailed CRT Monitor */}
      <CRTMonitor />

      {/* === DESK / SURFACE === */}
      <mesh position={[1.2, -1.65, -0.3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 4]} />
        <meshStandardMaterial color="#1a1a16" roughness={0.65} metalness={0.04} />
      </mesh>

      {/* Desk edge trim */}
      <mesh position={[3.0, -1.7, -0.3]} castShadow>
        <boxGeometry args={[7, 0.08, 0.15]} />
        <meshStandardMaterial color="#2a2a20" roughness={0.5} metalness={0.1} />
      </mesh>

      {/* === DESK PROPS === */}
      {/* Coffee mug */}
      <mesh position={[1.5, -1.48, -1.2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.16, 12]} />
        <meshStandardMaterial color="#e0d8c8" roughness={0.4} metalness={0.05} />
      </mesh>
      <mesh position={[1.65, -1.45, -1.2]}>
        <torusGeometry args={[0.12, 0.015, 8, 12]} />
        <meshStandardMaterial color="#e0d8c8" roughness={0.4} />
      </mesh>

      {/* Stack of floppy disks */}
      {[0, 0.015, 0.03].map((h, i) => (
        <mesh key={`floppy-${i}`} position={[-0.8, -1.60 + h, -1.0]} rotation={[0, 0.1, 0]}>
          <boxGeometry args={[0.22, 0.008, 0.22]} />
          <meshStandardMaterial color={['#444', '#333', '#383838'][i]} roughness={0.5} />
        </mesh>
      ))}

      {/* === ATMOSPHERIC HAZE PARTICLES === */}
      {Array.from({ length: 40 }).map((_, i) => (
        <mesh
          key={`haze-${i}`}
          position={[
            (Math.random() - 0.3) * 10,
            (Math.random() - 0.4) * 5,
            (Math.random() - 0.5) * 8 - 1,
          ]}
        >
          <sphereGeometry args={[0.02 + Math.random() * 0.09, 4, 4]} />
          <meshBasicMaterial
            color={i % 4 === 0 ? COLORS.CRT_GLOW_BLUE : '#333355'}
            transparent
            opacity={0.03 + Math.random() * 0.07}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Dark floor plane */}
      <mesh position={[0, -2.0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color={COLORS.BLACK_VOID} roughness={1} transparent opacity={0.3} depthWrite={false} />
      </mesh>
    </group>
  );
}
