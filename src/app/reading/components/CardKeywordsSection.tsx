'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DrawCardResponse, InterpretationResponse, SpreadType, TarotCardData } from '@/app/types/tarot'

interface CardKeywordsSectionProps {
  spreadType: SpreadType
  reading: {
    cards: DrawCardResponse[]
    interpretation: InterpretationResponse
  }
  allTarotCards: TarotCardData[]
}

export function CardKeywordsSection({ spreadType, reading, allTarotCards }: CardKeywordsSectionProps) {
  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="font-caveat-brush tarot-purple text-2xl">Card Keywords</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {reading.cards.map((card, index) => (
            <div key={card.id} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
              <span className="font-shadows-into-light text-sm font-medium text-purple-300">
                {getPositionName(spreadType, card.position)}: {card.name}
              </span>
              <div className="flex flex-wrap gap-1">
                {(() => {
                  // Get the card data from the tarot database to access keywords
                  const tarotCard = allTarotCards.find((c: TarotCardData) => c.name === card.name);
                  if (!tarotCard || !tarotCard.keywords || tarotCard.keywords.length === 0) {
                    return <span className="text-gray-400 text-xs">No keywords available</span>;
                  }
                  return tarotCard.keywords.map((keyword: string, keywordIndex: number) => (
                    <span
                      key={keywordIndex}
                      className="px-2 py-1 bg-purple-900/50 text-purple-200 text-base font-just-another-hand tracking-widest rounded-full"
                    >
                      {keyword.trim()}
                    </span>
                  ));
                })()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to get meaningful position names based on spread type
function getPositionName(spreadType: SpreadType, position: number): string {
  switch (spreadType) {
    case 'single':
      return 'General Reading'
    case 'three-card':
      // Handle both 0-indexed and 1-indexed positions
      const normalizedPosition = position === 0 ? 1 : position;
      switch (normalizedPosition) {
        case 1:
          return 'Past'
        case 2:
          return 'Present'
        case 3:
          return 'Future'
        default:
          return `Card ${position}`
      }
    case 'celtic-cross':
      // Traditional Celtic cross uses positions 1-10
      // Handle both 0-indexed and 1-indexed positions
      const celticNormalizedPosition = position + 1;
      switch (celticNormalizedPosition) {
        case 1:
          return 'The Present'
        case 2:
          return 'The Challenge'
        case 3:
          return 'The Foundation/Recent Past'
        case 4:
          return 'The Future'
        case 5:
          return 'Goals/Conscious Thoughts'
        case 6:
          return 'Subconscious Influences'
        case 7:
          return 'Advice'
        case 8:
          return 'External Influences'
        case 9:
          return 'Hopes and Fears'
        case 10:
          return 'The Outcome'
        default:
          return `Card ${celticNormalizedPosition}`
      }
    default:
      return `Card ${position}`
  }
}