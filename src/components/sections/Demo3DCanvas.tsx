"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, ThreeEvent, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { drawCardFront, drawCardBack } from "@/utils/cardCanvas";
import { drawProfileScreen } from "@/utils/profileCanvas";

function DemoScene({ isPlaying }: { isPlaying: boolean }) {
  const cardRef = useRef<THREE.Group>(null);
  const phoneRef = useRef<THREE.Group>(null);
  const nfcGlowRef = useRef<THREE.Mesh>(null);
  
  // Interactive States
  const [phase, setPhase] = useState<"idle" | "tapping" | "scrolling">("idle");
  const animTime = useRef(0);
  
  // Smooth Scrolling Physics
  const scrollYRef = useRef(0);
  const scrollVelocity = useRef(0);
  const maxScroll = 600;

  // Dragging state for phone screen
  const isDragging = useRef(false);
  const previousY = useRef(0);

  // Textures
  const cardFrontTexture = React.useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 646;
    drawCardFront(canvas, "Alex Sterling", "CEO", "TAPFOLIO", "#0a0a0a", "metal", "matte", null);
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 16;
    return tex;
  }, []);

  const cardBackTexture = React.useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 646;
    drawCardBack(canvas, "#0a0a0a", "metal", "matte", "Alex Sterling");
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 16;
    return tex;
  }, []);

  const phoneTexture = React.useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 1024;
    drawProfileScreen(canvas, 0, "Alex Sterling", "CEO", "TAPFOLIO", "#2563EB", null, null);
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 16;
    return tex;
  }, []);

  // Sync scrollY to Texture
  const updatePhoneScreen = () => {
    if (!phoneTexture) return;
    drawProfileScreen(phoneTexture.image, scrollYRef.current, "Alex Sterling", "CEO", "TAPFOLIO", "#2563EB", null, null);
    phoneTexture.needsUpdate = true;
  };

  useEffect(() => {
    if (isPlaying && phase === "idle") {
      setPhase("tapping");
      animTime.current = 0;
    }
  }, [isPlaying, phase]);

  useFrame((state, delta) => {
    if (!cardRef.current || !phoneRef.current) return;

    if (phase === "idle") {
      // Idle floating state
      cardRef.current.position.y = THREE.MathUtils.damp(cardRef.current.position.y, 2 + Math.sin(state.clock.elapsedTime * 2) * 0.1, 4, delta);
      cardRef.current.position.z = THREE.MathUtils.damp(cardRef.current.position.z, 1.5, 4, delta);
      cardRef.current.position.x = THREE.MathUtils.damp(cardRef.current.position.x, 0, 4, delta);
      cardRef.current.rotation.x = THREE.MathUtils.damp(cardRef.current.rotation.x, Math.PI / 6, 4, delta);
      cardRef.current.rotation.y = THREE.MathUtils.damp(cardRef.current.rotation.y, Math.sin(state.clock.elapsedTime) * 0.2, 4, delta);
      
      phoneRef.current.rotation.y = THREE.MathUtils.damp(phoneRef.current.rotation.y, Math.PI, 4, delta); // Show back
      phoneRef.current.rotation.x = THREE.MathUtils.damp(phoneRef.current.rotation.x, -Math.PI / 4, 4, delta);
      phoneRef.current.position.y = Math.cos(state.clock.elapsedTime * 1.5) * 0.1;
      
      if (nfcGlowRef.current) {
        (nfcGlowRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
      }
      
    } else if (phase === "tapping") {
      animTime.current += delta;
      const t = animTime.current;
      
      if (t < 0.6) {
        // Tapping motion (quick snap down)
        const progress = t / 0.6;
        const ease = 1 - Math.pow(1 - progress, 3);
        cardRef.current.position.y = THREE.MathUtils.lerp(2, 0.5, ease);
        cardRef.current.position.z = THREE.MathUtils.lerp(1.5, -0.5, ease);
        cardRef.current.rotation.x = THREE.MathUtils.lerp(Math.PI / 6, Math.PI / 2, ease);
        cardRef.current.rotation.y = 0;
        
        phoneRef.current.rotation.y = Math.PI;
        phoneRef.current.rotation.x = -Math.PI / 4;
      } else if (t >= 0.6 && t < 1.0) {
        // Hold tap - trigger NFC glow
        cardRef.current.position.z = -0.52; // slight push
        if (nfcGlowRef.current) {
          const glowProgress = (t - 0.6) / 0.4; // 0 to 1
          const mat = nfcGlowRef.current.material as THREE.MeshBasicMaterial;
          mat.opacity = Math.sin(glowProgress * Math.PI) * 0.8;
          nfcGlowRef.current.scale.setScalar(1 + glowProgress * 2);
        }
      } else if (t >= 1.0 && t < 2.2) {
        // Phone flips over to reveal front
        const flipProgress = (t - 1.0) / 1.2;
        const easeFlip = 1 - Math.pow(1 - flipProgress, 3);
        phoneRef.current.rotation.y = THREE.MathUtils.lerp(Math.PI, 0, easeFlip);
        phoneRef.current.rotation.x = THREE.MathUtils.lerp(-Math.PI / 4, 0, easeFlip);
        
        // Card flies away to the right smoothly
        cardRef.current.position.x = THREE.MathUtils.damp(cardRef.current.position.x, 8, 2, delta);
        cardRef.current.position.y = THREE.MathUtils.damp(cardRef.current.position.y, 4, 2, delta);
        
        if (nfcGlowRef.current) {
          (nfcGlowRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
        }
      } else if (t >= 2.2) {
        // Transition to scrolling interactive phase
        setPhase("scrolling");
      }
    } else if (phase === "scrolling") {
      // Float the phone gently while facing the user
      phoneRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
      
      // Phone gently tracks mouse X and Y using damped interpolation
      const mouseX = (state.pointer.x * Math.PI) / 12;
      const mouseY = -(state.pointer.y * Math.PI) / 12;
      phoneRef.current.rotation.y = THREE.MathUtils.damp(phoneRef.current.rotation.y, mouseX, 4, delta);
      phoneRef.current.rotation.x = THREE.MathUtils.damp(phoneRef.current.rotation.x, mouseY, 4, delta);

      // Handle Inertia Scrolling Update
      if (Math.abs(scrollVelocity.current) > 0.1) {
        scrollYRef.current += scrollVelocity.current;
        scrollVelocity.current *= 0.9; // Friction
        
        // Hard clamp at boundaries with a bounce effect
        if (scrollYRef.current < 0) {
          scrollYRef.current = 0;
          scrollVelocity.current *= -0.5;
        }
        if (scrollYRef.current > maxScroll) {
          scrollYRef.current = maxScroll;
          scrollVelocity.current *= -0.5;
        }
        updatePhoneScreen();
      }
    }
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (phase === "scrolling") {
      isDragging.current = true;
      previousY.current = e.clientY;
      scrollVelocity.current = 0; // stop current inertia
      if (typeof window !== "undefined") {
        document.body.style.cursor = "grabbing";
      }
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    if (typeof window !== "undefined") {
      document.body.style.cursor = "auto";
    }
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (phase === "scrolling" && isDragging.current) {
      e.stopPropagation();
      const deltaY = previousY.current - e.clientY;
      previousY.current = e.clientY;
      
      // Inject velocity instead of setting scroll position directly
      scrollVelocity.current = deltaY * 1.2;
    }
  };

  const { viewport } = useThree();
  const isMobile = viewport.width < 5;
  const scale = isMobile ? 0.7 : 1;

  return (
    <group onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} scale={scale}>
      {/* TapFolio Card */}
      <group 
        ref={cardRef} 
        onClick={() => {
          if (phase === "idle") {
            setPhase("tapping");
            animTime.current = 0;
          }
        }}
        onPointerOver={() => {
          if (phase === "idle" && typeof window !== "undefined") {
            document.body.style.cursor = "pointer";
          }
        }}
        onPointerOut={() => {
          if (typeof window !== "undefined") document.body.style.cursor = "auto";
        }}
      >
        <mesh position={[0, 0, 0.011]}>
          <planeGeometry args={[3.375 * 0.7, 2.125 * 0.7]} />
          {cardFrontTexture && <meshStandardMaterial map={cardFrontTexture} roughness={0.3} metalness={0.6} />}
        </mesh>
        <mesh>
          <boxGeometry args={[3.375 * 0.7, 2.125 * 0.7, 0.02]} />
          <meshStandardMaterial color="#050505" />
        </mesh>
        <mesh position={[0, 0, -0.011]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[3.375 * 0.7, 2.125 * 0.7]} />
          {cardBackTexture && <meshStandardMaterial map={cardBackTexture} roughness={0.3} metalness={0.6} />}
        </mesh>
      </group>

      {/* Smartphone */}
      <group 
        ref={phoneRef} 
        position={[0, -1, 0]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      >
        {/* Phone Body */}
        <mesh castShadow>
          <boxGeometry args={[2.3, 4.5, 0.12]} />
          <meshStandardMaterial color="#1f1f24" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Screen Bezel */}
        <mesh position={[0, 0, 0.065]}>
          <boxGeometry args={[2.34, 4.54, 0.02]} />
          <meshStandardMaterial color="#000" metalness={0.3} roughness={0.7} />
        </mesh>
        
        {/* Profile Screen Base (Texture + Emissive Glow) */}
        <mesh position={[0, 0, 0.076]}>
          <planeGeometry args={[2.18, 4.38]} />
          {phoneTexture && (
            <meshStandardMaterial 
              map={phoneTexture} 
              roughness={0.4} 
              emissiveMap={phoneTexture}
              emissive={new THREE.Color(0x222222)}
            />
          )}
        </mesh>
        
        {/* Screen Glass Cover for Realistic Glare */}
        <mesh position={[0, 0, 0.078]}>
          <planeGeometry args={[2.18, 4.38]} />
          <meshPhysicalMaterial 
            transparent 
            opacity={0.15} 
            roughness={0.0} 
            metalness={0.2} 
            clearcoat={1.0} 
            clearcoatRoughness={0.1} 
          />
        </mesh>

        {/* Back Camera Bump */}
        <mesh position={[0.6, 1.6, -0.07]}>
          <boxGeometry args={[0.8, 0.8, 0.06]} />
          <meshStandardMaterial color="#111" roughness={0.2} metalness={0.9} />
        </mesh>

        {/* NFC Tap Glow Indicator on the back of phone */}
        <mesh position={[0, 1.5, -0.08]} ref={nfcGlowRef}>
          <ringGeometry args={[0.3, 0.4, 32]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0} side={THREE.DoubleSide} />
        </mesh>
      </group>

      <ContactShadows position={[0, -4, 0]} opacity={0.4} scale={10} blur={2} far={10} />
    </group>
  );
}

export default function Demo3DCanvas({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 10, 5]} intensity={2.0} castShadow />
        <pointLight position={[-5, -5, -5]} intensity={1.0} color="#aaddff" />
        <Environment preset="city" />
        <DemoScene isPlaying={isPlaying} />
      </Canvas>
    </div>
  );
}
