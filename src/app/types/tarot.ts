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
