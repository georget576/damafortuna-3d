import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { DrawCardResponse } from '@/app/types/tarot'
import { z } from 'zod'

// Request validation schema
const drawRequestSchema = z.object({
  spreadType: z.enum(['single', 'three-card', 'celtic-cross']),
  deckId: z.string().optional()
})

export interface DrawRequest {
  spreadType: string
  deckId?: string
}

export interface DrawResponse {
  cards: DrawCardResponse[]
}

// Function to generate random reversals
function generateRandomReversals(count: number): boolean[] {
  const reversals: boolean[] = []
  for (let i = 0; i < count; i++) {
    reversals.push(Math.random() < 0.2) // 20% chance of being reversed
  }
  return reversals
}

// Function to get card count based on spread type
function getCardCount(spreadType: string): number {
  switch (spreadType.toLowerCase()) {
    case 'single':
      return 1
    case 'three-card':
      return 3
    case 'celtic-cross':
      return 10
    default:
      throw new Error('Invalid spread type')
  }
}

// Function to shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = drawRequestSchema.parse(body)
    const { spreadType, deckId } = validatedData
    
    // Get card count based on spread type
    const cardCount = getCardCount(spreadType)
    
    // Get all cards from the specified deck or default deck
    const deck = deckId
      ? await prisma.deck.findUnique({
          where: { id: deckId },
          include: { tarotCards: true }
        })
      : await prisma.deck.findFirst({
          include: { tarotCards: true }
        })
    
    if (!deck || !deck.tarotCards || deck.tarotCards.length === 0) {
      return NextResponse.json(
        { error: 'No cards found in the specified deck' },
        { status: 404 }
      )
    }
    
    // Check if there are enough cards in the deck
    if (deck.tarotCards.length < cardCount) {
      return NextResponse.json(
        { error: `Not enough cards in deck. Required: ${cardCount}, Available: ${deck.tarotCards.length}` },
        { status: 400 }
      )
    }
    
    // Shuffle cards and draw the required number
    const shuffledCards = shuffleArray(deck.tarotCards)
    const drawnCards = shuffledCards.slice(0, cardCount)
    
    // Generate random reversals
    const reversals = generateRandomReversals(cardCount)
    
    // Format the response
    const cards = drawnCards.map((card, index) => ({
      id: card.id,
      name: card.name,
      imageUrl: card.imageUrl,
      isReversed: reversals[index],
      position: index + 1,
      arcana: card.arcana,
      suit: card.suit,
      number: card.number
    }))
    
    return NextResponse.json({
      cards
    } as DrawResponse)
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error drawing cards:', error)
    return NextResponse.json(
      { error: 'Failed to draw cards' },
      { status: 500 }
    )
  }
}