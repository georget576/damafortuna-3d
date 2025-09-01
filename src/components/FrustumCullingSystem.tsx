'use client';

import React, { useRef, useEffect, useMemo, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Group, Box3, Sphere, Vector3, Matrix4, Camera, Frustum, Plane } from 'three';

interface CullingObject {
  id: string;
  ref: React.RefObject<Group>;
  boundingBox: Box3;
  boundingSphere: Sphere;
  lastVisibleTime: number;
  isVisible: boolean;
  cullingEnabled: boolean;
  cullingDistance: number;
}

interface FrustumCullingSystemProps {
  objects: CullingObject[];
  enableCulling: boolean;
  cullingDistance: number;
  updateInterval: number;
  onObjectVisibilityChange?: (id: string, isVisible: boolean) => void;
}

export function FrustumCullingSystem({
  objects,
  enableCulling = true,
  cullingDistance = 15,
  updateInterval = 100,
  onObjectVisibilityChange
}: FrustumCullingSystemProps) {
  const { camera } = useThree();
  const frameCount = useRef(0);
  const lastUpdateTime = useRef(0);
  const stats = useRef({
    totalChecks: 0,
    culledObjects: 0,
    visibleObjects: 0,
    avgDistance: 0,
    lastStatsUpdate: 0,
  });

  // Cache frustum and matrices for performance
  const frustum = useRef<Frustum>(new Frustum());
  const viewProjectionMatrix = useRef<Matrix4>(new Matrix4());
  const worldMatrix = useRef<Matrix4>(new Matrix4());

  // Initialize bounding volumes for all objects
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

  // Update frustum planes based on camera
  const updateFrustum = () => {
    viewProjectionMatrix.current.multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
    );
    frustum.current.setFromProjectionMatrix(viewProjectionMatrix.current);
  };

  // Check if sphere is visible in frustum
  const isSphereVisible = (sphere: Sphere, distance: number): boolean => {
    if (distance > cullingDistance) {
      return false;
    }

    // Expand sphere by a small padding to prevent edge cases
    const expandedSphere = sphere.clone();
    expandedSphere.radius *= 1.05;

    // Check against frustum planes
    const planes = frustum.current.planes;
    for (let i = 0; i < 6; i++) {
      const distance = planes[i].distanceToPoint(expandedSphere.center);
      if (distance < -expandedSphere.radius) {
        return false;
      }
    }
    return true;
  };

  // Check if bounding box is visible in frustum
  const isBoundingBoxVisible = (box: Box3, distance: number): boolean => {
    if (distance > cullingDistance) {
      return false;
    }

    // Get the 8 corners of the bounding box
    const corners = [];
    for (let x = 0; x <= 1; x++) {
      for (let y = 0; y <= 1; y++) {
        for (let z = 0; z <= 1; z++) {
          const corner = new Vector3(
            box.min.x + (box.max.x - box.min.x) * x,
            box.min.y + (box.max.y - box.min.y) * y,
            box.min.z + (box.max.z - box.min.z) * z
          );
          corners.push(corner);
        }
      }
    }

    // Check if any corner is inside the frustum
    const planes = frustum.current.planes;
    for (const corner of corners) {
      let insideAllPlanes = true;
      for (const plane of planes) {
        if (plane.distanceToPoint(corner) < 0) {
          insideAllPlanes = false;
          break;
        }
      }
      if (insideAllPlanes) {
        return true;
      }
    }

    return false;
  };

  // Main culling update loop
  const updateCulling = (currentTime: number) => {
    if (!enableCulling) {
      // If culling is disabled, mark all objects as visible
      objects.forEach(obj => {
        if (!obj.isVisible) {
          obj.isVisible = true;
          obj.lastVisibleTime = currentTime;
          onObjectVisibilityChange?.(obj.id, true);
        }
      });
      return;
    }

    let totalDistance = 0;
    let visibleCount = 0;
    let culledCount = 0;

    objects.forEach(obj => {
      if (!obj.ref.current || !obj.boundingBox || !obj.boundingSphere) {
        return;
      }

      // Calculate distance from camera
      const distance = obj.ref.current.position.distanceTo(camera.position);
      totalDistance += distance;

      // Check visibility using both bounding box and sphere
      const boxVisible = isBoundingBoxVisible(obj.boundingBox, distance);
      const sphereVisible = isSphereVisible(obj.boundingSphere, distance);
      const wasVisible = obj.isVisible;

      obj.isVisible = boxVisible || sphereVisible;
      obj.lastVisibleTime = currentTime;

      // Call callback if visibility changed
      if (wasVisible !== obj.isVisible) {
        onObjectVisibilityChange?.(obj.id, obj.isVisible);
      }

      if (obj.isVisible) {
        visibleCount++;
      } else {
        culledCount++;
      }
    });

    // Update stats
    stats.current.totalChecks++;
    stats.current.culledObjects = culledCount;
    stats.current.visibleObjects = visibleCount;
    stats.current.avgDistance = totalDistance / objects.length;

    // Log stats every 60 frames (~1 second)
    frameCount.current++;
    if (frameCount.current % 60 === 0) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[FrustumCullingSystem] Stats - Total: ${objects.length}, Visible: ${visibleCount}, Culled: ${culledCount}, Avg Distance: ${stats.current.avgDistance.toFixed(2)}`);
      }
    }
  };

  // Main animation loop
  useFrame((state) => {
    const currentTime = state.clock.elapsedTime * 1000; // Convert to milliseconds

    // Skip updates if interval hasn't passed
    if (currentTime - lastUpdateTime.current < updateInterval) {
      return;
    }

    lastUpdateTime.current = currentTime;
    updateFrustum();
    updateCulling(currentTime);
  });

  // Debug visualization (optional - can be enabled for debugging)
  const debugVisualization = useMemo(() => {
    if (process.env.NODE_ENV !== 'development') {
      return null;
    }

    return (
      <group>
        {/* This would contain debug visualization for frustum and object bounds */}
        {/* Implementation would depend on specific debugging needs */}
      </group>
    );
  }, []);

  return (
    <group>
      {debugVisualization}
    </group>
  );
}

// Hook for creating optimized culling objects
export function useCullingObject(
  id: string,
  cullingEnabled: boolean = true,
  cullingDistance: number = 15
): {
  ref: React.RefObject<Group>;
  boundingBox: Box3 | null;
  boundingSphere: Sphere | null;
  isVisible: boolean;
} {
  const ref = useRef<Group>(null);
  const [boundingBox, setBoundingBox] = useState<Box3 | null>(null);
  const [boundingSphere, setBoundingSphere] = useState<Sphere | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  // Initialize bounding volumes
  useEffect(() => {
    if (ref.current) {
      const box = new Box3().setFromObject(ref.current);
      const sphere = new Sphere();
      box.getBoundingSphere(sphere);
      
      setBoundingBox(box);
      setBoundingSphere(sphere);
    }
  }, [ref]);

  return {
    ref,
    boundingBox,
    boundingSphere,
    isVisible,
  };
}

// Performance monitoring hook
export function useCullingPerformance() {
  const stats = useRef({
    totalChecks: 0,
    culledObjects: 0,
    visibleObjects: 0,
    avgDistance: 0,
    lastResetTime: 0,
  });

  const getStats = () => ({
    totalChecks: stats.current.totalChecks,
    culledObjects: stats.current.culledObjects,
    visibleObjects: stats.current.visibleObjects,
    avgDistance: stats.current.avgDistance,
    cullingRatio: stats.current.totalChecks > 0 
      ? stats.current.culledObjects / stats.current.totalChecks 
      : 0,
  });

  const resetStats = () => {
    stats.current = {
      totalChecks: 0,
      culledObjects: 0,
      visibleObjects: 0,
      avgDistance: 0,
      lastResetTime: Date.now(),
    };
  };

  return {
    getStats,
    resetStats,
  };
}