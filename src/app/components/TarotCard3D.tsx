'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { TarotCardData } from '@/app/types/tarot';
import { useTexture } from '@react-three/drei';
import { Mesh, MeshStandardMaterial, DoubleSide } from 'three';
import { RoundedBoxGeometry } from 'three-stdlib';
import { useFrame } from '@react-three/fiber';

interface TarotCard3DProps {
  card: TarotCardData;
  isFaceUp: boolean;
  position?: [number, number, number];
  rotation?: [number, number, number];
  onClick?: () => void;
}

export const TarotCard3D: React.FC<TarotCard3DProps> = ({
  card,
  isFaceUp: initialIsFaceUp,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  onClick,
}) => {
  const meshRef = useRef<Mesh>(null);
  
  // Load textures at the top level of the component
  const frontPath = useMemo(() => {
    if (!card.image) return '/rider-waite/back.jpg';
    
    // Handle both absolute paths and relative paths
    if (card.image.startsWith('/')) {
      return card.image.startsWith('/rider-waite/') ? card.image : `/rider-waite${card.image}`;
    }
    
    // If it's already a full URL, use it as is
    if (card.image.includes('://')) {
      return card.image;
    }
    
    // Default to rider-waite folder
    return `/rider-waite/${card.image}`;
  }, [card.image]);
  
  const frontTexture = useTexture(frontPath);
  const backTexture = useTexture('/rider-waite/back.jpg');

  // Base rotation without any reversed logic
  const baseRotation = useMemo(() => {
    return [
      rotation[0],  // X-axis rotation
      rotation[1],  // Y-axis rotation
      rotation[2]   // Z-axis rotation
    ] as [number, number, number];
  }, [rotation]);

  // Set rotation based on base rotation and face up state
  useEffect(() => {
    if (meshRef.current) {
      // Apply base rotation
      meshRef.current.rotation.x = baseRotation[0];
      meshRef.current.rotation.y = baseRotation[1];
      meshRef.current.rotation.z = baseRotation[2];
      
      // Apply flip rotation based on face up state
      const flipRotation = initialIsFaceUp ? Math.PI : 0;
      meshRef.current.rotation.x += flipRotation;
    }
  }, [baseRotation, initialIsFaceUp]);

  const handleClick = () => {
    onClick?.();
  };

  // Create materials for each face with proper UV mapping
  const materials = useMemo(() => {
    // Face indices: 0:right, 1:left, 2:top, 3:bottom, 4:front, 5:back
    return [
      new MeshStandardMaterial({ color: 0x8B4513 }), // right - brown
      new MeshStandardMaterial({ color: 0x8B4513 }), // left - brown
      new MeshStandardMaterial({ color: 0x8B4513 }), // top - brown
      new MeshStandardMaterial({ color: 0x8B4513 }), // bottom - brown
      new MeshStandardMaterial({
        map: initialIsFaceUp ? frontTexture : backTexture,
        color: 0xffffff,
        side: DoubleSide
      }), // front - shows card face when face up, back when face down
      new MeshStandardMaterial({
        map: initialIsFaceUp ? backTexture : frontTexture,
        color: 0xffffff,
        side: DoubleSide
      }),  // back - shows back when face up, card face when face down
    ];
  }, [frontTexture, backTexture, initialIsFaceUp]);

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
      scale={[1.2, 1.2, 1.2]} // Slightly larger cards
    >
      <primitive object={new RoundedBoxGeometry(1.8, 3, 0.03, 12, 0.25)} />
      <primitive object={materials} attach="material" />
    </mesh>
  );
};
