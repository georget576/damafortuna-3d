'use client';

import { Moon } from '../Moon';
import { LitCandle } from '../LitCandle';

interface Scene3Props {
  moonGlowing: boolean;
  onMoonGlow: () => void;
}

export function Scene3({ moonGlowing, onMoonGlow }: Scene3Props) {
  console.log(`[Scene3] Rendering - moonGlowing: ${moonGlowing}`);
  
  return (
    <>
      {/* Multiple powerful spotlights to dramatically increase moon glow intensity */}
      <spotLight
        position={[0, 3.5, 8]} // Positioned behind the camera (camera ends at [0, 3.5, 8])
        angle={Math.PI / 3} // 60-degree cone for wider coverage
        penumbra={0.1} // Sharper edges for more focused light
        intensity={moonGlowing ? 25 : 0} // Increased intensity when moon is glowing
        color="#ffffff"
        distance={40}
        decay={0.3}
        castShadow
        target-position={[0, 8, -10]} // Aimed directly at the moon
      />
      
      {/* Secondary spotlight from a different angle */}
      <spotLight
        position={[3, 6, 5]} // Positioned to the side and above
        angle={Math.PI / 4} // 45-degree cone
        penumbra={0.2}
        intensity={moonGlowing ? 20 : 0} // Increased intensity when moon is glowing
        color="#e6f3ff"
        distance={40}
        decay={0.4}
        castShadow
        target-position={[0, 8, -10]} // Aimed directly at the moon
      />
      
      {/* Tertiary spotlight from opposite side */}
      <spotLight
        position={[-3, 6, 5]} // Positioned to the opposite side and above
        angle={Math.PI / 4} // 45-degree cone
        penumbra={0.2}
        intensity={moonGlowing ? 20 : 0} // Increased intensity when moon is glowing
        color="#e6f3ff"
        distance={40}
        decay={0.4}
        castShadow
        target-position={[0, 8, -10]} // Aimed directly at the moon
      />
      
      {/* Additional spotlight to illuminate the candle area since it's now in front */}
      <spotLight
        position={[0, 2, 5]} // Positioned to illuminate the candle area
        angle={Math.PI / 2} // 90-degree cone for broader coverage
        penumbra={0.3}
        intensity={3} // Constant illumination for the candle
        color="#ffaa66"
        distance={15}
        decay={0.5}
        castShadow
        target-position={[0, 1, 2]} // Aimed at the candle position
      />
      
      {/* Powerful point light positioned in front of the moon for better illumination */}
      <pointLight
        position={[0, 10, -15]} // Positioned in front of the moon
        intensity={moonGlowing ? 30 : 0} // Increased intensity
        color="#ffffff"
        distance={60}
        decay={0.2}
      />
      
      {/* Additional ambient light around the moon */}
      <pointLight
        position={[0, 5, -5]} // Positioned below and in front
        intensity={moonGlowing ? 8 : 0} // Supporting intensity
        color="#e6f3ff"
        distance={30}
        decay={0.5}
      />
      
      {/* Additional point light to illuminate the candle area */}
      <pointLight
        position={[0, 2, 2]} // Positioned near the candle
        intensity={5} // Constant illumination for the candle
        color="#ff9944"
        distance={8}
        decay={1}
      />
      
      {/* Moon positioned above and behind */}
      <Moon
        position={[0, 8, -10]}
        isGlowing={moonGlowing}
        onGlow={onMoonGlow}
      />
      
      {/* Candle lit (always lit in this scene) - positioned in front of moon */}
      <LitCandle
        position={[0, 0.8, 2]} // Moved forward in Z-axis to be in front of moon
        isVisible={true} // Always visible in this scene
      />
    </>
  );
}