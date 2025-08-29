import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/database'
import { revalidatePath } from 'next/cache'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const entryId = params.id

    // Find the journal entry to verify it exists and belongs to the user
    const entry = await prisma.journalEntry.findFirst({
      where: {
        id: entryId,
        userId: session.user.id
      }
    })

    if (!entry) {
      return NextResponse.json(
        { success: false, error: 'Journal entry not found' },
        { status: 404 }
      )
    }

    // Delete the journal entry (Prisma will handle cascading deletes for related records)
    await prisma.journalEntry.delete({
      where: { id: entryId }
    })

    revalidatePath('/journal')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting journal entry:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: `Failed to delete journal entry: ${error instanceof Error ? error.message : 'Unknown error'}` 
      },
      { status: 500 }
    )
  }
}