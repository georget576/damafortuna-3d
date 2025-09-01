'use client';

import { Table } from "../Table";
import { Moon } from '../Moon';

interface Scene4_6Props {
  sceneNumber: number;
  moonGlowing: boolean;
}

export function Scene4_6({ sceneNumber, moonGlowing }: Scene4_6Props) {
  // Debug logging only once during development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Scene4_6] Rendering for scene ${sceneNumber}, moonGlowing: ${moonGlowing}`);
  }
  
  return (
    <>
      {/* Scene 4: Moon only */}
      {sceneNumber === 4 && (
        <>
          <Moon position={[0, 8, -10]} isGlowing={moonGlowing} onGlow={() => {}} />
          
          {/* Ultra-high-intensity light sources behind camera to illuminate moon from front */}
          <spotLight
            position={[0, 3.5, 8]} // Positioned behind camera (camera ends at [0, 3.5, 8])
            angle={Math.PI / 3} // 60-degree cone for wider coverage
            penumbra={0.1} // Sharper edges for more focused light
            intensity={moonGlowing ? 60 : 0} // Increased intensity
            color="#ffffff"
            distance={50}
            decay={0.2}
            castShadow
            target-position={[0, 8, -10]} // Aimed directly at the moon
          />
          
          {/* Secondary spotlight from behind camera at different angle */}
          <spotLight
            position={[3, 4, 7]} // Positioned to the side and behind camera
            angle={Math.PI / 4} // 45-degree cone
            penumbra={0.15}
            intensity={moonGlowing ? 50 : 0} // Increased intensity
            color="#e6f3ff"
            distance={55}
            decay={0.3}
            castShadow
            target-position={[0, 8, -10]}
          />
          
          {/* Tertiary spotlight from opposite side behind camera */}
          <spotLight
            position={[-3, 4, 7]} // Positioned to opposite side and behind camera
            angle={Math.PI / 4} // 45-degree cone
            penumbra={0.15}
            intensity={moonGlowing ? 50 : 0} // Increased intensity
            color="#e6f3ff"
            distance={55}
            decay={0.3}
            castShadow
            target-position={[0, 8, -10]}
          />
          
          {/* Ultra-powerful point light positioned in front of the moon */}
          <pointLight
            position={[0, 10, -15]} // Positioned in front of the moon
            intensity={moonGlowing ? 80 : 0} // Increased intensity
            color="#ffffff"
            distance={100}
            decay={0.1}
          />
          
          {/* Additional rim lighting for dramatic effect */}
          <spotLight
            position={[5, 10, -8]}
            angle={Math.PI / 3} // 60-degree cone
            penumbra={0.3}
            intensity={moonGlowing ? 40 : 0} // Increased intensity
            color="#cce7ff"
            distance={60}
            decay={0.3}
            target-position={[0, 8, -10]}
          />
          
          {/* Additional front lighting for maximum illumination */}
          <spotLight
            position={[0, 6, -6]} // Positioned in front of the moon
            angle={Math.PI / 2.5} // 72-degree cone
            penumbra={0.25}
            intensity={moonGlowing ? 30 : 0} // Ultra-high intensity
            color="#ffffff"
            distance={50}
            decay={0.3}
            castShadow
            target-position={[0, 8, -10]} // Aimed directly at the moon
          />
          
          {/* Additional side lighting for comprehensive coverage */}
          <spotLight
            position={[6, 8, -10]} // Positioned to the side
            angle={Math.PI / 3.5} // ~51-degree cone
            penumbra={0.3}
            intensity={moonGlowing ? 25 : 0} // High intensity
            color="#f0f8ff"
            distance={55}
            decay={0.4}
            castShadow
            target-position={[0, 8, -10]}
          />
          
          {/* Additional opposite side lighting */}
          <spotLight
            position={[-6, 8, -10]} // Positioned to the opposite side
            angle={Math.PI / 3.5} // ~51-degree cone
            penumbra={0.3}
            intensity={moonGlowing ? 25 : 0} // High intensity
            color="#f0f8ff"
            distance={55}
            decay={0.4}
            castShadow
            target-position={[0, 8, -10]}
          />
          
          {/* Enhanced rim lighting for dramatic effect */}
          <spotLight
            position={[5, 10, -8]}
            angle={Math.PI / 3} // 60-degree cone
            penumbra={0.5}
            intensity={moonGlowing ? 20 : 0} // Ultra-high intensity
            color="#cce7ff"
            distance={50}
            decay={0.4}
            target-position={[0, 8, -10]}
          />
          
          {/* Bottom rim lighting */}
          <spotLight
            position={[0, 2, -10]} // Positioned below the moon
            angle={Math.PI / 4} // 45-degree cone
            penumbra={0.4}
            intensity={moonGlowing ? 18 : 0} // High intensity
            color="#e6f7ff"
            distance={40}
            decay={0.5}
            target-position={[0, 8, -10]}
          />
        </>
      )}
      
      {/* Scene 5: Table only */}
      {sceneNumber === 5 && (
        <Table position={[0, 0, 0]} />
      )}
      
      {/* Scene 6: Welcome message + moon */}
      {sceneNumber === 6 && (
        <>
          <Moon position={[0, 8, -10]} isGlowing={moonGlowing} onGlow={() => {}} />
          
          {/* High-intensity light sources behind camera to illuminate moon from front */}
          <spotLight
            position={[0, 3.5, 8]} // Positioned behind camera (camera ends at [0, 3.5, 8])
            angle={Math.PI / 3} // 60-degree cone for wider coverage
            penumbra={0.2}
            intensity={moonGlowing ? 30 : 0} // Increased intensity
            color="#ffffff"
            distance={50}
            decay={0.3}
            castShadow
            target-position={[0, 8, -10]}
          />
          
          {/* Secondary spotlight from behind camera at different angle */}
          <spotLight
            position={[3, 4, 7]} // Positioned to the side and behind camera
            angle={Math.PI / 4} // 45-degree cone
            penumbra={0.3}
            intensity={moonGlowing ? 25 : 0} // Increased intensity
            color="#e6f3ff"
            distance={50}
            decay={0.4}
            castShadow
            target-position={[0, 8, -10]}
          />
          
          {/* Powerful point light positioned in front of the moon */}
          <pointLight
            position={[0, 10, -15]} // Positioned in front of the moon
            intensity={moonGlowing ? 35 : 0} // Increased intensity
            color="#ffffff"
            distance={70}
            decay={0.2}
          />
          
          {/* Balanced lighting for moon and welcome area */}
          <spotLight
            position={[0, 5, -3]} // Positioned to light both moon and welcome area
            angle={Math.PI / 2.5} // 72-degree cone
            penumbra={0.3}
            intensity={moonGlowing ? 18 : 0} // Increased intensity when moon is glowing
            color="#ffffff"
            distance={40}
            decay={0.4}
            castShadow
            target-position={[0, 4, -5]} // Aimed between moon and welcome area
          />
          
          {/* Welcome area lighting */}
          <pointLight
            position={[0, 3, 0]}
            intensity={2}
            color="#fffae6"
            distance={15}
            decay={1.2}
          />
          {/* Welcome message will be rendered by the landing page */}
        </>
      )}
    </>
  );
}