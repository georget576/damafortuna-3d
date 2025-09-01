'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, Stars } from '@react-three/drei';
import { Suspense, useState, useRef, useEffect } from 'react';
import { SceneState, SCENES } from './types';

// Import components using relative paths
import { LightingSystem } from '@/components/LightingSystem';
import { WelcomeMessage } from '@/components/WelcomeMessage';
import { SceneController } from '@/components/SceneController';
import { Scene1 } from '@/components/scenes/Scene1';
import { Scene2 } from '@/components/scenes/Scene2';
import { Scene3 } from '@/components/scenes/Scene3';
import { Scene4_6 } from '@/components/scenes/Scene4_6';
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';

export default function LandingPage() {
  const [sceneState, setSceneState] = useState<SceneState>(() => {
    const initialScene = SCENES[0];
    console.log(`[Debug] Initial scene state:`, initialScene);
    return {
      currentScene: initialScene.id,
      matchLit: false,
      candleLit: false,
      moonGlowing: false,
      cameraPosition: initialScene.cameraPosition,
      cameraTarget: initialScene.cameraTarget,
    };
  });

  const [transformMode, setTransformMode] = useState(false);
  const sceneControllerRef = useRef<any>(null);
  
  // Initialize performance monitoring
  usePerformanceMonitor();
  
  // Debug logging for camera conflicts
  useEffect(() => {
    console.log(`[Debug] Scene ${sceneState.currentScene} - Camera Position:`, sceneState.cameraPosition);
    console.log(`[Debug] Scene ${sceneState.currentScene} - Camera Target:`, sceneState.cameraTarget);
  }, [sceneState.currentScene, sceneState.cameraPosition, sceneState.cameraTarget]);

  const handleMatchLight = () => {
    // First light up the match
    setSceneState(prev => ({
      ...prev,
      matchLit: true
    }));
    
    // Then advance to scene 2 after 3 seconds
    setTimeout(() => {
      advanceScene(2);
    }, 3000);
  };

  const handleCandleLight = () => {
    setSceneState(prev => ({
      ...prev,
      candleLit: true,
      currentScene: 3
    }));
  };

  const handleMoonGlow = () => {
    setSceneState(prev => ({
      ...prev,
      moonGlowing: true,
      currentScene: 4
    }));
  };

  const advanceScene = (sceneNumber: number) => {
    const nextScene = SCENES.find(scene => scene.id === sceneNumber);
    if (nextScene) {
      setSceneState(prev => ({
        ...prev,
        currentScene: nextScene.id,
        cameraPosition: nextScene.cameraPosition,
        cameraTarget: nextScene.cameraTarget,
      }));
    }
  };

  const handleMatchTransform = (position: [number, number, number], rotation: [number, number, number]) => {
    console.log(`[Match] Transformed to position: ${position}, rotation: ${rotation}`);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">

      {/* Three.js Canvas */}
      <Canvas
        camera={{
          fov: 60,
          position: [0, 3, 4], // Match SCENES[0].cameraPosition for smooth start
          near: 0.5,
          far: 1000
        }}
        shadows
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          {/* Environment and Background */}
          <Environment preset="night" />
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />
          
          {/* Lighting System */}
          <LightingSystem
            matchLit={sceneState.matchLit}
            candleLit={sceneState.candleLit}
            moonGlowing={sceneState.moonGlowing}
            currentScene={sceneState.currentScene}
          />

          {/* Scene 1: Only Match */}
          {sceneState.currentScene === 1 && (
            <Scene1
              matchLit={sceneState.matchLit}
              onMatchLight={handleMatchLight}
            />
          )}
          
          {/* Scene 2: Candle only */}
          {sceneState.currentScene === 2 && (
            <Scene2
              candleLit={sceneState.candleLit}
              onCandleLight={handleCandleLight}
            />
          )}
          
          {/* Scene 3: Candle lit and Moon */}
          {sceneState.currentScene === 3 && (
            <Scene3
              moonGlowing={sceneState.moonGlowing}
              onMoonGlow={handleMoonGlow}
            />
          )}
          
          {/* Scene 4-6: Only Table + Moon*/}
          {sceneState.currentScene >= 4 && (
            <Scene4_6 sceneNumber={sceneState.currentScene} moonGlowing={sceneState.moonGlowing} />
          )}

          {/* Camera Controls - Removed to avoid conflicts with SceneController */}
          
          {/* Scene Controller for managing scene transitions */}
          <SceneController
            ref={sceneControllerRef}
            currentScene={sceneState.currentScene}
            sceneState={sceneState}
            advanceScene={advanceScene}
          />
        </Suspense>
      </Canvas>

      {/* Welcome Message (Scene 6) */}
      {sceneState.currentScene === 6 && (
        <WelcomeMessage />
      )}

      {/* Scene Instructions */}
      <div className="absolute top-4 left-4 z-10 bg-black/50 text-white p-4 rounded-lg max-w-sm">
        <h2 className="text-xl font-bold mb-2">
          {SCENES.find(s => s.id === sceneState.currentScene)?.name || `Scene ${sceneState.currentScene}`}
        </h2>
        <p className="text-sm">
          {SCENES.find(s => s.id === sceneState.currentScene)?.description || ""}
        </p>
      </div>
    </div>
  );
}