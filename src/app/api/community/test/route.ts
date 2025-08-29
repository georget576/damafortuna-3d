import { NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

export async function GET() {
  try {
    console.log('Testing database connection...')
    
    // Test basic Prisma connection
    const testResult = await prisma.$queryRaw`SELECT 1`
    console.log('Database connection test successful:', testResult)
    
    // Check if ForumCategory table exists
    try {
      const categories = await prisma.forumCategory.findMany()
      console.log('ForumCategory table exists, found', categories.length, 'categories')
      
      // Try to create a test category
      const testCategory = await prisma.forumCategory.create({
        data: {
          name: 'Test Category',
          description: 'This is a test category',
          slug: 'test-category'
        }
      })
      console.log('Test category created:', testCategory)
      
      // Clean up
      await prisma.forumCategory.delete({
        where: { id: testCategory.id }
      })
      console.log('Test category deleted')
      
      return NextResponse.json({ 
        success: true, 
        message: 'Database connection and ForumCategory model work correctly',
        categories: categories.length
      })
    } catch (error) {
      console.error('Error with ForumCategory:', error)
      return NextResponse.json({ 
        success: false, 
        message: 'ForumCategory model does not exist or has issues',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  } catch (error) {
    console.error('Database connection test failed:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}