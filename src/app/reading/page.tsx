"use client"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { generateRandomReading, saveReading } from '@/app/actions/reading-actions'
import { toast } from 'sonner'
import {
  SpreadType,
  DrawCardResponse,
  InterpretationResponse,
  TarotCardData
} from '@/app/types/tarot'

// Import all extracted components
import HeaderSection from './components/HeaderSection'
import { ReadingControls } from './components/ReadingControls'
import { ReadingDisplay } from './components/ReadingDisplay'
import { ReflectionSection } from './components/ReflectionSection'
import { EmptyState } from './components/EmptyState'

// Types for our reading data
interface ReadingData {
  cards: DrawCardResponse[]
  interpretation: InterpretationResponse
}

export default function ReadingPage() {
  const { data: session, status } = useSession()
  const [spreadType, setSpreadType] = useState<SpreadType>('single')
  const [reading, setReading] = useState<ReadingData | null>(null)
  
  // Initialize with a safe default structure
  const safeReading: ReadingData = {
    cards: [],
    interpretation: {
      reading: '',
      cardInterpretations: []
    }
  }
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
      console.log('Generated reading result:', result)
      console.log('Reading structure:', {
        hasCards: result?.cards && result.cards.length > 0,
        hasInterpretation: result?.interpretation && result.interpretation.reading,
        cardCount: result?.cards?.length || 0,
        interpretationCount: result?.interpretation?.cardInterpretations?.length || 0
      })
      setReading(result)
    } catch (err) {
      console.error('Error generating reading:', err)
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
      return
    }
    
    setIsSaving(true)
    setError(null)
    
    try {
      const result = await saveReading(
        `${spreadType} Reading`,
        spreadType.toLowerCase(),
        reading.cards,
        reading.interpretation?.reading || '',
        reading.interpretation?.cardInterpretations || [],
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

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <HeaderSection
          spreadType={spreadType}
          setSpreadType={setSpreadType}
          onGenerateReading={handleGenerateReading}
          isLoading={isLoading}
          error={error}
          status={status}
        />

        {reading ? (
          <>
            <ReadingControls
              spreadType={spreadType}
              onGenerateReading={handleGenerateReading}
              onSaveReading={handleSaveReading}
              isLoading={isLoading}
              isSaving={isSaving}
              status={status}
            />
             
            <ReadingDisplay
              spreadType={spreadType}
              reading={reading}
              allTarotCards={allTarotCards}
            />
             
            <ReflectionSection
              reflection={userInput}
              onReflectionChange={setUserInput}
            />
          </>
        ) : (
          <EmptyState
            spreadType={spreadType}
            setSpreadType={setSpreadType}
            onGenerateReading={handleGenerateReading}
            disabled={isLoading}
          />
        )}
      </div>
    </div>
  )
}
