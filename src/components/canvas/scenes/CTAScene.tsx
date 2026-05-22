'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneProgress } from '@/hooks/useSceneProgress';
import { COLORS } from '@/lib/constants';

function ConvergingParticle({ idx, total, progress }: { idx: number; total: number; progress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const data = useMemo(() => {
    const angle = (idx / total) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
    const radius = 3.5 + Math.random() * 2.5;
    return {
      startX: Math.cos(angle) * radius,
      startY: (Math.random() - 0.3) * 3.5,
      startZ: (Math.random() - 0.5) * 2 - 0.3,
      speed: 0.6 + Math.random() * 0.9,
      size: 0.015 + Math.random() * 0.04,
      hue: Math.random() > 0.5 ? COLORS.GOLDEN_ACCENT : '#e8d080',
    };
  }, [idx, total]);

  useFrame(() => {
    if (!meshRef.current) return;
    // retreat: progress > 0.85 → fade out
    const retreat = progress > 0.85 ? (progress - 0.85) / 0.15 : 0;
    const converge = Math.min(progress, 0.85) * data.speed;
    meshRef.current.position.x = data.startX * (1 - converge);
    meshRef.current.position.y = data.startY * (1 - converge * 0.9);
    meshRef.current.position.z = data.startZ * (1 - converge * 0.7);
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = (0.02 + Math.min(progress, 0.85) * 0.35) * (1 - retreat);
  });

  return (
    <mesh ref={meshRef} position={[data.startX, data.startY, data.startZ]}>
      <sphereGeometry args={[data.size, 4, 4]} />
      <meshBasicMaterial color={data.hue} transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

function GoldenFrameRing({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const retreat = progress > 0.85 ? (progress - 0.85) / 0.15 : 0;
    const t = Math.min(progress, 0.85);
    const scale = 1.8 - t * 1.4;
    groupRef.current.scale.setScalar(Math.max(0.25, scale) * (1 - retreat * 0.7));
    groupRef.current.position.z = -0.3 + t * 0.1;
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[0.2, 0, 0]}>
        <torusGeometry args={[1.6, 0.012, 16, 80]} />
        <meshStandardMaterial
          color={COLORS.GOLDEN_ACCENT}
          roughness={0.1}
          metalness={0.95}
          transparent
          opacity={1}
        />
      </mesh>
      <mesh rotation={[-0.15, 0, Math.PI / 3]}>
        <torusGeometry args={[1.1, 0.008, 12, 60]} />
        <meshStandardMaterial
          color="#e8d040"
          roughness={0.05}
          metalness={1.0}
          transparent
          opacity={1}
        />
      </mesh>
      <mesh rotation={[0.3, Math.PI / 4, 0]}>
        <torusGeometry args={[1.35, 0.004, 8, 60]} />
        <meshBasicMaterial color={COLORS.GOLDEN_ACCENT} transparent opacity={0.3} depthWrite={false} />
      </mesh>
    </group>
  );
}

export function CTAScene() {
  const { progress } = useSceneProgress('cta');
  const { camera } = useThree();
  const coreGlowRef = useRef<THREE.Mesh>(null);

  const startPos = useMemo(() => new THREE.Vector3(0, 0.6, 6.5), []);
  const endPos = useMemo(() => new THREE.Vector3(0, 0.05, 2.2), []);
  const lookTarget = useMemo(() => new THREE.Vector3(0, 0.0, 0), []);

  useFrame(() => {
    const t = progress * progress;
    camera.position.lerpVectors(startPos, endPos, t);
    camera.lookAt(lookTarget);
    if (coreGlowRef.current) {
      const retreat = progress > 0.85 ? (progress - 0.85) / 0.15 : 0;
      const mat = coreGlowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = (0.04 + Math.min(progress, 0.85) * 0.25 + Math.sin(Date.now() * 0.004) * 0.03)
        * (1 - retreat);
    }
  });

  const retreat = progress > 0.85 ? (progress - 0.85) / 0.15 : 0;
  const activePhase = 1 - retreat;

  const PARTICLE_COUNT = 30;

  return (
    <group>
      {/* Ambient dims during retreat */}
      <ambientLight intensity={0.06 * activePhase} color="#080402" />

      {/* Central spotlight — narrows, then dims in retreat */}
      <spotLight
        position={[0, 3.5, 1.5]}
        angle={0.55 - Math.min(progress, 0.85) * 0.35}
        penumbra={0.3 + Math.min(progress, 0.85) * 0.5}
        intensity={(3 + Math.min(progress, 0.85) * 8) * activePhase}
        color="#fff8e0"
        distance={10}
      />

      {/* Rim lights — dim in retreat */}
      <pointLight position={[-2.5, 0.3, 0.5]} intensity={(1 + Math.min(progress, 0.85) * 1.5) * activePhase} color={COLORS.GOLDEN_ACCENT} distance={7} />
      <pointLight position={[2.5, 0.3, 0.5]} intensity={(1 + Math.min(progress, 0.85) * 1.5) * activePhase} color={COLORS.GOLDEN_ACCENT} distance={7} />

      {/* Backdrop */}
      <mesh position={[0, -0.05, -0.6]}>
        <planeGeometry args={[14, 16]} />
        <meshStandardMaterial color="#040201" roughness={1} />
      </mesh>

      {/* Floor */}
      <mesh position={[0, -2.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 14]} />
        <meshStandardMaterial color="#040201" roughness={1} />
      </mesh>

      {/* Core glow — dims in retreat */}
      <mesh ref={coreGlowRef} position={[0, 0.0, -0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5 + Math.min(progress, 0.85) * 0.4, 48]} />
        <meshBasicMaterial color={COLORS.GOLDEN_ACCENT} transparent opacity={0.04} depthWrite={false} />
      </mesh>

      {/* Golden frame rings */}
      {progress < 0.92 && <GoldenFrameRing progress={progress} />}

      {/* Converging particles */}
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <ConvergingParticle key={`cp-${i}`} idx={i} total={PARTICLE_COUNT} progress={progress} />
      ))}

      <fog attach="fog" args={['#040201', 1.5 - Math.min(progress, 0.85) * 0.8, 10 - Math.min(progress, 0.85) * 3 + retreat * 4]} />
    </group>
  );
}
