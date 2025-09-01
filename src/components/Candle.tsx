'use client';

import { useRef, useState } from 'react';
import { Group } from 'three';
import { useGLTF } from '@react-three/drei';
import { useVisibilityCulling } from '@/app/hooks/useVisibilityCulling';
import { LitCandle } from './LitCandle';

interface CandleProps {
  position: [number, number, number];
  isLit: boolean;
  onLight: () => void;
}

export function Candle({ position, isLit, onLight }: CandleProps) {
  const candleRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Load unlit candle model
  const { scene: candleUnlit } = useGLTF('/assets/candle.glb');

  // Use visibility culling to optimize animation
  const { isVisible } = useVisibilityCulling(candleRef, {
    enableDistanceCulling: true,
    enableFrustumCulling: true,
    cullingDistance: 15,
    checkInterval: 100,
  });

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    // If match is near candle and dragging ends, light the candle
    if (isDragging) {
      onLight();
    }
  };

  return (
    <group
      position={position}
      ref={candleRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onPointerDown={() => {
        setClicking(true);
        handleDragStart();
      }}
      onPointerUp={() => {
        setClicking(false);
        handleDragEnd();
      }}
    >
      {/* Candle 3D Model */}
      {isLit ? (
        <LitCandle position={[0, 0, 0]} isVisible={isVisible} />
      ) : (
        <primitive object={candleUnlit.clone()} scale={[0.8, 0.8, 0.8]} />
      )}
      
      {/* Hover and click effects */}
      {hovered && !isLit && (
        <pointLight
          position={[0, 1.2, 0]}
          intensity={0.3}
          color="#ffffff"
        />
      )}
      
      {clicking && !isLit && (
        <pointLight
          position={[0, 1.2, 0]}
          intensity={0.6}
          color="#ffeb99"
        />
      )}
    </group>
  );
}


