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

// Helper function to generate enhanced, story-like interpretation
function generateFullInterpretation(selectedCards: any[], availableCards: any[], spreadType: string): string {
  const spreadIntroductions: Record<string, string> = {
    'single': 'The universe speaks to you through this single card, offering a focused message that illuminates your current path and whispers guidance for the journey ahead.',
    'three-card': 'As the cards unfold before you, they weave a tapestry of time - each position revealing a chapter in your story, past, present, and future flowing together like a sacred river.',
    'celtic-cross': 'The sacred pattern of the Celtic Cross emerges, a mystical crossroads where your journey intersects with destiny, challenge, and potential. Each card illuminates a different facet of your current reality.'
  }

  const spreadConclusions: Record<string, string> = {
    'single': 'This card serves as both mirror and compass, reflecting your inner landscape while pointing toward the wisdom that awaits your next step.',
    'three-card': 'Remember that the past is your foundation, the present is your power, and the future is your potential - all existing in the eternal now of your consciousness.',
    'celtic-cross': 'This reading reveals not just what is, but what could be. Trust in the divine timing of your journey and know that you are always guided and protected.'
  }

  const positionNames: Record<string, string[]> = {
    'single': ['The Present Moment'],
    'three-card': ['The Past', 'The Present', 'The Future'],
    'celtic-cross': [
      'The Present', 'The Challenge', 'The Foundation',
      'The Recent Past', 'The Conscious Goal', 'The Unconscious',
      'The Attitude', 'The External Environment',
      'Hopes & Fears', 'The Outcome'
    ]
  }

  const description = spreadIntroductions[spreadType.toLowerCase()] || 'The cards reveal their wisdom to guide you on your path.'
  
  let reading = `✨ ${description}\n\n`
  
  // Add narrative flow based on spread type
  if (spreadType === 'three-card') {
    reading += `📚 Your Story Unfolds:\n\n`
  } else if (spreadType === 'celtic-cross') {
    reading += `🔮 The Sacred Pattern:\n\n`
  } else {
    reading += `💫 The Message:\n\n`
  }
  
  selectedCards.forEach((card, index) => {
    const cardData = availableCards.find(c => c.id === card.cardId)
    const cardName = cardData?.name || 'Unknown Card'
    const cardKeywords = cardData?.keywords || []
    const interpretation = card.isReversed ? cardData?.meaningReversed : cardData?.meaningUpright
    
    const positionName = positionNames[spreadType.toLowerCase()]?.[index] || `Position ${index + 1}`
    
    reading += `🎴 ${positionName}: ${cardName}\n`
    
    // Add keywords as "energies"
    if (cardKeywords.length > 0) {
      reading += `   Energies: ${cardKeywords.join(' • ')}\n`
    }
    
    // Add the interpretation with enhanced formatting
    reading += `   ${interpretation || 'No interpretation available for this card.'}\n\n`
  })
  
  // Add conclusion
  reading += `\n💫 ${spreadConclusions[spreadType.toLowerCase()] || 'Trust in the wisdom of the cards and your own intuition.'}\n\n`
  
  // Add a gentle reminder
  reading += `🌟 Remember: Tarot is a tool for self-reflection and guidance. The true wisdom lies within you, and these cards simply help illuminate the path that already exists in your heart.`
  
  return reading
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
      const readingTitle = title || `New ${spreadType} Reading - ${new Date().toLocaleDateString()}`
      
      // Debug log for slug generation
      console.log('Slug generation debug:', {
        originalTitle: readingTitle,
        words: readingTitle.trim().split(' '),
        firstSixWords: readingTitle.trim().split(' ').slice(0, 6),
        generatedSlug: readingTitle ? readingTitle.trim().split(' ').slice(0, 6).join('-').toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '') : null
      })
      
      reading = await prisma.reading.create({
          data: {
            userId: session.user.id,
            deckId: deck.id,
            spreadType: mapStringToSpreadType(spreadType) as any,
            journalEntry: {
              create: {
                userId: session.user.id,
                title: readingTitle,
                // Generate a slug from the first 6 words of the title
                slug: readingTitle ? readingTitle.trim().split(' ').slice(0, 6).join('-').toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '') : null,
                notes: includeInterpretation ? generateFullInterpretation(selectedCards, availableCards, spreadType) : '',
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
        reading: reading?.journalEntry?.notes || (includeInterpretation ? generateFullInterpretation(selectedCards, availableCards, spreadType) : ''),
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