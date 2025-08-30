'use client'

import { TarotReader3D } from '@/app/components/TarotReader3D'
import { DrawCardResponse, InterpretationResponse, SpreadType, TarotCardData, SPREAD_TYPE_DESCRIPTIONS } from '@/app/types/tarot'

interface ReadingDisplayProps {
  spreadType: SpreadType
  reading: {
    cards: DrawCardResponse[]
    interpretation: InterpretationResponse
  } | null
  allTarotCards: TarotCardData[]
}

export function ReadingDisplay({ spreadType, reading, allTarotCards }: ReadingDisplayProps) {
  if (!reading) {
    return null
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold font-caveat-brush tarot-gold">Your {SPREAD_TYPE_DESCRIPTIONS.find(s => s.type === spreadType)?.name || spreadType} Reading</h2>
      </div>
      
      <div className="h-[600px] xl:h-[700px] bg-black/30 rounded-lg overflow-hidden border border-gray-700 relative">
        <TarotReader3D
          spread={spreadType}
          drawnCards={reading.cards}
        />
      </div>
    </div>
  )
}