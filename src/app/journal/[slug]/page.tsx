"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Calendar, Edit, Save, X, ArrowLeft, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { getJournalEntryBySlug, updateJournalEntry, JournalEntry, InterpretationData, getInterpretations } from '@/app/actions/reading-actions'

import Image from 'next/image'

interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

export default function JournalEntryPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [entry, setEntry] = useState<JournalEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    title: '',
    notes: '',
    userNotes: ''
  })
  const [interpretations, setInterpretations] = useState<InterpretationData | null>(null)
  const getPositionTitle = (spreadType: string, position: number) => {
    switch (spreadType) {
      case 'SINGLE':
        return 'Card'
      case 'THREE_CARD':
        const threeCardTitles = ['Past', 'Present', 'Future']
        return threeCardTitles[position] || `Card ${position + 1}`
      case 'CELTIC_CROSS':
        const celticTitles = [
          'Current Position',
          'Challenge',
          'Foundation',
          'Recent Past',
          'Conscious Goal',
          'Unconscious Influences',
          'Your Attitude',
          'External Environment',
          'Hopes and Fears',
          'Likely Outcome'
        ]
        return celticTitles[position] || `Card ${position + 1}`
      default:
        return `Card ${position + 1}`
    }
  }

  useEffect(() => {
    const fetchEntry = async () => {
      setLoading(true)
      try {
        const userId = (session?.user as User)?.id
        const result = await getJournalEntryBySlug(params.slug as string, userId)
        if (result) {
          setEntry(result)
          setEditForm({
            title: result.title || '',
            notes: result.notes,
            userNotes: result.userNotes || ''
          })
          
          // Fetch interpretations for this entry
          try {
            const interpretationResult = await getInterpretations({
              readingId: result.id,
              userId
            })
            
            if (interpretationResult) {
              setInterpretations(interpretationResult)
            }
          } catch (error) {
            console.error('Error fetching interpretations:', error)
            // Show a toast notification to inform the user
            toast.error('Could not load card interpretations. The reading data may be incomplete.')
          }
        } else {
          toast.error('Journal entry not found')
          router.push('/journal')
        }
      } catch (error) {
        console.error('Error fetching journal entry:', error)
        toast.error('Failed to load journal entry')
        router.push('/journal')
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchEntry()
    }
  }, [params.slug, router, status, (session?.user as User)?.id])

  // Update edit form when interpretations are loaded
  useEffect(() => {
    if (interpretations && interpretations.cardInterpretations && entry) {
      const formattedInterpretation = formatInterpretationsForEdit(
        interpretations.cardInterpretations,
        entry.reading.spreadType
      )
      
      setEditForm(prev => ({
        ...prev,
        notes: formattedInterpretation
      }))
    }
  }, [interpretations, entry])

  const handleSaveEdit = async () => {
    if (!entry) return

    try {
      const userId = (session?.user as User)?.id
      const result = await updateJournalEntry(
        entry.id,
        {
          title: editForm.title || undefined,
          notes: editForm.notes
        },
        userId
      )

      if (result.success && result.entry) {
        toast.success('Journal entry updated successfully!')
        setEditing(false)
        setEntry(result.entry)
      } else {
        throw new Error(result.error || 'Failed to update entry')
      }
    } catch (error) {
      console.error('Error updating journal entry:', error)
      toast.error('Failed to update journal entry')
    }
  }

  const handleCancelEdit = () => {
    if (!entry) return
    
    setEditing(false)
    // Use the current interpretation data if available, otherwise use entry.notes
    const notesToUse = interpretations && interpretations.cardInterpretations
      ? formatInterpretationsForEdit(interpretations.cardInterpretations, entry.reading.spreadType)
      : entry.notes
    
    setEditForm({
      title: entry.title || '',
      notes: notesToUse,
      userNotes: entry.userNotes || ''
    })
  }

  // Helper function to format interpretations for editing
  const formatInterpretationsForEdit = (cardInterpretations: {position: number; cardName: string; interpretation: string}[], spreadType: string) => {
    return cardInterpretations
      .map((cardInterp) =>
        `${getPositionTitle(spreadType, cardInterp.position)}: ${cardInterp.cardName}\n${cardInterp.interpretation}`
      )
      .join('\n\n')
  }

  // Generate slug URL for the entry (now using the current slug)
  const generateSlugUrl = () => {
    if (!entry || !entry.slug) return ''
    return `/journal/${entry.slug}`
  }

  // Format slug without dashes for community post creation
  const formatSlugWithoutDashes = () => {
    if (!entry || !entry.slug) return ''
    return entry.slug.replace(/-/g, ' ')
  }

  const formatDate = (dateString: Date | string) => {
    const date = dateString instanceof Date ? dateString : new Date(dateString)
    return (
      <span className="font-just-another-hand tracking-widest">
        {date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })}
      </span>
    )
  }

  const getSpreadTypeDisplay = (spreadType: string) => {
    switch (spreadType) {
      case 'SINGLE':
        return 'Single Card'
      case 'THREE_CARD':
        return 'Three Card'
      case 'CELTIC_CROSS':
        return 'Celtic Cross'
      default:
        return spreadType
    }
  }


  // Handle authentication and loading states in the render
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className='font-just-another-hand tracking-widest text-2xl text-purple-200'>Loading...</p>
        </div>
      </div>
    )
  }

  if (status !== 'authenticated') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-gray-800/50 rounded-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4 font-caveat-brush text-purple-300">Authentication Required</h2>
          <p className="text-gray-300 mb-6 font-shadows-into-light">
            Please sign in to access journal entries.
          </p>
          <Button
            onClick={() => window.location.href = '/auth/signin'}
            className="bg-purple-600 hover:bg-purple-700 font-caveat-brush px-6 py-3"
          >
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className='font-just-another-hand tracking-widest text-2xl text-purple-200'>Loading journal entry...</p>
        </div>
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-300">No journal entry found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 md:mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              onClick={() => router.push('/journal')}
              variant="outline"
              className="border-gray-600 bg-purple-700 font-caveat-brush text-sm sm:text-base px-3 sm:px-4 py-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Back to Journal</span>
            </Button>
            {entry.slug && (
              <Button
                onClick={() => {
                  // Create a new post in the community with the journal entry as context
                  window.open(`/community?journalSlug=${formatSlugWithoutDashes()}&readingId=${entry.reading.id}`, '_blank')
                }}
                variant="outline"
                className="border-gray-600 bg-purple-700 font-caveat-brush text-sm sm:text-base px-3 sm:px-4 py-2"
                title="Create community post from this journal entry"
              >
                <Share2 className='h-4 w-4 mr-2' />
                Share
              </Button>
            )}
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold font-caveat-brush text-purple-300">
                {Array.isArray(params.slug)
                  ? params.slug[0]?.split('-').map((word: string) =>
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')
                  : params.slug
                    ? params.slug.split('-').map((word: string) =>
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')
                    : entry.title
                      ? entry.title.split('-').map(word =>
                          word.charAt(0).toUpperCase() + word.slice(1).replace(/[^a-zA-Z0-9]/g, '')
                        ).join(' ')
                      : entry.slug
                        ? entry.slug.split('-').map(word =>
                            word.charAt(0).toUpperCase() + word.slice(1).replace(/[^a-zA-Z0-9]/g, '')
                          ).join(' ')
                        : 'Untitled Reading'
                }
              </h1>
              <p className="text-gray-400 flex items-center gap-2 mt-1 md:mt-2 text-sm">
                <Calendar className="h-4 w-4" />
                {formatDate(entry.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2 font-caveat-brush">
            {editing ? (
              <>
                <Button
                  onClick={handleSaveEdit}
                  className="bg-green-600 hover:bg-green-700 text-sm sm:text-base px-3 sm:px-4 py-2"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  className="border-gray-600 text-black text-sm sm:text-base px-3 sm:px-4 py-2"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setEditing(true)}
                variant="outline"
                className="border-gray-600 bg-purple-700 font-caveat-brush text-sm sm:text-base px-3 sm:px-4 py-2"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Entry
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 font-just-another-hand text-purple-300">
          Cards: {getSpreadTypeDisplay(entry.reading.spreadType)}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entry.reading.readingCards.map((readingCard, index) => (
            <Card key={index} className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="font-caveat-brush text-xl text-center text-purple-300">
                  {readingCard.card.name}
                  {readingCard.isReversed && (
                    <span className="ml-2 text-red-300 text-sm font-just-another-hand tracking-widest">Reversed</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-4">
                  {readingCard.card.imageUrl ? (
                    <Image
                      src={readingCard.card.imageUrl}
                      alt={readingCard.card.name}
                      width={320}
                      height={480}
                      className="w-32 h-48 object-contain rounded-lg border border-gray-700"
                    />
                  ) : (
                    <div className="w-32 h-48 bg-gray-900 rounded-lg flex items-center justify-center border border-gray-700">
                      <span className="text-gray-500 text-sm font-just-another-hand tracking-widest">No Image</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-purple-300 mb-1 font-caveat-brush">Card Name</h4>
                    <p className="text-sm text-gray-300 font-just-another-hand tracking-widest">{readingCard.card.name}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-purple-300 mb-1 font-caveat-brush">Keywords</h4>
                    <div className="flex flex-wrap gap-1 font-just-another-hand tracking-widest">
                      {readingCard.card.keywords?.map((keyword, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 bg-purple-900/30 text-purple-200 rounded-full border border-purple-700"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  {readingCard.card.description && (
                    <div>
                      <h4 className="font-semibold text-purple-300 mb-1 font-caveat-brush">Description</h4>
                      <p className="text-sm text-gray-300 font-just-another-hand tracking-widest">{readingCard.card.description}</p>
                    </div>
                  )}

                  {/* Dynamically display meaning based on card orientation */}
                  {readingCard.isReversed && readingCard.card.meaningReversed ? (
                    <div>
                      <h4 className="font-semibold text-purple-300 mb-1 font-caveat-brush">Reversed Meaning</h4>
                      <p className="text-sm text-gray-300 font-just-another-hand tracking-widest">{readingCard.card.meaningReversed}</p>
                    </div>
                  ) : readingCard.card.meaningUpright ? (
                    <div>
                      <h4 className="font-semibold text-purple-300 mb-1 font-caveat-brush">Upright Meaning</h4>
                      <p className="text-sm text-gray-300 font-just-another-hand tracking-widest">{readingCard.card.meaningUpright}</p>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Interpretation Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 font-just-another-hand text-purple-300">
          Interpretation
        </h2>
        {editing ? (
          <Textarea
            value={editForm.notes}
            onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
            className="min-h-[200px] bg-gray-900/50 border-gray-600 text-white font-shadows-into-light"
            placeholder="Enter your interpretation of the reading..."
          />
        ) : interpretations && interpretations.cardInterpretations ? (
          <div className="space-y-3">
            {/* Show individual card interpretations */}
            {interpretations.cardInterpretations.map((cardInterpretation, index) => (
              <div key={index} className="border-l-2 border-purple-500 pl-3">
                <p className="text-purple-200 text-xs font-just-another-hand tracking-widest mb-1">
                  {getPositionTitle(entry.reading.spreadType, cardInterpretation.position)}: {cardInterpretation.cardName}
                </p>
                <p className="text-gray-300 text-sm leading-relaxed font-shadows-into-light">
                  {cardInterpretation.interpretation}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 font-shadows-into-light">
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {entry.notes || 'No interpretation provided.'}
            </p>
          </div>
        )}
      </div>

      {/* User Notes Section */}
      {entry.userNotes && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 font-just-another-hand text-purple-300">
            Your Reflections
          </h2>
          {editing ? (
            <Textarea
              value={editForm.userNotes}
              onChange={(e) => setEditForm({ ...editForm, userNotes: e.target.value })}
              className="min-h-[150px] bg-gray-900/50 border-gray-600 text-white font-shadows-into-light"
              placeholder="Enter your personal notes and reflections..."
            />
          ) : (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 font-shadows-into-light">
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {entry.userNotes}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Empty User Notes Section (only when editing) */}
      {editing && !entry.userNotes && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 font-just-another-hand text-purple-300">
            Your Reflections
          </h2>
          <Textarea
            value={editForm.userNotes}
            onChange={(e) => setEditForm({ ...editForm, userNotes: e.target.value })}
            className="min-h-[150px] bg-gray-900/50 border-gray-600 text-white font-shadows-into-light"
            placeholder="Enter your personal notes and reflections..."
          />
        </div>
      )}
    </div>
  )
}