'use client';

import { useRef, useEffect } from 'react';

export const usePerformanceMonitor = () => {
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const fps = useRef(0);

  useEffect(() => {
    const updateFPS = () => {
      frameCount.current++;
      const now = performance.now();
      const delta = now - lastTime.current;
      
      if (delta >= 1000) {
        fps.current = Math.round((frameCount.current * 1000) / delta);
        frameCount.current = 0;
        lastTime.current = now;
        console.log(`[Performance] FPS: ${fps.current}`);
      }
      
      requestAnimationFrame(updateFPS);
    };
    
    const animationId = requestAnimationFrame(updateFPS);
    return () => cancelAnimationFrame(animationId);
  }, []);
};