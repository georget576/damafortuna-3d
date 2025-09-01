'use client';

import { Candle } from '../Candle';

interface Scene2Props {
  candleLit: boolean;
  onCandleLight: () => void;
}

export function Scene2({ candleLit, onCandleLight }: Scene2Props) {
  console.log(`[Scene2] Rendering - candleLit: ${candleLit}`);
  
  return (
    <>
      <Candle
        position={[0, 0.8, 0]}
        isLit={candleLit}
        onLight={onCandleLight}
      />
      
      {/* Enhanced ambient light for Scene 2 */}
      <ambientLight intensity={0.4} color="#404040" />
      
      {/* Main directional light to illuminate the scene */}
      <directionalLight
        position={[3, 6, 3]}
        intensity={1.0}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      {/* Focused point light on the candle for better visibility */}
      <pointLight
        position={[0, 2, 1]}
        intensity={candleLit ? 2.5 : 1.2}
        color={candleLit ? "#ffaa66" : "#ffffff"}
        distance={8}
        decay={1.5}
      />
      
      {/* Spotlight to highlight the candle from above and side */}
      <spotLight
        position={[1, 4, 2]}
        intensity={1.2}
        angle={Math.PI / 3}
        penumbra={0.4}
        distance={10}
        decay={1.5}
        castShadow
        target-position={[0, 0.8, 0]}
        color="#ffffff"
      />
      
      {/* Fill light from the opposite side for better balance */}
      <directionalLight
        position={[-2, 3, -1]}
        intensity={0.6}
        color="#88ccff"
        castShadow
      />
    </>
  );
}