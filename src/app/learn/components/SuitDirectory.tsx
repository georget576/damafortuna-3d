"use client"

import { Card, CardContent } from '@/components/ui/card'

interface SuitDirectoryProps {
  selectedSuit: string | null
  onSuitSelect: (suit: string) => void
}

const suits = [
  { id: 'cups', name: 'Cups', icon: '🏆' },
  { id: 'wands', name: 'Wands', icon: '🪄' },
  { id: 'swords', name: 'Swords', icon: '⚔️' },
  { id: 'pentacles', name: 'Pentacles', icon: '🪙' }
]

export default function SuitDirectory({ selectedSuit, onSuitSelect }: SuitDirectoryProps) {
  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardContent className="p-4">
        <h3 className="font-bold mb-3 text-purple-300 font-caveat-brush text-lg">Minor Arcana Suits</h3>
        <div className="grid grid-cols-2 gap-2">
          {suits.map((suit) => (
            <button
              key={suit.id}
              onClick={() => onSuitSelect(suit.id)}
              className={`p-3 rounded-lg transition-colors flex flex-col items-center gap-2 ${
                selectedSuit === suit.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700/50 hover:bg-gray-600'
              }`}
            >
              <span className="text-2xl">{suit.icon}</span>
              <span className="font-bold text-sm font-caveat-brush text-purple-300">{suit.name}</span>
              <span className="text-base opacity-75 font-just-another-hand tracking-widest text-purple-300">14 cards</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}