import { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Group, Box3, Sphere, Vector3, Matrix4, Camera, Frustum, Plane } from 'three';

interface CullingOptions {
  enableDistanceCulling: boolean;
  enableFrustumCulling: boolean;
  cullingDistance: number;
  frustumPadding: number;
  checkInterval: number;
}

interface VisibilityState {
  isVisible: boolean;
  distance: number;
  lastCheckTime: number;
}

const defaultOptions: CullingOptions = {
  enableDistanceCulling: true,
  enableFrustumCulling: true,
  cullingDistance: 15,
  frustumPadding: 0.1,
  checkInterval: 100, // Check every 100ms
};

export function useVisibilityCulling(
  ref: React.RefObject<Group>,
  options: Partial<CullingOptions> = {}
): VisibilityState {
  const { camera } = useThree();
  const [visibilityState, setVisibilityState] = useState<VisibilityState>({
    isVisible: true,
    distance: 0,
    lastCheckTime: 0,
  });

  const mergedOptions = { ...defaultOptions, ...options };
  const boundingBox = useRef<Box3 | null>(null);
  const boundingSphere = useRef<Sphere | null>(null);
  const frustum = useRef<Frustum | null>(null);
  const lastUpdateTime = useRef(0);

  // Initialize bounding volumes
  useEffect(() => {
    if (!ref.current) return;

    // Calculate bounding box and sphere
    boundingBox.current = new Box3().setFromObject(ref.current);
    boundingSphere.current = new Sphere();
    boundingBox.current.getBoundingSphere(boundingSphere.current);

    // Initialize frustum
    frustum.current = new Frustum();
    updateFrustum();
  }, [ref]);

  // Update frustum planes based on camera
  const updateFrustum = () => {
    if (!camera || !frustum.current) return;
    
    const projectionMatrix = new Matrix4().multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
    );
    frustum.current.setFromProjectionMatrix(projectionMatrix);
  };

  // Check if bounding sphere is within camera frustum
  const checkFrustumCulling = (): boolean => {
    if (!frustum.current || !boundingSphere.current || !ref.current) {
      return true;
    }

    // Expand bounding sphere by padding factor
    const expandedSphere = boundingSphere.current.clone();
    expandedSphere.radius *= (1 + mergedOptions.frustumPadding);

    // Check if sphere intersects with any of the frustum planes
    const planes = frustum.current.planes;
    for (let i = 0; i < 6; i++) {
      const distance = planes[i].distanceToPoint(expandedSphere.center);
      if (distance < -expandedSphere.radius) {
        return false; // Sphere is outside this frustum plane
      }
    }
    return true; // Sphere intersects with all frustum planes
  };

  // Check if object is within distance threshold
  const checkDistanceCulling = (): boolean => {
    if (!ref.current) return true;
    
    const distance = ref.current.position.distanceTo(camera.position);
    return distance <= mergedOptions.cullingDistance;
  };

  // Main visibility check
  const checkVisibility = (currentTime: number): VisibilityState => {
    let isVisible = true;

    if (mergedOptions.enableDistanceCulling) {
      isVisible = isVisible && checkDistanceCulling();
    }

    if (mergedOptions.enableFrustumCulling) {
      isVisible = isVisible && checkFrustumCulling();
    }

    const distance = ref.current ? ref.current.position.distanceTo(camera.position) : 0;

    return {
      isVisible,
      distance,
      lastCheckTime: currentTime,
    };
  };

  // Update visibility state
  useFrame((state) => {
    const currentTime = state.clock.elapsedTime * 1000; // Convert to milliseconds

    // Skip checks if interval hasn't passed
    if (currentTime - lastUpdateTime.current < mergedOptions.checkInterval) {
      return;
    }

    lastUpdateTime.current = currentTime;

    // Update camera frustum
    updateFrustum();

    // Check visibility
    const newState = checkVisibility(currentTime);
    setVisibilityState(newState);

    // Debug logging in development
    if (process.env.NODE_ENV === 'development' && Math.random() < 0.01) { // Log 1% of checks
      console.log(`[VisibilityCulling] Object visible: ${newState.isVisible}, Distance: ${newState.distance.toFixed(2)}`);
    }
  });

  return visibilityState;
}

// Hook for optimized animation with culling
export function useOptimizedAnimation(
  ref: React.RefObject<Group>,
  animationCallback: (delta: number, isVisible: boolean) => void,
  options: Partial<CullingOptions> = {}
) {
  const visibilityState = useVisibilityCulling(ref, options);
  const lastUpdateTime = useRef(0);
  const updateInterval = useRef(16); // Default to ~60fps

  useFrame((state, delta) => {
    // Skip updates if object is not visible and culling is enabled
    if (!visibilityState.isVisible && options.enableDistanceCulling) {
      // Update visibility state periodically even when culled
      if (state.clock.elapsedTime * 1000 - visibilityState.lastCheckTime > 1000) {
        // Force a visibility check every second
        visibilityState.lastCheckTime = state.clock.elapsedTime * 1000;
      }
      return;
    }

    // Apply adaptive update interval based on distance
    if (visibilityState.distance > 5 && visibilityState.distance <= 10) {
      updateInterval.current = 33; // ~30fps for medium distance
    } else if (visibilityState.distance > 10) {
      updateInterval.current = 66; // ~15fps for far distance
    } else {
      updateInterval.current = 16; // ~60fps for close distance
    }

    const currentTime = state.clock.elapsedTime * 1000;
    if (currentTime - lastUpdateTime.current >= updateInterval.current) {
      animationCallback(delta, visibilityState.isVisible);
      lastUpdateTime.current = currentTime;
    }
  });
}

// Utility for creating optimized animation hooks
export function createOptimizedAnimationHook(
  animationCallback: (delta: number, isVisible: boolean) => void,
  defaultOptions: Partial<CullingOptions> = {}
) {
  return function useCustomAnimation(
    ref: React.RefObject<Group>,
    customOptions?: Partial<CullingOptions>
  ) {
    return useOptimizedAnimation(ref, animationCallback, { ...defaultOptions, ...customOptions });
  };
}

// Performance monitoring hook
export function useCullingPerformance() {
  const stats = useRef({
    checks: 0,
    culled: 0,
    totalDistance: 0,
    lastResetTime: 0,
  });

  useFrame((state) => {
    const currentTime = state.clock.elapsedTime * 1000;
    
    // Reset stats every 10 seconds
    if (currentTime - stats.current.lastResetTime > 10000) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[CullingPerformance] Stats in 10s - Checks: ${stats.current.checks}, Culled: ${stats.current.culled}, Avg Distance: ${(stats.current.totalDistance / Math.max(stats.current.checks, 1)).toFixed(2)}`);
      }
      
      stats.current = {
        checks: 0,
        culled: 0,
        totalDistance: 0,
        lastResetTime: currentTime,
      };
    }
  });

  const recordCheck = (isVisible: boolean, distance: number) => {
    stats.current.checks++;
    stats.current.totalDistance += distance;
    if (!isVisible) {
      stats.current.culled++;
    }
  };

  return { recordCheck };
}