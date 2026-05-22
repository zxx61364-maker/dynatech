'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneProgress } from '@/hooks/useSceneProgress';
import { COLORS } from '@/lib/constants';

const PERIPHERAL_NODES: [number, number, number][] = [
  [-2.8, 0.9, -0.28],
  [-1.4, 1.4, -0.25],
  [1.0, 1.3, -0.24],
  [2.6, 0.9, -0.26],
  [-3.0, -0.3, -0.29],
  [2.8, -0.4, -0.27],
  [-1.6, -1.1, -0.26],
  [1.8, -1.0, -0.25],
];

const CENTER = new THREE.Vector3(0, -0.05, -0.22);

// ── Peripheral Equipment Label ────────────────────
function EquipmentLabel({ position, progress, color }: { position: THREE.Vector3; progress: number; color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const startPos = useMemo(() => position.clone(), [position]);

  useFrame(() => {
    if (!groupRef.current) return;
    const t = Math.max(0, Math.min(1, (progress - 0.7) / 0.3));
    groupRef.current.position.lerpVectors(startPos, CENTER, t * 0.75);
    groupRef.current.scale.setScalar(1 - t * 0.35);
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Label plate */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.38, 0.12, 0.01]} />
        <meshStandardMaterial color="#b09850" roughness={0.2} metalness={0.9} />
      </mesh>
      {/* Engraved border */}
      <mesh position={[0, 0, 0.006]}>
        <boxGeometry args={[0.4, 0.14, 0.004]} />
        <meshStandardMaterial color={color} roughness={0.15} metalness={0.95} />
      </mesh>
      {/* Center line */}
      <mesh position={[0, 0, 0.009]}>
        <boxGeometry args={[0.34, 0.005, 0.002]} />
        <meshBasicMaterial color={COLORS.GOLDEN_ACCENT} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

// ── Conduit from center to peripheral ─────────────
function Conduit({ idx, nodePos, progress }: { idx: number; nodePos: THREE.Vector3; progress: number }) {
  const barRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!barRef.current) return;
    const lineT = Math.max(0, Math.min(1, (progress - 0.03 * idx) / 0.6));
    const convergeT = Math.max(0, Math.min(1, (progress - 0.7) / 0.3));
    const s = CENTER.clone();
    const e = nodePos.clone().lerp(CENTER, convergeT * 0.75);
    const mid = s.clone().add(e).multiplyScalar(0.5);
    const dir = e.clone().sub(s);
    const len = dir.length();
    barRef.current.position.copy(mid);
    barRef.current.scale.set(1, 1, lineT * len);
    barRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir.normalize());
    const mat = barRef.current.material as THREE.MeshStandardMaterial;
    mat.opacity = 0.6 * lineT * (1 - convergeT * 0.8);
  });

  return (
    <mesh ref={barRef}>
      <boxGeometry args={[0.025, 0.01, 1]} />
      <meshStandardMaterial
        color={idx % 2 === 0 ? COLORS.GOLDEN_ACCENT : '#b89030'}
        roughness={0.15}
        metalness={0.92}
        transparent
        opacity={0}
      />
    </mesh>
  );
}

// ── CENTRAL CROSS-CONNECT PANEL ───────────────────
function CentralPanel({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const reveal = Math.max(0, Math.min(1, progress / 0.4));
    groupRef.current.scale.setScalar(0.7 + reveal * 0.3);
  });

  return (
    <group ref={groupRef} position={[0, -0.05, -0.2]}>
      {/* === OUTER FRAME — heavy brass === */}
      <mesh>
        <boxGeometry args={[2.8, 1.8, 0.08]} />
        <meshStandardMaterial color="#3a3020" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Outer brass trim ring */}
      <mesh position={[0, 0, 0.042]}>
        <boxGeometry args={[2.85, 1.85, 0.015]} />
        <meshStandardMaterial color={COLORS.GOLDEN_ACCENT} roughness={0.08} metalness={0.98} />
      </mesh>

      {/* === INNER PANEL SURFACE — dark bakelite === */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[2.4, 1.4, 0.02]} />
        <meshStandardMaterial color="#0e0a06" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* === CONNECTION BLOCK ROWS === */}
      {Array.from({ length: 6 }).map((_, row) => (
        <group key={`block-row-${row}`} position={[0, -0.5 + row * 0.2, 0.065]}>
          {/* Block housing */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2.1, 0.1, 0.025]} />
            <meshStandardMaterial color="#1a1410" roughness={0.35} metalness={0.45} />
          </mesh>
          {/* Terminal pairs on this block */}
          {Array.from({ length: 9 }).map((_, col) => (
            <group key={`term-${row}-${col}`} position={[-0.95 + col * 0.24, 0, 0.014]}>
              {/* Left pin */}
              <mesh position={[-0.04, 0, 0]}>
                <cylinderGeometry args={[0.018, 0.018, 0.02, 10]} />
                <meshStandardMaterial color={COLORS.GOLDEN_ACCENT} roughness={0.1} metalness={0.97} />
              </mesh>
              {/* Right pin */}
              <mesh position={[0.04, 0, 0]}>
                <cylinderGeometry args={[0.018, 0.018, 0.02, 10]} />
                <meshStandardMaterial color={COLORS.GOLDEN_ACCENT} roughness={0.1} metalness={0.97} />
              </mesh>
              {/* Bridge clip */}
              <mesh position={[0, 0.03, 0]}>
                <boxGeometry args={[0.08, 0.015, 0.015]} />
                <meshStandardMaterial color="#b89030" roughness={0.12} metalness={0.95} />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* === TOP LABEL STRIP === */}
      <mesh position={[0, 0.82, 0.06]}>
        <boxGeometry args={[2.6, 0.1, 0.015]} />
        <meshStandardMaterial color="#a08030" roughness={0.15} metalness={0.9} />
      </mesh>
      {/* Vertical label strips at edges */}
      <mesh position={[-1.35, 0, 0.06]}>
        <boxGeometry args={[0.06, 1.2, 0.015]} />
        <meshStandardMaterial color="#907028" roughness={0.15} metalness={0.9} />
      </mesh>
      <mesh position={[1.35, 0, 0.06]}>
        <boxGeometry args={[0.06, 1.2, 0.015]} />
        <meshStandardMaterial color="#907028" roughness={0.15} metalness={0.9} />
      </mesh>

      {/* === CORNER BOLTS === */}
      {[[-1.25, 0.75], [1.25, 0.75], [-1.25, -0.75], [1.25, -0.75]].map(([x, y], i) => (
        <mesh key={`bolt-${i}`} position={[x, y, 0.055]}>
          <cylinderGeometry args={[0.04, 0.04, 0.02, 12]} />
          <meshStandardMaterial color="#e8d040" roughness={0.06} metalness={1.0} />
        </mesh>
      ))}

      {/* === STATUS LED ROW === */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={`led-${i}`} position={[-0.6 + i * 0.3, 0.73, 0.07]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color={i < 2 ? '#44cc44' : '#cc9933'} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

// ── Scene ────────────────────────────────────────────
export function ClientWallScene() {
  const { progress } = useSceneProgress('client-wall');
  const { camera } = useThree();

  const startPos = useMemo(() => new THREE.Vector3(0, 0.3, 6.5), []);
  const endPos = useMemo(() => new THREE.Vector3(0, -0.15, 2.2), []);
  const lookTarget = useMemo(() => new THREE.Vector3(0, -0.05, -0.3), []);

  useFrame(() => {
    const t = progress * progress;
    camera.position.lerpVectors(startPos, endPos, t);
    camera.lookAt(lookTarget);
  });

  return (
    <group>
      {/* Brighter overall lighting */}
      <ambientLight intensity={0.42} color="#2a1808" />
      <pointLight position={[-2.5, 2, 5]} intensity={3.5} color="#fff0dc" distance={14} />
      <pointLight position={[2.5, 0.5, 4]} intensity={2.0} color="#c8a060" distance={10} />
      {/* Frontal light on the central panel */}
      <pointLight position={[0, 0.3, 4.5]} intensity={2.5} color="#d4b080" distance={7} />

      {/* Backdrop wall */}
      <mesh position={[0, -0.05, -0.35]}>
        <planeGeometry args={[11, 13]} />
        <meshStandardMaterial color="#0a0806" roughness={0.95} />
      </mesh>

      {/* Vertical wall seams */}
      {[-3.5, -2, -0.5, 1, 2.5, 4].map((x) => (
        <mesh key={`vl-${x}`} position={[x, -0.05, -0.33]}>
          <boxGeometry args={[0.025, 8, 0.025]} />
          <meshStandardMaterial color="#1c140c" roughness={0.65} metalness={0.08} />
        </mesh>
      ))}

      {/* Horizontal cable tray */}
      <mesh position={[0, -1.6, -0.3]}>
        <boxGeometry args={[9, 0.03, 0.08]} />
        <meshStandardMaterial color="#2a1c10" roughness={0.45} metalness={0.35} />
      </mesh>

      {/* === CENTRAL DOMINANT DEVICE === */}
      <CentralPanel progress={progress} />

      {/* === PERIPHERAL EQUIPMENT LABELS === */}
      {PERIPHERAL_NODES.map((pos, i) => (
        <EquipmentLabel
          key={`label-${i}`}
          position={new THREE.Vector3(...pos)}
          progress={progress}
          color={['#c8a040', '#b89030', '#d0a848', '#c09038', '#b89840', '#c8a848', '#d0a040', '#c09838'][i]}
        />
      ))}

      {/* === CONDUITS from center to peripherals === */}
      {PERIPHERAL_NODES.map((pos, i) => (
        <Conduit key={`conduit-${i}`} idx={i} nodePos={new THREE.Vector3(...pos)} progress={progress} />
      ))}

      {/* Floor */}
      <mesh position={[0, -2.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 14]} />
        <meshStandardMaterial color="#060402" roughness={1} />
      </mesh>

      {/* Light haze */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh
          key={`haze-${i}`}
          position={[
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.3) * 2,
            (Math.random() - 0.5) * 3 - 0.5,
          ]}
        >
          <sphereGeometry args={[0.03 + Math.random() * 0.05, 4, 4]} />
          <meshBasicMaterial
            color="#4a2810"
            transparent
            opacity={0.02 + Math.random() * 0.03}
            depthWrite={false}
          />
        </mesh>
      ))}

      <fog attach="fog" args={['#0a0806', 2.5, 14]} />
    </group>
  );
}
