'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneProgress } from '@/hooks/useSceneProgress';
import { COLORS } from '@/lib/constants';

function SettlingParticle({ idx, total, progress }: { idx: number; total: number; progress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const data = useMemo(() => {
    const angle = (idx / total) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const dist = 2.5 + Math.random() * 3.5;
    return {
      startX: Math.cos(angle) * dist,
      startY: (Math.random() - 0.3) * 3.5,
      startZ: (Math.random() - 0.5) * 2,
      size: 0.012 + Math.random() * 0.035,
      settleDelay: Math.random() * 0.3,
    };
  }, [idx, total]);

  useFrame(() => {
    if (!meshRef.current) return;
    const t = Math.max(0, Math.min(1, (progress - data.settleDelay) / (1 - data.settleDelay)));
    const ease = 1 - Math.pow(1 - t, 3);
    meshRef.current.position.x = data.startX * (1 - ease);
    meshRef.current.position.y = 0.15 + data.startY * (1 - ease);
    meshRef.current.position.z = data.startZ * (1 - ease);
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.02 + t * 0.45 * (1 - t * 0.5);
  });

  return (
    <mesh ref={meshRef} position={[data.startX, data.startY, data.startZ]}>
      <sphereGeometry args={[data.size, 4, 4]} />
      <meshBasicMaterial color={COLORS.GOLDEN_ACCENT} transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

function GoldenTieRelic({ progress }: { progress: number }) {
  const tieRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (tieRef.current) {
      tieRef.current.rotation.y += delta * 0.15;
      tieRef.current.position.y = 0.2 + Math.sin(Date.now() * 0.0008) * 0.03;
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.05 + progress * 0.18 + Math.sin(Date.now() * 0.002) * 0.03;
    }
  });

  const goldMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: COLORS.GOLDEN_ACCENT, roughness: 0.08, metalness: 0.99 }),
    [],
  );
  const goldBright = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#e8d040', roughness: 0.06, metalness: 1.0 }),
    [],
  );

  return (
    <group ref={tieRef} position={[0, 0.2, 0]}>
      {/* Tie knot */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[0.24, 0.18, 0.14]} />
        <primitive object={goldMat} attach="material" />
      </mesh>
      <mesh position={[0, 0.63, 0]}>
        <boxGeometry args={[0.15, 0.04, 0.15]} />
        <primitive object={goldBright} attach="material" />
      </mesh>

      {/* Tie body */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.05, 0.9, 16, 1]} />
        <primitive object={goldMat} attach="material" />
      </mesh>

      {/* Highlight strip */}
      <mesh position={[0, 0.1, 0.09]}>
        <boxGeometry args={[0.03, 0.55, 0.01]} />
        <primitive object={goldBright} attach="material" />
      </mesh>

      {/* Tie tip */}
      <mesh position={[0, -0.42, 0]}>
        <coneGeometry args={[0.05, 0.14, 16]} />
        <primitive object={goldMat} attach="material" />
      </mesh>

      {/* Collar ring */}
      <mesh position={[0, 0.55, 0]}>
        <torusGeometry args={[0.16, 0.035, 10, 24]} />
        <meshStandardMaterial color="#e0d080" roughness={0.12} metalness={0.97} />
      </mesh>

      {/* Floor glow — intensifies dramatically */}
      <mesh ref={glowRef} position={[0, -0.72, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.6, 1.6]} />
        <meshBasicMaterial color={COLORS.GOLDEN_ACCENT} transparent opacity={0.05} depthWrite={false} />
      </mesh>
    </group>
  );
}

export function FinaleScene() {
  const { progress } = useSceneProgress('finale');
  const { camera } = useThree();

  const startPos = useMemo(() => new THREE.Vector3(0, 1.2, 5.0), []);
  const endPos = useMemo(() => new THREE.Vector3(0, 0.15, 2.0), []);
  const lookTarget = useMemo(() => new THREE.Vector3(0, 0.2, 0), []);

  useFrame(() => {
    const t = progress < 0.2 ? progress * 0.3 / 0.2 : 0.3 + (progress - 0.2) * 0.7 / 0.8;
    camera.position.lerpVectors(startPos, endPos, Math.min(1, t));
    camera.lookAt(lookTarget);
  });

  const PARTICLE_COUNT = 25;

  return (
    <group>
      <ambientLight intensity={0.03} color={COLORS.BLACK_VOID} />

      {/* Main dramatic spotlight — tightens as we arrive */}
      <spotLight
        position={[0, 5.5, 0.5]}
        angle={0.35 - progress * 0.12}
        penumbra={0.3 + progress * 0.4}
        intensity={6 + progress * 12}
        color="#fff8e0"
        distance={14}
        castShadow
      />

      {/* Front gold fill — intensifies */}
      <pointLight position={[0, 0.3, 3.5]} intensity={1 + progress * 3} color={COLORS.GOLDEN_ACCENT} distance={8} />

      {/* Back rim */}
      <pointLight position={[0, 0.5, -2]} intensity={2 + progress * 2} color="#c08020" distance={7} />

      {/* Side warmth */}
      <pointLight position={[3, 0.1, 0]} intensity={0.3 + progress * 0.5} color="#331800" distance={6} />
      <pointLight position={[-3, 0.1, 0]} intensity={0.3 + progress * 0.5} color="#331800" distance={6} />

      {/* Stage floor */}
      <mesh position={[0, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#080808" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Light pool on floor — tightens */}
      <mesh position={[0, -0.69, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2 - progress * 0.3, 48]} />
        <meshBasicMaterial color="#1a1000" transparent opacity={0.08 + progress * 0.1} depthWrite={false} />
      </mesh>

      {/* Pedestal */}
      <mesh position={[0, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.26, 0.06, 32]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.6} />
      </mesh>
      <mesh position={[0, -0.57, 0]}>
        <cylinderGeometry args={[0.08, 0.14, 0.2, 20]} />
        <meshStandardMaterial color="#181818" roughness={0.25} metalness={0.55} />
      </mesh>
      <mesh position={[0, -0.65, 0]}>
        <cylinderGeometry args={[0.28, 0.3, 0.06, 32]} />
        <meshStandardMaterial color="#141414" roughness={0.2} metalness={0.6} />
      </mesh>

      {/* God ray planes — fade in */}
      <mesh position={[0, 0.1, 1.5]} rotation={[-0.25, 0, 0]}>
        <planeGeometry args={[2.5, 3.5]} />
        <meshBasicMaterial color="#221100" transparent opacity={0.01 + progress * 0.03} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.3, 1.0]} rotation={[0.08, 0, 0]}>
        <planeGeometry args={[2, 3]} />
        <meshBasicMaterial color="#110800" transparent opacity={0.01 + progress * 0.02} depthWrite={false} />
      </mesh>

      {/* Settling particles — converge to center from periphery */}
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <SettlingParticle key={`sp-${i}`} idx={i} total={PARTICLE_COUNT} progress={progress} />
      ))}

      {/* Light haze */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh
          key={`haze-${i}`}
          position={[
            (Math.random() - 0.5) * 2 * (1 - progress * 0.7),
            (Math.random() - 0.2) * 2 + 0.5,
            (Math.random() - 0.5) * 2,
          ]}
        >
          <sphereGeometry args={[0.02 + Math.random() * 0.05, 4, 4]} />
          <meshBasicMaterial
            color="#c8a040"
            transparent
            opacity={0.015 + Math.random() * 0.03}
            depthWrite={false}
          />
        </mesh>
      ))}

      <fog attach="fog" args={[COLORS.BLACK_VOID, 1.0, 10 - progress * 2]} />

      <GoldenTieRelic progress={progress} />
    </group>
  );
}
