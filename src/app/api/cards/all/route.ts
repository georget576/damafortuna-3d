import { NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { TarotCardData } from '@/app/types/tarot'

export async function GET() {
  try {
    // Get all tarot cards from the database
    const cards = await prisma.tarotCard.findMany({
      orderBy: { name: 'asc' }
    })
    
    // Format the cards to match the TarotCardData interface
    const formattedCards: TarotCardData[] = cards.map(card => ({
      id: card.id,
      name: card.name,
      image: card.imageUrl || '',
      description: card.description || '',
      keywords: card.keywords || [],
      arcana: card.arcana.toLowerCase() as 'major' | 'minor',
      suit: card.suit as 'cups' | 'wands' | 'swords' | 'pentacles' | undefined,
      number: card.number || 0
    }))
    
    return NextResponse.json(formattedCards)
  } catch (error) {
    console.error('Error fetching tarot cards:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tarot cards' },
      { status: 500 }
    )
  }
}