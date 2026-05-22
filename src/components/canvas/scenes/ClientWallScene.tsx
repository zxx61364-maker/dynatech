'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneProgress } from '@/hooks/useSceneProgress';
import { COLORS } from '@/lib/constants';

const PERIPHERAL_NODES: [number, number, number][] = [
  [-2.8, 0.9, -0.28], [-1.4, 1.4, -0.25], [1.0, 1.3, -0.24], [2.6, 0.9, -0.26],
  [-3.0, -0.3, -0.29], [2.8, -0.4, -0.27], [-1.6, -1.1, -0.26], [1.8, -1.0, -0.25],
];

const CENTER = new THREE.Vector3(0, -0.05, -0.22);

// Phase thresholds
const P_LABEL_FADE = 0.10;   // labels start fading in
const P_CONDUIT_DRAW = 0.22; // conduits start drawing
const P_FULL_SYSTEM = 0.55;  // everything connected
const P_RETREAT = 0.78;      // begin converging to center

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// ── Peripheral Label + activation dot ──────────────
function EquipmentLabel({ idx, position, progress }: {
  idx: number; position: THREE.Vector3; progress: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const dotRef = useRef<THREE.Mesh>(null);
  const startPos = useMemo(() => position.clone(), [position]);

  // Each label activates at a staggered time (top→bottom spread)
  const activateAt = 0.10 + idx * 0.03;

  useFrame(() => {
    if (!groupRef.current) return;
    const retreat = smoothstep(P_RETREAT, 1.0, progress);
    groupRef.current.position.lerpVectors(startPos, CENTER, retreat * 0.55);

    const appear = smoothstep(activateAt, activateAt + 0.08, progress);
    groupRef.current.scale.setScalar(0.3 + appear * 0.7);

    if (dotRef.current) {
      const connected = progress > activateAt + 0.18;
      const dotAlpha = connected ? 0.25 + Math.sin(Date.now() * 0.005 + idx) * 0.1 : 0;
      (dotRef.current.material as THREE.MeshBasicMaterial).opacity =
        dotAlpha * (1 - retreat);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <boxGeometry args={[0.3, 0.09, 0.007]} />
        <meshStandardMaterial color="#8a6830" roughness={0.18} metalness={0.9} />
      </mesh>
      {/* Activation dot */}
      <mesh ref={dotRef} position={[0, 0, 0.006]}>
        <sphereGeometry args={[0.015, 6, 6]} />
        <meshBasicMaterial color={COLORS.GOLDEN_ACCENT} transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

// ── Conduit with connection flash ──────────────────
function Conduit({ idx, nodePos, progress }: {
  idx: number; nodePos: THREE.Vector3; progress: number;
}) {
  const barRef = useRef<THREE.Mesh>(null);
  const flashRef = useRef<THREE.Mesh>(null);
  const drawStart = P_CONDUIT_DRAW + idx * 0.025;

  useFrame(() => {
    if (!barRef.current) return;
    const retreat = smoothstep(P_RETREAT, 1.0, progress);
    const lineT = smoothstep(drawStart, drawStart + 0.25, progress);
    const s = CENTER.clone();
    const e = nodePos.clone().lerp(CENTER, retreat * 0.55);
    const mid = s.clone().add(e).multiplyScalar(0.5);
    const dir = e.clone().sub(s);
    const len = dir.length();
    barRef.current.position.copy(mid);
    barRef.current.scale.set(1, 1, lineT * len);
    barRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir.normalize());
    const mat = barRef.current.material as THREE.MeshStandardMaterial;
    mat.opacity = 0.5 * lineT * (1 - retreat * 0.7);

    // Connection flash — brief bright pulse when conduit first reaches label
    if (flashRef.current) {
      const justConnected = progress > drawStart + 0.22 && progress < drawStart + 0.32;
      const fMat = flashRef.current.material as THREE.MeshBasicMaterial;
      fMat.opacity = justConnected ? (0.6 - (progress - drawStart - 0.22) / 0.1 * 0.6) * (1 - retreat) : 0;
      flashRef.current.position.copy(e);
    }
  });

  return (
    <>
      <mesh ref={barRef}>
        <boxGeometry args={[0.018, 0.007, 1]} />
        <meshStandardMaterial
          color={COLORS.GOLDEN_ACCENT}
          roughness={0.12}
          metalness={0.92}
          transparent
          opacity={0}
        />
      </mesh>
      <mesh ref={flashRef}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshBasicMaterial color="#ffe8a0" transparent opacity={0} depthWrite={false} />
      </mesh>
    </>
  );
}

// ── Scan Line ───────────────────────────────────────
function ScanLine({ progress }: { progress: number }) {
  const scanRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!scanRef.current) return;
    const inFull = smoothstep(P_FULL_SYSTEM - 0.05, P_FULL_SYSTEM, progress);
    const retreat = smoothstep(P_RETREAT, 1.0, progress);
    if (inFull < 0.01 || retreat > 0.3) {
      scanRef.current.visible = false;
      return;
    }
    scanRef.current.visible = true;
    // Sweep vertically across the panel
    const cycle = (Date.now() * 0.0008) % 1;
    scanRef.current.position.y = -0.7 + cycle * 1.4;
    const mat = scanRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.3 * inFull * (1 - retreat);
  });

  return (
    <mesh ref={scanRef} position={[0, 0, 0.095]}>
      <planeGeometry args={[2.5, 0.015]} />
      <meshBasicMaterial
        color={COLORS.GOLDEN_ACCENT}
        transparent
        opacity={0}
        depthWrite={false}
      />
    </mesh>
  );
}

// ── CENTRAL CROSS-CONNECT PANEL ────────────────────
function CentralPanel({ progress }: { progress: number }) {
  const panelRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!panelRef.current) return;
    const reveal = smoothstep(0.0, 0.15, progress);
    panelRef.current.scale.setScalar(0.55 + reveal * 0.45);
    if (innerRef.current) {
      const mat = innerRef.current.material as THREE.MeshStandardMaterial;
      // Inner panel brightens slightly when system is fully connected
      const fullPower = smoothstep(P_FULL_SYSTEM - 0.1, P_FULL_SYSTEM, progress);
      mat.emissive = new THREE.Color('#110800').multiplyScalar(0.3 + fullPower * 1.5);
      mat.emissiveIntensity = 0.2 + fullPower * 0.6;
    }
  });

  return (
    <group ref={panelRef} position={[0, -0.05, -0.2]}>
      {/* === OUTER FRAME === */}
      <mesh>
        <boxGeometry args={[3.2, 2.0, 0.09]} />
        <meshStandardMaterial color="#4a3a20" roughness={0.22} metalness={0.68} />
      </mesh>

      {/* Brass trim ring — brighter, more prominent */}
      <mesh position={[0, 0, 0.047]}>
        <boxGeometry args={[3.26, 2.06, 0.02]} />
        <meshStandardMaterial
          color="#d4b050"
          roughness={0.04}
          metalness={0.99}
          emissive="#302000"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Inner bakelite panel */}
      <mesh ref={innerRef} position={[0, 0, 0.06]}>
        <boxGeometry args={[2.8, 1.6, 0.025]} />
        <meshStandardMaterial
          color="#14100c"
          roughness={0.6}
          metalness={0.08}
          emissive="#080400"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* === CONNECTION BLOCKS === */}
      {Array.from({ length: 6 }).map((_, row) => (
        <group key={`row-${row}`} position={[0, -0.56 + row * 0.225, 0.077]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2.4, 0.1, 0.03]} />
            <meshStandardMaterial color="#1e1814" roughness={0.28} metalness={0.52} />
          </mesh>
          {Array.from({ length: 10 }).map((_, col) => (
            <group key={`t-${row}-${col}`} position={[-1.08 + col * 0.24, 0, 0.017]}>
              <mesh position={[-0.04, 0, 0]}>
                <cylinderGeometry args={[0.024, 0.024, 0.028, 10]} />
                <meshStandardMaterial color={COLORS.GOLDEN_ACCENT} roughness={0.06} metalness={0.99} />
              </mesh>
              <mesh position={[0.04, 0, 0]}>
                <cylinderGeometry args={[0.024, 0.024, 0.028, 10]} />
                <meshStandardMaterial color={COLORS.GOLDEN_ACCENT} roughness={0.06} metalness={0.99} />
              </mesh>
              <mesh position={[0, 0.035, 0]}>
                <boxGeometry args={[0.09, 0.018, 0.018]} />
                <meshStandardMaterial color="#b89030" roughness={0.08} metalness={0.97} />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* === LABEL STRIPS === */}
      <mesh position={[0, 0.94, 0.07]}>
        <boxGeometry args={[3.0, 0.13, 0.02]} />
        <meshStandardMaterial color="#b89848" roughness={0.1} metalness={0.94} />
      </mesh>
      <mesh position={[-1.55, 0, 0.07]}>
        <boxGeometry args={[0.07, 1.4, 0.02]} />
        <meshStandardMaterial color="#a88838" roughness={0.1} metalness={0.92} />
      </mesh>
      <mesh position={[1.55, 0, 0.07]}>
        <boxGeometry args={[0.07, 1.4, 0.02]} />
        <meshStandardMaterial color="#a88838" roughness={0.1} metalness={0.92} />
      </mesh>

      {/* === CORNER BOLTS === */}
      {[[-1.45, 0.85], [1.45, 0.85], [-1.45, -0.85], [1.45, -0.85]].map(([x, y], i) => (
        <mesh key={`blt-${i}`} position={[x, y, 0.067]}>
          <cylinderGeometry args={[0.05, 0.05, 0.03, 12]} />
          <meshStandardMaterial color="#f0e050" roughness={0.04} metalness={1.0} />
        </mesh>
      ))}

      {/* === STATUS LEDS === */}
      {Array.from({ length: 5 }).map((_, i) => (
        <LED key={`led-${i}`} idx={i} progress={progress} />
      ))}
    </group>
  );
}

// ── Individual LED with activation sequence ────────
function LED({ idx, progress }: { idx: number; progress: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const activateAt = 0.04 + idx * 0.025;

  useFrame(() => {
    if (!ref.current) return;
    const on = progress > activateAt;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.color.set(on ? '#44dd44' : '#442222');
    mat.opacity = on ? 0.6 + Math.sin(Date.now() * 0.006 + idx) * 0.2 : 0.3;
  });

  return (
    <mesh ref={ref} position={[-0.6 + idx * 0.3, 0.85, 0.085]}>
      <sphereGeometry args={[0.022, 8, 8]} />
      <meshBasicMaterial color="#442222" transparent opacity={0.3} />
    </mesh>
  );
}

// ── Scene ────────────────────────────────────────────
export function ClientWallScene() {
  const { progress } = useSceneProgress('client-wall');
  const { camera } = useThree();

  const startPos = useMemo(() => new THREE.Vector3(0, 0.2, 6.0), []);
  const endPos = useMemo(() => new THREE.Vector3(0, -0.15, 1.9), []);
  const lookTarget = useMemo(() => new THREE.Vector3(0, -0.05, -0.25), []);

  useFrame(() => {
    const t = progress * progress;
    camera.position.lerpVectors(startPos, endPos, t);
    // Slight lateral drift during full system phase — inspecting the panel
    const fullPhase = smoothstep(P_FULL_SYSTEM - 0.1, P_FULL_SYSTEM, progress);
    const retreat = smoothstep(P_RETREAT, 1.0, progress);
    const drift = Math.sin(Date.now() * 0.0006) * 0.12 * fullPhase * (1 - retreat);
    const look = lookTarget.clone();
    look.x += drift;
    camera.lookAt(look);
  });

  // Ambient ramps from dim to well-lit as system comes online
  const ambientIntensity = 0.2 + progress * 0.42;

  return (
    <group>
      <ambientLight intensity={ambientIntensity} color="#2a1808" />
      <pointLight position={[-2.5, 2, 5]} intensity={2.5 + progress * 2.5} color="#fff0dc" distance={14} />
      <pointLight position={[2.5, 0.5, 4]} intensity={1.5 + progress * 1.2} color="#c8a060" distance={10} />
      <pointLight position={[0, 0.5, 4.5]} intensity={2 + progress * 2.5} color="#e8c880" distance={7} />

      {/* Backdrop wall */}
      <mesh position={[0, -0.05, -0.38]}>
        <planeGeometry args={[12, 14]} />
        <meshStandardMaterial color="#0a0806" roughness={0.95} />
      </mesh>

      {/* Wall seams */}
      {[-2.5, 0, 2.5].map((x) => (
        <mesh key={`vs-${x}`} position={[x, -0.05, -0.35]}>
          <boxGeometry args={[0.018, 7.5, 0.02]} />
          <meshStandardMaterial color="#18100a" roughness={0.7} metalness={0.05} />
        </mesh>
      ))}

      {/* Cable tray */}
      <mesh position={[0, -1.7, -0.32]}>
        <boxGeometry args={[9, 0.03, 0.07]} />
        <meshStandardMaterial color="#2a1c10" roughness={0.45} metalness={0.35} />
      </mesh>

      {/* === SOLE HERO === */}
      <CentralPanel progress={progress} />

      {/* === Scan Line (only active during full system phase) === */}
      <ScanLine progress={progress} />

      {/* === Peripheral labels === */}
      {PERIPHERAL_NODES.map((pos, i) => (
        <EquipmentLabel
          key={`lbl-${i}`} idx={i}
          position={new THREE.Vector3(...pos)} progress={progress}
        />
      ))}

      {/* === Conduits === */}
      {PERIPHERAL_NODES.map((pos, i) => (
        <Conduit key={`cnd-${i}`} idx={i}
          nodePos={new THREE.Vector3(...pos)} progress={progress}
        />
      ))}

      {/* === Subtle orbital particles (2 pairs, not scattered noise) === */}
      {[0, 1].map((i) => (
        <OrbitPair key={`orbit-${i}`} idx={i} progress={progress} />
      ))}

      {/* Floor */}
      <mesh position={[0, -2.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 14]} />
        <meshStandardMaterial color="#060402" roughness={1} />
      </mesh>

      <fog attach="fog" args={['#0a0806', 3.0, 15]} />
    </group>
  );
}

// ── Orbital particle pair (structured, not random) ──
function OrbitPair({ idx, progress }: { idx: number; progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const angle = idx * Math.PI;

  useFrame(() => {
    if (!groupRef.current) return;
    const retreat = smoothstep(P_RETREAT, 1.0, progress);
    const fullPhase = smoothstep(P_FULL_SYSTEM - 0.1, P_FULL_SYSTEM, progress);
    const visible = fullPhase > 0.2 && retreat < 0.5;
    groupRef.current.visible = visible;
    if (!visible) return;
    const rot = Date.now() * 0.0012 + angle;
    const r = 1.6 - retreat * 0.9;
    groupRef.current.position.set(Math.cos(rot) * r, Math.sin(rot * 1.3) * 0.4, -0.18);
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[0.015, 4, 4]} />
        <meshBasicMaterial color={COLORS.GOLDEN_ACCENT} transparent opacity={0.4} depthWrite={false} />
      </mesh>
      <mesh position={[0.06, 0, 0]}>
        <sphereGeometry args={[0.01, 4, 4]} />
        <meshBasicMaterial color="#e8d080" transparent opacity={0.3} depthWrite={false} />
      </mesh>
    </group>
  );
}
