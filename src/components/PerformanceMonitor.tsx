'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, Vector3, Color } from 'three';

interface PerformanceStats {
  fps: number;
  drawCalls: number;
  culledObjects: number;
  visibleObjects: number;
  memoryUsage: number;
  lastUpdateTime: number;
}

interface PerformanceMonitorProps {
  enabled: boolean;
  updateInterval: number;
  showStats: boolean;
  onStatsUpdate?: (stats: PerformanceStats) => void;
}

export function PerformanceMonitor({
  enabled = true,
  updateInterval = 1000,
  showStats = true,
  onStatsUpdate
}: PerformanceMonitorProps) {
  const { gl, scene } = useThree();
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 0,
    drawCalls: 0,
    culledObjects: 0,
    visibleObjects: 0,
    memoryUsage: 0,
    lastUpdateTime: 0,
  });

  const frameCount = useRef(0);
  const lastFpsUpdate = useRef(0);
  const lastStatsUpdate = useRef(0);
  const rendererInfo = useRef(gl.info);

  // Calculate FPS
  const calculateFPS = (delta: number) => {
    frameCount.current++;
    const now = performance.now();
    
    if (now - lastFpsUpdate.current >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / (now - lastFpsUpdate.current));
      frameCount.current = 0;
      lastFpsUpdate.current = now;
      return fps;
    }
    
    return stats.fps;
  };

  // Count visible objects in scene
  const countVisibleObjects = () => {
    let visibleCount = 0;
    let culledCount = 0;
    
    scene.traverse((object) => {
      if ('visible' in object && object.visible !== false) {
        visibleCount++;
      } else {
        culledCount++;
      }
    });
    
    return { visible: visibleCount, culled: culledCount };
  };

  // Get memory usage if available
  const getMemoryUsage = () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / (1024 * 1024); // Convert to MB
    }
    return 0;
  };

  // Main stats update loop
  const updateStats = (delta: number) => {
    const now = performance.now();
    
    if (now - lastStatsUpdate.current >= updateInterval) {
      const fps = calculateFPS(delta);
      const { visible, culled } = countVisibleObjects();
      const memoryUsage = getMemoryUsage();
      const drawCalls = rendererInfo.current.render.calls;
      
      const newStats: PerformanceStats = {
        fps,
        drawCalls,
        culledObjects: culled,
        visibleObjects: visible,
        memoryUsage,
        lastUpdateTime: now,
      };
      
      setStats(newStats);
      onStatsUpdate?.(newStats);
      
      // Reset renderer info for next interval
      rendererInfo.current.reset();
      
      lastStatsUpdate.current = now;
    }
  };

  // Stats display component
  const StatsDisplay = () => {
    if (!showStats) return null;

    const formatNumber = (num: number) => num.toFixed(0);
    const formatMemory = (mb: number) => mb.toFixed(1);

    return (
      <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-3 rounded-lg font-mono text-sm z-50">
        <div className="flex flex-col space-y-1">
          <div className="flex justify-between">
            <span>FPS:</span>
            <span className={stats.fps > 50 ? 'text-green-400' : stats.fps > 30 ? 'text-yellow-400' : 'text-red-400'}>
              {formatNumber(stats.fps)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Draw Calls:</span>
            <span>{formatNumber(stats.drawCalls)}</span>
          </div>
          <div className="flex justify-between">
            <span>Visible Objects:</span>
            <span className="text-green-400">{formatNumber(stats.visibleObjects)}</span>
          </div>
          <div className="flex justify-between">
            <span>Culled Objects:</span>
            <span className="text-yellow-400">{formatNumber(stats.culledObjects)}</span>
          </div>
          <div className="flex justify-between">
            <span>Memory:</span>
            <span>{formatMemory(stats.memoryUsage)} MB</span>
          </div>
        </div>
      </div>
    );
  };

  // Performance monitoring in useFrame
  useFrame((state, delta) => {
    if (!enabled) return;
    
    updateStats(delta);
  });

  // Performance monitoring in regular intervals
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      // Additional stats that don't need to be calculated every frame
    }, updateInterval);

    return () => clearInterval(interval);
  }, [enabled, updateInterval]);

  return (
    <>
      <StatsDisplay />
    </>
  );
}

// Hook for performance monitoring
export function usePerformanceMonitoring() {
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  
  const startMonitoring = () => {
    setIsMonitoring(true);
  };
  
  const stopMonitoring = () => {
    setIsMonitoring(false);
    setStats(null);
  };
  
  const resetStats = () => {
    setStats(null);
  };
  
  return {
    stats,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    resetStats,
  };
}

// Utility for performance benchmarking
export class PerformanceBenchmark {
  private results: { [key: string]: number[] } = {};
  private startTime = 0;
  
  start(label: string) {
    this.startTime = performance.now();
    if (!this.results[label]) {
      this.results[label] = [];
    }
  }
  
  end(label: string) {
    const duration = performance.now() - this.startTime;
    this.results[label].push(duration);
  }
  
  getAverage(label: string): number {
    const values = this.results[label] || [];
    if (values.length === 0) return 0;
    
    const sum = values.reduce((a, b) => a + b, 0);
    return sum / values.length;
  }
  
  getStats(label: string): { average: number; min: number; max: number; count: number } {
    const values = this.results[label] || [];
    if (values.length === 0) {
      return { average: 0, min: 0, max: 0, count: 0 };
    }
    
    const sum = values.reduce((a, b) => a + b, 0);
    const average = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    return { average, min, max, count: values.length };
  }
  
  reset() {
    this.results = {};
  }
  
  getAllStats(): { [key: string]: any } {
    const allStats: { [key: string]: any } = {};
    
    for (const label in this.results) {
      allStats[label] = this.getStats(label);
    }
    
    return allStats;
  }
}

// Hook for performance benchmarking
export function usePerformanceBenchmark() {
  const benchmark = useRef(new PerformanceBenchmark());
  
  const start = (label: string) => {
    benchmark.current.start(label);
  };
  
  const end = (label: string) => {
    benchmark.current.end(label);
  };
  
  const getStats = (label: string) => {
    return benchmark.current.getStats(label);
  };
  
  const getAllStats = () => {
    return benchmark.current.getAllStats();
  };
  
  const reset = () => {
    benchmark.current.reset();
  };
  
  return {
    start,
    end,
    getStats,
    getAllStats,
    reset,
  };
}