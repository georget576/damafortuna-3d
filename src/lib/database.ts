import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Service functions for tarot cards
export const tarotCardService = {
  // Get all tarot cards
  getAllCards: async () => {
    return await prisma.tarotCard.findMany({
      include: {
        deck: true
      },
      orderBy: [
        { arcana: 'asc' },
        { suit: 'asc' },
        { number: 'asc' }
      ]
    });
  },

  // Get cards by arcana type
  getCardsByArcana: async (arcana: 'MAJOR' | 'MINOR') => {
    return await prisma.tarotCard.findMany({
      where: { arcana },
      include: {
        deck: true
      },
      orderBy: [
        { suit: 'asc' },
        { number: 'asc' }
      ]
    });
  },

  // Get cards by suit
  getCardsBySuit: async (suit: 'WANDS' | 'CUPS' | 'SWORDS' | 'PENTACLES') => {
    return await prisma.tarotCard.findMany({
      where: { suit },
      include: {
        deck: true
      },
      orderBy: [
        { number: 'asc' }
      ]
    });
  },

  // Get a single card by ID
  getCardById: async (id: string) => {
    return await prisma.tarotCard.findUnique({
      where: { id },
      include: {
        deck: true
      }
    });
  },

  // Get a card by name
  getCardByName: async (name: string) => {
    return await prisma.tarotCard.findFirst({
      where: { name },
      include: {
        deck: true
      }
    });
  },

  // Search cards by keyword
  searchCards: async (keyword: string) => {
    return await prisma.tarotCard.findMany({
      where: {
        OR: [
          { keywords: { has: keyword } },
          { name: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } },
          { meaningUpright: { contains: keyword, mode: 'insensitive' } },
          { meaningReversed: { contains: keyword, mode: 'insensitive' } }
        ]
      },
      include: {
        deck: true
      }
    });
  }
};

// Service functions for decks
export const deckService = {
  // Get all decks
  getAllDecks: async () => {
    return await prisma.deck.findMany({
      include: {
        tarotCards: true
      }
    });
  },

  // Get a deck by ID
  getDeckById: async (id: string) => {
    return await prisma.deck.findUnique({
      where: { id },
      include: {
        tarotCards: true
      }
    });
  },

  // Get a deck by name
  getDeckByName: async (name: string) => {
    return await prisma.deck.findFirst({
      where: { name },
      include: {
        tarotCards: true
      }
    });
  }
};