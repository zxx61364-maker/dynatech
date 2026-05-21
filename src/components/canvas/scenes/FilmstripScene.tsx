'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneProgress } from '@/hooks/useSceneProgress';
import { PROJECTS, COLORS } from '@/lib/constants';

function FilmFrame({
  index,
  total,
  project,
  progress,
}: {
  index: number;
  total: number;
  project: (typeof PROJECTS)[0];
  progress: number;
}) {
  const t = index / (total - 1);
  const angle = t * Math.PI * 0.55 - Math.PI * 0.275;
  const radius = 5.5;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius - 3;
  const y = (t - 0.5) * 2.5;
  const rotY = -angle;

  return (
    <group position={[x, y, z]} rotation={[0, rotY, 0]}>
      {/* Film perforation border — top strip */}
      <mesh position={[0, 0.68, 0]}>
        <boxGeometry args={[2.0, 0.08, 0.015]} />
        <meshStandardMaterial color="#111111" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Sprocket holes — top */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`st-${i}`} position={[-0.85 + i * 0.24, 0.72, 0.005]}>
          <boxGeometry args={[0.1, 0.06, 0.02]} />
          <meshStandardMaterial color="#000" roughness={0.4} />
        </mesh>
      ))}

      {/* Film perforation border — bottom strip */}
      <mesh position={[0, -0.68, 0]}>
        <boxGeometry args={[2.0, 0.08, 0.015]} />
        <meshStandardMaterial color="#111111" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Sprocket holes — bottom */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`sb-${i}`} position={[-0.85 + i * 0.24, -0.72, 0.005]}>
          <boxGeometry args={[0.1, 0.06, 0.02]} />
          <meshStandardMaterial color="#000" roughness={0.4} />
        </mesh>
      ))}

      {/* Film frame border */}
      <mesh position={[0, 0, 0.015]}>
        <boxGeometry args={[1.9, 1.1, 0.01]} />
        <meshStandardMaterial color="#181818" roughness={0.5} metalness={0.25} />
      </mesh>

      {/* Frame content — gradient plane */}
      <mesh position={[0, 0, 0.025]}>
        <planeGeometry args={[1.7, 0.95]} />
        <meshBasicMaterial color={project.color} />
      </mesh>

      {/* Frame number */}
      <Text
        position={[0.6, 0.55, 0.03]}
        fontSize={0.06}
        color="#666"
        anchorX="right"
        anchorY="top"
       
      >
        {String(index + 1).padStart(2, '0')}
      </Text>

      {/* Project title below frame */}
      <Text
        position={[0, -0.85, 0.03]}
        fontSize={0.08}
        color={COLORS.TEXT_WARM_WHITE}
        anchorX="center"
        anchorY="top"
        letterSpacing={0.04}
       
      >
        {project.title.toUpperCase()}
      </Text>
      <Text
        position={[0, -0.95, 0.03]}
        fontSize={0.055}
        color="rgba(248,244,230,0.5)"
        anchorX="center"
        anchorY="top"
        letterSpacing={0.03}
       
      >
        {project.subtitle}
      </Text>
    </group>
  );
}

export function FilmstripScene() {
  const { progress } = useSceneProgress('filmstrip');
  const { camera } = useThree();

  const startPos = useMemo(() => new THREE.Vector3(0, 0.8, 7), []);
  const endPos = useMemo(() => new THREE.Vector3(0, -0.3, 2.5), []);
  const lookStart = useMemo(() => new THREE.Vector3(0, 0.3, -3), []);
  const lookEnd = useMemo(() => new THREE.Vector3(0, -0.3, -2), []);

  useFrame(() => {
    const t = progress;
    camera.position.lerpVectors(startPos, endPos, t);
    const lookTgt = new THREE.Vector3().lerpVectors(lookStart, lookEnd, t);
    camera.lookAt(lookTgt);
  });

  return (
    <group>
      {/* Darkroom lighting */}
      <ambientLight intensity={0.2} color={COLORS.FILM_SAFELIGHT} />
      {/* Safelight */}
      <pointLight position={[3, 1.5, 4]} intensity={4} color="#551100" distance={14} />
      <pointLight position={[-3, -1, 5]} intensity={2.5} color="#331100" distance={12} />
      {/* Projector light beam hint */}
      <spotLight position={[0, 0, 5]} angle={0.4} penumbra={0.6} intensity={6} color="#ffe8d0" distance={15} />

      <fog attach="fog" args={['#0a0505', 2, 15]} />

      {/* Film frames */}
      {PROJECTS.map((project, i) => (
        <FilmFrame key={project.id} index={i} total={PROJECTS.length} project={project} progress={progress} />
      ))}

      {/* Subtle darkroom floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0a0808" roughness={1} transparent opacity={0.5} depthWrite={false} />
      </mesh>
    </group>
  );
}
