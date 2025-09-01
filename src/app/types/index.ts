/**
 * TypeScript interfaces for the landing page components
 */

// Basic 3D position type
export type Position3D = [number, number, number];

// Scene state interface
export interface SceneState {
  currentScene: number;
  matchLit: boolean;
  candleLit: boolean;
  moonGlowing: boolean;
  cameraPosition: Position3D;
  cameraTarget: Position3D;
}

// Match component props interface
export interface MatchProps {
  position: Position3D;
  isLit: boolean;
  onClick: () => void;
}

// Candle component props interface
export interface CandleProps {
  position: Position3D;
  isLit: boolean;
  onLight: () => void;
}

// Moon component props interface
export interface MoonProps {
  position: Position3D;
  isGlowing: boolean;
  onGlow: () => void;
}

// Table component props interface
export interface TableProps {
  position: Position3D;
}

// Lighting system props interface
export interface LightingSystemProps {
  matchLit: boolean;
  candleLit: boolean;
  moonGlowing: boolean;
}

// Scene controller props interface
export interface SceneControllerProps {
  currentScene: number;
  sceneState: SceneState;
  advanceScene: (sceneNumber: number) => void;
}

// Welcome message animation variants
export const welcomeVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
  scale: {
    initial: { scale: 0 },
    animate: { scale: 1 },
  },
  title: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  description: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  button: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  stars: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
};

// Animation timing constants
export const ANIMATION_TIMING = {
  fast: 0.3,
  medium: 0.8,
  slow: 1.5,
  transition: 0.5,
} as const;

// Scene configuration interface
export interface SceneConfig {
  id: number;
  name: string;
  description: string;
  cameraPosition: Position3D;
  cameraTarget: Position3D;
  duration?: number;
  autoAdvance?: boolean;
}

// Available scenes configuration
export const SCENES: SceneConfig[] = [
{
  id: 1,
  name: "Light the Match",
  description: "Click on the match to light it",
  cameraPosition: [0, 3, 4], // Start camera further back and higher to avoid collision
  cameraTarget: [0, 1.2, 0], // Target to aim at the match
  duration: 0,
  autoAdvance: false,
},
  {
    id: 2,
    name: "Light the Candle",
    description: "Click on the candle to light it",
    cameraPosition: [0, 2, 7], // Camera further back
    cameraTarget: [0, 1.5, 0], // Adjusted target higher to ensure candle is in frame
    duration: 0,
    autoAdvance: false,
  },
  {
    id: 3,
    name: "Light in Darkness",
    description: "The candle lights the way...",
    cameraPosition: [0, 2, 3], // Start camera close to the candle
    cameraTarget: [0, 4, -5], // Target between candle and moon
    duration: 8000, // Increased duration to allow candle animation
    autoAdvance: true,
  },
  {
    id: 4,
    name: "The Moon",
    description: "Embrace the light of the Moon...",
    cameraPosition: [0, 5, -5],
    cameraTarget: [0, 6, -8],
    duration: 5000,
    autoAdvance: true,
  },
  {
    id: 5,
    name: "A reading",
    description: "Guided by fate...",
    cameraPosition: [0, 4, -3],
    cameraTarget: [0, 1.5, 0],
    duration: 5000,
    autoAdvance: true,
  },
  {
    id: 6,
    name: "Welcome",
    description: "Unlock your destiny",
    cameraPosition: [0, 4, -3],
    cameraTarget: [0, 3, -1],
    duration: 0,
    autoAdvance: false,
  },
];