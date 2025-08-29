import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/database'

export async function drawCards(request: { count: number; deckId?: string }) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL 
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
    const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL 
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
    const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL 
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
      throw new Error('Failed to get interpretations')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error getting interpretations:', error)
    throw new Error('Failed to get interpretations')
  }
}

export async function saveReading(request: {
  readingId: string
  title?: string
  notes?: string
  isPublic?: boolean
  userId?: string
}) {
  try {
    // Get the authenticated user session
    const session = await getServerSession(authOptions)

    // Use provided userId or fall back to authenticated user
    let targetUserId = request.userId

    if (!targetUserId && session?.user?.id) {
      targetUserId = session.user.id
    }

    // Require authentication - no fallback to default user
    if (!targetUserId) {
      return { success: false, error: 'Authentication required' }
    }

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id: targetUserId }
    })

    if (!userExists) {
      return { success: false, error: 'User not found in database. Please try logging out and back in.' }
    }

    // Update the reading with the provided data
    const updatedReading = await prisma.reading.update({
      where: { id: request.readingId },
      data: {
        journalEntry: {
          upsert: {
            create: {
              notes: request.notes || '',
              title: request.title || '',
              userId: targetUserId
            },
            update: {
              notes: request.notes,
              title: request.title
            }
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
        journalEntry: true
      }
    })

    revalidatePath('/journal')
    return { success: true, reading: updatedReading }
  } catch (error) {
    console.error('Error saving reading:', error)
    return { success: false, error: 'Failed to save reading' }
  }
}

export async function getJournalEntries(userId?: string, userEmail?: string, page: number = 1, limit: number = 10) {
  try {
    // Get the authenticated user session
    const session = await getServerSession(authOptions)

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
        journalEntry: true
      }
    })

    return {
      entries,
      total,
      totalPages,
      currentPage: page
    }
  } catch (error) {
    console.error('Error fetching journal entries:', error)
    return { entries: [], total: 0, totalPages: 0, currentPage: page }
  }
}

export async function getJournalEntryBySlug(slug: string, userId?: string) {
  try {
    // Get the authenticated user session
    const session = await getServerSession(authOptions)

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
            }
          }
        }
      }
    })

    return entry
  } catch (error) {
    console.error('Error fetching journal entry by slug:', error)
    return null
  }
}

export async function getJournalEntry(id: string, userId?: string) {
  try {
    // Get the authenticated user session
    const session = await getServerSession(authOptions)

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
            }
          }
        }
      }
    })

    return entry
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
    const session = await getServerSession(authOptions)

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
            }
          }
        }
      }
    })

    revalidatePath('/journal')
    return { success: true, entry: updatedEntry }
  } catch (error) {
    console.error('Error updating journal entry:', error)
    return { success: false, error: 'Failed to update journal entry' }
  }
}

export async function deleteJournalEntry(id: string, userId?: string, userEmail?: string) {
  try {
    // Get the authenticated user session
    const session = await getServerSession(authOptions)

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

    await prisma.journalEntry.delete({
      where: { id }
    })

    revalidatePath('/journal')
    return { success: true }
  } catch (error) {
    console.error('Error deleting journal entry:', error)
    return { success: false, error: 'Failed to delete journal entry' }
  }
}