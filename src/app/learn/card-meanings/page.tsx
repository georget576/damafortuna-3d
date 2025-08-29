"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { BookOpen } from 'lucide-react'
import { TarotCardData } from '@/app/types/tarot'
import CardLibrary from '../components/CardLibrary'
import CardDetails from '../components/CardDetails'

export default function CardMeaningsPage() {
  const [selectedCard, setSelectedCard] = useState<TarotCardData | null>(null)
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
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 font-caveat-brush text-purple-200">Card Meanings</h1>
        <p className="text-lg text-gray-300 font-shadows-into-light">
          Explore the rich symbolism and meanings of each tarot card
        </p>
      </div>

      <div className="grid gap-6">
        {/* Search and Filter */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white font-caveat-brush">
              <BookOpen className="h-5 w-5" />
              Find a Card
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Search by name or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md bg-gray-700 border-gray-600 text-white font-shadows-into-light"
              />
              
              <div className="grid gap-4">
                <Select
                  value={selectedCard?.id || ''}
                  onValueChange={(value) => {
                    const card = allTarotCards.find(c => c.id === value);
                    setSelectedCard(card || null);
                  }}
                >
                  <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white font-just-another-hand tracking-widest">
                    <SelectValue placeholder="Select a card..." />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 font-just-another-hand tracking-widest text-white">
                    {filteredCards.map((card) => (
                      <SelectItem key={card.id} value={card.id}>
                        {card.name} ({card.arcana})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card Library and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CardLibrary onCardSelect={setSelectedCard} selectedCard={selectedCard} />
          </div>
          
          <div className="lg:col-span-2">
            {selectedCard ? (
              <CardDetails card={selectedCard} />
            ) : (
              <Card className="bg-gray-800/50 border-gray-700 h-full flex items-center justify-center">
                <p className="text-gray-400 text-center p-8 font-just-another-hand tracking-widest">
                  Select a card from the library to view its details
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
