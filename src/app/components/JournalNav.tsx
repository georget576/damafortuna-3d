"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { getJournalEntries, JournalEntry } from '@/app/actions/reading-actions'

interface JournalNavProps {
  currentId?: string
}

export function JournalNav({ currentId }: JournalNavProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true)
      try {
        const result = await getJournalEntries(1, 50) // Get up to 50 entries for nav
        setEntries(result.entries)
      } catch (error) {
        console.error('Error fetching journal entries:', error)
        toast.error('Failed to load journal entries')
      } finally {
        setLoading(false)
      }
    }

    fetchEntries()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getSpreadTypeDisplay = (spreadType: string) => {
    switch (spreadType) {
      case 'SINGLE':
        return 'Single'
      case 'THREE_CARD':
        return '3-Card'
      case 'CELTIC_CROSS':
        return 'Celtic Cross'
      default:
        return spreadType
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
        <p className="text-gray-400 mt-2">Loading entries...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Link href="/reading">
        <Button className="w-full bg-purple-600 hover:bg-purple-700 font-caveat-brush">
          <Plus className="h-4 w-4 mr-2" />
          New Reading
        </Button>
      </Link>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4 text-purple-300 font-just-another-hand">
          Journal Entries
        </h2>
        
        {entries.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No journal entries yet</p>
            <p className="text-sm mt-2">Create your first reading!</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
            {entries.map((entry) => (
              <Link key={entry.id} href={`/journal/${entry.id}`}>
                <Card 
                  className={`cursor-pointer transition-all duration-200 hover:bg-gray-800/70 ${
                    currentId === entry.id ? 'bg-purple-900/30 border-purple-600' : 'bg-gray-800/50 border-gray-700'
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="font-caveat-brush text-lg truncate">
                        {entry.title || 'Untitled Reading'}
                      </CardTitle>
                      <CardDescription className="text-xs text-gray-400 ml-2 flex-shrink-0">
                        {getSpreadTypeDisplay(entry.reading.spreadType)}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(entry.createdAt)}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {entry.reading.readingCards.slice(0, 3).map((card, index) => (
                        <span 
                          key={index}
                          className="text-xs px-2 py-1 bg-purple-900/30 text-purple-200 rounded-full border border-purple-700"
                        >
                          {card.card.name}
                          {card.isReversed && <span className="ml-1 text-red-300">↺</span>}
                        </span>
                      ))}
                      {entry.reading.readingCards.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-gray-700 text-gray-400 rounded-full">
                          +{entry.reading.readingCards.length - 3} more
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}