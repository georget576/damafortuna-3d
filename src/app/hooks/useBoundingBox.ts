import { useRef, useEffect, useState, useMemo } from 'react';
import { Group, Box3, Sphere, Vector3, Matrix4 } from 'three';

interface BoundingBoxInfo {
  box: Box3;
  sphere: Sphere;
  center: Vector3;
  size: Vector3;
  corners: Vector3[];
}

interface BoundingBoxOptions {
  autoUpdate: boolean;
  updateInterval: number;
  calculateCorners: boolean;
  includeChildren: boolean;
  applyWorldMatrix: boolean;
}

const defaultOptions: BoundingBoxOptions = {
  autoUpdate: true,
  updateInterval: 1000, // Update every second
  calculateCorners: true,
  includeChildren: true,
  applyWorldMatrix: true,
};

export function useBoundingBox(
  ref: React.RefObject<Group>,
  options: Partial<BoundingBoxOptions> = {}
): {
  boundingBox: Box3 | null;
  boundingSphere: Sphere | null;
  boundingInfo: BoundingBoxInfo | null;
  isDirty: boolean;
  updateBoundingBox: () => void;
} {
  const mergedOptions = { ...defaultOptions, ...options };
  const [isDirty, setIsDirty] = useState(true);
  const [boundingBox, setBoundingBox] = useState<Box3 | null>(null);
  const [boundingSphere, setBoundingSphere] = useState<Sphere | null>(null);
  const [boundingInfo, setBoundingInfo] = useState<BoundingBoxInfo | null>(null);

  const lastUpdateTime = useRef(0);
  const tempMatrix = useRef(new Matrix4());
  const tempBox = useRef(new Box3());
  const tempSphere = useRef(new Sphere());
  const tempVector = useRef(new Vector3());

  // Calculate bounding box and related information
  const calculateBoundingBox = (): BoundingBoxInfo | null => {
    if (!ref.current) return null;

    const box = tempBox.current.clone();
    const sphere = tempSphere.current.clone();

    // Calculate bounding box
    if (mergedOptions.includeChildren) {
      box.setFromObject(ref.current);
    } else {
      // For a Group, we'll use its children's bounding boxes if any exist
      if (ref.current.children.length > 0) {
        box.makeEmpty();
        for (const child of ref.current.children) {
          const childBox = new Box3().setFromObject(child);
          box.union(childBox);
        }
      } else {
        box.makeEmpty();
      }
    }

    // Apply world matrix if needed
    if (mergedOptions.applyWorldMatrix) {
      box.applyMatrix4(ref.current.matrixWorld);
    }

    // Calculate bounding sphere
    box.getBoundingSphere(sphere);

    // Calculate center and size
    const center = box.getCenter(tempVector.current);
    const size = box.getSize(tempVector.current);

    // Calculate corners if needed
    let corners: Vector3[] = [];
    if (mergedOptions.calculateCorners) {
      corners = [];
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
    }

    return {
      box: box.clone(),
      sphere: sphere.clone(),
      center: center.clone(),
      size: size.clone(),
      corners: corners.map(v => v.clone()),
    };
  };

  // Update bounding box
  const updateBoundingBox = () => {
    const info = calculateBoundingBox();
    if (info) {
      setBoundingBox(info.box);
      setBoundingSphere(info.sphere);
      setBoundingInfo(info);
      setIsDirty(false);
    }
  };

  // Auto-update bounding box
  useEffect(() => {
    if (!mergedOptions.autoUpdate) return;

    const checkAndUpdate = () => {
      const now = Date.now();
      if (now - lastUpdateTime.current >= mergedOptions.updateInterval) {
        lastUpdateTime.current = now;
        
        // Check if the object has changed
        const currentInfo = calculateBoundingBox();
        if (currentInfo && (!boundingBox || !boundingBox.equals(currentInfo.box))) {
          updateBoundingBox();
        }
      }
    };

    const interval = setInterval(checkAndUpdate, 100); // Check every 100ms
    return () => clearInterval(interval);
  }, [mergedOptions.autoUpdate, mergedOptions.updateInterval, ref]);

  // Initial calculation
  useEffect(() => {
    if (isDirty) {
      updateBoundingBox();
    }
  }, [isDirty]);

  // Mark as dirty when ref changes
  useEffect(() => {
    setIsDirty(true);
  }, [ref]);

  return {
    boundingBox,
    boundingSphere,
    boundingInfo,
    isDirty,
    updateBoundingBox,
  };
}

// Hook for optimized collision detection
export function useCollisionDetection(
  refs: React.RefObject<Group>[],
  options: Partial<BoundingBoxOptions> = {}
) {
  const boundingBoxes = useRef<(BoundingBoxInfo | null)[]>([]);
  const [collisions, setCollisions] = useState<Set<number>>(new Set());

  // Update all bounding boxes
  const updateAllBoundingBoxes = () => {
    boundingBoxes.current = refs.map(ref => {
      if (!ref.current) return null;
      
      const box = new Box3().setFromObject(ref.current);
      const sphere = new Sphere();
      box.getBoundingSphere(sphere);
      
      return {
        box,
        sphere,
        center: box.getCenter(new Vector3()),
        size: box.getSize(new Vector3()),
        corners: [],
      };
    });
  };

  // Check for collisions between all objects
  const checkCollisions = () => {
    updateAllBoundingBoxes();
    
    const newCollisions = new Set<number>();
    
    for (let i = 0; i < boundingBoxes.current.length; i++) {
      for (let j = i + 1; j < boundingBoxes.current.length; j++) {
        const box1 = boundingBoxes.current[i];
        const box2 = boundingBoxes.current[j];
        
        if (box1 && box2 && box1.box.intersectsBox(box2.box)) {
          newCollisions.add(i);
          newCollisions.add(j);
        }
      }
    }
    
    setCollisions(newCollisions);
  };

  // Auto-check collisions
  useEffect(() => {
    const interval = setInterval(checkCollisions, 100); // Check every 100ms
    return () => clearInterval(interval);
  }, [refs]);

  return {
    collisions,
    isColliding: (index: number) => collisions.has(index),
    checkCollisions,
  };
}

// Hook for distance-based operations
export function useDistanceOperations(
  ref: React.RefObject<Group>,
  targetRef: React.RefObject<Group>
) {
  const [distance, setDistance] = useState<number>(0);
  const [isInRange, setIsInRange] = useState<boolean>(false);

  const updateDistance = () => {
    if (ref.current && targetRef.current) {
      const dist = ref.current.position.distanceTo(targetRef.current.position);
      setDistance(dist);
      setIsInRange(dist <= 5); // Default range of 5 units
    }
  };

  useEffect(() => {
    const interval = setInterval(updateDistance, 100); // Update every 100ms
    return () => clearInterval(interval);
  }, [ref, targetRef]);

  return {
    distance,
    isInRange,
    updateDistance,
  };
}

// Utility functions for bounding box operations
export const BoundingBoxUtils = {
  // Expand a bounding box by a given amount
  expand: (box: Box3, amount: number): Box3 => {
    const expanded = box.clone();
    expanded.expandByScalar(amount);
    return expanded;
  },

  // Move a bounding box to a new center
  moveTo: (box: Box3, newCenter: Vector3): Box3 => {
    const currentCenter = box.getCenter(new Vector3());
    const offset = newCenter.sub(currentCenter);
    const moved = box.clone();
    moved.translate(offset);
    return moved;
  },

  // Get the farthest corner of a bounding box from a point
  getFarthestCorner: (box: Box3, fromPoint: Vector3): Vector3 => {
    const corners = [];
    for (let x = 0; x <= 1; x++) {
      for (let y = 0; y <= 1; y++) {
        for (let z = 0; z <= 1; z++) {
          corners.push(new Vector3(
            box.min.x + (box.max.x - box.min.x) * x,
            box.min.y + (box.max.y - box.min.y) * y,
            box.min.z + (box.max.z - box.min.z) * z
          ));
        }
      }
    }

    let farthestCorner = corners[0];
    let maxDistance = 0;

    for (const corner of corners) {
      const dist = corner.distanceTo(fromPoint);
      if (dist > maxDistance) {
        maxDistance = dist;
        farthestCorner = corner;
      }
    }

    return farthestCorner;
  },

  // Check if a point is inside a bounding box
  isPointInside: (box: Box3, point: Vector3): boolean => {
    return box.containsPoint(point);
  },

  // Get the closest point on a bounding box to a given point
  getClosestPoint: (box: Box3, toPoint: Vector3): Vector3 => {
    return box.clampPoint(toPoint, new Vector3());
  },
};