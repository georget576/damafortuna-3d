'use server'

import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/database'

// Type definitions
export type JournalEntry = {
  id: string
  slug?: string | null
  title?: string | null
  notes: string
  userNotes?: string | null
  userId: string
  createdAt: string | Date
  updatedAt: string | Date
  reading: {
    id: string
    spreadType: string
    createdAt: string | Date
    deck?: {
      id: string
      name: string
    } | null
    readingCards: Array<{
      id: string
      position: number
      isReversed: boolean
      card: {
        id: string
        name: string
        imageUrl?: string | null
        keywords: string[]
        description?: string | null
        meaningUpright?: string | null
        meaningReversed?: string | null
      }
    }>
  }
}

export async function drawCards(request: { count: number; deckId?: string }) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL
      ? process.env.NEXTAUTH_URL.replace(/\/$/, '') // Remove trailing slash
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000'
    
    const response = await fetch(`${baseUrl}/api/cards/draw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies in the request
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error('Failed to draw cards')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error drawing cards:', error)
    throw new Error('Failed to draw cards')
  }
}

export async function createReading(readingData: {
  title: string
  description?: string
  cards: Array<{
    cardId: string
    position: number
    isReversed: boolean
  }>
  deckId?: string
}) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL
      ? process.env.NEXTAUTH_URL.replace(/\/$/, '') // Remove trailing slash
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000'
    
    const response = await fetch(`${baseUrl}/api/readings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(readingData),
    })

    if (!response.ok) {
      throw new Error('Failed to create reading')
    }

    const data = await response.json()
    revalidatePath('/journal')
    return data
  } catch (error) {
    console.error('Error creating reading:', error)
    throw new Error('Failed to create reading')
  }
}

export async function getInterpretations(request: {
  readingId: string
  userId?: string
}) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL
      ? process.env.NEXTAUTH_URL.replace(/\/$/, '') // Remove trailing slash
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000'
    
    const response = await fetch(`${baseUrl}/api/interpretations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`Failed to get interpretations: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error getting interpretations:', error)
    throw new Error(`Failed to get interpretations: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function generateRandomReading(spreadType: string) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL
      ? process.env.NEXTAUTH_URL.replace(/\/$/, '') // Remove trailing slash
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000'
    
    const response = await fetch(`${baseUrl}/api/readings/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ spreadType, includeInterpretation: true }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate reading')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error generating reading:', error)
    throw new Error('Failed to generate reading')
  }
}

export async function saveReading(
  title: string,
  spreadType: string,
  cards: any[],
  reading: string,
  cardInterpretations: any[],
  notes?: string,
  userId?: string
) {
  try {
    // Get the authenticated user session
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      throw new Error('Authentication required')
    }

    // Use provided userId or fall back to authenticated user
    let targetUserId = userId || session.user.id

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id: targetUserId }
    })

    if (!userExists) {
      throw new Error('User not found in database. Please try logging out and back in.')
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
            title: notes ? notes.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').split(' ').slice(0, 6).join('-') : title, // Set title to be the same as slug
            // Generate a slug from the first 6 words of userNotes
            slug: notes ? notes.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').split(' ').slice(0, 6).join('-') : null,
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
    return { success: true, reading: newReading }
  } catch (error) {
    console.error('Error saving reading:', error)
    return { success: false, error: `Failed to save reading: ${error instanceof Error ? error.message : 'Unknown error'}` }
  }
}

export async function getJournalEntries(userId?: string, userEmail?: string, page: number = 1, limit: number = 10) {
  try {
    // Get the authenticated user session
    let session
    try {
      session = await getServerSession(authOptions)
    } catch (error) {
      console.warn('Could not get server session, continuing without session:', error)
      session = null
    }

    // Use provided userId, userEmail, or fall back to authenticated user
    let user
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } })
    } else if (userEmail) {
      user = await prisma.user.findUnique({ where: { email: userEmail } })
    } else if (session?.user?.id) {
      // Use authenticated user if available
      user = await prisma.user.findUnique({ where: { id: session.user.id } })
    }

    if (!user) {
      return { entries: [], total: 0, totalPages: 0, currentPage: page }
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get total count for pagination
    const total = await prisma.reading.count({
      where: {
        userId: user.id,
        journalEntry: { isNot: null }
      }
    })

    const totalPages = Math.ceil(total / limit)

    // Get paginated entries
    const entries = await prisma.reading.findMany({
      where: {
        userId: user.id,
        journalEntry: { isNot: null }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
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

    // Transform the entries to match the JournalEntry type
    const transformedEntries = entries.map(entry => ({
      id: entry.id,
      slug: entry.journalEntry?.slug || null,
      title: entry.journalEntry?.title || null,
      notes: entry.journalEntry?.notes || '',
      userNotes: entry.journalEntry?.userNotes || null,
      userId: entry.userId,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.journalEntry?.updatedAt?.toISOString() || entry.createdAt.toISOString(),
      reading: {
        id: entry.id,
        spreadType: entry.spreadType,
        createdAt: entry.createdAt.toISOString(),
        deck: entry.deck,
        readingCards: entry.readingCards.map(rc => ({
          id: rc.id,
          position: rc.position,
          isReversed: rc.isReversed,
          card: {
            id: rc.card.id,
            name: rc.card.name,
            imageUrl: rc.card.imageUrl,
            keywords: rc.card.keywords,
            description: rc.card.description,
            meaningUpright: rc.card.meaningUpright,
            meaningReversed: rc.card.meaningReversed
          }
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

// Add type for interpretation data
export interface InterpretationData {
  readingId: string
  reading: string
  cardInterpretations: Array<{
    position: number
    cardName: string
    interpretation: string
  }>
}

export async function getJournalEntryWithInterpretation(id: string, userId?: string) {
  try {
    // Get the journal entry
    const entry = await getJournalEntry(id, userId)
    if (!entry) return null

    // Get interpretation data
    const interpretationResult = await getInterpretations({
      readingId: entry.id,
      userId
    })

    return {
      ...entry,
      interpretation: interpretationResult
    }
  } catch (error) {
    console.error('Error fetching journal entry with interpretation:', error)
    return null
  }
}

export async function getJournalEntryBySlug(slug: string, userId?: string) {
  try {
    // Get the authenticated user session
    let session
    try {
      session = await getServerSession(authOptions)
    } catch (error) {
      console.warn('Could not get server session, continuing without session:', error)
      session = null
    }

    // Use provided userId or fall back to authenticated user
    let user
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } })
    } else if (session?.user?.id) {
      user = await prisma.user.findUnique({ where: { id: session.user.id } })
    }

    if (!user) {
      return null
    }

    const entry = await prisma.journalEntry.findFirst({
      where: {
        userId: user.id,
        slug: slug
      },
      include: {
        reading: {
          include: {
            deck: {
              select: {
                id: true,
                name: true
              }
            },
            readingCards: {
              include: {
                card: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    imageUrl: true,
                    meaningUpright: true,
                    meaningReversed: true,
                    keywords: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!entry) return null

    // Transform the entry to match the JournalEntry type
    return {
      id: entry.id,
      slug: entry.slug,
      title: entry.title,
      notes: entry.notes,
      userNotes: entry.userNotes,
      userId: user.id, // Use the user object instead of entry.reading.userId
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
      reading: {
        id: entry.reading.id,
        spreadType: entry.reading.spreadType,
        createdAt: entry.reading.createdAt.toISOString(),
        deck: entry.reading.deck,
        readingCards: entry.reading.readingCards.map(rc => ({
          id: rc.id,
          position: rc.position,
          isReversed: rc.isReversed,
          card: {
            id: rc.card.id,
            name: rc.card.name,
            imageUrl: rc.card.imageUrl,
            keywords: rc.card.keywords,
            description: rc.card.description,
            meaningUpright: rc.card.meaningUpright,
            meaningReversed: rc.card.meaningReversed
          }
        }))
      }
    }
  } catch (error) {
    console.error('Error fetching journal entry by slug:', error)
    return null
  }
}

export async function getJournalEntry(id: string, userId?: string) {
  try {
    // Get the authenticated user session
    let session
    try {
      session = await getServerSession(authOptions)
    } catch (error) {
      console.warn('Could not get server session, continuing without session:', error)
      session = null
    }

    // Use provided userId or fall back to authenticated user
    let user
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } })
    } else if (session?.user?.id) {
      user = await prisma.user.findUnique({ where: { id: session.user.id } })
    }

    if (!user) {
      return null
    }

    const entry = await prisma.journalEntry.findFirst({
      where: {
        id: id,
        userId: user.id
      },
      include: {
        reading: {
          include: {
            deck: {
              select: {
                id: true,
                name: true
              }
            },
            readingCards: {
              include: {
                card: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    imageUrl: true,
                    meaningUpright: true,
                    meaningReversed: true,
                    keywords: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!entry) return null

    // Transform the entry to match the JournalEntry type
    return {
      id: entry.id,
      slug: entry.slug,
      title: entry.title,
      notes: entry.notes,
      userNotes: entry.userNotes,
      userId: user.id, // Add the required userId field
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
      reading: {
        id: entry.reading.id,
        spreadType: entry.reading.spreadType,
        createdAt: entry.reading.createdAt.toISOString(),
        deck: entry.reading.deck,
        readingCards: entry.reading.readingCards.map(rc => ({
          id: rc.id,
          position: rc.position,
          isReversed: rc.isReversed,
          card: {
            id: rc.card.id,
            name: rc.card.name,
            imageUrl: rc.card.imageUrl,
            keywords: rc.card.keywords,
            description: rc.card.description,
            meaningUpright: rc.card.meaningUpright,
            meaningReversed: rc.card.meaningReversed
          }
        }))
      }
    }
  } catch (error) {
    console.error('Error fetching journal entry:', error)
    return null
  }
}

export async function updateJournalEntry(
  id: string,
  updates: {
    title?: string
    notes?: string
    isPublic?: boolean
  },
  userId?: string,
  userEmail?: string
) {
  try {
    // Get the authenticated user session
    let session
    try {
      session = await getServerSession(authOptions)
    } catch (error) {
      console.warn('Could not get server session, continuing without session:', error)
      session = null
    }

    // Use provided userId, userEmail, or fall back to authenticated user
    let user
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } })
    } else if (userEmail) {
      user = await prisma.user.findUnique({ where: { email: userEmail } })
    } else if (session?.user?.id) {
      user = await prisma.user.findUnique({ where: { id: session.user.id } })
    }

    if (!user) {
      return { success: false, error: 'User not found. Please try logging out and back in.' }
    }

    const updatedEntry = await prisma.journalEntry.update({
      where: { id },
      data: {
        ...updates,
        // Update slug if title is provided and changed (limit to 6 words)
        ...(updates.title && {
          slug: updates.title ? updates.title.trim().split(/\s+/).slice(0, 6).join('-').toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '') : null,
          // Set title to be the same as slug
          title: updates.title ? updates.title.trim().split(/\s+/).slice(0, 6).join('-').toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '') : null
        }),
        updatedAt: new Date()
      },
      include: {
        reading: {
          include: {
            deck: {
              select: {
                id: true,
                name: true
              }
            },
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
        }
      }
    })

    // Transform the updated entry to match the JournalEntry type
    const transformedEntry = {
      id: updatedEntry.id,
      slug: updatedEntry.slug,
      title: updatedEntry.title,
      notes: updatedEntry.notes,
      userNotes: updatedEntry.userNotes,
      userId: user.id, // Add the required userId field
      createdAt: updatedEntry.createdAt.toISOString(),
      updatedAt: updatedEntry.updatedAt.toISOString(),
      reading: {
        id: updatedEntry.reading.id,
        spreadType: updatedEntry.reading.spreadType,
        createdAt: updatedEntry.reading.createdAt.toISOString(),
        deck: updatedEntry.reading.deck,
        readingCards: updatedEntry.reading.readingCards.map(rc => ({
          id: rc.id,
          position: rc.position,
          isReversed: rc.isReversed,
          card: {
            id: rc.card.id,
            name: rc.card.name,
            imageUrl: rc.card.imageUrl,
            keywords: rc.card.keywords,
            description: rc.card.description,
            meaningUpright: rc.card.meaningUpright,
            meaningReversed: rc.card.meaningReversed
          }
        }))
      }
    }

    revalidatePath('/journal')
    return { success: true, entry: transformedEntry }
  } catch (error) {
    console.error('Error updating journal entry:', error)
    return { success: false, error: 'Failed to update journal entry' }
  }
}

export async function deleteJournalEntry(id: string, userId?: string, userEmail?: string) {
  try {
    // Get the authenticated user session
    let session
    try {
      session = await getServerSession(authOptions)
    } catch (error) {
      console.warn('Could not get server session, continuing without session:', error)
      session = null
    }

    // Use provided userId, userEmail, or fall back to authenticated user
    let user
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } })
    } else if (userEmail) {
      user = await prisma.user.findUnique({ where: { email: userEmail } })
    } else if (session?.user?.id) {
      user = await prisma.user.findUnique({ where: { id: session.user.id } })
    }

    if (!user) {
      return { success: false, error: 'User not found. Please try logging out and back in.' }
    }

    // First, try to find the journal entry by ID
    let journalEntry = await prisma.journalEntry.findFirst({
      where: {
        id: id,
        userId: user.id
      }
    })

    // If not found by ID, try to find it by reading ID
    if (!journalEntry) {
      const reading = await prisma.reading.findFirst({
        where: {
          id: id,
          userId: user.id,
          journalEntry: { isNot: null }
        },
        include: {
          journalEntry: true
        }
      })

      if (reading && reading.journalEntry) {
        journalEntry = reading.journalEntry
      }
    }

    if (!journalEntry) {
      return { success: false, error: 'Journal entry not found' }
    }

    // Delete the journal entry (Prisma will handle cascading deletes for related records)
    await prisma.journalEntry.delete({
      where: { id: journalEntry.id }
    })

    revalidatePath('/journal')
    return { success: true }
  } catch (error) {
    console.error('Error deleting journal entry:', error)
    return { success: false, error: `Failed to delete journal entry: ${error instanceof Error ? error.message : 'Unknown error'}` }
  }
}