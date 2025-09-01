'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, Box3, Sphere, Vector3, Matrix4, Camera } from 'three';

interface AnimationObject {
  id: string;
  ref: React.RefObject<Group>;
  boundingBox?: Box3;
  boundingSphere?: Sphere;
  isAnimated: boolean;
  isVisible: boolean;
  lastVisibleTime: number;
  animationState: {
    isActive: boolean;
    lastUpdateTime: number;
    updateInterval: number;
  };
}

interface AnimationManagerProps {
  enableCulling: boolean;
  cullingDistance: number;
  objects: AnimationObject[];
}

export function AnimationManager({ 
  enableCulling = true, 
  cullingDistance = 10,
  objects 
}: AnimationManagerProps) {
  const { camera } = useThree();
  const frameCount = useRef(0);
  const lastStatsUpdate = useRef(0);
  const [stats, setStats] = useState({
    totalObjects: 0,
    visibleObjects: 0,
    culledObjects: 0,
    activeAnimations: 0
  });

  // Initialize bounding boxes for objects
  useEffect(() => {
    objects.forEach(obj => {
      if (obj.ref.current && !obj.boundingBox) {
        const box = new Box3().setFromObject(obj.ref.current);
        const sphere = new Sphere();
        box.getBoundingSphere(sphere);
        
        obj.boundingBox = box;
        obj.boundingSphere = sphere;
      }
    });
  }, [objects]);

  // Check if object is visible in camera frustum
  const checkObjectVisibility = (obj: AnimationObject, camera: Camera): boolean => {
    if (!obj.ref.current || !obj.boundingSphere) return true;
    
    // Simple distance-based culling
    const distance = obj.ref.current.position.distanceTo(camera.position);
    if (distance > cullingDistance) {
      return false;
    }

    // More advanced frustum culling could be implemented here
    // For now, we'll use distance-based culling as a performance optimization
    return true;
  };

  // Update animation state based on visibility
  const updateAnimationState = (obj: AnimationObject, isVisible: boolean, currentTime: number) => {
    if (!obj.isAnimated) return;

    // If object is visible, ensure animation is active
    if (isVisible) {
      obj.isVisible = true;
      obj.lastVisibleTime = currentTime;
      
      if (!obj.animationState.isActive) {
        obj.animationState.isActive = true;
        obj.animationState.lastUpdateTime = currentTime;
      }
    } else {
      // If object is not visible, consider culling the animation
      obj.isVisible = false;
      
      // Only cull if object has been invisible for more than 1 second
      if (currentTime - obj.lastVisibleTime > 1000) {
        obj.animationState.isActive = false;
      }
    }
  };

  // Main animation loop with culling optimization
  useFrame((state, delta) => {
    frameCount.current++;
    const currentTime = state.clock.elapsedTime * 1000; // Convert to milliseconds

    // Update stats every 60 frames (approximately 1 second at 60fps)
    if (frameCount.current % 60 === 0) {
      let visibleCount = 0;
      let culledCount = 0;
      let activeAnimationCount = 0;

      objects.forEach(obj => {
        if (obj.isVisible) visibleCount++;
        if (!obj.animationState.isActive) culledCount++;
        if (obj.animationState.isActive && obj.isAnimated) activeAnimationCount++;
      });

      setStats({
        totalObjects: objects.length,
        visibleObjects: visibleCount,
        culledObjects: culledCount,
        activeAnimations: activeAnimationCount
      });

      // Debug logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[AnimationManager] Stats - Total: ${objects.length}, Visible: ${visibleCount}, Culled: ${culledCount}, Active: ${activeAnimationCount}`);
      }
    }

    // Update each object's animation state
    objects.forEach(obj => {
      if (!obj.ref.current) return;

      const isVisible = enableCulling ? checkObjectVisibility(obj, camera) : true;
      updateAnimationState(obj, isVisible, currentTime);

      // Only update animations if they're active
      if (obj.animationState.isActive && obj.isAnimated) {
        // Check if it's time to update based on the interval
        if (currentTime - obj.animationState.lastUpdateTime >= obj.animationState.updateInterval) {
          // This would call the specific animation logic for each object
          // In a real implementation, this would be more sophisticated
          obj.animationState.lastUpdateTime = currentTime;
        }
      }
    });
  });

  // Expose stats for monitoring
  return { stats };
}

// Utility hook for registering animated objects
export function useAnimationObject(
  id: string,
  isAnimated: boolean = true,
  updateInterval: number = 16 // ~60fps default
): React.RefObject<Group> {
  const ref = useRef<Group>(null);
  
  // This would typically be registered with a global AnimationManager
  // For now, we'll return the ref which can be used with the AnimationManager
  return ref;
}

// Utility for calculating bounding boxes
export function calculateBoundingBox(ref: React.RefObject<Group>): { box: Box3, sphere: Sphere } | null {
  if (!ref.current) return null;
  
  const box = new Box3().setFromObject(ref.current);
  const sphere = new Sphere();
  box.getBoundingSphere(sphere);
  
  return { box, sphere };
}

// Performance monitoring hook
export function usePerformanceMonitoring() {
  const frameCount = useRef(0);
  const lastFpsUpdate = useRef(0);
  const fps = useRef(0);
  
  useFrame((state) => {
    frameCount.current++;
    const currentTime = state.clock.elapsedTime;
    
    // Update FPS every second
    if (currentTime - lastFpsUpdate.current >= 1) {
      fps.current = frameCount.current / (currentTime - lastFpsUpdate.current);
      frameCount.current = 0;
      lastFpsUpdate.current = currentTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] FPS: ${fps.current.toFixed(1)}`);
      }
    }
  });
  
  return { fps: fps.current };
}