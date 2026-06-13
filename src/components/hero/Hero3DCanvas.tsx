"use client";

import React, { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Float, Environment } from "@react-three/drei";
import * as THREE from "three";
import { drawCardFront, drawCardBack } from "@/utils/cardCanvas";

function CardMesh() {
  const meshRef = useRef<THREE.Group>(null);

  // Generate textures once
  const frontTexture = React.useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 646;
    drawCardFront(
      canvas,
      "Alex Sterling",
      "CEO & Founder",
      "TAPFOLIO",
      "#0a0a0a",
      "pvc",
      "matte",
      null
    );
    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 16;
    return texture;
  }, []);

  const backTexture = React.useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 646;
    drawCardBack(
      canvas,
      "#0a0a0a",
      "pvc",
      "matte",
      "Alex Sterling"
    );
    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 16;
    return texture;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      // Get scroll progress (0 to 1) relative to hero section height
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      // Soft clamp scroll progress to avoid abrupt stops, we'll let it scroll out of view smoothly
      const scrollProgress = scrollY / windowHeight;
      
      // Gentle floating + Scroll Rotation
      const baseRotationY = 0.5;
      // As user scrolls down, card spins around Y axis
      const scrollRotationY = scrollProgress * Math.PI * 1.5; 
      const floatRotationY = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
      
      meshRef.current.rotation.y = baseRotationY + scrollRotationY + floatRotationY;
      
      // Tilt backward as they scroll down
      const baseRotationX = 0;
      const scrollRotationX = scrollProgress * Math.PI * 0.25;
      const floatRotationX = Math.cos(state.clock.elapsedTime * 0.3) * 0.1;
      
      meshRef.current.rotation.x = baseRotationX - scrollRotationX + floatRotationX;
      
      // Slight parallax vertical lift on scroll
      meshRef.current.position.y = scrollProgress * 1.5;
    }
  });

  // Adjust scale based on window size
  const { viewport } = useThree();
  const isMobile = viewport.width < 5;
  const scale = isMobile ? 0.7 : 1;

  return (
    <group ref={meshRef} scale={scale}>
      {/* Front Face */}
      <mesh position={[0, 0, 0.011]}>
        <planeGeometry args={[3.375, 2.125]} />
        {frontTexture && <meshStandardMaterial map={frontTexture} roughness={0.7} metalness={0.1} />}
      </mesh>
      
      {/* Core (Edges) */}
      <mesh>
        <boxGeometry args={[3.375, 2.125, 0.02]} />
        <meshStandardMaterial color="#050505" roughness={0.9} />
      </mesh>

      {/* Back Face */}
      <mesh position={[0, 0, -0.011]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[3.375, 2.125]} />
        {backTexture && <meshStandardMaterial map={backTexture} roughness={0.7} metalness={0.1} />}
      </mesh>
    </group>
  );
}

export default function Hero3DCanvas() {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} />
        <Environment preset="city" />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <CardMesh />
        </Float>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
