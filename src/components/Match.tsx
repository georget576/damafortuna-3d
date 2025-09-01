'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Group } from 'three';
import { useMatchAnimation } from '@/app/hooks/useMatchAnimation';
import { FlameEffects } from './FlameEffects';

interface MatchProps {
  position: [number, number, number];
  isLit: boolean;
  onClick: () => void;
  rotation?: [number, number, number];
}

function MatchModel({ isLit }: { isLit: boolean }) {
  // Create a custom match model using Three.js geometry
  return (
    <group>
      {/* Match body - rectangular cuboid */}
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[0.1, 1.8, 0.1]} />
        <meshStandardMaterial
          color={isLit ? "#8B0000" : "#8B4513"} // Dark red when lit, brown when unlit
        />
      </mesh>
      
      {/* Match head - egg-like oval sphere */}
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color={isLit ? "#8B0000" : "#2C2C2C"} // Dark red when lit, black when unlit
        />
      </mesh>
    </group>
  );
}

export function Match({
  position,
  isLit,
  onClick,
  rotation = [0, 0, 0]
}: MatchProps) {
  const matchRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const [clicking, setClicking] = useState(false);


  // Extracted hooks and utilities
  useMatchAnimation({ matchRef, isLit, enableTransform: false });

  return (
    <group
      ref={matchRef}
      position={position}
      rotation={rotation}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onPointerDown={() => setClicking(true)}
      onPointerUp={() => setClicking(false)}
    >
      {/* Match 3D Model */}
      <MatchModel isLit={isLit} />
      
      {/* Flame effect when lit - positioned at match head */}
      <FlameEffects isLit={isLit} position={[0, 1.8, 0]} />
      
      {/* Hover and click effects - positioned at match head */}
      {hovered && !isLit && (
        <pointLight
          position={[0, 1.8, 0]}
          intensity={0.5}
          color="#ffffff"
        />
      )}
      
      {clicking && !isLit && (
        <pointLight
          position={[0, 1.8, 0]}
          intensity={1}
          color="#ff6b35"
        />
      )}
    </group>
  );
}
