'use client';

import { Match } from '../Match';

interface Scene1Props {
  matchLit: boolean;
  onMatchLight: () => void;
}

export function Scene1({ matchLit, onMatchLight }: Scene1Props) {
  return (
    <>
      <Match
        position={[0, 0.5, 0]}
        isLit={matchLit}
        onClick={onMatchLight}
      />
      
      {/* Enhanced ambient light for Scene 1 */}
      <ambientLight intensity={0.6} />
      
      {/* Enhanced directional light to illuminate the scene */}
      <directionalLight
        position={[2, 5, 2]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Enhanced point light focused on the match */}
      <pointLight
        position={[0, 1, 0]}
        intensity={matchLit ? 3 : 1.5}
        color="#ffffff"
        distance={10}
        decay={2}
      />
      
      {/* Additional spotlight to highlight the match from above */}
      <spotLight
        position={[0, 4, 0]}
        intensity={1.5}
        angle={Math.PI / 4}
        penumbra={0.3}
        distance={10}
        decay={2}
        castShadow
        target-position={[0, 0.5, 0]}
      />
      
      {/* Fill light from the side */}
      <directionalLight
        position={[-3, 3, -2]}
        intensity={0.8}
        castShadow
      />
    </>
  );
}
