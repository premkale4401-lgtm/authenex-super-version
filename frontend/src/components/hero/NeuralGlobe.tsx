"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

// Main sphere with glow
function Core() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.1;
      meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
      const scale = 1 + Math.sin(time * 2) * 0.03;
      meshRef.current.scale.setScalar(scale);
    }
    
    if (wireRef.current) {
      wireRef.current.rotation.y = time * 0.15;
    }
  });

  return (
    <group>
      {/* Main sphere */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 3]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
      
      {/* Wireframe */}
      <mesh ref={wireRef} scale={1.05}>
        <icosahedronGeometry args={[1.5, 2]} />
        <meshBasicMaterial
          color="#22d3ee"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>
      
      {/* Outer glow */}
      <mesh scale={2.2}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Lights */}
      <pointLight color="#06b6d4" intensity={2} distance={15} position={[5, 5, 5]} />
      <pointLight color="#8b5cf6" intensity={1.5} distance={15} position={[-5, -5, -5]} />
    </group>
  );
}

// Orbiting rings
function Rings() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.05;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2, i * 1.0, 0]}>
          <torusGeometry args={[2.8 + i * 0.7, 0.02, 16, 100]} />
          <meshBasicMaterial 
            color={i % 2 === 0 ? "#06b6d4" : "#8b5cf6"} 
            transparent 
            opacity={0.3} 
          />
        </mesh>
      ))}
    </group>
  );
}

// Floating particles - FIXED VERSION
function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  
  const count = 200;
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = 2.5 + Math.random() * 2.5;
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      
      // Cyan to purple gradient
      const mix = Math.random();
      col[i * 3] = mix * 0.04 + (1 - mix) * 0.55;
      col[i * 3 + 1] = mix * 0.8 + (1 - mix) * 0.14;
      col[i * 3 + 2] = mix * 0.91 + (1 - mix) * 0.96;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    
    return geo;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// Scene composition
function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <Core />
      <Rings />
      <Particles />
      
      <Stars
        radius={100}
        depth={50}
        count={1000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />
      
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
}

// Main component
export default function NeuralGlobe() {
  return (
    <div className="w-full h-[600px] relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
      
      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
      
      {/* HUD Overlay */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 pointer-events-none">
        <div className="px-3 py-1 rounded bg-slate-900/80 border border-cyan-500/20 text-xs font-mono text-cyan-400">
          SYS: ONLINE
        </div>
        <div className="px-3 py-1 rounded bg-slate-900/80 border border-cyan-500/20 text-xs font-mono text-cyan-400">
          NODES: 3,247
        </div>
      </div>
    </div>
  );
}