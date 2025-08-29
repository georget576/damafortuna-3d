"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Shuffle, Lightbulb } from 'lucide-react'
import { TarotCardData } from '@/app/types/tarot'

interface PracticeExerciseProps {
  difficulty?: string
}

export default function PracticeExercise({ difficulty = 'beginner' }: PracticeExerciseProps) {
  const [allTarotCards, setAllTarotCards] = useState<TarotCardData[]>([])
  const [exerciseCards, setExerciseCards] = useState<TarotCardData[]>([])
  const [exerciseOptions, setExerciseOptions] = useState<string[]>([])
  const [userAnswer, setUserAnswer] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [exerciseType, setExerciseType] = useState<'card' | 'decision' | 'meaning'>('card')

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

  const generateExercise = () => {
    const difficultyFilters = {
      beginner: allTarotCards.filter(card => card.arcana === 'major'),
      intermediate: allTarotCards.filter(card => card.arcana === 'minor'),
      advanced: allTarotCards
    }
    
    const filteredCards = difficultyFilters[difficulty as keyof typeof difficultyFilters] || allTarotCards
    
    // Randomly select exercise type
    const exerciseTypes: ('card' | 'decision' | 'meaning')[] = ['card', 'decision', 'meaning']
    const randomType = exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)]
    setExerciseType(randomType)
    
    if (randomType === 'card') {
      const correctCard = filteredCards[Math.floor(Math.random() * filteredCards.length)]
      
      // Generate 3 wrong options
      const wrongOptions = [...filteredCards]
        .filter(card => card.id !== correctCard.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(card => card.name)
      
      // Combine and shuffle options
      const allOptions = [correctCard.name, ...wrongOptions].sort(() => 0.5 - Math.random())
      
      setExerciseCards([correctCard])
      setExerciseOptions(allOptions)
    } else if (randomType === 'decision') {
      const scenarios = [
        {
          question: 'I need to make a career change decision',
          correctSpread: 'Celtic Cross',
          wrongOptions: ['Single Card', 'Three Card Spread', 'Relationship Spread']
        },
        {
          question: 'I want to understand my current relationship situation',
          correctSpread: 'Relationship Spread',
          wrongOptions: ['Single Card', 'Three Card Spread', 'Celtic Cross']
        },
        {
          question: 'I need guidance for today',
          correctSpread: 'Single Card',
          wrongOptions: ['Three Card Spread', 'Celtic Cross', 'Relationship Spread']
        },
        {
          question: 'I want to explore a complex life situation',
          correctSpread: 'Celtic Cross',
          wrongOptions: ['Single Card', 'Three Card Spread', 'Relationship Spread']
        }
      ]
      
      const scenario = scenarios[Math.floor(Math.random() * scenarios.length)]
      
      setExerciseCards([{
        name: scenario.question,
        description: scenario.correctSpread,
        keywords: []
      } as unknown as TarotCardData])
      setExerciseOptions([scenario.correctSpread, ...scenario.wrongOptions].sort(() => 0.5 - Math.random()))
    } else if (randomType === 'meaning') {
      const correctCard = filteredCards[Math.floor(Math.random() * filteredCards.length)]
      
      // Generate wrong meanings based on similar cards
      const wrongOptions = filteredCards
        .filter(card => card.id !== correctCard.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(card => card.keywords[0] || card.name)
      
      // Combine and shuffle options
      const allOptions = [correctCard.keywords[0] || correctCard.name, ...wrongOptions].sort(() => 0.5 - Math.random())
      
      setExerciseCards([correctCard])
      setExerciseOptions(allOptions)
    }
    
    setUserAnswer('')
    setShowFeedback(false)
  }

  const checkAnswer = (selectedAnswer: string) => {
    if (exerciseCards.length > 0) {
      let isAnswerCorrect = false
      
      if (exerciseType === 'card') {
        isAnswerCorrect = selectedAnswer === exerciseCards[0].name
      } else if (exerciseType === 'decision') {
        isAnswerCorrect = selectedAnswer === exerciseCards[0].description
      } else if (exerciseType === 'meaning') {
        isAnswerCorrect = selectedAnswer === (exerciseCards[0].keywords[0] || exerciseCards[0].name)
      }
      
      setIsCorrect(isAnswerCorrect)
      setShowFeedback(true)
    }
  }

  return (
    <div className="space-y-6 font-just-another-hand tracking-widest">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="w-full sm:w-48">
          <Select value={difficulty} onValueChange={(value) => {}}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 font-just-another-hand tracking-widest text-white">
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button 
          onClick={generateExercise}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Shuffle className="w-4 h-4 mr-2" />
          New Exercise
        </Button>
      </div>

      {exerciseCards.length > 0 ? (
        <Card className="bg-gray-800/50 border-gray-700 text-purple-300">
          <CardHeader>
            {exerciseType === 'card' && (
              <CardTitle className="font-caveat-brush text-2xl">Card Recognition Exercise</CardTitle>
            )}
            {exerciseType === 'decision' && (
              <CardTitle className="font-caveat-brush text-2xl">Spread Selection Exercise</CardTitle>
            )}
            {exerciseType === 'meaning' && (
              <CardTitle className="font-caveat-brush text-2xl">Card Meaning Exercise</CardTitle>
            )}
            <p className="text-gray-300">
              {exerciseType === 'card' && 'Choose the correct card name from the options below'}
              {exerciseType === 'decision' && 'Choose the best spread for this situation'}
              {exerciseType === 'meaning' && 'Choose the primary meaning of this card'}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-6">
                  {exerciseType === 'card' && (
                    <h3 className="font-bold mb-2 text-purple-300">Select the correct card:</h3>
                  )}
                  {exerciseType === 'decision' && (
                    <h3 className="font-bold mb-2 text-purple-300">Situation: {exerciseCards[0].name}</h3>
                  )}
                  {exerciseType === 'meaning' && (
                    <h3 className="font-bold mb-2 text-purple-300">Primary meaning:</h3>
                  )}
                  <div className="space-y-2">
                    {exerciseOptions.map((option, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start text-left bg-gray-700/50 hover:bg-gray-600 border-gray-600"
                        onClick={() => checkAnswer(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={generateExercise} variant="outline" className='bg-purple-600'>
                    Next Exercise
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-center">
                {exerciseType === 'card' && (
                  <div className="w-48 h-72 bg-black rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={exerciseCards[0].image}
                      alt={exerciseCards[0].name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                {exerciseType === 'decision' && (
                  <div className="w-48 h-72 bg-black rounded-lg overflow-hidden flex items-center justify-center p-4">
                    <div className="text-center text-white">
                      <div className="text-4xl mb-2">❓</div>
                      <p className="text-sm text-center">Decision Making</p>
                    </div>
                  </div>
                )}
                {exerciseType === 'meaning' && (
                  <div className="w-48 h-72 bg-black rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={exerciseCards[0].image}
                      alt={exerciseCards[0].name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
            
            {showFeedback && (
              <div className={`mt-4 p-4 rounded-lg ${
                isCorrect
                  ? 'bg-green-900/50 border border-green-700'
                  : 'bg-red-900/50 border border-red-700'
              }`}>
                <h3 className="font-bold mb-2">
                  {isCorrect ? 'Correct! 🎉' : 'Not quite right 🤔'}
                </h3>
                <p className="text-gray-300">
                  {isCorrect
                    ? (exerciseType === 'card' && 'Great job! You recognized this card correctly.')
                      || (exerciseType === 'decision' && 'Great job! You selected the appropriate spread.')
                      || (exerciseType === 'meaning' && 'Great job! You identified the correct meaning.')
                    : `The correct answer is: ${exerciseType === 'card' ? exerciseCards[0].name : exerciseType === 'decision' ? exerciseCards[0].description : exerciseCards[0].keywords[0] || exerciseCards[0].name}`
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="text-center py-12">
            <Lightbulb className="w-12 h-12 mx-auto mb-4 text-purple-400" />
            <p className="text-gray-400">Click "New Exercise" to start practicing!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}