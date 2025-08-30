import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState, useEffect } from 'react'
import { TarotCardData } from '@/app/types/tarot'

interface ForumCategory {
  id: string
  name: string
  slug: string
  description: string
}

interface SavedReading {
  id: string
  title: string
  spreadType: string
  createdAt: string
  cards: Array<{
    id: string
    name: string
    imageUrl?: string
    isReversed: boolean
    position: number
    positionLabel?: string
  }>
}

interface CreatePostFormProps {
  showCreateForm: boolean
  setShowCreateForm: (show: boolean) => void
  categories: ForumCategory[]
  savedReadings: SavedReading[]
  newPost: {
    title: string
    content: string
    categoryId: string
    type: string
    attachedReadingId: string | undefined
    attachedCardId: string | undefined
  }
  setNewPost: (post: {
    title: string
    content: string
    categoryId: string
    type: string
    attachedReadingId: string | undefined
    attachedCardId: string | undefined
  }) => void
  handleCreatePost: (e: React.FormEvent) => void
}

// Helper function to transform position numbers to human-readable labels
const transformPositionLabel = (position: number, spreadType: string): string => {
  // Common position mappings for different spread types based on spreadLayout.ts
  const positionMappings: Record<string, string[]> = {
    'THREE_CARD': ['Left', 'Center', 'Right'],
    'CELTIC_CROSS': [
      'The Present',           // Position 0
      'The Challenge',         // Position 1
      'Above',                // Position 2
      'Below',                // Position 3
      'Right',                // Position 4
      'Left',                 // Position 5
      'External Influences',  // Position 6
      'Hopes and Fears',      // Position 7
      'Advice',               // Position 8
      'The Outcome'           // Position 9
    ],
    'SINGLE': ['The Card'],
    'ONE_CARD': ['The Card'],
    'DAILY_DRAW': ['Daily Draw'],
    'LOVE_SPREAD': ['Past Love', 'Present Love', 'Future Love'],
    'CAREER_SPREAD': ['Past Career', 'Present Career', 'Future Career'],
    'YES_NO': ['Answer'],
    'GENERAL': ['Position 1', 'Position 2', 'Position 3']
  }

  // Get the mapping for this spread type, or fall back to general
  const mapping = positionMappings[spreadType.toUpperCase()] || positionMappings['GENERAL']
  
  // Return the position label if it exists, otherwise return the position number
  return mapping[position] || `Position ${position + 1}`
}

export default function CreatePostForm({
  showCreateForm,
  setShowCreateForm,
  categories,
  savedReadings,
  newPost,
  setNewPost,
  handleCreatePost
}: CreatePostFormProps) {
  if (!showCreateForm) return null

  // State for individual tarot cards
  const [tarotCards, setTarotCards] = useState<TarotCardData[]>([])
  const [loadingCards, setLoadingCards] = useState(true)
  const [selectedCard, setSelectedCard] = useState<TarotCardData | null>(null)

  // Fetch all tarot cards from API
  useEffect(() => {
    const fetchTarotCards = async () => {
      try {
        setLoadingCards(true)
        const response = await fetch('/api/cards/all')
        if (response.ok) {
          const data = await response.json()
          setTarotCards(data)
        } else {
          console.error('Failed to fetch tarot cards')
        }
      } catch (error) {
        console.error('Error fetching tarot cards:', error)
      } finally {
        setLoadingCards(false)
      }
    }

    fetchTarotCards()
  }, [])

  // Update selected card when attachedCardId changes
  useEffect(() => {
    if (newPost.attachedCardId) {
      const card = tarotCards.find(c => c.id === newPost.attachedCardId)
      setSelectedCard(card || null)
    } else {
      setSelectedCard(null)
    }
  }, [newPost.attachedCardId, tarotCards])

  return (
    <Card className="bg-gray-800/50 border-gray-700 mb-6">
      <CardHeader>
        <CardTitle className="font-caveat-brush text-xl text-purple-300">Create New Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div>
            <label className="block text-xl font-medium mb-2 text-white font-caveat-brush">Title</label>
            <Input
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              className="bg-gray-900/50 border-gray-600 text-white font-just-another-hand tracking-widest text-2xl"
              placeholder="Enter post title..."
            />
          </div>
          
          <div>
            <label className="block text-xl font-medium mb-2 text-white font-caveat-brush">Category</label>
            <div className="space-y-2">
              <select
                value={newPost.categoryId}
                onChange={(e) => setNewPost({ ...newPost, categoryId: e.target.value })}
                className="w-full bg-gray-900/50 border-gray-600 text-white px-4 py-2 rounded-md font-just-another-hand tracking-widest text-xl"
              >
                <option value="">Select a category</option>
                
                {/* Core Tarot Categories */}
                <option disabled className="font-bold text-purple-300">── 🔮 Core Tarot Categories ──</option>
                {(() => {
                  const coreCategories = categories.filter(cat =>
                    cat.name && (
                      cat.name.includes('🔮') ||
                      cat.name.includes('Daily') ||
                      cat.name.includes('Weekly') ||
                      cat.name.includes('Moon') ||
                      cat.name.includes('Major') ||
                      cat.name.includes('Minor') ||
                      cat.name.includes('Court') ||
                      cat.name.includes('Spread')
                    )
                  );
                  return coreCategories.length > 0 ? (
                    coreCategories
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((category) => (
                        <option key={category.id} value={category.id} className="pl-4">
                          {category.name}
                        </option>
                      ))
                  ) : (
                    <option disabled className="text-gray-500 pl-4">No categories found</option>
                  );
                })()}
                
                {/* Personal & Reflective Categories */}
                <option disabled className="font-bold text-blue-300">── 🧠 Personal & Reflective Categories ──</option>
                {(() => {
                  const personalCategories = categories.filter(cat =>
                    cat.name && (
                      cat.name.includes('🧠') ||
                      cat.name.includes('Intuitive') ||
                      cat.name.includes('Shadow') ||
                      cat.name.includes('Spiritual') ||
                      cat.name.includes('Emotional') ||
                      cat.name.includes('Synchronicities')
                    )
                  );
                  return personalCategories.length > 0 ? (
                    personalCategories
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((category) => (
                        <option key={category.id} value={category.id} className="pl-4 font-just-another-hand tracking-widest">
                          {category.name}
                        </option>
                      ))
                  ) : (
                    <option disabled className="text-gray-500 pl-4">No categories found</option>
                  );
                })()}
                
                {/* Journal Style Categories */}
                <option disabled className="font-bold text-green-300">── 📓 Journal Style Categories ──</option>
                {(() => {
                  const journalCategories = categories.filter(cat =>
                    cat.name && (
                      cat.name.includes('📓') ||
                      cat.name.includes('Tarot') ||
                      cat.name.includes('Card') ||
                      cat.name.includes('Reading') ||
                      cat.name.includes('Lessons') ||
                      cat.name.includes('Symbols')
                    )
                  );
                  return journalCategories.length > 0 ? (
                    journalCategories
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((category) => (
                        <option key={category.id} value={category.id} className="pl-4">
                          {category.name}
                        </option>
                      ))
                  ) : (
                    <option disabled className="text-gray-500 pl-4">No categories found</option>
                  );
                })()}
                
                {/* Occult & Esoteric Categories */}
                <option disabled className="font-bold text-yellow-300">── 🌙 Occult & Esoteric Categories ──</option>
                {(() => {
                  const occultCategories = categories.filter(cat =>
                    cat.name && (
                      cat.name.includes('🌙') ||
                      cat.name.includes('Astro') ||
                      cat.name.includes('Numerology') ||
                      cat.name.includes('Elemental') ||
                      cat.name.includes('Ritual')
                    )
                  );
                  return occultCategories.length > 0 ? (
                    occultCategories
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((category) => (
                        <option key={category.id} value={category.id} className="pl-4">
                          {category.name}
                        </option>
                      ))
                  ) : (
                    <option disabled className="text-gray-500 pl-4">No categories found</option>
                  );
                })()}
                
                {/* Fallback: Show all categories if no grouping matches */}
                {(() => {
                  const hasGroupedCategories =
                    categories.some(cat => cat.name.includes('🔮') || cat.name.includes('🧠') || cat.name.includes('📓') || cat.name.includes('🌙')) ||
                    categories.some(cat => cat.name.includes('Daily') || cat.name.includes('Weekly') || cat.name.includes('Moon') || cat.name.includes('Major') || cat.name.includes('Minor') || cat.name.includes('Court') || cat.name.includes('Spread')) ||
                    categories.some(cat => cat.name.includes('Intuitive') || cat.name.includes('Shadow') || cat.name.includes('Spiritual') || cat.name.includes('Emotional') || cat.name.includes('Synchronicities')) ||
                    categories.some(cat => cat.name.includes('Tarot') || cat.name.includes('Card') || cat.name.includes('Reading') || cat.name.includes('Lessons') || cat.name.includes('Symbols')) ||
                    categories.some(cat => cat.name.includes('Astro') || cat.name.includes('Numerology') || cat.name.includes('Elemental') || cat.name.includes('Ritual'));
                  
                  if (!hasGroupedCategories) {
                    return (
                      <>
                        <option disabled className="font-bold text-gray-400">── All Categories ──</option>
                        {categories
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((category) => (
                            <option key={category.id} value={category.id} className="pl-4">
                              {category.name}
                            </option>
                          ))}
                      </>
                    );
                  }
                  return null;
                })()}
              </select>
              {newPost.categoryId && (
                <div className="text-sm text-gray-400">
                  Selected category: <span className="text-white font-medium italic">
                    {categories.find(c => c.id === newPost.categoryId)?.name || 'Unknown Category'}
                  </span>
                  <span className="text-xs text-gray-500 ml-2 italic">
                    ({categories.find(c => c.id === newPost.categoryId)?.description})
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xl font-medium mb-2 text-white font-caveat-brush">Attach Saved Reading</label>
            <div className="space-y-2">
              <select
                value={newPost.attachedReadingId || ''}
                onChange={(e) => setNewPost({ ...newPost, attachedReadingId: e.target.value || undefined })}
                className="w-full bg-gray-900/50 border-gray-600 text-white px-4 py-2 rounded-md font-just-another-hand tracking-widest text-xl"
              >
                <option value="">Select a saved reading (optional)</option>
                {savedReadings.length > 0 ? (
                  savedReadings
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((reading) => (
                      <option key={reading.id} value={reading.id} className="pl-4">
                        {reading.title} ({reading.spreadType}) - {new Date(reading.createdAt).toLocaleDateString()}
                      </option>
                    ))
                ) : (
                  <option disabled className="text-gray-500 pl-4">No saved readings found</option>
                )}
              </select>
              {newPost.attachedReadingId && (
                <>
                  <div className="text-sm text-gray-400 mb-2">
                    Attached reading: <span className="text-white font-medium italic">
                      {savedReadings.find(r => r.id === newPost.attachedReadingId)?.title || 'Unknown Reading'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setNewPost({ ...newPost, attachedReadingId: undefined })}
                      className="ml-2 text-red-400 hover:text-red-300 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                  
                  {/* Display cards with position labels */}
                  <div className="mt-4 p-4 bg-gray-900/30 rounded-lg border border-gray-700">
                    <h4 className="text-lg font-medium mb-3 text-purple-300 font-caveat-brush">Reading Cards</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {(() => {
                        const reading = savedReadings.find(r => r.id === newPost.attachedReadingId);
                        if (!reading || !reading.cards.length) return null;
                        
                        return reading.cards
                          .sort((a, b) => a.position - b.position)
                          .map((card) => (
                            <div key={card.id} className="bg-gray-800/50 p-3 rounded-lg border border-gray-600">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-medium text-purple-300 bg-purple-900/30 px-2 py-1 rounded">
                                  {transformPositionLabel(card.position, savedReadings.find(r => r.id === newPost.attachedReadingId)?.spreadType || 'GENERAL')}
                                </span>
                                {card.isReversed && (
                                  <span className="text-xs font-medium text-red-300 bg-red-900/30 px-2 py-1 rounded">
                                    Reversed
                                  </span>
                                )}
                              </div>
                              <div className="text-sm font-medium text-white">{card.name}</div>
                            </div>
                          ));
                      })()}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xl font-medium mb-2 text-white font-caveat-brush">Attach Individual Card</label>
            <div className="space-y-2">
              <Select
                value={newPost.attachedCardId || ''}
                onValueChange={(value) => setNewPost({ ...newPost, attachedCardId: value || undefined })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a card (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {loadingCards ? (
                    <SelectItem value="" disabled>Loading cards...</SelectItem>
                  ) : tarotCards.length > 0 ? (
                    tarotCards
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((card) => (
                        <SelectItem key={card.id} value={card.id} className="pl-4">
                          {card.name} ({card.arcana === 'major' ? 'Major Arcana' : 'Minor Arcana'})
                        </SelectItem>
                      ))
                  ) : (
                    <SelectItem value="" disabled>No cards found</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {newPost.attachedCardId && (
                <div className="text-sm text-gray-400 mb-2">
                  Attached card: <span className="text-white font-medium italic">
                    {selectedCard?.name || 'Unknown Card'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setNewPost({ ...newPost, attachedCardId: undefined })}
                    className="ml-2 text-red-400 hover:text-red-300 text-xs"
                  >
                    Remove
                  </button>
                </div>
              )}
              {selectedCard && (
                <div className="mt-4 p-4 bg-gray-900/30 rounded-lg border border-gray-700">
                  <h4 className="text-lg font-medium mb-3 text-purple-300 font-caveat-brush">Selected Card</h4>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={selectedCard.image}
                        alt={selectedCard.name}
                        className="w-32 h-48 object-cover rounded-lg shadow-lg"
                        onError={(e) => {
                          e.currentTarget.src = '/rider-waite/back.jpg'
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="mb-3">
                        <span className="text-xs font-medium text-purple-300 bg-purple-900/30 px-2 py-1 rounded">
                          {selectedCard.arcana === 'major' ? 'Major Arcana' : 'Minor Arcana'}
                        </span>
                        {selectedCard.suit && (
                          <span className="ml-2 text-xs font-medium text-blue-300 bg-blue-900/30 px-2 py-1 rounded">
                            {selectedCard.suit}
                          </span>
                        )}
                      </div>
                      <div className="text-lg font-medium text-white mb-2">{selectedCard.name}</div>
                      <div className="text-sm text-gray-300 mb-2">
                        Keywords: {selectedCard.keywords.join(', ')}
                      </div>
                      <div className="text-sm text-gray-300">
                        {selectedCard.description}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xl font-medium mb-2 text-white font-caveat-brush">Post Type</label>
            <select
              value={newPost.type}
              onChange={(e) => setNewPost({ ...newPost, type: e.target.value })}
              className="w-full bg-gray-900/50 border-gray-600 text-white px-4 py-2 rounded-md font-just-another-hand tracking-widest text-xl"
            >
              <option value="DAILY_DRAW_REFLECTION">Daily Draw Reflection</option>
              <option value="SPREAD_BREAKDOWN">Spread Breakdown</option>
              <option value="CARD_STUDY">Card Study</option>
              <option value="INTUITIVE_MESSAGE">Intuitive Message</option>
              <option value="TAROT_LIFE_EVENT">Tarot & Life Event</option>
              <option value="DECK_REVIEW_COMPARISON">Deck Review or Comparison</option>
              <option value="THEME_BASED_READING">Theme-Based Reading</option>
              <option value="TAROT_PROMPT_RESPONSE">Tarot Prompt Response</option>
              <option value="SYMBOL_ARCHETYPE_EXPLORATION">Symbol & Archetype Exploration</option>
              <option value="MONTHLY_RECAP">Monthly Recap</option>
            </select>
          </div>

          <div>
            <label className="block text-xl font-medium mb-2 text-white font-caveat-brush">Content</label>
            <Textarea
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              className="min-h-[200px] bg-gray-900/50 border-gray-600 text-white font-shadows-into-light tracking-widest text-xl"
              placeholder="Write your post content here..."
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 font-caveat-brush"
            >
              Create Post
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateForm(false)}
              className="border-gray-600 font-caveat-brush"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}