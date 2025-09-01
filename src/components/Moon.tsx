'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh, MeshStandardMaterial, TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';
import { useVisibilityCulling } from '@/app/hooks/useVisibilityCulling';

interface MoonProps {
  position: [number, number, number];
  isGlowing: boolean;
  onGlow: () => void;
}

export function Moon({ position, isGlowing, onGlow }: MoonProps) {
  const moonRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  
  // Load moon texture
  const moonTexture = useLoader(TextureLoader, '/assets/textures/moon.png');

  // Use visibility culling to optimize animation
  const { isVisible } = useVisibilityCulling(moonRef, {
    enableDistanceCulling: true,
    enableFrustumCulling: true,
    cullingDistance: 25, // Moon is often far away, use longer culling distance
    checkInterval: 150, // Check less frequently for background objects
  });

  // Animation for moon glow effect - optimized with culling
  useFrame((state) => {
    if (!moonRef.current) return;
    
    // Gentle rotation with adaptive performance
    const rotationSpeed = isVisible ? 0.03 : 0;
    moonRef.current.rotation.y = state.clock.elapsedTime * rotationSpeed;
    
    // Pulsing glow effect - only when needed and with adaptive intensity
    if (isGlowing && isVisible) {
      // Increased intensity: from 2% to 8% scale variation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.08;
      moonRef.current.scale.set(scale, scale, scale);
      
      // Add a secondary pulsing effect for more dramatic glow
      const secondaryScale = 1 + Math.sin(state.clock.elapsedTime * 2.5) * 0.03;
      moonRef.current.scale.multiplyScalar(secondaryScale);
    } else if (moonRef.current.scale.x !== 1) {
      // Reset scale when not glowing
      moonRef.current.scale.set(1, 1, 1);
    }
    
    // Minimal performance logging to minimize impact
    if (process.env.NODE_ENV === 'development' && Math.random() < 0.0005) { // Log 0.05% of frames
      console.log(`[Moon] Animation active - isGlowing: ${isGlowing}, Visible: ${isVisible}`);
    }
  });

  return (
    <group
      position={position}
      ref={moonRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Moon 3D Geometry with texture mapping */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          map={moonTexture}
          roughness={0.3} // Reduced roughness for better light reflection
          metalness={0.1} // Slightly reduced metalness
          emissive={isGlowing ? "#e6f3ff" : "#000000"} // Add emissive property for glowing effect
          emissiveIntensity={isGlowing ? 0.4 : 0} // Emissive intensity when glowing
          transparent={true}
          opacity={0.95}
        />
      </mesh>
    </group>
  );
}