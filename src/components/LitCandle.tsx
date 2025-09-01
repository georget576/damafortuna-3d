'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { useGLTF } from '@react-three/drei';
import { useVisibilityCulling } from '@/app/hooks/useVisibilityCulling';

interface LitCandleProps {
  position: [number, number, number];
  isVisible: boolean;
}

export function LitCandle({ position, isVisible }: LitCandleProps) {
  const candleRef = useRef<Group>(null);

  // Load the lit candle model
  const { scene: candleLit } = useGLTF('/assets/candlelit.glb');

  // Use visibility culling to optimize animation
  const { isVisible: actualVisibility } = useVisibilityCulling(candleRef, {
    enableDistanceCulling: true,
    enableFrustumCulling: true,
    cullingDistance: 15,
    checkInterval: 100,
  });

  // Animation for lit candle - optimized with culling
  useFrame((state) => {
    if (!candleRef.current || !actualVisibility) return;
    
    // Adaptive flickering effect based on visibility
    const animationSpeed = actualVisibility ? 1.5 : 0;
    const amplitude = actualVisibility ? 0.01 : 0;
    
    // Subtle flickering effect with adaptive performance
    candleRef.current.rotation.z = Math.sin(state.clock.elapsedTime * animationSpeed) * amplitude;
    
    // Minimal performance logging to minimize impact
    if (process.env.NODE_ENV === 'development' && Math.random() < 0.0005) { // Log 0.05% of frames
      console.log(`[LitCandle] Animation active - Visible: ${actualVisibility}`);
    }
  });

  return (
    <group position={position} ref={candleRef}>
      {/* Lit Candle 3D Model */}
      <primitive object={candleLit.clone()} scale={[0.8, 0.8, 0.8]} />
      
      {/* Glow effect when lit - consistent with match flame */}
      {isVisible && actualVisibility && (
        <pointLight
          position={[0, 1.4, 0]}
          intensity={1.5}
          color="#ff6b35"
          distance={4}
          decay={2}
        />
      )}
    </group>
  );
}