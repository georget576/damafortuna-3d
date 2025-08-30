'use client'

import { CardMeaningsSection } from './CardMeaningsSection'
import { CardKeywordsSection } from './CardKeywordsSection'
import { DrawCardResponse, InterpretationResponse, SpreadType, TarotCardData } from '@/app/types/tarot'

interface CardInfoSectionProps {
  spreadType: SpreadType
  reading: {
    cards: DrawCardResponse[]
    interpretation: InterpretationResponse
  }
  allTarotCards: TarotCardData[]
}

export function CardInfoSection({ spreadType, reading, allTarotCards }: CardInfoSectionProps) {
  return (
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
  )
}