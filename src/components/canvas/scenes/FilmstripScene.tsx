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
  const frameRef = useRef<THREE.Group>(null);
  const t = index / (total - 1);
  const angle = t * Math.PI * 0.5 - Math.PI * 0.25;
  const radius = 6.0;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius - 3.5;
  const y = (t - 0.5) * 2.8;
  const rotY = -angle;

  // Gentle sway
  useFrame((_, delta) => {
    if (frameRef.current) {
      frameRef.current.position.y = y + Math.sin(Date.now() * 0.001 + index) * 0.06;
    }
  });

  return (
    <group ref={frameRef} position={[x, y, z]} rotation={[0, rotY, 0]}>
      {/* === FILM STRIP — TOP PERFORATION BAR === */}
      <mesh position={[0, 0.72, 0]}>
        <boxGeometry args={[2.1, 0.09, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.45} metalness={0.25} />
      </mesh>
      {/* Sprocket holes — top */}
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={`st-${i}`} position={[-0.9 + i * 0.22, 0.76, 0.01]}>
          <boxGeometry args={[0.1, 0.06, 0.025]} />
          <meshStandardMaterial color="#000" roughness={0.3} />
        </mesh>
      ))}

      {/* === FILM STRIP — BOTTOM PERFORATION BAR === */}
      <mesh position={[0, -0.72, 0]}>
        <boxGeometry args={[2.1, 0.09, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.45} metalness={0.25} />
      </mesh>
      {/* Sprocket holes — bottom */}
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={`sb-${i}`} position={[-0.9 + i * 0.22, -0.76, 0.01]}>
          <boxGeometry args={[0.1, 0.06, 0.025]} />
          <meshStandardMaterial color="#000" roughness={0.3} />
        </mesh>
      ))}

      {/* === FRAME BORDER (film frame edge) === */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[2.0, 1.2, 0.015]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* === FRAME CONTENT — gradient with design elements === */}
      {/* Background gradient plane */}
      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={[1.8, 1.05]} />
        <meshBasicMaterial color={project.color} />
      </mesh>

      {/* Overlay gradient strip */}
      <mesh position={[0, 0.2, 0.04]}>
        <planeGeometry args={[1.8, 0.3]} />
        <meshBasicMaterial color={
          new THREE.Color(project.color).multiplyScalar(1.3).getStyle()
        } transparent opacity={0.5} />
      </mesh>

      {/* Decorative rule line */}
      <mesh position={[0, 0.04, 0.045]}>
        <boxGeometry args={[1.6, 0.004, 0.002]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
      </mesh>
      <mesh position={[0, -0.04, 0.045]}>
        <boxGeometry args={[1.6, 0.004, 0.002]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
      </mesh>

      {/* Project title on frame */}
      <Text
        position={[0, -0.3, 0.05]}
        fontSize={0.09}
        color={COLORS.TEXT_WARM_WHITE}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.04}
        font={undefined}
      >
        {project.title.toUpperCase()}
      </Text>
      <Text
        position={[0, -0.42, 0.05]}
        fontSize={0.06}
        color="#f8f4e6"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.03}
        fillOpacity={0.4}
        font={undefined}
      >
        {project.subtitle}
      </Text>

      {/* Frame number */}
      <Text
        position={[0.6, 0.44, 0.05]}
        fontSize={0.07}
        color="#ffffff"
        anchorX="right"
        anchorY="top"
        fillOpacity={0.3}
        font={undefined}
      >
        {String(index + 1).padStart(2, '0')}
      </Text>

      {/* Corner marks */}
      <mesh position={[-0.82, 0.44, 0.04]}>
        <boxGeometry args={[0.12, 0.015, 0.002]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
      </mesh>
      <mesh position={[-0.82, 0.44, 0.04]}>
        <boxGeometry args={[0.015, 0.12, 0.002]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

export function FilmstripScene() {
  const { progress } = useSceneProgress('filmstrip');
  const { camera } = useThree();

  const startPos = useMemo(() => new THREE.Vector3(0, 1.2, 8), []);
  const endPos = useMemo(() => new THREE.Vector3(0, -0.1, 3.0), []);
  const lookStart = useMemo(() => new THREE.Vector3(0, 0.2, -3.5), []);
  const lookEnd = useMemo(() => new THREE.Vector3(0, -0.2, -3.5), []);

  useFrame(() => {
    const t = progress;
    camera.position.lerpVectors(startPos, endPos, t);
    const lookTgt = new THREE.Vector3().lerpVectors(lookStart, lookEnd, t);
    camera.lookAt(lookTgt);
  });

  return (
    <group>
      {/* Darkroom red safelight ambiance */}
      <ambientLight intensity={0.18} color={COLORS.FILM_SAFELIGHT} />

      {/* Main safelight from upper left */}
      <pointLight position={[4, 2.5, 5]} intensity={5} color="#551100" distance={16} />
      {/* Secondary safelight */}
      <pointLight position={[-4, -1, 5]} intensity={3} color="#331100" distance={14} />

      {/* Projector beam */}
      <spotLight
        position={[0, 1, 6]}
        angle={0.45}
        penumbra={0.55}
        intensity={7}
        color="#ffe0c8"
        distance={16}
      />

      <fog attach="fog" args={['#0a0505', 1.5, 16]} />

      {/* Film frames — curved carousel */}
      {PROJECTS.map((project, i) => (
        <FilmFrame
          key={project.id}
          index={i}
          total={PROJECTS.length}
          project={project}
          progress={progress}
        />
      ))}

      {/* Darkroom floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#0a0606" roughness={1} transparent opacity={0.4} depthWrite={false} />
      </mesh>



    </group>
  );
}
