'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PointLight, SpotLight, DirectionalLight } from 'three';

interface LightingSystemProps {
  matchLit: boolean;
  candleLit: boolean;
  moonGlowing: boolean;
  currentScene?: number; // Add currentScene to track scene for dynamic lighting
}

export function LightingSystem({ matchLit, candleLit, moonGlowing, currentScene }: LightingSystemProps) {
  const moonLightRef = useRef<PointLight>(null);
  const spotLightRef = useRef<SpotLight>(null);

  // Animate moon glow intensity - Optimized to run only when needed
  useFrame((state) => {
    // Skip animation if moon is not glowing
    if (!moonGlowing) return;
    
    // Only update refs if they exist
    if (moonLightRef.current) {
      const intensity = 5 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
      moonLightRef.current.intensity = intensity;
    }
    
    if (spotLightRef.current) {
      const intensity = 3 + Math.sin(state.clock.elapsedTime * 1.5) * 0.3;
      spotLightRef.current.intensity = intensity;
    }
    
    // Dynamic lighting for different scenes - camera-following effect
    if (currentScene === 3) {
      // Calculate a point between candle and moon for dynamic lighting
      const candlePos = [0, 0.8, 0];
      const moonPos = [0, 8, -10];
      
      // Interpolate between candle and moon based on time for a pulsing effect
      const pulseFactor = (Math.sin(state.clock.elapsedTime * 0.5) + 1) / 2;
      
      // Dynamic light position that follows the camera's upward pan
      const dynamicLightX = candlePos[0] + (moonPos[0] - candlePos[0]) * pulseFactor;
      const dynamicLightY = candlePos[1] + (moonPos[1] - candlePos[1]) * pulseFactor;
      const dynamicLightZ = candlePos[2] + (moonPos[2] - candlePos[2]) * pulseFactor;
      
      // Adjust candle light intensity based on the pulse
      if (moonLightRef.current) {
        moonLightRef.current.position.set(dynamicLightX, dynamicLightY, dynamicLightZ);
      }
      
      if (spotLightRef.current) {
        spotLightRef.current.position.set(dynamicLightX, dynamicLightY, dynamicLightZ);
      }
    } else if (currentScene === 4) {
      // Scene 4: Enhanced moon lighting that follows the moon position
      if (moonLightRef.current) {
        // Moon light follows the moon position with slight offset for better effect
        moonLightRef.current.position.set(0, 8, -10);
        // Increase intensity when scene is focused on moon
        moonLightRef.current.intensity = 8 + Math.sin(state.clock.elapsedTime * 2) * 1;
      }
      
      if (spotLightRef.current) {
        spotLightRef.current.position.set(0, 8, -10);
        spotLightRef.current.intensity = 5 + Math.sin(state.clock.elapsedTime * 1.5) * 0.8;
      }
    } else if (currentScene === 5) {
      // Scene 5: Table-focused lighting
      // Create soft, focused lighting for the table
      const tablePos = [0, 0, 0];
      
      if (moonLightRef.current) {
        // Moon light provides ambient illumination
        moonLightRef.current.position.set(0, 5, -5);
        moonLightRef.current.intensity = 3 + Math.sin(state.clock.elapsedTime * 1) * 0.3;
      }
      
      if (spotLightRef.current) {
        // Spotlight focuses on the table surface
        spotLightRef.current.position.set(0, 3, -2);
        spotLightRef.current.target.position.set(tablePos[0], tablePos[1], tablePos[2]);
        spotLightRef.current.intensity = 2 + Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
      }
    } else if (currentScene === 6) {
      // Scene 6: Balanced lighting for welcome message and moon
      const moonPos = [0, 8, -10];
      const welcomePos = [0, 2, 0];
      
      if (moonLightRef.current) {
        // Moon light provides soft illumination
        moonLightRef.current.position.set(moonPos[0], moonPos[1], moonPos[2]);
        moonLightRef.current.intensity = 4 + Math.sin(state.clock.elapsedTime * 1.5) * 0.5;
      }
      
      if (spotLightRef.current) {
        // Spotlight provides focused illumination for welcome area
        spotLightRef.current.position.set(0, 4, -1);
        spotLightRef.current.target.position.set(welcomePos[0], welcomePos[1], welcomePos[2]);
        spotLightRef.current.intensity = 2.5 + Math.sin(state.clock.elapsedTime * 1.2) * 0.4;
      }
    }
    
    // Reduced debug logging to minimize performance impact
    if (process.env.NODE_ENV === 'development' && Math.random() < 0.001) { // Log 0.1% of frames
      console.log(`[Lighting] Moon light active - moonGlowing: ${moonGlowing}`);
    }
  });

  return (
    <>
      {/* Ambient light for base scene illumination */}
      <ambientLight intensity={0.3} color="#505050" />
      
      {/* Main directional light (sun/moon light) */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={moonGlowing ? 1.2 : 0.6} // Increased intensity when moon is glowing
        color={moonGlowing ? '#ffffff' : '#ffffcc'}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Match light when lit */}
      {matchLit && (
        <pointLight
          position={[0, 1.5, 0]}
          intensity={2}
          color="#ff6b35"
          distance={8}
          decay={2}
          castShadow
        />
      )}
      
      {/* Subtle light for unlit Match in Scene 1 */}
      <pointLight
        position={[0, 2, 1]}
        intensity={0.8}
        color="#ffaa66"
        distance={6}
        decay={1.5}
      />
      
      {/* Candle light when lit */}
      {candleLit && (
        <pointLight
          position={[0, 1.4, 0]} // Centered on candle
          intensity={4} // Increased intensity
          color="#ffa500"
          distance={15} // Increased distance
          decay={1.2} // Adjusted decay
          castShadow
        />
      )}
      
      {/* Reduced moon lighting - individual scenes handle detailed moon lighting */}
      {moonGlowing && currentScene !== 3 && currentScene !== 4 && currentScene !== 6 && (
        <>
          {/* Subtle ambient moon glow */}
          <pointLight
            position={[0, 8, -10]}
            intensity={1.5}
            color="#e6f3ff"
            distance={30}
            decay={0.5}
          />
        </>
      )}
      
      {/* Fill light for better visibility */}
      <pointLight
        position={[-5, 5, -5]}
        intensity={0.8}
        color="#88ccff"
        distance={20}
        decay={1}
      />
      
      {/* Rim light for dramatic effect */}
      <pointLight
        position={[5, 8, -5]}
        intensity={0.3}
        color="#ffaa88"
        distance={15}
        decay={1.5}
      />
    </>
  );
}