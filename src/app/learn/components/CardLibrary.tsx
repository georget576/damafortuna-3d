"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { BookOpen } from 'lucide-react'
import { TarotCardData } from '@/app/types/tarot'

interface CardLibraryProps {
  onCardSelect: (card: TarotCardData) => void
  selectedCard?: TarotCardData | null
}

export default function CardLibrary({ onCardSelect, selectedCard }: CardLibraryProps) {
  const [allTarotCards, setAllTarotCards] = useState<TarotCardData[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch all tarot cards on component mount
  useEffect(() => {
    const fetchTarotCards = async () => {
      try {
        const response = await fetch('/api/cards/all');
        if (response.ok) {
          const cards = await response.json();
          setAllTarotCards(cards);
        }
      } catch (error) {
        console.error('Error fetching tarot cards:', error);
      }
    };
    
    fetchTarotCards();
  }, []);

  const filteredCards = allTarotCards.filter(card => 
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!selectedCard?.arcana || card.arcana === selectedCard.arcana)
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card className="bg-gray-800/50 border-gray-700 max-h-[600px] overflow-y-auto">
          <CardHeader>
            <CardTitle className="font-caveat-brush text-xl text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Card Library
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Search cards by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white font-shadows-into-light"
              />
              
              <Select value={selectedCard?.arcana || ''} onValueChange={(value) => {
                if (value) {
                  const filtered = allTarotCards.filter(card => card.arcana === value);
                  if (filtered.length > 0) {
                    onCardSelect(filtered[0]);
                  }
                }
              }}>
                <SelectTrigger className="bg-gray-700 border-gray-700 text-white font-just-another-hand tracking-widest">
                  <SelectValue placeholder="Filter by arcana" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 font-just-another-hand tracking-widest text-white">
                  <SelectItem value="major">Major Arcana</SelectItem>
                  <SelectItem value="minor">Minor Arcana</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="space-y-2 font-just-another-hand tracking-widest text-white">
                {filteredCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => onCardSelect(card)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedCard?.id === card.id 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-700/50 hover:bg-gray-600'
                    }`}
                  >
                    <div className="font-bold">{card.name}</div>
                    <div className="text-sm text-gray-400">{card.arcana} {card.suit}</div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}