import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { ReadingResponse, DrawCardResponse, CardInterpretation } from '@/app/types/tarot'
import { z } from 'zod'

// Request validation schemas
const readingRequestSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  spreadType: z.enum(['single', 'three-card', 'celtic-cross']),
  cards: z.array(z.object({
    id: z.string(),
    isReversed: z.boolean(),
    position: z.number()
  })),
  interpretation: z.string().min(1, 'Interpretation is required'),
  cardInterpretations: z.array(z.object({
    position: z.number(),
    cardName: z.string(),
    interpretation: z.string()
  })),
  userInput: z.string().optional()
})

const paginationSchema = z.object({
  page: z.string().transform(val => parseInt(val, 10)).default('1'),
  limit: z.string().transform(val => parseInt(val, 10)).default('10')
})

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = readingRequestSchema.parse(body)
    const { title, spreadType, cards, interpretation, cardInterpretations, userInput } = validatedData
    
    // Get the default deck
    const deck = await prisma.deck.findFirst()
    if (!deck) {
      return NextResponse.json(
        { error: 'No deck found' },
        { status: 404 }
      )
    }
    
    // Create the reading in the database
    const reading = await prisma.reading.create({
      data: {
        userId: 'default-user', // In a real app, this would come from authentication
        deckId: deck.id,
        spreadType: spreadType.toUpperCase() as any, // Convert to enum
        journalEntry: {
          create: {
            userId: 'default-user', // In a real app, this would come from authentication
            title,
            notes: interpretation,
            userNotes: userInput || null // Include user input as userNotes
          }
        },
        readingCards: {
          create: cards.map(card => ({
            cardId: card.id,
            position: card.position,
            isReversed: card.isReversed
          }))
        }
      },
      include: {
        readingCards: {
          include: {
            card: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                arcana: true
              }
            }
          }
        },
        journalEntry: true
      }
    })
    
    // Format the response
    const formattedReading: ReadingResponse = {
      id: reading.id,
      title: reading.journalEntry?.title || '',
      spreadType: reading.spreadType,
      createdAt: reading.createdAt.toISOString(),
      cards: reading.readingCards.map(card => ({
        id: card.cardId,
        name: card.card.name,
        imageUrl: card.card.imageUrl || '',
        isReversed: card.isReversed,
        position: card.position,
        arcana: card.card.arcana
      })),
      interpretation: reading.journalEntry?.notes || '',
      cardInterpretations: cardInterpretations,
      userInput: reading.journalEntry?.userNotes || ''
    }
    
    return NextResponse.json(formattedReading)
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error creating reading:', error)
    return NextResponse.json(
      { error: 'Failed to create reading' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Parse and validate query parameters
    const { searchParams } = new URL(request.url)
    const pagination = paginationSchema.parse(Object.fromEntries(searchParams))
    const { page, limit } = pagination
    const offset = (page - 1) * limit
    
    // Get readings from database with optimized query
    const readings = await prisma.reading.findMany({
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        readingCards: {
          include: {
            card: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                arcana: true
              }
            }
          }
        },
        journalEntry: {
          where: {
            userId: 'default-user' // In a real app, this would come from authentication
          }
        }
      }
    })
    
    // Format the response
    const formattedReadings: ReadingResponse[] = readings.map(reading => ({
      id: reading.id,
      title: reading.journalEntry?.title || '',
      spreadType: reading.spreadType,
      createdAt: reading.createdAt.toISOString(),
      cards: reading.readingCards.map(card => ({
        id: card.cardId,
        name: card.card.name,
        imageUrl: card.card.imageUrl || '',
        isReversed: card.isReversed,
        position: card.position,
        arcana: card.card.arcana
      })),
      interpretation: reading.journalEntry?.notes || '',
      cardInterpretations: [], // This would need to be stored separately or calculated
      userInput: reading.journalEntry?.userNotes || ''
    }))
    
    return NextResponse.json(formattedReadings)
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error fetching readings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch readings' },
      { status: 500 }
    )
  }
}