"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sparkles, Line, Text } from "@react-three/drei";
import * as THREE from "three";

type MousePosition = {
  x: number;
  y: number;
};

function SceneFallback() {
  return (
    <div className="h-full w-full bg-[radial-gradient(circle_at_50%_38%,_rgba(250,204,21,0.18),_transparent_18%),radial-gradient(circle_at_25%_65%,_rgba(0,0,0,0.06),_transparent_18%),linear-gradient(180deg,_#ffffff_0%,_#fffdf5_100%)]" />
  );
}

type FloatingNode = {
  id: string;
  type: "stars" | "reviewCard" | "platformTile" | "ratingChip" | "trustBadge";
  position: [number, number, number];
  color: string;
  accent: string;
  scale: number;
  speed: number;
};

function StarIcon({ color = "#fbbf24" }: { color?: string }) {
  const shape = useMemo(() => {
    const star = new THREE.Shape();
    const outerRadius = 0.5;
    const innerRadius = 0.2;
    const spikes = 5;

    for (let i = 0; i < spikes * 2; i++) {
      const angle = (i * Math.PI) / spikes;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) star.moveTo(x, y);
      else star.lineTo(x, y);
    }
    star.closePath();
    return star;
  }, []);

  const geometry = useMemo(
    () =>
      new THREE.ExtrudeGeometry(shape, {
        depth: 0.09,
        bevelEnabled: true,
        bevelSegments: 4,
        bevelSize: 0.03,
        bevelThickness: 0.03,
      }),
    [shape],
  );

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
    </mesh>
  );
}

function ReviewCard({ color, accent }: { color: string; accent: string }) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1, 0.6, 0.05]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.2, 0.03]}>
        <planeGeometry args={[0.8, 0.2]} />
        <meshStandardMaterial color={accent} />
      </mesh>
    </group>
  );
}

function PlatformTile({ color, accent }: { color: string; accent: string }) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[0.8, 0.8, 0.05]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <circleGeometry args={[0.3, 32]} />
        <meshStandardMaterial color={accent} />
      </mesh>
    </group>
  );
}

function RatingChip({ color, accent }: { color: string; accent: string }) {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.2, 0.2, 0.05, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <circleGeometry args={[0.15, 16]} />
        <meshStandardMaterial color={accent} />
      </mesh>
    </group>
  );
}

function TrustBadge({ color, accent }: { color: string; accent: string }) {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.25, 0.25, 0.05, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <circleGeometry args={[0.2, 16]} />
        <meshStandardMaterial color={accent} />
      </mesh>
    </group>
  );
}

function FloatingNodeMesh({ node }: { node: FloatingNode }) {
  switch (node.type) {
    case "stars":
      return <StarIcon color={node.color} />;
    case "reviewCard":
      return <ReviewCard color={node.color} accent={node.accent} />;
    case "platformTile":
      return <PlatformTile color={node.color} accent={node.accent} />;
    case "ratingChip":
      return <RatingChip color={node.color} accent={node.accent} />;
    case "trustBadge":
      return <TrustBadge color={node.color} accent={node.accent} />;
    default:
      return null;
  }
}

function FloatingNodeGroup({
  node,
  index,
  mouse,
}: {
  node: FloatingNode;
  index: number;
  mouse: MousePosition;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const base = useMemo(() => new THREE.Vector3(...node.position), [node.position]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    const mouseInfluence = new THREE.Vector3(mouse.x * 0.5, mouse.y * 0.5, 0);
    const floating = new THREE.Vector3(
      Math.sin(time * node.speed + index) * 0.3,
      Math.cos(time * node.speed * 0.8 + index) * 0.2,
      Math.sin(time * node.speed * 0.6 + index) * 0.1,
    );
    const target = base.clone().add(mouseInfluence).add(floating);
    groupRef.current.position.lerp(target, 0.02);
    groupRef.current.rotation.y = time * 0.1 + index * 0.1;
    groupRef.current.scale.setScalar(node.scale + Math.sin(time + index) * 0.1);
  });

  return (
    <group ref={groupRef}>
      <FloatingNodeMesh node={node} />
    </group>
  );
}

function ConnectionLines({ nodes }: { nodes: FloatingNode[] }) {
  const lines = useMemo(() => {
    const connections = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = new THREE.Vector3(...nodes[i].position).distanceTo(
          new THREE.Vector3(...nodes[j].position),
        );
        if (dist < 3) {
          connections.push({
            start: nodes[i].position,
            end: nodes[j].position,
            opacity: 1 - dist / 3,
          });
        }
      }
    }
    return connections;
  }, [nodes]);

  return (
    <group>
      {lines.map((line, index) => (
        <Line
          key={index}
          points={[line.start, line.end]}
          color="#fbbf24"
          opacity={line.opacity * 0.3}
          transparent
          lineWidth={1}
        />
      ))}
    </group>
  );
}

function CentralHub({ mouse }: { mouse: MousePosition }) {
  const hubRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!hubRef.current) return;
    const time = state.clock.elapsedTime;
    hubRef.current.rotation.y = time * 0.2;
    hubRef.current.position.x = mouse.x * 0.2;
    hubRef.current.position.y = mouse.y * 0.2;
  });

  return (
    <group ref={hubRef}>
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      <Sparkles count={20} size={0.05} scale={[1, 1, 1]} speed={0.5} color="#fbbf24" />
    </group>
  );
}

function ReviewEcosystem({ mouse }: { mouse: MousePosition }) {
  const nodes: FloatingNode[] = useMemo(
    () => [
      {
        id: "star1",
        type: "stars",
        position: [-2, 1, 0],
        color: "#fbbf24",
        accent: "#f59e0b",
        scale: 1,
        speed: 0.5,
      },
      {
        id: "review1",
        type: "reviewCard",
        position: [1, 0.5, -1],
        color: "#ffffff",
        accent: "#fbbf24",
        scale: 0.8,
        speed: 0.3,
      },
      {
        id: "platform1",
        type: "platformTile",
        position: [-1, -0.5, 1],
        color: "#1f2937",
        accent: "#fbbf24",
        scale: 0.9,
        speed: 0.4,
      },
      {
        id: "rating1",
        type: "ratingChip",
        position: [2, -1, 0],
        color: "#fbbf24",
        accent: "#ffffff",
        scale: 0.7,
        speed: 0.6,
      },
      {
        id: "trust1",
        type: "trustBadge",
        position: [0, 1.5, -0.5],
        color: "#1f2937",
        accent: "#fbbf24",
        scale: 1.1,
        speed: 0.2,
      },
      {
        id: "star2",
        type: "stars",
        position: [1.5, -0.8, 1],
        color: "#fbbf24",
        accent: "#f59e0b",
        scale: 0.9,
        speed: 0.7,
      },
      {
        id: "review2",
        type: "reviewCard",
        position: [-1.5, 0.2, -0.8],
        color: "#ffffff",
        accent: "#fbbf24",
        scale: 0.85,
        speed: 0.35,
      },
    ],
    [],
  );

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#fbbf24" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#1f2937" />
      <CentralHub mouse={mouse} />
      <ConnectionLines nodes={nodes} />
      {nodes.map((node, index) => (
        <FloatingNodeGroup key={node.id} node={node} index={index} mouse={mouse} />
      ))}
      <Sparkles count={50} size={0.02} scale={[4, 3, 3]} speed={0.3} color="#fbbf24" />
    </>
  );
}

export default function PremiumHeroScene({ mouse }: { mouse: MousePosition }) {
  return (
    <div className="absolute inset-0 rounded-[2rem] overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ antialias: true }}>
        <color attach="background" args={["#ffffff"]} />
        <ReviewEcosystem mouse={mouse} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} enableRotate={false} />
      </Canvas>
    </div>
  );
}
