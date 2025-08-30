import { NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

// Predefined tarot-themed categories with emoji titles
const predefinedCategories = [
  // 🔮 Core Tarot Categories
  { name: '🔮 Daily Draws', description: 'For single-card reflections or quick insights' },
  { name: '🔮 Weekly Readings', description: 'Broader spreads and themes for the week ahead' },
  { name: '🔮 Full Moon / New Moon Readings', description: 'Lunar cycle-based spreads' },
  { name: '🔮 Major Arcana Reflections', description: 'Deep dives into archetypal cards' },
  { name: '🔮 Minor Arcana Moments', description: 'Everyday lessons and patterns' },
  { name: '🔮 Court Card Insights', description: 'Personality archetypes and relational dynamics' },
  { name: '🔮 Spread Explorations', description: 'Custom or themed tarot spreads' },
  
  // 🧠 Personal & Reflective Categories
  { name: '🧠 Intuitive Messages', description: 'What came through during the reading' },
  { name: '🧠 Shadow Work', description: 'Exploring hidden aspects or emotional depth' },
  { name: '🧠 Spiritual Growth', description: 'Lessons, breakthroughs, and soul evolution' },
  { name: '🧠 Emotional Check-In', description: 'How the reading connects to your current state' },
  { name: '🧠 Synchronicities', description: 'Noticing patterns or signs in daily life' },
  
  // 📓 Journal Style Categories
  { name: '📓 Tarot Diary', description: 'Personal entries and reflections' },
  { name: '📓 Card of the Day', description: 'Focused journaling on a single card' },
  { name: '📓 Reading Recap', description: 'Summary and interpretation of a full spread' },
  { name: '📓 Lessons Learned', description: 'What the cards taught you' },
  { name: '📓 Symbols & Imagery', description: 'Noticing visual themes across decks' },
  
  // 🌙 Occult & Esoteric Categories
  { name: '🌙 Astro-Tarot Connections', description: 'Linking cards to astrology' },
  { name: '🌙 Numerology in Tarot', description: 'Exploring number symbolism' },
  { name: '🌙 Elemental Themes', description: 'Fire, Water, Air, Earth in the cards' },
  { name: '🌙 Ritual & Practice', description: 'How you incorporate tarot into spiritual routines' }
]

export async function GET() {
  try {
    console.log('Fetching categories...')
    
    // First, try to fetch existing categories
    const existingCategories = await prisma.forumCategory.findMany()
    console.log('Existing categories count:', existingCategories.length)
    
    // If no categories exist, run migration to create them
    if (existingCategories.length === 0) {
      console.log('No categories found, running migration...')
      
      try {
        // Import and run migration
        const { migrateCommunitySchema } = await import('@/lib/migrate-community')
        const migrationSuccess = await migrateCommunitySchema()
        
        if (migrationSuccess) {
          // Fetch categories again after migration
          const categories = await prisma.forumCategory.findMany({
            include: {
              _count: {
                select: {
                  posts: {
                    where: {
                      status: 'PUBLISHED'
                    }
                  }
                }
              }
            },
            orderBy: {
              name: 'asc'
            }
          })
          
          console.log('Migration successful, categories count:', categories.length)
          return NextResponse.json(categories)
        } else {
          console.error('Migration failed')
          return NextResponse.json(
            { error: 'Failed to migrate categories' },
            { status: 500 }
          )
        }
      } catch (migrationError) {
        console.error('Migration error:', migrationError)
        return NextResponse.json(
          { error: 'Failed to migrate categories', details: migrationError instanceof Error ? migrationError.message : 'Unknown error' },
          { status: 500 }
        )
      }
    }

    // Fetch all categories with counts
    const categories = await prisma.forumCategory.findMany({
      include: {
        _count: {
          select: {
            posts: {
              where: {
                status: 'PUBLISHED'
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })
    
    console.log('Final categories count:', categories.length)

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { name, description } = await request.json()

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      )
    }

    // Check if category already exists in predefined list
    const isPredefined = predefinedCategories.some(
      cat => cat.name.toLowerCase() === name.toLowerCase()
    )

    if (isPredefined) {
      return NextResponse.json(
        { error: 'This category already exists in our predefined list' },
        { status: 400 }
      )
    }

    // Generate slug from name (limit to 6 words)
    const slug = name
      .trim()
      .split(/\s+/)
      .slice(0, 6)
      .join('-')
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '') // Remove special characters
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens

    // Check if category with this slug already exists
    const existingCategory = await prisma.forumCategory.findUnique({
      where: { slug }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 400 }
      )
    }

    const category = await prisma.forumCategory.create({
      data: {
        name,
        description,
        slug
      }
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}