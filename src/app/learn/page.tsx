"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Shuffle, BookOpen, Target, Lightbulb } from 'lucide-react'
import { TarotCardData } from '@/app/types/tarot'

interface LearningModule {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  content: React.ReactNode
}

export default function LearnPage() {
  const [selectedModule, setSelectedModule] = useState<string>('overview')
  const [selectedCard, setSelectedCard] = useState<TarotCardData | null>(null)
  const [allTarotCards, setAllTarotCards] = useState<TarotCardData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [difficulty, setDifficulty] = useState<string>('beginner')
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


  // Learning modules
  const learningModules: LearningModule[] = [
    {
      id: 'overview',
      title: 'Learning Overview',
      description: 'Get started with tarot basics',
      icon: <GraduationCap className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-purple-900/30 p-6 rounded-lg border border-purple-700">
            <h2 className="text-2xl font-bold mb-4 font-caveat-brush text-purple-200">Welcome to Tarot Learning</h2>
            <p className="text-lg text-gray-300 mb-4 font-shadows-into-light">
              Embark on a journey to understand the mystical world of tarot. This interactive learning experience will guide you through the fundamentals, card meanings, and practical applications.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="font-bold mb-2 font-just-another-hand text-purple-300">78 Cards</h3>
                <p className="text-sm text-gray-400 font-caveat-brush">Learn the Major and Minor Arcana</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="font-bold mb-2 font-just-another-hand text-purple-300">Multiple Spreads</h3>
                <p className="text-sm text-gray-400 font-caveat-brush">Master different reading techniques</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="font-bold mb-2 font-just-another-hand text-purple-300">Interactive Practice</h3>
                <p className="text-sm text-gray-400 font-caveat-brush">Test your knowledge with exercises</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-4 font-caveat-brush text-purple-200">Learning Path</h3>
            <ol className="space-y-3 font-just-another-hand tracking-widest">
              <li className="flex items-start">
                <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">1</span>
                <div>
                  <h4 className="font-bold text-purple-300">Understand the Basics</h4>
                  <p className="text-gray-400 text-sm">Learn about tarot history, structure, and symbolism</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">2</span>
                <div>
                  <h4 className="font-bold text-purple-300">Master Card Meanings</h4>
                  <p className="text-gray-400 text-sm">Study each card's symbolism, keywords, and interpretations</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">3</span>
                <div>
                  <h4 className="font-bold text-purple-300">Learn Spread Techniques</h4>
                  <p className="text-gray-400 text-sm">Practice different layouts and reading approaches</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">4</span>
                <div>
                  <h4 className="font-bold text-purple-300">Develop Your Intuition</h4>
                  <p className="text-gray-400 text-sm">Trust your instincts and personal connection to the cards</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      )
    },
    {
      id: 'cards',
      title: 'Card Meanings',
      description: 'Explore individual tarot cards',
      icon: <BookOpen className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search cards by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white font-shadows-into-light"
              />
            </div>
            <div className="w-full sm:w-48 font-just-another-hand">
              <Select value={selectedCard?.arcana || ''} onValueChange={(value) => {
                if (value) {
                  const filtered = allTarotCards.filter(card => card.arcana === value);
                  setSelectedCard(filtered.length > 0 ? filtered[0] : null);
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
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="bg-gray-800/50 border-gray-700 max-h-[600px] overflow-y-auto">
                <CardHeader>
                  <CardTitle className="font-caveat-brush text-xl text-white">Card Library</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 font-just-another-hand tracking-widest text-white">
                    {allTarotCards
                      .filter(card => 
                        card.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                        (!selectedCard?.arcana || card.arcana === selectedCard.arcana)
                      )
                      .map((card) => (
                        <button
                          key={card.id}
                          onClick={() => setSelectedCard(card)}
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
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              {selectedCard ? (
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="font-caveat-brush text-2xl text-white">{selectedCard.name}</CardTitle>
                    <div className="flex gap-2 mt- font-just-another-hand tracking-widest">
                      <span className="px-2 py-1 bg-purple-900/50 text-purple-200 text-xs rounded-full">
                        {selectedCard.arcana}
                      </span>
                      {selectedCard.suit && (
                        <span className="px-2 py-1 bg-purple-900/50 text-purple-200 text-xs rounded-full">
                          {selectedCard.suit}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex justify-center">
                        <div className="w-48 h-72 bg-black rounded-lg overflow-hidden flex items-center justify-center">
                          <img
                            src={selectedCard.image}
                            alt={selectedCard.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-bold mb-2 text-purple-300 font-caveat-brush">Description</h3>
                          <p className="text-gray-300 font-shadows-into-light">{selectedCard.description}</p>
                        </div>
                        
                        <div>
                          <h3 className="font-bold mb-2 text-purple-300 font-caveat-brush">Keywords</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedCard.keywords.map((keyword, index) => (
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
                            {selectedCard.arcana === 'major' 
                              ? 'Major Arcana cards represent significant life lessons, karmic influences, and archetypal patterns. They often indicate important life events and spiritual growth.'
                              : 'Minor Arcana cards reflect everyday situations, challenges, and opportunities. They provide insight into the practical aspects of life and how we navigate our daily experiences.'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-gray-800/50 border-gray-700 h-full flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <BookOpen className="w-12 h-12 mx-auto mb-4" />
                    <p>Select a card to view its details</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'spreads',
      title: 'Spread Techniques',
      description: 'Learn different tarot spreads',
      icon: <Target className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="font-caveat-brush text-xl text-purple-300">Single Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4 font-shadows-into-light">
                  Perfect for daily guidance, quick insights, or focusing on a specific question.
                </p>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h4 className="font-bold mb-2 text-purple-300 font-caveat-brush">Best for:</h4>
                  <ul className="text-sm text-gray-400 space-y-1 font-just-another-hand tracking-widest">
                    <li>• Daily guidance</li>
                    <li>• Quick yes/no questions</li>
                    <li>• Focusing on a specific issue</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="font-caveat-brush text-xl text-purple-300">Three Card Spread</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4 font-shadows-into-light">
                  Explore past, present, and future, or mind, body, and spirit connections.
                </p>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h4 className="font-bold mb-2 text-purple-300 font-caveat-brush">Best for:</h4>
                  <ul className="text-sm text-gray-400 space-y-1 font-just-another-hand tracking-widest">
                    <li>• Understanding time progression</li>
                    <li>• Exploring current situation</li>
                    <li>• Decision making</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="font-caveat-brush text-xl text-purple-300">Celtic Cross</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4 font-shadows-into-light">
                  A comprehensive 10-card spread for deep insight into complex situations.
                </p>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h4 className="font-bold mb-2 text-purple-300 font-caveat-brush">Best for:</h4>
                  <ul className="text-sm text-gray-400 space-y-1 font-just-another-hand tracking-widest">
                    <li>• Complex situations</li>
                    <li>• Deep self-reflection</li>
                    <li>• Life path questions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="font-caveat-brush text-xl text-purple-300">Spread Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-just-another-hand tracking-widest">
                <div>
                  <h3 className="font-bold mb-3 text-purple-300">Before Reading</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>Clear your mind and focus on your question</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>Shuffle the cards thoroughly</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>Set your intention for the reading</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold mb-3 text-purple-300">During Reading</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>Trust your first impressions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>Look for patterns and connections</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>Consider both upright and reversed meanings</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'exercises',
      title: 'Practice Exercises',
      description: 'Test your tarot knowledge',
      icon: <Lightbulb className="w-5 h-5" />,
      content: (
        <div className="space-y-6 font-just-another-hand tracking-widest">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="w-full sm:w-48">
              <Select value={difficulty} onValueChange={setDifficulty}>
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
  ]


  const selectedModuleContent = learningModules.find(module => module.id === selectedModule)

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4 font-caveat-brush text-purple-300">Tarot Learning Center</h1>
        <p className="text-lg text-gray-300 font-shadows-into-light">
          Explore, learn, and practice tarot with our interactive modules
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        {learningModules.map((module) => (
          <Button
            key={module.id}
            variant={selectedModule === module.id ? 'default' : 'ghost'}
            onClick={() => setSelectedModule(module.id)}
            className={`flex items-center space-x-2 font-caveat-brush ${
              selectedModule === module.id 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {module.icon}
            <span>{module.title}</span>
          </Button>
        ))}
      </div>

      {selectedModuleContent && (
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 font-caveat-brush text-purple-200">
            {selectedModuleContent.title}
          </h2>
          <p className="text-gray-300 mb-6 font-shadows-into-light">
            {selectedModuleContent.description}
          </p>
          {selectedModuleContent.content}
        </div>
      )}
    </div>
  )
}

function GraduationCap(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5" />
    </svg>
  )
}