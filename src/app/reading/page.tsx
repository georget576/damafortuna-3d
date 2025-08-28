"use client"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { generateRandomReading, saveReading } from '@/app/actions/reading-actions'
import { TarotReader3D } from '@/app/components/TarotReader3D'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  SpreadType,
  DrawCardResponse,
  InterpretationResponse,
  TarotCardData
} from '@/app/types/tarot'

// Types for our reading data
interface ReadingData {
  cards: DrawCardResponse[]
  interpretation: InterpretationResponse
}

export default function ReadingPage() {
  const { data: session, status } = useSession()
  const [spreadType, setSpreadType] = useState<SpreadType>('single')
  const [reading, setReading] = useState<ReadingData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [allTarotCards, setAllTarotCards] = useState<TarotCardData[]>([])
  const [userInput, setUserInput] = useState<string>('')
  
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

  const handleGenerateReading = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await generateRandomReading(spreadType.toLowerCase())
      setReading(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate reading')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveReading = async () => {
    if (!reading) return
    
    // Check if user is logged in
    if (status === 'loading') {
      toast.info('Checking authentication...')
      return
    }
    
    if (!session || !session.user?.id) {
      toast.error('You must be logged in to save readings')
      return
    }
    
    setIsSaving(true)
    setError(null)
    
    try {
      const result = await saveReading(
        `${spreadType} Reading`,
        spreadType.toLowerCase(),
        reading.cards,
        reading.interpretation.reading,
        reading.interpretation.cardInterpretations,
        userInput,
        session?.user?.id
      )
      
      if (result.success) {
        toast.success('Reading saved successfully!')
      } else {
        throw new Error(result.error || 'Failed to save reading')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save reading')
    } finally {
      setIsSaving(false)
    }
  }


  // Helper function to get meaningful position names based on spread type
  const getPositionName = (position: number): string => {
    switch (spreadType) {
      case 'single':
        return 'General Reading'
      case 'three-card':
        switch (position) {
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
        switch (position) {
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
            return `Card ${position}`
        }
      default:
        return `Card ${position}`
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 font-caveat-brush">Tarot Reading</h1>
          <p className="text-lg text-gray-300 mb-6 font-shadows-into-light">
            The arcana invites you to draw a card and learn your fate
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <div className="flex items-center gap-2">
              <label htmlFor="spreadType" className="text-sm font-caveat-brush">Spread Type:</label>
              <Select value={spreadType} onValueChange={(value) => setSpreadType(value as SpreadType)}>
                <SelectTrigger className="w-48 bg-gray-400 border-gray-400 font-caveat-brush text-lg">
                  <SelectValue/>
                </SelectTrigger>
                <SelectContent className="bg-gray-400 border-gray-400 font-shadows-into-light">
                  <SelectItem value="single" className="font-caveat-brush text-lg">Single Card</SelectItem>
                  <SelectItem value="three-card" className="font-caveat-brush text-lg">Three Card</SelectItem>
                  <SelectItem value="celtic-cross" className="font-caveat-brush text-lg">Celtic Cross</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button
              onClick={handleGenerateReading}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 font-caveat-brush"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Get My Reading'
              )}
            </Button>
          </div>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-red-200">{error}</p>
            </div>
          )}
        </div>

        {reading && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold font-caveat-brush tarot-gold">Your {spreadType.toLowerCase()} Reading</h2>
              <Button
                onClick={handleSaveReading}
                className={`${status === 'loading' ? 'bg-gray-600' : session?.user?.id ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} font-just-another-hand text-2xl`}
                disabled={status === 'loading' || !session?.user?.id || isSaving}
              >
                {status === 'loading' ? 'Checking...' :
                 !session?.user?.id ? 'You must be logged in to save' :
                 isSaving ? (
                   <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     Saving...
                   </>
                 ) : 'Save Reading'}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 h-[600px] xl:h-[700px] bg-black/30 rounded-lg overflow-hidden border border-gray-700 relative">
                <TarotReader3D
                  spread={spreadType}
                  drawnCards={reading.cards}
                />
              </div>
              
              <div className="space-y-4 h-fit">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="font-caveat-brush text-2xl tarot-purple">Your Thoughts & Reflections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Share your thoughts about this reading, what resonates with you, or any questions you have..."
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      className="min-h-[120px] bg-gray-900/50 border-gray-600 text-white placeholder-gray-400 font-shadows-into-light"
                    />
                  </CardContent>
                </Card>
                
                {userInput && (
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="font-caveat-brush text-2xl tarot-gold">Your Reflections</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-invert max-w-none">
                        <p className="font-shadows-into-light whitespace-pre-wrap text-gray-300">{userInput}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
                <Card className="bg-gray-800/50 border-gray-700 max-h-[400px] overflow-y-auto">
                  <CardHeader>
                    <CardTitle className="font-caveat-brush tarot-gold text-2xl">Card Meanings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reading.interpretation.cardInterpretations.map((interp, index) => {
                        // Find the corresponding card data to check if it's reversed
                        const cardData = reading.cards.find(
                          card => card.position === interp.position && card.name === interp.cardName
                        );
                        
                        return (
                          <div key={interp.position} className="border-l-4 border-purple-500 pl-4">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-just-another-hand text-2xl text-purple-300">
                                {getPositionName(interp.position)}: {interp.cardName}
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
                
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="font-caveat-brush tarot-purple text-2xl">Card Keywords</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {reading.cards.map((card, index) => (
                        <div key={card.id} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                          <span className="font-shadows-into-light text-sm font-medium text-purple-300">
                            {getPositionName(card.position)}: {card.name}
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
                                  className="px-2 py-1 bg-purple-900/50 text-purple-200 text-xs rounded-full"
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
              </div>
            </div>
          </div>
        )}
        
        {!reading && !isLoading && (
          <div className="text-center py-12">
            <div className="bg-gray-800/50 rounded-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold mb-4 font-caveat-brush">Ready for Your Reading?</h3>
              <p className="text-gray-300 mb-6 font-shadows-into-light">
                Select a spread type and click "Get My Reading" to begin your tarot journey.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h4 className="font-just-another-hand text-2xl text-purple-300 mb-2">Single Card</h4>
                  <p className="text-lg text-gray-400 font-shadows-into-light">Set the tone of the day or get some quick insights.</p>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h4 className="font-just-another-hand text-2xl text-purple-300 mb-2">Three Card</h4>
                  <p className="text-lg text-gray-400 font-shadows-into-light">Explore your past, present, and future with three cards.</p>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h4 className="font-just-another-hand text-2xl text-purple-300 mb-2">Celtic Cross</h4>
                  <p className="text-lg text-gray-400 font-shadows-into-light">A comprehensive 10-card spread for deep insight.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
