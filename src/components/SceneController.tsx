'use client';

import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { SCENES, SceneState } from '@/app/types';// Import SCENES and SceneState

interface SceneControllerProps {
  currentScene: number;
  sceneState: SceneState; // Keep sceneState for initial values if needed elsewhere
  advanceScene: (sceneNumber: number) => void;
}

export const SceneController = React.forwardRef<any, SceneControllerProps>(
  ({ currentScene, advanceScene }, ref) => { // Removed sceneState from destructuring as it's not directly used here
    const { camera } = useThree();
    const sceneTimeoutRef = useRef<NodeJS.Timeout>();
    const cameraStartPos = useRef<[number, number, number]>(SCENES[currentScene - 1].cameraPosition);
    const cameraTargetPos = useRef<[number, number, number]>(SCENES[currentScene - 1].cameraTarget);
    const animationProgress = useRef(0);
    const cameraAnimationComplete = useRef(false);
    
    // Debug logging only in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[SceneController] Rendering for scene ${currentScene}`);
    }

    // Handle scene transitions
    useEffect(() => {
      // Clear any existing timeout
      if (sceneTimeoutRef.current) {
        clearTimeout(sceneTimeoutRef.current);
      }

      const currentSceneConfig = SCENES[currentScene - 1];
      if (currentSceneConfig) {
        cameraStartPos.current = currentSceneConfig.cameraPosition;
        cameraTargetPos.current = currentSceneConfig.cameraTarget;

        if (currentSceneConfig.autoAdvance && currentSceneConfig.duration) {
          sceneTimeoutRef.current = setTimeout(() => advanceScene(currentScene + 1), currentSceneConfig.duration);
        }
      }

      animationProgress.current = 0;
      cameraAnimationComplete.current = false;
      
      return () => {
        if (sceneTimeoutRef.current) {
          clearTimeout(sceneTimeoutRef.current);
        }
      };
    }, [currentScene, advanceScene]);

    // Camera animation - Optimized to run only when needed
    useFrame((state, delta) => {
      // Skip camera animation if already at target position
      if (cameraAnimationComplete.current) return;
      
      // For all scenes, run normal animation only when needed
      if (animationProgress.current < 1) {
        animationProgress.current = Math.min(animationProgress.current + delta * 0.5, 1);
        
        // Smooth interpolation with optimized arc motion for Scene 1
        const t = animationProgress.current;
        const smoothT = t * t * (3 - 2 * t); // Smoothstep function
        
        // For Scene 1, use a safe approach path that keeps the match in view
        if (currentScene === 1) {
          // Start and end positions
          const startX = cameraStartPos.current[0];
          const startZ = cameraStartPos.current[2];
          const startY = cameraStartPos.current[1];
          
          // End position that's offset to the side to avoid collision but still see the match
          const endX = 2.0; // Position 2.0 units to the right of the match
          const endZ = 3.0; // Position 3.0 units in front of the match (further for better view)
          const endY = 2.5; // Position 2.5 units high (above the match)
          
          // Calculate a control point for a Bezier curve that provides good viewing angle
          const controlX = (startX + endX) / 2;
          const controlZ = (startZ + endZ) / 2 - 1; // Control point further back
          const controlY = Math.max(startY, endY) + 1.5; // Control point higher up
          
          // Use smoothstep for more natural easing, especially at the end
          const smoothT = t * t * (3 - 2 * t);
          
          // Quadratic Bezier curve for smooth animation
          const x = (1 - smoothT) * (1 - smoothT) * startX +
                   2 * (1 - smoothT) * smoothT * controlX +
                   smoothT * smoothT * endX;
          const z = (1 - smoothT) * (1 - smoothT) * startZ +
                   2 * (1 - smoothT) * smoothT * controlZ +
                   smoothT * smoothT * endZ;
          const y = (1 - smoothT) * (1 - smoothT) * startY +
                   2 * (1 - smoothT) * smoothT * controlY +
                   smoothT * smoothT * endY;
          
          // Apply the position
          camera.position.x = x;
          camera.position.y = y;
          camera.position.z = z;
          
          // Calculate the proper look-at target to ensure match stays in view
          // The match is positioned at [0, 0.5, 0] in the scene with:
          // - Base at [0, 0.5 + 0.9, 0] = [0, 1.4, 0]
          // - Head at [0, 0.5 + 1.8, 0] = [0, 2.3, 0]
          // We'll aim at the middle of the match: [0, 1.85, 0]
          const lookAtX = 0;
          const lookAtY = 1.85; // Middle of the match (between base at 1.4 and head at 2.3)
          const lookAtZ = 0;
          
          // Use lookAt with proper vector calculation
          camera.lookAt(lookAtX, lookAtY, lookAtZ);
        } else if (currentScene === 2) {
          // Special handling for Scene 2 (Candle scene)
          // Start and end positions
          const startX = cameraStartPos.current[0];
          const startZ = cameraStartPos.current[2];
          const startY = cameraStartPos.current[1];
          
          // End position optimized for candle viewing
          const endX = 1.5; // Position to the right of the candle for better view angle
          const endZ = 4.0; // Closer to the candle for better visibility
          const endY = 2.0; // Lower height to see the candle better
          
          // Calculate a control point for a Bezier curve
          const controlX = (startX + endX) / 2;
          const controlZ = (startZ + endZ) / 2 - 0.5; // Control point slightly back
          const controlY = Math.max(startY, endY) + 1.0; // Control point higher up
          
          // Use smoothstep for more natural easing
          const smoothT = t * t * (3 - 2 * t);
          
          // Quadratic Bezier curve for smooth animation
          const x = (1 - smoothT) * (1 - smoothT) * startX +
                   2 * (1 - smoothT) * smoothT * controlX +
                   smoothT * smoothT * endX;
          const z = (1 - smoothT) * (1 - smoothT) * startZ +
                   2 * (1 - smoothT) * smoothT * controlZ +
                   smoothT * smoothT * endZ;
          const y = (1 - smoothT) * (1 - smoothT) * startY +
                   2 * (1 - smoothT) * smoothT * controlY +
                   smoothT * smoothT * endY;
          
          // Apply the position
          camera.position.x = x;
          camera.position.y = y;
          camera.position.z = z;
          
          // Calculate the proper look-at target to ensure candle stays in view
          // The candle is positioned at [0, 0.8, 0] with flame at [0, 1.4, 0] when lit
          const lookAtX = 0;
          const lookAtY = 1.2; // Aim at middle of candle body
          const lookAtZ = 0;
          
          // Use lookAt with proper vector calculation
          camera.lookAt(lookAtX, lookAtY, lookAtZ);
        } else if (currentScene === 3) {
          // Special handling for Scene 3 (Candle and Moon)
          // Start and end positions
          const startX = cameraStartPos.current[0];
          const startZ = cameraStartPos.current[2];
          const startY = cameraStartPos.current[1];
          
          // End position optimized for viewing moon
          const endX = 0; // Centered
          const endZ = 8; // Closer to see the moon clearly
          const endY = 3.5; // Height to see the moon
          
          // Calculate a control point for a Bezier curve that pans upward
          const controlX = (startX + endX) / 2;
          const controlZ = (startZ + endZ) / 2 - 2; // Control point further back
          const controlY = Math.max(startY, endY) + 3; // Higher control point for upward pan
          
          // Use smoothstep for more natural easing
          const smoothT = t * t * (3 - 2 * t);
          
          // Quadratic Bezier curve for smooth animation
          const x = (1 - smoothT) * (1 - smoothT) * startX +
                   2 * (1 - smoothT) * smoothT * controlX +
                   smoothT * smoothT * endX;
          const z = (1 - smoothT) * (1 - smoothT) * startZ +
                   2 * (1 - smoothT) * smoothT * controlZ +
                   smoothT * smoothT * endZ;
          const y = (1 - smoothT) * (1 - smoothT) * startY +
                   2 * (1 - smoothT) * smoothT * controlY +
                   smoothT * smoothT * endY;
          
          // Apply the position
          camera.position.x = x;
          camera.position.y = y;
          camera.position.z = z;
          
          // Animate the look-at target to pan from candle to moon
          // Start at candle position [0, 0.8, 0] and end at moon position [0, 8, -10]
          const candleX = 0;
          const candleY = 0.8; // Candle height
          const candleZ = 0;
          
          const moonX = 0;
          const moonY = 8; // Moon height
          const moonZ = -10;
          
          // Interpolate between candle and moon
          const lookAtX = candleX + (moonX - candleX) * smoothT;
          const lookAtY = candleY + (moonY - candleY) * smoothT;
          const lookAtZ = candleZ + (moonZ - candleZ) * smoothT;
          
          // Use lookAt with proper vector calculation
          camera.lookAt(lookAtX, lookAtY, lookAtZ);
        } else if (currentScene === 4) {
          // Special handling for Scene 4 (Moon only)
          // Start and end positions
          const startX = cameraStartPos.current[0];
          const startZ = cameraStartPos.current[2];
          const startY = cameraStartPos.current[1];
          
          // End position optimized for viewing moon
          const endX = 0; // Centered
          const endZ = -8; // Closer to the moon for better view
          const endY = 6; // Height to see the moon clearly
          
          // Calculate a control point for a Bezier curve that pans upward
          const controlX = (startX + endX) / 2;
          const controlZ = (startZ + endZ) / 2 - 2; // Control point further back
          const controlY = Math.max(startY, endY) + 2; // Higher control point for upward pan
          
          // Quadratic Bezier curve for smooth animation
          const x = (1 - smoothT) * (1 - smoothT) * startX +
                   2 * (1 - smoothT) * smoothT * controlX +
                   smoothT * smoothT * endX;
          const z = (1 - smoothT) * (1 - smoothT) * startZ +
                   2 * (1 - smoothT) * smoothT * controlZ +
                   smoothT * smoothT * endZ;
          const y = (1 - smoothT) * (1 - smoothT) * startY +
                   2 * (1 - smoothT) * smoothT * controlY +
                   smoothT * smoothT * endY;
          
          // Apply the position
          camera.position.x = x;
          camera.position.y = y;
          camera.position.z = z;
          
          // Look at the moon position [0, 8, -10]
          const moonX = 0;
          const moonY = 8; // Moon height
          const moonZ = -10;
          camera.lookAt(moonX, moonY, moonZ);
        } else if (currentScene === 5) {
          // Special handling for Scene 5 (Table only)
          // Start and end positions
          const startX = cameraStartPos.current[0];
          const startZ = cameraStartPos.current[2];
          const startY = cameraStartPos.current[1];
          
          // End position optimized for viewing table - increase distance to avoid being too close
          const endX = 0; // Centered
          const endZ = -4; // Increased distance from table
          const endY = 4; // Good height to see the table surface
          
          // Calculate a control point for a smooth approach - ensure camera stays high
          const controlX = (startX + endX) / 2;
          const controlZ = (startZ + endZ) / 2 - 1; // Control point slightly back
          const controlY = Math.max(startY, endY) + 2; // Increased control point height
          
          // Quadratic Bezier curve for smooth animation
          const x = (1 - smoothT) * (1 - smoothT) * startX +
                   2 * (1 - smoothT) * smoothT * controlX +
                   smoothT * smoothT * endX;
          const z = (1 - smoothT) * (1 - smoothT) * startZ +
                   2 * (1 - smoothT) * smoothT * controlZ +
                   smoothT * smoothT * endZ;
          const y = (1 - smoothT) * (1 - smoothT) * startY +
                   2 * (1 - smoothT) * smoothT * controlY +
                   smoothT * smoothT * endY;
          
          // Apply the position
          camera.position.x = x;
          camera.position.y = y;
          camera.position.z = z;
          
          // Look at the table center [0, 0, 0]
          const tableX = 0;
          const tableY = 0; // Table surface level
          const tableZ = 0;
          camera.lookAt(tableX, tableY, tableZ);
        } else if (currentScene === 6) {
          // Special handling for Scene 6 (Welcome message + moon)
          // Start and end positions
          const startX = cameraStartPos.current[0];
          const startZ = cameraStartPos.current[2];
          const startY = cameraStartPos.current[1];
          
          // End position optimized for viewing both moon and welcome area
          const endX = 0; // Centered
          const endZ = -1; // Balanced position
          const endY = 3; // Good height for overall view
          
          // Calculate a control point for smooth transition
          const controlX = (startX + endX) / 2;
          const controlZ = (startZ + endZ) / 2 - 1; // Control point slightly back
          const controlY = Math.max(startY, endY) + 1.5; // Control point higher up
          
          // Quadratic Bezier curve for smooth animation
          const x = (1 - smoothT) * (1 - smoothT) * startX +
                   2 * (1 - smoothT) * smoothT * controlX +
                   smoothT * smoothT * endX;
          const z = (1 - smoothT) * (1 - smoothT) * startZ +
                   2 * (1 - smoothT) * smoothT * controlZ +
                   smoothT * smoothT * endZ;
          const y = (1 - smoothT) * (1 - smoothT) * startY +
                   2 * (1 - smoothT) * smoothT * controlY +
                   smoothT * smoothT * endY;
          
          // Apply the position
          camera.position.x = x;
          camera.position.y = y;
          camera.position.z = z;
          
          // Look at a point between moon and welcome area
          const lookAtX = 0;
          const lookAtY = 4; // Between moon height and ground level
          const lookAtZ = -5; // Between moon position and center
          camera.lookAt(lookAtX, lookAtY, lookAtZ);
        } else {
          // Normal linear interpolation for other scenes
          camera.position.x = cameraStartPos.current[0] + (cameraTargetPos.current[0] - cameraStartPos.current[0]) * smoothT;
          camera.position.y = cameraStartPos.current[1] + (cameraTargetPos.current[1] - cameraStartPos.current[1]) * smoothT;
          camera.position.z = cameraStartPos.current[2] + (cameraTargetPos.current[2] - cameraStartPos.current[2]) * smoothT;
          
          // Update camera target to look at the correct position
          const lookAtTarget = [
            cameraTargetPos.current[0],
            cameraTargetPos.current[1],
            cameraTargetPos.current[2]
          ];
          camera.lookAt(lookAtTarget[0], lookAtTarget[1], lookAtTarget[2]);
        }
        
        // Mark animation as complete when we reach the target
        if (animationProgress.current >= 1) {
          cameraAnimationComplete.current = true;
          
          // For Scene 1, ensure we maintain the correct final position and lookAt
          if (currentScene === 1) {
            camera.position.set(2.0, 2.5, 3.0);
            camera.lookAt(0, 1.85, 0);
          } else if (currentScene === 2) {
            // For Scene 2, ensure we maintain the correct final position and lookAt for candle viewing
            camera.position.set(1.5, 2.0, 4.0);
            camera.lookAt(0, 1.2, 0);
          } else if (currentScene === 3) {
            // For Scene 3, ensure we maintain the correct final position and lookAt for moon viewing
            camera.position.set(0, 3.5, 8);
            camera.lookAt(0, 8, -10); // Look directly at the moon
          } else if (currentScene === 4) {
            // For Scene 4, ensure we maintain the correct final position and lookAt for moon viewing
            camera.position.set(0, 6, -8);
            camera.lookAt(0, 8, -10); // Look directly at the moon
          } else if (currentScene === 5) {
            // For Scene 5, ensure we maintain the correct final position and lookAt for table viewing
            camera.position.set(0, 4, -4); // Increased distance from table
            camera.lookAt(0, 0, 0); // Look at the table center
          } else if (currentScene === 6) {
            // For Scene 6, ensure we maintain the correct final position and lookAt for welcome view
            camera.position.set(0, 3, -1);
            camera.lookAt(0, 4, -5); // Look at a point between moon and welcome area
          } else {
            // For other scenes, use the target position
            camera.position.set(
              cameraTargetPos.current[0],
              cameraTargetPos.current[1],
              cameraTargetPos.current[2]
            );
            camera.lookAt(
              cameraTargetPos.current[0],
              cameraTargetPos.current[1],
              cameraTargetPos.current[2]
            );
          }
        }
      }
    });

    // Expose advanceScene method via ref
    React.useImperativeHandle(ref, () => advanceScene, [advanceScene]);

    return null;
  }
);

SceneController.displayName = 'SceneController';