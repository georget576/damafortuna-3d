'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/database'
import {
  DrawCardResponse,
  CardInterpretation
} from '@/app/types/tarot'

// Types for our actions
export interface DrawCardsRequest {
  spreadType: string
  deckId?: string
}

export interface DrawCardsResponse {
  cards: DrawCardResponse[]
}

export interface CreateReadingRequest {
  title: string
  spreadType: string
  cards: Array<{
    id: string
    isReversed: boolean
    position: number
  }>
  interpretation: string
  cardInterpretations: CardInterpretation[]
}

export interface CreateReadingResponse {
  id: string
  title: string
  spreadType: string
  createdAt: string
  cards: DrawCardResponse[]
  interpretation: string
  cardInterpretations: CardInterpretation[]
}

export interface GetInterpretationsRequest {
  cards: Array<{
    id: string
    isReversed: boolean
    position: number
  }>
  spreadType: string
}

export interface GetInterpretationsResponse {
  reading: string
  cardInterpretations: CardInterpretation[]
}

// Action to draw cards
export async function drawCards(request: DrawCardsRequest): Promise<DrawCardsResponse> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/cards/draw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error('Failed to draw cards')
    }

    return await response.json()
  } catch (error) {
    console.error('Error drawing cards:', error)
    throw new Error('Failed to draw cards')
  }
}

// Action to create a reading
export async function createReading(request: CreateReadingRequest): Promise<CreateReadingResponse> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/readings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error('Failed to create reading')
    }

    const result = await response.json()
    
    // Revalidate the readings page to show the new reading
    revalidatePath('/reading')
    
    return result
  } catch (error) {
    console.error('Error creating reading:', error)
    throw new Error('Failed to create reading')
  }
}

// Action to get interpretations for cards
export async function getInterpretations(request: GetInterpretationsRequest): Promise<GetInterpretationsResponse> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/interpretations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error('Failed to get interpretations')
    }

    return await response.json()
  } catch (error) {
    console.error('Error getting interpretations:', error)
    throw new Error('Failed to get interpretations')
  }
}

// Helper function to generate a random reading
export async function generateRandomReading(spreadType: string): Promise<{
  cards: DrawCardsResponse['cards']
  interpretation: GetInterpretationsResponse
}> {
  // Step 1: Draw cards
  const drawResponse = await drawCards({ spreadType })
  
  // Step 2: Get interpretations
  const interpretationResponse = await getInterpretations({
    cards: drawResponse.cards.map(card => ({
      id: card.id,
      isReversed: card.isReversed,
      position: card.position
    })),
    spreadType
  })
  
  return {
    cards: drawResponse.cards,
    interpretation: interpretationResponse
  }
}

// Action to save a reading directly to the database
export async function saveReading(
  title: string,
  spreadType: string,
  cards: DrawCardResponse[],
  interpretation: string,
  cardInterpretations: CardInterpretation[],
  userInput?: string
): Promise<{ success: boolean; readingId?: string; error?: string }> {
  try {
    // First, check if a default user exists, if not create one
    let user = await prisma.user.findFirst({
      where: { email: 'default@example.com' }
    })
    
    if (!user) {
      // Create a default user if none exists
      user = await prisma.user.create({
        data: {
          email: 'default@example.com',
          name: 'Default User'
        }
      })
    }
    
    // Get the default deck
    const deck = await prisma.deck.findFirst()
    if (!deck) {
      return { success: false, error: 'No deck found' }
    }
    
    // Create the reading in the database
    const reading = await prisma.reading.create({
      data: {
        userId: user.id,
        deckId: deck.id,
        spreadType: spreadType.toUpperCase() as any, // Convert to enum
        journalEntry: {
          create: {
            userId: user.id,
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
      }
    })
    
    // Revalidate the readings page to show the new reading
    revalidatePath('/reading')
    
    return { success: true, readingId: reading.id }
  } catch (error) {
    console.error('Error saving reading:', error)
    return { success: false, error: 'Failed to save reading' }
  }
}

// Journal entry types
export interface JournalEntry {
  id: string
  title: string | null
  notes: string
  userNotes: string | null
  createdAt: string
  updatedAt: string
  reading: {
    id: string
    spreadType: string
    createdAt: string
    readingCards: Array<{
      card: {
        id: string
        name: string
        arcana: string
        suit: string | null
        number: number | null
        imageUrl: string | null
        keywords: string[]
      }
      position: number
      isReversed: boolean
    }>
  }
}

// Action to get user's journal entries with pagination
export async function getJournalEntries(page: number = 1, limit: number = 10, userId?: string): Promise<{
  entries: JournalEntry[]
  total: number
  totalPages: number
  currentPage: number
}> {
  try {
    // Use provided userId or fall back to default user
    let user
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId }
      })
    } else {
      // Fallback to default user for backward compatibility
      user = await prisma.user.findFirst({
        where: { email: 'default@example.com' }
      })
    }
    
    if (!user) {
      return { entries: [], total: 0, totalPages: 0, currentPage: page }
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit
    
    // Get journal entries with related data
    const [entries, total] = await Promise.all([
      prisma.journalEntry.findMany({
        where: { userId: user.id },
        include: {
          reading: {
            include: {
              readingCards: {
                include: {
                  card: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.journalEntry.count({
        where: { userId: user.id }
      })
    ])
    
    const totalPages = Math.ceil(total / limit)
    
    // Transform entries to match our interface
    const transformedEntries = entries.map(entry => ({
      ...entry,
      id: entry.id,
      title: entry.title || 'Untitled Reading',
      notes: entry.notes,
      userNotes: entry.userNotes,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
      reading: {
        id: entry.reading.id,
        spreadType: entry.reading.spreadType,
        createdAt: entry.reading.createdAt.toISOString(),
        readingCards: entry.reading.readingCards.map(rc => ({
          card: {
            id: rc.card.id,
            name: rc.card.name,
            arcana: rc.card.arcana,
            suit: rc.card.suit,
            number: rc.card.number,
            imageUrl: rc.card.imageUrl,
            keywords: rc.card.keywords || []
          },
          position: rc.position,
          isReversed: rc.isReversed
        }))
      }
    }))
    
    return {
      entries: transformedEntries,
      total,
      totalPages,
      currentPage: page
    }
  } catch (error) {
    console.error('Error fetching journal entries:', error)
    return { entries: [], total: 0, totalPages: 0, currentPage: page }
  }
}

// Action to get a single journal entry
export async function getJournalEntry(entryId: string, userId?: string): Promise<JournalEntry | null> {
  try {
    // Use provided userId or fall back to default user
    let user
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId }
      })
    } else {
      // Fallback to default user for backward compatibility
      user = await prisma.user.findFirst({
        where: { email: 'default@example.com' }
      })
    }
    
    if (!user) {
      return null
    }
    
    // Get the journal entry with related data
    const entry = await prisma.journalEntry.findFirst({
      where: {
        id: entryId,
        userId: user.id
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
                    arcana: true,
                    suit: true,
                    number: true,
                    imageUrl: true,
                    keywords: true
                  }
                }
              }
            }
          }
        }
      }
    })
    
    if (!entry) {
      return null
    }
    
    // Transform entry to match our interface
    return {
      ...entry,
      id: entry.id,
      title: entry.title || 'Untitled Reading',
      notes: entry.notes,
      userNotes: entry.userNotes,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
      reading: {
        id: entry.reading.id,
        spreadType: entry.reading.spreadType,
        createdAt: entry.reading.createdAt.toISOString(),
        readingCards: entry.reading.readingCards.map(rc => ({
          card: {
            id: rc.card.id,
            name: rc.card.name,
            arcana: rc.card.arcana,
            suit: rc.card.suit,
            number: rc.card.number,
            imageUrl: rc.card.imageUrl,
            keywords: rc.card.keywords || []
          },
          position: rc.position,
          isReversed: rc.isReversed
        }))
      }
    }
  } catch (error) {
    console.error('Error fetching journal entry:', error)
    return null
  }
}

// Action to update a journal entry
export async function updateJournalEntry(
  entryId: string,
  title: string,
  notes: string,
  userNotes: string,
  userId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Use provided userId or fall back to default user
    let user
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId }
      })
    } else {
      // Fallback to default user for backward compatibility
      user = await prisma.user.findFirst({
        where: { email: 'default@example.com' }
      })
    }
    
    if (!user) {
      return { success: false, error: 'User not found' }
    }
    
    // Update the journal entry
    await prisma.journalEntry.update({
      where: {
        id: entryId,
        userId: user.id
      },
      data: {
        title,
        notes,
        userNotes
      }
    })
    
    // Revalidate the journal page to show the updated entry
    revalidatePath('/journal')
    
    return { success: true }
  } catch (error) {
    console.error('Error updating journal entry:', error)
    return { success: false, error: 'Failed to update journal entry' }
  }
}