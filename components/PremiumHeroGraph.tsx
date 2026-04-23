"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sparkles, Line } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const sampleData = [10, 50, 120, 300, 800];

function createGraphPoints() {
  const maxValue = Math.max(...sampleData);
  const gap = 1.6;
  return sampleData.map((value, index) => {
    return new THREE.Vector3(
      index * gap - 1.5,
      (value / maxValue) * 2.2 + 0.05,
      Math.sin(index * 0.4) * 0.08,
    );
  });
}

function GraphLine({ points }: { points: THREE.Vector3[] }) {
  const lineRef = useRef<any>(null);
  const [progress, setProgress] = useState(0);

  useFrame((state, delta) => {
    setProgress((current) => Math.min(1, current + delta * 0.22));

    if (!lineRef.current) return;
    const steps = Math.max(2, Math.ceil(progress * (points.length - 1)) + 1);
    const visible = points.slice(0, steps);
    lineRef.current.geometry.setFromPoints(visible);
  });

  return (
    <Line
      ref={lineRef}
      points={points}
      color="#6ef1ff"
      lineWidth={1.6}
      dashed={false}
      transparent
      opacity={0.9}
      toneMapped={false}
    />
  );
}

function DataPoint({ position, active }: { position: THREE.Vector3; active: boolean }) {
  const ref = useRef<any>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const target = active ? 0.18 + Math.sin(state.clock.elapsedTime * 3) * 0.03 : 0.001;
    ref.current.scale.lerp(new THREE.Vector3(target, target, target), 0.08);
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial
        color="#8dfffe"
        emissive="#53d6ff"
        emissiveIntensity={active ? 1.3 : 0.1}
        roughness={0.15}
        metalness={0.8}
      />
    </mesh>
  );
}

function AxisGrid({ points }: { points: THREE.Vector3[] }) {
  const xMax = points[points.length - 1].x + 0.4;
  const yMax = 2.5;

  return (
    <group>
      <Line points={[new THREE.Vector3(-1.8, 0, 0), new THREE.Vector3(xMax, 0, 0)]} color="#3f7e9a" opacity={0.25} lineWidth={0.9} />
      <Line points={[new THREE.Vector3(-1.8, 0, 0), new THREE.Vector3(-1.8, yMax, 0)]} color="#3f7e9a" opacity={0.25} lineWidth={0.9} />
      {points.map((point, index) => (
        <Line
          key={`grid-${index}`}
          points={[new THREE.Vector3(point.x, 0, 0), new THREE.Vector3(point.x, point.y, 0)]}
          color="#3f7e9a"
          opacity={0.08}
          lineWidth={0.7}
        />
      ))}
    </group>
  );
}

function CameraRig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  useFrame((state, delta) => {
    if (!group.current) return;
    const targetX = mouse.x * 0.2;
    const targetY = mouse.y * 0.12;
    group.current.rotation.y += (targetX - group.current.rotation.y) * delta * 2.5;
    group.current.rotation.x += (targetY - group.current.rotation.x) * delta * 2.5;
  });

  return <group ref={group}>{children}</group>;
}

function GrowthScene() {
  const points = useMemo(() => createGraphPoints(), []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[2, 3, 4]} intensity={1.2} color="#7bf8ff" />
      <pointLight position={[-3, 1.8, -2]} intensity={0.5} color="#7a7cff" />
      <CameraRig>
        <group position={[0, -0.15, 0]}>
          <AxisGrid points={points} />
          <GraphLine points={points} />
          {points.map((point, index) => (
            <DataPoint key={index} position={point} active={index <= Math.floor((index / points.length) * 5)} />
          ))}
        </group>
      </CameraRig>
      <Sparkles count={25} size={0.16} scale={[3, 1.4, 1]} speed={0.3} color="#64f7ff" />
    </>
  );
}

export default function PremiumHeroGraph() {
  return (
    <div className="absolute inset-0 rounded-[2rem] overflow-hidden">
      <Canvas camera={{ position: [3.5, 1.8, 5.4], fov: 36 }} gl={{ antialias: true }}>
        <color attach="background" args={["#020814"]} />
        <GrowthScene />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.12} enableRotate={false} />
        <EffectComposer>
          <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.8} intensity={0.8} height={300} />
        </EffectComposer>
      </Canvas>
      <div className="pointer-events-none absolute left-4 top-4">
        <div className="text-xs uppercase tracking-[0.3em] text-slate-300">Growth</div>
        <div className="mt-2 text-sm font-semibold text-white">Reviews and reputation</div>
      </div>
    </div>
  );
}