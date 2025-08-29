"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TarotCardData } from '@/app/types/tarot'

interface CardDetailsProps {
  card: TarotCardData
}

export default function CardDetails({ card }: CardDetailsProps) {
  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="font-caveat-brush text-xl md:text-2xl lg:text-3xl text-white text-center md:text-left">{card.name}</CardTitle>
        <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start font-just-another-hand tracking-widest">
          <span className="px-2 py-1 bg-purple-900/50 text-purple-200 text-xs md:text-sm lg:text-base rounded-full">
            {card.arcana}
          </span>
          {card.suit && (
            <span className="px-2 py-1 bg-purple-900/50 text-purple-200 text-xs md:text-sm lg:text-base rounded-full">
              {card.suit}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
          <div className="flex justify-center">
            <div className="w-32 h-48 md:w-48 md:h-72 lg:w-56 lg:h-84 xl:w-64 xl:h-96 bg-black rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={card.image}
                alt={card.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <div className="space-y-4 md:space-y-6 lg:space-y-8">
            <div>
              <h3 className="font-bold mb-3 text-purple-300 font-caveat-brush text-sm md:text-base lg:text-lg">Description</h3>
              <p className="text-gray-300 font-shadows-into-light text-sm md:text-base lg:text-lg leading-relaxed">{card.description}</p>
            </div>
            
            <div>
              <h3 className="font-bold mb-3 text-purple-300 font-caveat-brush text-sm md:text-base lg:text-lg">Keywords</h3>
              <div className="flex flex-wrap gap-2 lg:gap-3">
                {card.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-2 md:px-3 py-1 bg-purple-900/50 text-purple-200 text-xs md:text-sm lg:text-base rounded-full font-just-another-hand tracking-widest"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-3 text-purple-300 font-caveat-brush text-sm md:text-base lg:text-lg">Interpretation</h3>
              <p className="text-gray-300 font-shadows-into-light text-sm md:text-base lg:text-lg leading-relaxed">
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