import { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { SpreadType, DrawCardResponse } from '@/app/types/tarot';
import { getSpreadLayout } from '@/app/utils/spreadLayout';
import { TarotCard3D } from './TarotCard3D';

interface TarotReader3DProps {
  spread: SpreadType;
  drawnCards: DrawCardResponse[];
  onCardClick?: (card: DrawCardResponse) => void;
}

export const TarotReader3D: React.FC<TarotReader3DProps> = ({
  spread,
  drawnCards,
  onCardClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set());

  // Convert Three.js objects to tuples for compatibility with TarotCard3D
  const layout = useMemo(() => {
    const threeLayout = getSpreadLayout(spread, drawnCards.length);
    return threeLayout.map(item => ({
      position: [item.position.x, item.position.y, item.position.z] as [number, number, number],
      rotation: [item.rotation.x, item.rotation.y, item.rotation.z] as [number, number, number],
    }));
  }, [spread, drawnCards.length]);

  useEffect(() => {
    // Auto-reveal cards after a short delay for dramatic effect
    const timer = setTimeout(() => {
      const newRevealed = new Set(drawnCards.map((_, index) => index));
      setRevealedCards(newRevealed);
    }, 1000);

    return () => clearTimeout(timer);
  }, [drawnCards]);

  const handleCardClick = (card: DrawCardResponse, index: number) => {
    // Manual reveal on click
    setRevealedCards(prev => new Set(prev).add(index));
    onCardClick?.(card);
  };

  return (
    <div ref={containerRef} className="canvas-container-3d w-full h-full">
      <Canvas camera={{ position: [0, 2, 12], fov: 45 }} style={{ width: '100%', height: '100%' }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
        <directionalLight position={[-10, 5, -5]} intensity={0.8} />
        <Environment preset="sunset" background={false} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={20}
          minDistance={5}
          maxPolarAngle={Math.PI / 2}
        />
        {drawnCards.map((card, index) => (
          <TarotCard3D
            key={card.id}
            card={{
              id: card.id,
              name: card.name,
              image: card.imageUrl,
              description: '',
              keywords: [],
              arcana: card.arcana.toLowerCase() as any
            }}
            position={layout[index]?.position || [0, 0, 0]}
            rotation={layout[index]?.rotation || [0, 0, 0]}
            isFaceUp={revealedCards.has(index)}
            onClick={() => handleCardClick(card, index)}
          />
        ))}
      </Canvas>
    </div>
  );
};
