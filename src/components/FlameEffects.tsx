import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { BufferGeometry, Float32BufferAttribute, Points, AdditiveBlending, DoubleSide, Texture, Group } from 'three';
import { useRef, useMemo, useState } from 'react';

interface FlameEffectsProps {
  isLit: boolean;
  position?: [number, number, number];
  intensity?: number;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  size: number;
}

function EnhancedParticleSystem() {
  const particlesRef = useRef<Points>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const timeRef = useRef(0);
  
  // Load smoke texture
  const smokeTexture = useTexture('/assets/textures/smoke.png');
  
  // Initialize particles
  useMemo(() => {
    const initialParticles: Particle[] = [];
    const count = 150; // Reduced count for better performance with textured particles
    
    for (let i = 0; i < count; i++) {
      initialParticles.push({
        x: (Math.random() - 0.5) * 0.15,
        y: Math.random() * 0.1,
        z: (Math.random() - 0.5) * 0.15,
        vx: (Math.random() - 0.5) * 0.003,
        vy: 0.008 + Math.random() * 0.004,
        vz: (Math.random() - 0.5) * 0.003,
        life: Math.random(),
        maxLife: 1.0 + Math.random() * 1.0, // Longer life for smoke
        size: 0.08 + Math.random() * 0.04 // Larger size for smoke particles
      });
    }
    
    setParticles(initialParticles);
  }, []);
  
  // Update particle positions and properties
useFrame((state, delta) => {
if (!particlesRef.current) return;

timeRef.current += delta;
const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
const colors = particlesRef.current.geometry.attributes.color.array as Float32Array;

for (let i = 0; i < particles.length; i++) {
  const particle = particles[i];
  
  // Update life - slower for smoke particles
  particle.life += delta * 0.8;
  if (particle.life > particle.maxLife) {
    // Reset particle
    particle.x = (Math.random() - 0.5) * 0.15;
    particle.y = 0;
    particle.z = (Math.random() - 0.5) * 0.15;
    particle.vx = (Math.random() - 0.5) * 0.003;
    particle.vy = 0.008 + Math.random() * 0.004; // Slower upward movement
    particle.vz = (Math.random() - 0.5) * 0.003;
    particle.life = 0;
    particle.size = 0.08 + Math.random() * 0.04; // Larger size for smoke
  }
  
  // Enhanced noise-like turbulence for more realistic smoke movement
  const noise = Math.sin(particle.x * 1.5 + timeRef.current * 2) *
               Math.cos(particle.y * 1.2 + timeRef.current * 1.5) *
               Math.sin(particle.z * 1.8 + timeRef.current * 2.5);
  
  // Update velocity with turbulence - more horizontal movement for smoke
  particle.vx += (Math.random() - 0.5) * 0.002 + noise * 0.002;
  particle.vy += 0.002; // Slower upward buoyancy
  particle.vz += (Math.random() - 0.5) * 0.002 + noise * 0.002;
  
  // Apply damping - less damping for more smoke dispersion
  particle.vx *= 0.995;
  particle.vz *= 0.995;
  particle.vy *= 0.998;
  
  // Update position
  particle.x += particle.vx;
  particle.y += particle.vy;
  particle.z += particle.vz;
  
  // Calculate base index
  const idx = i * 3;
  
  // Update position array
  positions[idx] = particle.x;
  positions[idx + 1] = particle.y;
  positions[idx + 2] = particle.z;
  
  // Calculate color for smoke - gray to white
  const lifeRatio = particle.life / particle.maxLife;
  const heightFactor = Math.max(0, 1 - particle.y / 2.0);
  
  // Smoke color - gray tones
  const grayValue = 0.6 + heightFactor * 0.4; // Lighter as it rises
  colors[idx] = grayValue;     // R
  colors[idx + 1] = grayValue; // G
  colors[idx + 2] = grayValue; // B
  
  // Apply opacity based on life and height - more transparent for smoke
  const opacity = (1 - lifeRatio) * heightFactor * 0.6;
  colors[idx + 3] = opacity;
}

particlesRef.current.geometry.attributes.position.needsUpdate = true;
particlesRef.current.geometry.attributes.color.needsUpdate = true;
});
  
  // Create geometry and attributes
  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    const positions = new Float32Array(particles.length * 3);
    const colors = new Float32Array(particles.length * 4); // RGBA
    
    // Initialize positions and colors
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      const idx = i * 3;
      
      positions[idx] = particle.x;
      positions[idx + 1] = particle.y;
      positions[idx + 2] = particle.z;
      
      // Default color (will be updated in frame)
      colors[idx] = 0.8;
      colors[idx + 1] = 0.8;
      colors[idx + 2] = 0.8;
      colors[idx + 3] = 0.5;
    }
    
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geo.setAttribute('color', new Float32BufferAttribute(colors, 4));
    
    return geo;
  }, [particles]);
  
  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        map={smokeTexture}
        size={0.08}
        vertexColors={true}
        transparent={true}
        opacity={0.7}
        sizeAttenuation={true}
        blending={AdditiveBlending}
        depthWrite={false}
        map-anisotropy={8}
      />
    </points>
  );
}

export function FlameEffects({ isLit, position = [0, 1.8, 0], intensity = 1.0 }: FlameEffectsProps) {
  if (!isLit) return null;

  const flameTexture = useTexture('/assets/textures/flame.png');
  const [flickerIntensity, setFlickerIntensity] = useState(1.0);
  const [time, setTime] = useState(0);
  const outerFlameRef = useRef<Group>(null);
  const middleFlameRef = useRef<Group>(null);
  const innerFlameRef = useRef<Group>(null);
  const coreFlameRef = useRef<Group>(null);
  
  // Add realistic flickering and movement effects
  useFrame((state) => {
    const elapsedTime = state.clock.elapsedTime;
    setTime(elapsedTime);
    
    // Create realistic flickering with multiple sine waves
    const flicker = 0.9 +
      Math.sin(elapsedTime * 12) * 0.04 +
      Math.sin(elapsedTime * 19) * 0.025 +
      Math.sin(elapsedTime * 27) * 0.015 +
      Math.sin(elapsedTime * 35) * 0.008;
    setFlickerIntensity(flicker);
    
    // Animate flame movement
    if (outerFlameRef.current) {
      // Outer flame sways more subtly
      outerFlameRef.current.rotation.x = Math.sin(elapsedTime * 2.5) * 0.02;
      outerFlameRef.current.rotation.z = Math.cos(elapsedTime * 1.8) * 0.015;
    }
    
    if (middleFlameRef.current) {
      // Middle flame has more movement
      middleFlameRef.current.rotation.x = Math.sin(elapsedTime * 3.2) * 0.04;
      middleFlameRef.current.rotation.z = Math.cos(elapsedTime * 2.3) * 0.025;
      middleFlameRef.current.position.y = 0.08 + Math.sin(elapsedTime * 4.5) * 0.02;
    }
    
    if (innerFlameRef.current) {
      // Inner flame moves more actively
      innerFlameRef.current.rotation.x = Math.sin(elapsedTime * 4.1) * 0.06;
      innerFlameRef.current.rotation.z = Math.cos(elapsedTime * 3.1) * 0.04;
      innerFlameRef.current.position.y = 0.02 + Math.sin(elapsedTime * 5.8) * 0.03;
      
      // Scale pulsing for inner flame
      const scale = 1 + Math.sin(elapsedTime * 6.2) * 0.08;
      innerFlameRef.current.scale.set(scale, scale, scale);
    }
    
    if (coreFlameRef.current) {
      // Core flame has subtle movement
      coreFlameRef.current.rotation.x = Math.sin(elapsedTime * 5.3) * 0.03;
      coreFlameRef.current.rotation.z = Math.cos(elapsedTime * 4.2) * 0.02;
      coreFlameRef.current.position.y = -0.05 + Math.sin(elapsedTime * 7.1) * 0.015;
    }
  });

  return (
    <group position={position}>
      {/* Enhanced particle system */}
      <EnhancedParticleSystem />
      
      {/* Outer flame layer - deep red with slight transparency */}
      <group ref={outerFlameRef}>
        <mesh position={[0, 0.15, 0]}>
          <coneGeometry args={[0.3 * intensity, 1.2 * intensity, 16]} />
          <meshStandardMaterial
            map={flameTexture}
            transparent
            opacity={0.35 * flickerIntensity}
            emissive="#cc0000"
            emissiveIntensity={1.2 * intensity * flickerIntensity}
            side={DoubleSide}
            color="#cc0000"
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
      </group>
      
      {/* Middle flame layer - orange-red */}
      <group ref={middleFlameRef}>
        <mesh position={[0, 0.08, 0]}>
          <coneGeometry args={[0.22 * intensity, 0.9 * intensity, 14]} />
          <meshStandardMaterial
            map={flameTexture}
            transparent
            opacity={0.55 * flickerIntensity}
            emissive="#ff4400"
            emissiveIntensity={1.8 * intensity * flickerIntensity}
            color="#ff4400"
            side={DoubleSide}
            roughness={0.6}
            metalness={0.2}
          />
        </mesh>
      </group>
      
      {/* Inner flame layer - bright orange-yellow */}
      <group ref={innerFlameRef}>
        <mesh position={[0, 0.02, 0]}>
          <coneGeometry args={[0.15 * intensity, 0.6 * intensity, 12]} />
          <meshStandardMaterial
            map={flameTexture}
            transparent
            opacity={0.75 * flickerIntensity}
            emissive="#ff8800"
            emissiveIntensity={2.5 * intensity * flickerIntensity}
            color="#ff8800"
            side={DoubleSide}
            roughness={0.4}
            metalness={0.3}
          />
        </mesh>
      </group>
      
      {/* Core flame - bright white-yellow */}
      <group ref={coreFlameRef}>
        <mesh position={[0, -0.05, 0]}>
          <coneGeometry args={[0.08 * intensity, 0.3 * intensity, 10]} />
          <meshStandardMaterial
            color="#ffffaa"
            transparent
            opacity={0.85 * flickerIntensity}
            emissive="#ffffff"
            emissiveIntensity={3.5 * intensity * flickerIntensity}
            side={DoubleSide}
            roughness={0.2}
            metalness={0.4}
          />
        </mesh>
      </group>
      
      {/* Dynamic point light that flickers */}
      <pointLight
        position={[0, 0.4 * intensity, 0]}
        intensity={4 * intensity * flickerIntensity}
        color="#ffaa66"
        distance={3}
        decay={3}
      />
      
      {/* Additional ambient light for glow */}
      <pointLight
        position={[0, 0.2 * intensity, 0]}
        intensity={1.5 * intensity * flickerIntensity}
        color="#ff6600"
        distance={2}
        decay={4}
      />
      
      {/* Secondary point light for more realistic illumination */}
      <pointLight
        position={[0.1 * intensity, 0.3 * intensity, 0]}
        intensity={2 * intensity * flickerIntensity}
        color="#ff8844"
        distance={2.5}
        decay={3.5}
      />
    </group>
  );
}
