"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TarotCardData } from '@/app/types/tarot'

interface CardDetailsProps {
  card: TarotCardData
}

export default function CardDetails({ card }: CardDetailsProps) {
  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="font-caveat-brush text-2xl text-white">{card.name}</CardTitle>
        <div className="flex gap-2 mt-2 font-just-another-hand tracking-widest">
          <span className="px-2 py-1 bg-purple-900/50 text-purple-200 text-xs rounded-full">
            {card.arcana}
          </span>
          {card.suit && (
            <span className="px-2 py-1 bg-purple-900/50 text-purple-200 text-xs rounded-full">
              {card.suit}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex justify-center">
            <div className="w-48 h-72 bg-black rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={card.image}
                alt={card.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-bold mb-2 text-purple-300 font-caveat-brush">Description</h3>
              <p className="text-gray-300 font-shadows-into-light">{card.description}</p>
            </div>
            
            <div>
              <h3 className="font-bold mb-2 text-purple-300 font-caveat-brush">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {card.keywords.map((keyword, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-purple-900/50 text-purple-200 text-sm rounded-full font-just-another-hand tracking-widest"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-2 text-purple-300 font-caveat-brush">Interpretation</h3>
              <p className="text-gray-300 font-shadows-into-light">
                {card.arcana === 'major' 
                  ? 'Major Arcana cards represent significant life lessons, karmic influences, and archetypal patterns. They often indicate important life events and spiritual growth.'
                  : 'Minor Arcana cards reflect everyday situations, challenges, and opportunities. They provide insight into the practical aspects of life and how we navigate our daily experiences.'
                }
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}