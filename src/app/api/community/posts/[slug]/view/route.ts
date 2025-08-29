import { NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await prisma.forumPost.findUnique({
      where: { slug: params.slug }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    await prisma.forumPost.update({
      where: { slug: params.slug },
      data: {
        views: {
          increment: 1
        }
      }
    })

    return NextResponse.json({ message: 'View count incremented' })
  } catch (error) {
    console.error('Error incrementing view count:', error)
    return NextResponse.json(
      { error: 'Failed to increment view count' },
      { status: 500 }
    )
  }
}