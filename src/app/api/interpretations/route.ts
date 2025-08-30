import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { InterpretationResponse, CardInterpretation } from '@/app/types/tarot'
import { z } from 'zod'

// Request validation schema for readingId and userId
const interpretationRequestSchema = z.object({
  readingId: z.string(),
  userId: z.string().optional()
})

// Schema for cards and spread type
const cardsAndSpreadSchema = z.object({
  cards: z.array(z.object({
    id: z.string(),
    isReversed: z.boolean(),
    position: z.number()
  })),
  spreadType: z.enum(['single', 'three-card', 'celtic-cross'])
})

// Helper function to generate reading based on spread type
function generateReading(spreadType: string, cardInterpretations: CardInterpretation[]): string {
  const spreadDescriptions: Record<string, string> = {
    'single': 'This single card reading offers insight into your current situation and provides guidance for moving forward.',
    'three-card': 'This three-card reading represents your past, present, and future. The first card shows what has led you to this point, the second card reveals your current situation, and the third card indicates where you are headed.',
    'celtic-cross': 'This Celtic Cross reading provides a comprehensive view of your situation. The first card represents your current position, the second card crosses and challenges you, the third card is your foundation, the fourth card is your recent past, the fifth card is your conscious goal, the sixth card is your unconscious influences, the seventh card represents your attitude, the eighth card represents your external environment, the ninth card represents your hopes and fears, and the tenth card represents the likely outcome.'
  }
  
  const description = spreadDescriptions[spreadType.toLowerCase()] || 'This reading offers insight into your current situation.'
  
  let reading = `${description}\n\n`
  
  cardInterpretations.forEach((interpretation) => {
    reading += `Card ${interpretation.position}: ${interpretation.cardName}\n`
    reading += `${interpretation.interpretation}\n\n`
  })
  
  return reading
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = interpretationRequestSchema.parse(body)
    const { readingId, userId } = validatedData
    
    // First, try to find the reading by ID
    let reading = await prisma.reading.findFirst({
      where: {
        id: readingId,
        ...(userId && { userId: userId }) // Only check userId if provided
      },
      include: {
        readingCards: {
          include: {
            card: {
              select: {
                id: true,
                name: true,
                meaningUpright: true,
                meaningReversed: true
              }
            }
          },
          orderBy: { position: 'asc' }
        }
      }
    })

    // If not found by ID, try to find the reading via the journal entry
    if (!reading) {
      const journalEntry = await prisma.journalEntry.findFirst({
        where: {
          id: readingId,
          ...(userId && { userId: userId })
        },
        include: {
          reading: {
            include: {
              readingCards: {
                include: {
                  card: {
                    select: {
                      id: true,
                      name: true,
                      meaningUpright: true,
                      meaningReversed: true
                    }
                  }
                },
                orderBy: { position: 'asc' }
              }
            }
          }
        }
      })

      if (journalEntry?.reading) {
        reading = journalEntry.reading
      }
    }
    
    if (!reading) {
      return NextResponse.json(
        { error: 'Reading not found. The journal entry may not have an associated reading.' },
        { status: 404 }
      )
    }
    
    // Map readingCards to the expected format
    const cards = reading.readingCards.map(rc => ({
      id: rc.card.id,
      isReversed: rc.isReversed,
      position: rc.position
    }))
    
    // Map spread type to the expected format
    const spreadTypeMap: Record<string, string> = {
      'SINGLE': 'single',
      'THREE_CARD': 'three-card',
      'CELTIC_CROSS': 'celtic-cross'
    }
    
    const spreadType = spreadTypeMap[reading.spreadType] || 'single'
    
    // Validate cards and spread type
    const validatedCardsAndSpread = cardsAndSpreadSchema.parse({
      cards,
      spreadType
    })
    
    const { cards: validatedCards, spreadType: validatedSpreadType } = validatedCardsAndSpread
    
    // Get card IDs and fetch card details
    const cardIds = validatedCards.map(card => card.id)
    const cardDetails = await prisma.tarotCard.findMany({
      where: { id: { in: cardIds } },
      select: { id: true, name: true, meaningUpright: true, meaningReversed: true }
    })
    
    // Create a map of card details by id for easy lookup
    const cardDetailsMap = new Map<string, { id: string; name: string; meaningUpright: string | null; meaningReversed: string | null }>()
    cardDetails.forEach(card => {
      cardDetailsMap.set(card.id, card)
    })
    
    // Generate interpretations for each card
    const cardInterpretations: CardInterpretation[] = validatedCards.map((card) => {
      const details = cardDetailsMap.get(card.id)
      
      if (!details) {
        return {
          position: card.position,
          cardName: 'Unknown Card',
          interpretation: 'No interpretation available for this card.'
        }
      }
      
      const interpretation = card.isReversed ? details.meaningReversed : details.meaningUpright
      
      return {
        position: card.position,
        cardName: details.name,
        interpretation: interpretation || 'No interpretation available for this card.'
      }
    })
    
    // Generate the full reading
    const readingText = generateReading(validatedSpreadType, cardInterpretations)
    
    return NextResponse.json({
      reading: readingText,
      cardInterpretations
    } as InterpretationResponse)
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error generating interpretations:', error)
    return NextResponse.json(
      { error: 'Failed to generate interpretations' },
      { status: 500 }
    )
  }
}