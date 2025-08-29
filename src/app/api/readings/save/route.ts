import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/database'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user session
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse the request body
    const body = await request.json()
    const { title, spreadType, cards, reading, cardInterpretations, notes, userId } = body

    // Use provided userId or fall back to authenticated user
    let targetUserId = userId || session.user.id

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id: targetUserId }
    })

    if (!userExists) {
      return NextResponse.json(
        { success: false, error: 'User not found in database. Please try logging out and back in.' },
        { status: 401 }
      )
    }

    // Get or create a default deck for the user
    let deck = await prisma.deck.findFirst({
      where: { name: 'Default Deck' }
    })

    if (!deck) {
      deck = await prisma.deck.create({
        data: {
          name: 'Default Deck',
          description: 'Default deck for new readings'
        }
      })
    }

    // Map spread type to Prisma enum
    const prismaSpreadType = spreadType.toUpperCase().replace('-', '_') as any

    // Create a reading record first
    const newReading = await prisma.reading.create({
      data: {
        spreadType: prismaSpreadType,
        userId: targetUserId,
        deckId: deck.id,
        readingCards: {
          create: cards.map((card: any) => ({
            position: card.position,
            isReversed: card.isReversed,
            card: {
              connect: {
                id: card.cardId || card.id // Use card.cardId if available, fall back to card.id
              }
            }
          }))
        },
        journalEntry: {
          create: {
            title,
            // Generate a slug from the first 5 words of userNotes
            slug: notes ? notes.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').split(' ').slice(0, 5).join('-') : null,
            notes: reading, // Use the reading parameter for notes
            userNotes: notes || null, // Use the notes parameter for userNotes
            userId: targetUserId // Add the required userId field
          }
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        deck: {
          select: {
            id: true,
            name: true
          }
        },
        journalEntry: true,
        readingCards: {
          include: {
            card: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                keywords: true,
                description: true,
                meaningUpright: true,
                meaningReversed: true
              }
            }
          }
        }
      }
    })

    revalidatePath('/journal')
    return NextResponse.json({ success: true, reading: newReading })
  } catch (error) {
    console.error('Error saving reading:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    return NextResponse.json(
      { 
        success: false, 
        error: `Failed to save reading: ${error instanceof Error ? error.message : 'Unknown error'}` 
      },
      { status: 500 }
    )
  }
}