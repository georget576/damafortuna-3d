import { NextResponse } from 'next/server'
import { migrateCommunitySchema } from '@/lib/migrate-community'

export async function GET() {
  try {
    console.log('Running community migration...')
    
    const success = await migrateCommunitySchema()
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Community schema migrated successfully' 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Migration failed' 
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Migration endpoint error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Migration failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}