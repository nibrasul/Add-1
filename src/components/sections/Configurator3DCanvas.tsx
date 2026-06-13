"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { drawCardFront, drawCardBack } from "@/utils/cardCanvas";

export interface ConfiguratorState {
  name: string;
  role: string;
  company: string;
  color: string;
  material: "pvc" | "metal";
  finish: "glossy" | "matte" | "brushed";
  logoUrl: string | null;
  qrPosition: "front" | "back" | "hidden";
}

function ConfigCardMesh({ config }: { config: ConfiguratorState }) {
  const meshRef = useRef<THREE.Group>(null);
  
  const [frontTexture, setFrontTexture] = useState<THREE.CanvasTexture | null>(null);
  const [backTexture, setBackTexture] = useState<THREE.CanvasTexture | null>(null);

  // Re-generate textures whenever config changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load logo if present
    let logoImg: HTMLImageElement | null = null;
    
    const renderTextures = () => {
      // Front
      const frontCanvas = document.createElement("canvas");
      frontCanvas.width = 1024;
      frontCanvas.height = 646;
      drawCardFront(
        frontCanvas, 
        config.name || "Your Name", 
        config.role || "Role", 
        config.company || "Company", 
        config.color, 
        config.material, 
        config.finish, 
        logoImg
      );
      const fTex = new THREE.CanvasTexture(frontCanvas);
      fTex.anisotropy = 16;
      setFrontTexture(fTex);

      // Back
      const backCanvas = document.createElement("canvas");
      backCanvas.width = 1024;
      backCanvas.height = 646;
      drawCardBack(
        backCanvas, 
        config.color, 
        config.material, 
        config.finish, 
        config.name
      );
      const bTex = new THREE.CanvasTexture(backCanvas);
      bTex.anisotropy = 16;
      setBackTexture(bTex);
    };

    if (config.logoUrl) {
      const img = new Image();
      img.src = config.logoUrl;
      img.onload = () => {
        logoImg = img;
        renderTextures();
      };
      img.onerror = () => {
        renderTextures(); // render without logo if error
      };
    } else {
      renderTextures();
    }
  }, [config]);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle idle floating
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }
  });

  // Calculate material properties
  const roughness = config.finish === "glossy" ? 0.08 : config.finish === "matte" ? 0.8 : 0.35;
  const metalness = config.material === "metal" ? 0.85 : 0.05;

  const { viewport } = useThree();
  const isMobile = viewport.width < 5;
  const scale = isMobile ? 0.7 : 1;

  return (
    <group ref={meshRef} scale={scale}>
      {/* Front Face */}
      <mesh position={[0, 0, 0.011]}>
        <planeGeometry args={[3.375, 2.125]} />
        {frontTexture && <meshStandardMaterial map={frontTexture} roughness={roughness} metalness={metalness} />}
      </mesh>
      
      {/* Core (Edges) */}
      <mesh>
        <boxGeometry args={[3.375, 2.125, 0.02]} />
        <meshStandardMaterial color={config.material === "metal" ? "#111" : "#050505"} roughness={roughness} metalness={metalness} />
      </mesh>

      {/* Back Face */}
      <mesh position={[0, 0, -0.011]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[3.375, 2.125]} />
        {backTexture && <meshStandardMaterial map={backTexture} roughness={roughness} metalness={metalness} />}
      </mesh>
    </group>
  );
}

export default function Configurator3DCanvas({ config }: { config: ConfiguratorState }) {
  return (
    <div className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }}>
        <ambientLight intensity={0.65} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
        <pointLight position={[-5, 3, -5]} intensity={0.7} color="#ffffff" />
        <Environment preset="city" />
        
        <ConfigCardMesh config={config} />
        
        <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={10} />
        
        {/* Allows the user to spin the card around */}
        <OrbitControls enableZoom={true} enablePan={false} minDistance={3} maxDistance={6} />
      </Canvas>
    </div>
  );
}
