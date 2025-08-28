import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/database'

interface UserWithId {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

export async function DELETE(request: NextRequest) {
  try {
    // Get the current session with explicit options
    const session = await getServerSession(authOptions)
    
    console.log('Session in delete API:', session)
    console.log('Auth options:', {
      secret: process.env.NEXTAUTH_SECRET,
      jwtSecret: process.env.NEXTAUTH_URL,
    })
    
    if (!session?.user) {
      console.log('Delete failed: No session')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Try to get user ID from session user, or extract from JWT token
    let userId: string | undefined
    
    if ((session.user as UserWithId)?.id) {
      userId = (session.user as UserWithId).id
      console.log('Found userId in session user:', userId)
    } else {
      // Try to get from the JWT token using the session object
      try {
        // For JWT strategy, the token should be available in the session
        if (session && session.user) {
          // The user object should now have the ID from our session callback
          const userWithId = session.user as any
          userId = userWithId.id
          console.log('Found userId in session user object:', userId)
        }
      } catch (error) {
        console.error('Error extracting user ID from session:', error)
      }
    }

    if (!userId) {
      console.log('Delete failed: No user ID found in session')
      return NextResponse.json(
        { error: 'Unauthorized - No user ID found' },
        { status: 401 }
      )
    }

    console.log('Final extracted userId:', userId)
    console.log('Extracted userId:', userId)
    console.log('Delete attempt for user:', userId)

    // First, check if user exists and get related records count
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            readings: true,
            journalEntries: true,
            accounts: true,
            sessions: true
          }
        }
      }
    })

    if (!user) {
      console.log('Delete failed: User not found')
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    console.log('User found with related records:', user._count)

    // Manually delete related records to avoid cascade issues
    try {
      // Delete journal entries first (they depend on readings)
      console.log('Deleting journal entries...')
      await prisma.journalEntry.deleteMany({
        where: { userId }
      })
      console.log('Journal entries deleted successfully')
    } catch (journalError) {
      console.error('Error deleting journal entries:', journalError)
      // Continue with deletion even if journal entries fail
    }

    try {
      // Delete reading cards first (they depend on readings)
      console.log('Deleting reading cards...')
      await prisma.readingCard.deleteMany({
        where: {
          reading: {
            userId: userId
          }
        }
      })
      console.log('Reading cards deleted successfully')
    } catch (readingCardsError) {
      console.error('Error deleting reading cards:', readingCardsError)
      // Continue with deletion even if reading cards fail
    }

    try {
      // Delete readings
      console.log('Deleting readings...')
      await prisma.reading.deleteMany({
        where: { userId }
      })
      console.log('Readings deleted successfully')
    } catch (readingError) {
      console.error('Error deleting readings:', readingError)
      // Continue with deletion even if readings fail
    }

    try {
      // Delete accounts and sessions (these should cascade)
      console.log('Deleting accounts and sessions...')
      await prisma.account.deleteMany({
        where: { userId }
      })
      await prisma.session.deleteMany({
        where: { userId }
      })
      console.log('Accounts and sessions deleted successfully')
    } catch (authError) {
      console.error('Error deleting accounts/sessions:', authError)
      // Continue with deletion even if auth records fail
    }

    // Finally, delete the user
    console.log('Deleting user...')
    await prisma.user.delete({
      where: { id: userId }
    })
    console.log('User deleted successfully')

    return NextResponse.json(
      { message: 'Account deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting user account:', error)
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    return NextResponse.json(
      { error: 'Failed to delete account', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}