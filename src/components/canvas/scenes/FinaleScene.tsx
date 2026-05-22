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
      // Slow rotation at end for final-frame settle
      const settleSlow = progress > 0.85 ? 1 - (progress - 0.85) / 0.15 * 0.7 : 1;
      tieRef.current.rotation.y += delta * 0.15 * settleSlow;
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

      {/* Main dramatic spotlight — tightens as we arrive, strong reveal */}
      <spotLight
        position={[0, 6, 0.5]}
        angle={0.4 - progress * 0.15}
        penumbra={0.25 + progress * 0.55}
        intensity={5 + progress * 16}
        color="#fffaf0"
        distance={14}
        castShadow
      />

      {/* Front gold fill — intensifies */}
      <pointLight position={[0, 0.3, 3.5]} intensity={1 + progress * 4} color={COLORS.GOLDEN_ACCENT} distance={8} />

      {/* Back rim — stronger for silhouette */}
      <pointLight position={[0, 0.5, -2]} intensity={2.5 + progress * 2.5} color="#c08020" distance={7} />

      {/* Side rim catches on the tie edges */}
      <pointLight position={[1.5, 0.3, 0.5]} intensity={0.3 + progress * 0.8} color="#ffe8d0" distance={4} />
      <pointLight position={[-1.5, 0.3, 0.5]} intensity={0.3 + progress * 0.8} color="#ffe8d0" distance={4} />

      {/* Side warmth */}
      <pointLight position={[3, 0.1, 0]} intensity={0.3 + progress * 0.5} color="#331800" distance={6} />
      <pointLight position={[-3, 0.1, 0]} intensity={0.3 + progress * 0.5} color="#331800" distance={6} />

      {/* Stage floor */}
      <mesh position={[0, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#080808" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Light pool on floor — widens slightly then tightens */}
      <mesh position={[0, -0.71, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.0 - progress * 0.2, 48]} />
        <meshBasicMaterial color="#1a1000" transparent opacity={0.06 + progress * 0.12} depthWrite={false} />
      </mesh>

      {/* Pedestal — 4-tier for gallery presence */}
      <mesh position={[0, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.28, 0.06, 32]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.15} metalness={0.65} />
      </mesh>
      <mesh position={[0, -0.56, 0]}>
        <cylinderGeometry args={[0.1, 0.16, 0.18, 20]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.2} metalness={0.6} />
      </mesh>
      <mesh position={[0, -0.64, 0]}>
        <cylinderGeometry args={[0.3, 0.32, 0.06, 32]} />
        <meshStandardMaterial color="#161616" roughness={0.15} metalness={0.65} />
      </mesh>
      {/* Widest base step */}
      <mesh position={[0, -0.69, 0]}>
        <cylinderGeometry args={[0.38, 0.4, 0.04, 32]} />
        <meshStandardMaterial color="#121212" roughness={0.12} metalness={0.7} />
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

      {/* Light haze — reduced, subtle */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh
          key={`haze-${i}`}
          position={[
            (Math.random() - 0.5) * 1.5 * (1 - progress * 0.7),
            (Math.random() - 0.15) * 1.5 + 0.6,
            (Math.random() - 0.5) * 1.5,
          ]}
        >
          <sphereGeometry args={[0.02 + Math.random() * 0.04, 4, 4]} />
          <meshBasicMaterial
            color="#c8a040"
            transparent
            opacity={0.01 + Math.random() * 0.02}
            depthWrite={false}
          />
        </mesh>
      ))}

      <fog attach="fog" args={[COLORS.BLACK_VOID, 0.8, 8 - progress * 2.5]} />

      <GoldenTieRelic progress={progress} />
    </group>
  );
}
