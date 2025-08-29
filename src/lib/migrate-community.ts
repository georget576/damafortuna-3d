import { prisma } from './database'

export async function migrateCommunitySchema() {
  try {
    console.log('Starting community schema migration...')
    
    // Check if ForumCategory table exists
    const categories = await prisma.forumCategory.findMany()
    console.log(`Found ${categories.length} existing categories`)
    
    if (categories.length === 0) {
      // Create predefined categories
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
      
      // Create categories
      for (const categoryData of predefinedCategories) {
        const slug = categoryData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
        
        await prisma.forumCategory.create({
          data: {
            ...categoryData,
            slug
          }
        })
        console.log(`Created category: ${categoryData.name}`)
      }
      
      console.log('Migration completed successfully!')
    } else {
      console.log('Migration not needed - categories already exist')
    }
    
    return true
  } catch (error) {
    console.error('Migration failed:', error)
    return false
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateCommunitySchema()
    .then(success => {
      process.exit(success ? 0 : 1)
    })
    .catch(error => {
      console.error('Migration error:', error)
      process.exit(1)
    })
}