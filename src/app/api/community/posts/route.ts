import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/database'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const skip = (page - 1) * limit

    const where: any = {
      status: 'PUBLISHED'
    }

    if (category) {
      where.categoryId = category
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [posts, total] = await Promise.all([
      prisma.forumPost.findMany({
        where,
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
          _count: {
            select: {
              replies: true
            }
          },
          reading: true,
          journal: true
        },
        orderBy: [
          { isSticky: 'desc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.forumPost.count({ where })
    ])

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { title, content, categoryId, type, attachedReadingId } = await request.json()
  
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Generate slug from title (limit to 6 words)
    const slug = title
      .trim()
      .split(/\s+/)
      .slice(0, 6)
      .join('-')
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '') // Remove special characters
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens

    // Check if post with this slug already exists
    const existingPost = await prisma.forumPost.findUnique({
      where: { slug }
    })

    if (existingPost) {
      // Add unique identifier if slug exists
      const uniqueSlug = `${slug}-${Date.now()}`
      
      const post = await prisma.forumPost.create({
        data: {
          title,
          content,
          excerpt: content.substring(0, 150) + '...',
          slug: uniqueSlug,
          type: type || 'GENERAL',
          author: {
            connect: {
              id: session.user.id
            }
          },
          ...(categoryId && { category: { connect: { id: categoryId } } }),
          ...(attachedReadingId && {
            reading: {
              connect: {
                id: attachedReadingId
              }
            }
          })
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
          },
          reading: true,
          journal: true
        }
      })

      return NextResponse.json(post, { status: 201 })
    }

    const post = await prisma.forumPost.create({
      data: {
        title,
        content,
        excerpt: content.substring(0, 150) + '...',
        slug,
        type: type || 'GENERAL',
        author: {
          connect: {
            id: session.user.id
          }
        },
        ...(categoryId && { category: { connect: { id: categoryId } } }),
        ...(attachedReadingId && {
          reading: {
            connect: {
              id: attachedReadingId
            }
          }
        })
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
        },
        reading: true,
        journal: true
      }
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}