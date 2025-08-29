'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DrawCardResponse, InterpretationResponse, SpreadType } from '@/app/types/tarot'

interface CardMeaningsSectionProps {
  spreadType: SpreadType
  reading: {
    cards: DrawCardResponse[]
    interpretation: InterpretationResponse
  }
}

export function CardMeaningsSection({ spreadType, reading }: CardMeaningsSectionProps) {
  const cardInterpretations = reading.interpretation?.cardInterpretations || []
  
  if (cardInterpretations.length === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-700 max-h-[400px] overflow-y-auto">
        <CardHeader>
          <CardTitle className="font-caveat-brush tarot-gold text-2xl">Card Meanings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-center py-4">No interpretations available</p>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="bg-gray-800/50 border-gray-700 max-h-[400px] overflow-y-auto">
      <CardHeader>
        <CardTitle className="font-caveat-brush tarot-gold text-2xl">Card Meanings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cardInterpretations.map((interp, index) => {
            // Find the corresponding card data to check if it's reversed
            const cardData = reading.cards.find(
              card => card.position === interp.position && card.name === interp.cardName
            );
            
            return (
              <div key={interp.position} className="border-l-4 border-purple-500 pl-4">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-just-another-hand text-2xl text-purple-300">
                    {getPositionName(spreadType, interp.position)}: {interp.cardName}
                  </h4>
                  {cardData?.isReversed && (
                    <span className="px-2 py-1 bg-red-900/50 text-red-200 text-xs rounded-full border border-red-700">
                      REVERSED
                    </span>
                  )}
                </div>
                <p className="font-shadows-into-light text-gray-300 text-lg mt-1 leading-relaxed">
                  {interp.interpretation}
                </p>
              </div>
            );
          })}
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
          return `Card ${position + 1}`
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