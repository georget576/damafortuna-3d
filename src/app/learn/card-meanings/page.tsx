"use client"
import { useState } from 'react'
import CardLibrary from '../components/CardLibrary'
import CardDetails from '../components/CardDetails'

export default function CardMeaningsPage() {
  const [selectedCard, setSelectedCard] = useState<any>(null)

  return (
    <div className="space-y-6 md:space-y-8 w-full px-0">
      <div className="mb-6 md:mb-8 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 font-caveat-brush text-purple-200">Card Meanings</h1>
        <p className="text-lg md:text-xl lg:text-2xl text-gray-300 font-shadows-into-light">
          Explore the rich symbolism and meanings of each tarot card
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
        <div className="lg:col-span-1">
          <CardLibrary onCardSelect={setSelectedCard} selectedCard={selectedCard} />
        </div>
        
        <div className="lg:col-span-3">
          {selectedCard ? (
            <CardDetails card={selectedCard} />
          ) : (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 md:p-10 text-center">
              <p className="text-gray-400 font-just-another-hand tracking-widest text-lg md:text-xl">
                Select a card from the library to view its details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
