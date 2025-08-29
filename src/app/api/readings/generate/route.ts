import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/database'
import { ReadingResponse } from '@/app/types/tarot'
import { z } from 'zod'

// Request validation schema
const generateRequestSchema = z.object({
  spreadType: z.enum(['single', 'three-card', 'celtic-cross']),
  title: z.string().optional(),
  includeInterpretation: z.boolean().default(false)
})

// Map string values to SpreadType enum
const mapStringToSpreadType = (spreadType: string): any => {
  switch (spreadType) {
    case 'single':
      return 'SINGLE'
    case 'three-card':
      return 'THREE_CARD'
    case 'celtic-cross':
      return 'CELTIC_CROSS'
    default:
      return spreadType.toUpperCase()
  }
}

export async function POST(request: NextRequest) {
  // Get the authenticated user session (optional for generation)
  const session = await getServerSession(authOptions)
  const isAuthenticated = session?.user?.id ? true : false
  
  // Verify that the user exists in the database if authenticated
  if (isAuthenticated && session?.user?.id) {
    const userExists = await prisma.user.findUnique({
      where: { id: session.user.id }
    })
    
    if (!userExists) {
      console.error('User not found in database:', { userId: session.user.id, session })
      return NextResponse.json(
        { error: 'User not found in database. Please try logging out and back in.' },
        { status: 401 }
      )
    }
  }
  
  try {
    
    // Parse and validate request body
    const body = await request.json()
    const validatedData = generateRequestSchema.parse(body)
    const { spreadType, title, includeInterpretation } = validatedData
    
    // Get the default deck
    const deck = await prisma.deck.findFirst()
    if (!deck) {
      return NextResponse.json(
        { error: 'No deck found' },
        { status: 404 }
      )
    }
    
    // Determine number of cards to draw based on spread type
    let cardCount = 1
    switch (spreadType) {
      case 'single':
        cardCount = 1
        break
      case 'three-card':
        cardCount = 3
        break
      case 'celtic-cross':
        cardCount = 10
        break
    }
    
    // Draw random cards
    const availableCards = await prisma.tarotCard.findMany({
      where: { deckId: deck.id }
    })
    
    if (availableCards.length < cardCount) {
      return NextResponse.json(
        { error: 'Not enough cards in deck' },
        { status: 400 }
      )
    }
    
    // Select random cards without replacement
    const selectedCards = []
    const shuffledCards = [...availableCards].sort(() => Math.random() - 0.5)
    
    for (let i = 0; i < cardCount; i++) {
      const card = shuffledCards[i]
      const isReversed = Math.random() < 0.3 // 30% chance of being reversed
      
      selectedCards.push({
        cardId: card.id,
        position: i,
        isReversed
      })
    }
    
    let reading = null
    let savedToDatabase = false
    
    // Only save to database if user is authenticated
    if (isAuthenticated && session?.user?.id) {
      // Create the reading in the database
      const readingTitle = title || `${spreadType} Reading - ${new Date().toLocaleDateString()}`
      
      reading = await prisma.reading.create({
          data: {
            userId: session.user.id,
            deckId: deck.id,
            spreadType: mapStringToSpreadType(spreadType) as any,
            journalEntry: {
              create: {
                userId: session.user.id,
                title: readingTitle,
                notes: includeInterpretation ? 'Auto-generated reading' : '',
                userNotes: null
              }
            },
            readingCards: {
              create: selectedCards.map(card => ({
                cardId: card.cardId,
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
                    arcana: true,
                    meaningUpright: true,
                    meaningReversed: true,
                    keywords: true,
                    description: true
                  }
                }
              }
            },
            journalEntry: true
          }
        })
      savedToDatabase = true
    }
    
    // Format the response
    const formattedReading: ReadingResponse = {
      id: reading?.id || `temp-${Date.now()}`,
      title: reading?.journalEntry?.title || title || `${spreadType} Reading - ${new Date().toLocaleDateString()}`,
      spreadType: mapStringToSpreadType(spreadType) as any,
      createdAt: reading?.createdAt.toISOString() || new Date().toISOString(),
      cards: selectedCards.map(card => {
        const cardData = availableCards.find(c => c.id === card.cardId)
        return {
          id: card.cardId,
          name: cardData?.name || 'Unknown Card',
          imageUrl: cardData?.imageUrl || '',
          isReversed: card.isReversed,
          position: card.position,
          arcana: cardData?.arcana || 'MINOR'
        }
      }),
      interpretation: {
        reading: reading?.journalEntry?.notes || (includeInterpretation ? 'Auto-generated reading' : ''),
        cardInterpretations: selectedCards.map(card => {
          const cardData = availableCards.find(c => c.id === card.cardId)
          const cardName = cardData?.name || 'Unknown Card'
          const uprightMeaning = cardData?.meaningUpright || 'Upright meaning'
          const reversedMeaning = cardData?.meaningReversed || 'Reversed meaning'
          
          return {
            position: card.position,
            cardName: cardName,
            interpretation: card.isReversed
              ? reversedMeaning
              : uprightMeaning
          }
        })
      },
      userInput: reading?.journalEntry?.userNotes || '',
      savedToDatabase: savedToDatabase,
      cardInterpretations: selectedCards.map(card => {
        const cardData = availableCards.find(c => c.id === card.cardId)
        const cardName = cardData?.name || 'Unknown Card'
        const uprightMeaning = cardData?.meaningUpright || 'Upright meaning'
        const reversedMeaning = cardData?.meaningReversed || 'Reversed meaning'
        
        return {
          position: card.position,
          cardName: cardName,
          interpretation: card.isReversed
            ? reversedMeaning
            : uprightMeaning
        }
      }),
    }
    
    // Debug log
    console.log('API Response:', {
      id: formattedReading.id,
      cardCount: formattedReading.cards.length,
      hasInterpretation: !!formattedReading.interpretation,
      interpretationLength: formattedReading.interpretation.reading.length,
      cardInterpretationsCount: formattedReading.cardInterpretations.length,
      selectedCardsCount: selectedCards.length
    })
    
    return NextResponse.json(formattedReading)
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      )
    }
    
    // Handle Prisma foreign key constraint violation specifically
    if (error instanceof Error && error.name === 'PrismaClientKnownRequestError') {
      const prismaError = error as any
      if (prismaError.code === 'P2003') {
        console.error('Foreign key constraint violated:', {
          error: prismaError.message,
          modelName: prismaError.meta?.modelName,
          fieldName: prismaError.meta?.field_name,
          userId: session?.user?.id || 'anonymous'
        })
        return NextResponse.json(
          {
            error: 'Database constraint violation. User may not exist or reference integrity issue.',
            details: 'Please try logging out and back in to refresh your session.'
          },
          { status: 400 }
        )
      }
    }
    
    // Log detailed error for debugging
    console.error('Error generating reading:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      userId: session?.user?.id || 'anonymous',
      timestamp: new Date().toISOString()
    })
    
    return NextResponse.json(
      { error: 'Failed to generate reading. Please try again.' },
      { status: 500 }
    )
  }
}