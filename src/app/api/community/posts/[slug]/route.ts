import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/database'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await prisma.forumPost.findUnique({
      where: { slug: params.slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        reading: {
          include: {
            readingCards: {
              include: {
                card: true
              },
              orderBy: {
                position: 'asc'
              }
            },
            deck: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        journal: {
          include: {
            reading: {
              include: {
                readingCards: {
                  include: {
                    card: true
                  },
                  orderBy: {
                    position: 'asc'
                  }
                }
              }
            }
          }
        },
        _count: {
          select: {
            replies: true
          }
        }
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const post = await prisma.forumPost.findUnique({
      where: { slug: params.slug }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Check if user is the author
    if (post.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only edit your own posts' },
        { status: 403 }
      )
    }

    const { title, content } = await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Generate new slug if title changed (limit to 6 words)
    let slug = post.slug
    if (title !== post.title) {
      slug = title
        .trim()
        .split(/\s+/)
        .slice(0, 6)
        .join('-')
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '') // Remove special characters
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      
      // Check if new slug already exists
      const existingPost = await prisma.forumPost.findUnique({
        where: { slug }
      })
      
      if (existingPost && existingPost.id !== post.id) {
        // Add unique identifier if slug exists
        slug = `${slug}-${Date.now()}`
      }
    }

    const updatedPost = await prisma.forumPost.update({
      where: { slug: params.slug },
      data: {
        title,
        content,
        excerpt: content.substring(0, 150) + '...',
        slug
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const post = await prisma.forumPost.findUnique({
      where: { slug: params.slug }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Check if user is the author
    if (post.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only delete your own posts' },
        { status: 403 }
      )
    }

    await prisma.forumPost.delete({
      where: { slug: params.slug }
    })

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}