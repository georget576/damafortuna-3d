import { Vector3, Euler } from 'three';
import { SpreadType } from '../types/tarot';

interface CardTransform {
  position: Vector3;
  rotation: Euler;
}

export function getSpreadLayout(spread: SpreadType, count: number): CardTransform[] {
  // Card dimensions from TarotCard3D component (scaled)
  const CARD_WIDTH = 2.16; // 1.8 * 1.2
  const CARD_HEIGHT = 3.6; // 3 * 1.2
  const CARD_SPACING = 0.5; // Extra space between cards
  
  switch (spread) {
    case 'single':
      return [{
        position: new Vector3(0, 0, 0),
        rotation: new Euler(0, 0, 0), // Card is upright by default
      }];
      
    case 'three-card':
      // Calculate spacing based on card width to prevent overlap
      const cardSpacing = CARD_WIDTH + CARD_SPACING;
      // Reverse the order so cards appear left-to-right from camera perspective
      return Array.from({ length: count }).map((_, i) => ({
        position: new Vector3((count - 1 - i) * cardSpacing - (cardSpacing * (count - 1) / 2), 0, 0), // Cards in a straight line, no z-offset (reversed order)
        rotation: new Euler(0, 0, 0), // All cards are upright by default
      }));
      
    case 'celtic-cross':
      // Traditional Celtic Cross layout: Cross (6 cards) + Staff (4 cards)
      const positions = [
        // Cross pattern (first 6 cards)
        { x: 0, y: 0, z: 0 },           // 1. The Present - center position
        { x: 0, y: -0.1, z: 0.01 },     // 2. The Challenge - stacked underneath, will be rotated 90° on Z axis
        { x: 0, y: CARD_HEIGHT + CARD_SPACING, z: 0 }, // 3. Above - positioned above center
        { x: 0, y: -(CARD_HEIGHT + CARD_SPACING), z: 0 }, // 4. Below - positioned below center
        { x: CARD_WIDTH + CARD_SPACING, y: 0, z: 0 }, // 5. Right - positioned to the right
        { x: -(CARD_WIDTH + CARD_SPACING), y: 0, z: 0 }, // 6. Left - positioned to the left
        
        // Staff pattern (next 4 cards) - vertical column to the right (reversed order)
        { x: CARD_WIDTH * 2.5 + CARD_SPACING * 2, y: -(CARD_HEIGHT * 1.5 + CARD_SPACING), z: 0.2 }, // 7. External Influences - bottom of staff
        { x: CARD_WIDTH * 2.5 + CARD_SPACING * 2, y: -(CARD_HEIGHT * 0.5), z: 0.4 }, // 8. Hopes and Fears - middle bottom of staff
        { x: CARD_WIDTH * 2.5 + CARD_SPACING * 2, y: CARD_HEIGHT * 0.5, z: 0.6 }, // 9. Advice - middle top of staff
        { x: CARD_WIDTH * 2.5 + CARD_SPACING * 2, y: CARD_HEIGHT * 1.5 + CARD_SPACING, z: 0.8 }  // 10. The Outcome - top of staff
      ];
      
      return positions.slice(0, count).map((pos, i) => ({
        position: new Vector3(pos.x, pos.y, pos.z),
        // Apply 90-degree rotation on Z axis for card 2 (The Challenge)
        rotation: new Euler(0, 0, i === 1 ? Math.PI / 2 : 0), // Card 2 is rotated 90° on Z axis
      }));
      
    default:
      return [];
  }
}

