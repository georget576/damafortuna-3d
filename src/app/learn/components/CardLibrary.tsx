"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react'
import { TarotCardData } from '@/app/types/tarot'
import ArcanaDirectory from './ArcanaDirectory'
import SuitDirectory from './SuitDirectory'

interface CardLibraryProps {
  onCardSelect: (card: TarotCardData) => void
  selectedCard?: TarotCardData | null
}

export default function CardLibrary({ onCardSelect, selectedCard }: CardLibraryProps) {
  const [allTarotCards, setAllTarotCards] = useState<TarotCardData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [cardsPerPage] = useState(8)
  const [selectedArcana, setSelectedArcana] = useState<'major' | 'minor' | null>(null)
  const [selectedSuit, setSelectedSuit] = useState<string | null>(null)
  const [isMinorExpanded, setIsMinorExpanded] = useState(false)

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

  // Filter cards based on selected arcana and suit
  const filteredCards = allTarotCards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesArcana = !selectedArcana || card.arcana === selectedArcana
    
    // Only apply suit filter if Minor Arcana is selected and a suit is chosen
    let matchesSuit = true
    if (selectedArcana === 'minor' && selectedSuit) {
      // Convert both to uppercase for comparison since database stores suits in uppercase
      matchesSuit = card.suit?.toUpperCase() === selectedSuit.toUpperCase()
    }
    
    return matchesSearch && matchesArcana && matchesSuit
  })

  // Pagination logic
  const indexOfLastCard = currentPage * cardsPerPage
  const indexOfFirstCard = indexOfLastCard - cardsPerPage
  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard)
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages))
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1))

  const handleArcanaSelect = (arcana: 'major' | 'minor') => {
    setSelectedArcana(arcana)
    setSelectedSuit(null) // Reset suit selection when changing arcana
    if (arcana === 'minor') {
      setIsMinorExpanded(true)
    }
  }

  const handleSuitSelect = (suit: string) => {
    setSelectedSuit(suit)
  }

  const handleMinorToggle = () => {
    setIsMinorExpanded(!isMinorExpanded)
  }

  return (
    <div className="w-full h-full flex flex-col">
      <Card className="bg-gray-800/50 border-gray-700 h-full overflow-y-auto">
        <CardHeader className="pb-3">
          <CardTitle className="font-caveat-brush text-lg md:text-xl lg:text-2xl text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
            Card Library
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6 lg:space-y-8">
          {/* Search */}
          <Input
            placeholder="Search cards by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white font-shadows-into-light text-sm md:text-base lg:text-lg"
          />
          
          {/* Directory Structure */}
          <div>
            <h3 className="font-bold mb-3 text-purple-300 font-caveat-brush text-sm md:text-base lg:text-lg">Browse by Category</h3>
            <ArcanaDirectory
              selectedArcana={selectedArcana}
              onArcanaSelect={handleArcanaSelect}
              isMinorExpanded={isMinorExpanded}
              onMinorToggle={handleMinorToggle}
            />
            
            {/* Show Suit Directory when Minor Arcana is selected */}
            {selectedArcana === 'minor' && (
              <div className="mt-4">
                <SuitDirectory
                  selectedSuit={selectedSuit}
                  onSuitSelect={handleSuitSelect}
                />
              </div>
            )}
          </div>

          {/* Card List */}
          <div className="space-y-2 font-just-another-hand tracking-widest text-white">
            {currentCards.length > 0 ? (
              currentCards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => onCardSelect(card)}
                  className={`w-full text-left p-3 md:p-4 rounded-lg transition-colors ${
                    selectedCard?.id === card.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700/50 hover:bg-gray-600'
                  }`}
                >
                  <div className="font-bold text-sm md:text-base lg:text-lg">{card.name}</div>
                  <div className="text-xs md:text-sm lg:text-base text-gray-400">
                    {card.arcana} {card.suit && `• ${card.suit}`}
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                {selectedArcana || searchTerm
                  ? 'No cards found matching your criteria'
                  : 'Select a category to browse cards'
                }
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {filteredCards.length > cardsPerPage && (
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700">
              <Button
                onClick={prevPage}
                disabled={currentPage === 1}
                variant="ghost"
                className="font-caveat-brush text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base lg:text-lg"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                Previous
              </Button>
              
              <div className="text-sm md:text-base lg:text-lg text-gray-400 font-just-another-hand tracking-wide">
                Page {currentPage} of {totalPages}
              </div>
              
              <Button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                variant="ghost"
                className="font-caveat-brush text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base lg:text-lg"
              >
                Next
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}