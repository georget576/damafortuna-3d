export interface TarotCardData {
  id: string;
  name: string;
  image: string;
  description: string;
  keywords: string[];
  arcana: 'major' | 'minor';
  suit?: 'cups' | 'wands' | 'swords' | 'pentacles';
}

export type SpreadType = 'three-card' | 'celtic-cross' | 'single';

// Spread type descriptions
export interface SpreadTypeDescription {
  type: SpreadType;
  name: string;
  description: string;
}

export const SPREAD_TYPE_DESCRIPTIONS: SpreadTypeDescription[] = [
  {
    type: 'three-card',
    name: 'Past, Present & Future',
    description: 'A classic three-card spread that reveals past influences, current situation, and future outcomes.'
  },
  {
    type: 'celtic-cross',
    name: 'Celtic Cross',
    description: 'A comprehensive ten-card spread that provides deep insight into complex situations and questions.'
  },
  {
    type: 'single',
    name: 'General',
    description: 'A single card reading for quick guidance and general insight.'
  }
];

// API response types
export interface DrawCardResponse {
  id: string;
  name: string;
  imageUrl: string;
  isReversed: boolean;
  position: number;
  arcana: 'MAJOR' | 'MINOR';
  suit?: string;
  number?: number;
}

export interface CardInterpretation {
  position: number;
  cardName: string;
  interpretation: string;
}

export interface InterpretationResponse {
  reading: string;
  cardInterpretations: CardInterpretation[];
}

export interface ReadingResponse {
  id: string;
  title: string;
  spreadType: string;
  createdAt: string;
  cards: DrawCardResponse[];
  interpretation: InterpretationResponse;
  cardInterpretations: CardInterpretation[];
  userInput?: string;
  savedToDatabase?: boolean;
}
