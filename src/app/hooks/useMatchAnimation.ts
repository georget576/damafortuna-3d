import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { useVisibilityCulling } from './useVisibilityCulling';

interface UseMatchAnimationProps {
  matchRef: React.RefObject<Group>;
  isLit: boolean;
  enableTransform: boolean;
}

export function useMatchAnimation({
  matchRef,
  isLit,
  enableTransform
}: UseMatchAnimationProps) {
  // Use visibility culling to optimize animation - DISABLED FOR DEBUGGING
  const { isVisible } = useVisibilityCulling(matchRef, {
    enableDistanceCulling: false,
    enableFrustumCulling: false,
    cullingDistance: 12,
    checkInterval: 100,
  });

  useFrame((state) => {
    // Skip animation if object is not visible and culling is enabled
    if (!matchRef.current || !isVisible) return;
    
    // Different animation behavior based on match state
    if (isLit && !enableTransform) {
      // When lit, create a subtle flickering effect
      const flickerSpeed = 3;
      const flickerAmplitude = 0.02;
      const flicker = Math.sin(state.clock.elapsedTime * flickerSpeed * 10) * flickerAmplitude;
      
      // Subtle rotation when lit
      matchRef.current.rotation.z = flicker;
      
      // Subtle scaling effect when lit
      const scale = 1 + flicker * 0.1;
      matchRef.current.scale.set(scale, scale, scale);
    } else if (!isLit && enableTransform) {
      // When unlit and transform enabled, use original animation
      const animationSpeed = isVisible ? 1 : 0;
      const amplitude = isVisible ? 0.05 : 0;
      matchRef.current.rotation.z = Math.sin(state.clock.elapsedTime * animationSpeed) * amplitude;
    }
  });
}