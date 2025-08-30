import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/database'
import { revalidatePath } from 'next/cache'

export interface JournalEntry {
  id: string
  title: string | null
  notes: string
  userNotes: string | null
  userId: string
  createdAt: Date
  updatedAt: Date
  slug?: string
}

export interface JournalEntriesResponse {
  entries: JournalEntry[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || session?.user?.id
    const userEmail = searchParams.get('userEmail')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Validate required parameters
    if (!userId && !userEmail) {
      return NextResponse.json(
        { success: false, error: 'User ID or email is required' },
        { status: 400 }
      )
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (userId) {
      where.userId = userId
    } else if (userEmail) {
      // Find user by email if userId not provided
      const user = await prisma.user.findUnique({
        where: { email: userEmail }
      })
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        )
      }
      where.userId = user.id
    }

    // Get total count for pagination
    const total = await prisma.journalEntry.count({ where })

    // Get journal entries
    const entries = await prisma.journalEntry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // Transform entries to match our interface
    const transformedEntries = entries.map(entry => ({
      id: entry.id,
      title: entry.title,
      notes: entry.notes,
      userNotes: entry.userNotes,
      userId: entry.userId,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
      slug: entry.slug || undefined
    }))

    // Calculate total pages
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      entries,
      total,
      page,
      limit,
      totalPages
    } as JournalEntriesResponse)
  } catch (error) {
    console.error('Error fetching journal entries:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: `Failed to fetch journal entries: ${error instanceof Error ? error.message : 'Unknown error'}` 
      },
      { status: 500 }
    )
  }
}

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
    const { title, content, userId } = body

    // Use provided userId or fall back to authenticated user
    const targetUserId = userId || session.user.id

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

    // Create a slug from the title (limit to 6 words)
    const slug = title
      .trim()
      .split(/\s+/)
      .slice(0, 6)
      .join('-')
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '') // Remove special characters
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens

    // Create journal entry using unchecked create to avoid required relationship fields
    const newEntry = await prisma.journalEntry.create({
      data: {
        title,
        slug: slug || null,
        notes: content,
        userNotes: null,
        userId: targetUserId
      } as any,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // Transform the entry to match our interface
    const transformedEntry: JournalEntry = {
      id: newEntry.id,
      title: newEntry.title,
      notes: newEntry.notes,
      userNotes: newEntry.userNotes,
      userId: newEntry.userId,
      createdAt: newEntry.createdAt,
      updatedAt: newEntry.updatedAt,
      slug: newEntry.slug || undefined
    }

    revalidatePath('/journal')
    return NextResponse.json({ success: true, entry: newEntry })
  } catch (error) {
    console.error('Error creating journal entry:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    return NextResponse.json(
      { 
        success: false, 
        error: `Failed to create journal entry: ${error instanceof Error ? error.message : 'Unknown error'}` 
      },
      { status: 500 }
    )
  }
}