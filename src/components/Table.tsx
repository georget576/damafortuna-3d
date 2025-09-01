'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { useGLTF } from '@react-three/drei';
import { useVisibilityCulling } from '@/app/hooks/useVisibilityCulling';

interface TableProps {
  position: [number, number, number];
}

export function Table({ position }: TableProps) {
  const tableRef = useRef<Group>(null);

  // Load the table model only once and memoize
  const { scene } = useGLTF('/assets/table.glb');
  
  // Debug logging only once during development
  if (process.env.NODE_ENV === 'development' && scene) {
    console.log(`[Table] GLTF scene loaded: Success`);
  }

  // Use visibility culling to optimize animation
  const { isVisible } = useVisibilityCulling(tableRef, {
    enableDistanceCulling: true,
    enableFrustumCulling: true,
    cullingDistance: 20, // Table is a large object, use farther culling distance
    checkInterval: 200, // Check less frequently for static objects
  });

  // Subtle animation for table - optimized with culling
  useFrame((state) => {
    if (!tableRef.current || !isVisible) return;
    
    // Adaptive animation based on visibility
    const animationSpeed = isVisible ? 0.1 : 0;
    const amplitude = isVisible ? 0.005 : 0;
    
    // Gentle swaying motion with adaptive performance
    tableRef.current.rotation.z = Math.sin(state.clock.elapsedTime * animationSpeed) * amplitude;
    
    // Minimal performance logging to minimize impact
    if (process.env.NODE_ENV === 'development' && Math.random() < 0.0005) { // Log 0.05% of frames
      console.log(`[Table] Animation active - Visible: ${isVisible}`);
    }
  });

  return (
    <group
      position={position}
      ref={tableRef}
    >
      {/* Table 3D Model */}
      <primitive object={scene.clone()} scale={[1, 1, 1]} />
    </group>
  );
}