'use client'

import { TarotReader3D } from '@/app/components/TarotReader3D'
import { CardMeaningsSection } from './CardMeaningsSection'
import { CardKeywordsSection } from './CardKeywordsSection'
import { DrawCardResponse, InterpretationResponse, SpreadType, TarotCardData } from '@/app/types/tarot'

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
        <h2 className="text-2xl font-bold font-caveat-brush tarot-gold">Your {spreadType.toLowerCase()} Reading</h2>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 h-[600px] xl:h-[700px] bg-black/30 rounded-lg overflow-hidden border border-gray-700 relative">
          <TarotReader3D
            spread={spreadType}
            drawnCards={reading.cards}
          />
        </div>
        
        <div className="space-y-4 h-fit">
          <CardMeaningsSection
            spreadType={spreadType}
            reading={reading}
          />
          
          <CardKeywordsSection
            spreadType={spreadType}
            reading={reading}
            allTarotCards={allTarotCards}
          />
        </div>
      </div>
    </div>
  )
}