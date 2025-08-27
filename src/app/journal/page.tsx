"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Calendar, Edit, Save, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { getJournalEntries, updateJournalEntry, JournalEntry } from '@/app/actions/reading-actions'

export default function JournalContentPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalEntries, setTotalEntries] = useState(0)
  const [editingEntry, setEditingEntry] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    title: '',
    notes: '',
    userNotes: ''
  })

  // Fetch journal entries
  const fetchEntries = async (page: number = 1) => {
    setLoading(true)
    try {
      const result = await getJournalEntries(page, 10)
      setEntries(result.entries)
      setTotalPages(result.totalPages)
      setTotalEntries(result.total)
      setCurrentPage(result.currentPage)
    } catch (error) {
      console.error('Error fetching journal entries:', error)
      toast.error('Failed to load journal entries')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEntries(currentPage)
  }, [currentPage])

  const handleEditClick = (entry: JournalEntry) => {
    setEditingEntry(entry.id)
    setEditForm({
      title: entry.title || '',
      notes: entry.notes,
      userNotes: entry.userNotes || ''
    })
  }

  const handleCancelEdit = () => {
    setEditingEntry(null)
    setEditForm({
      title: '',
      notes: '',
      userNotes: ''
    })
  }

  const handleSaveEdit = async () => {
    if (!editingEntry) return

    try {
      const result = await updateJournalEntry(
        editingEntry,
        editForm.title,
        editForm.notes,
        editForm.userNotes
      )

      if (result.success) {
        toast.success('Journal entry updated successfully!')
        setEditingEntry(null)
        fetchEntries(currentPage) // Refresh entries
      } else {
        throw new Error(result.error || 'Failed to update entry')
      }
    } catch (error) {
      console.error('Error updating journal entry:', error)
      toast.error('Failed to update journal entry')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className='font-just-another-hand tracking-widest tarot-gold'>Loading your journal entries...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 font-caveat-brush">Tarot Journal</h1>
        <p className="text-base md:text-lg text-gray-300 mb-4 md:mb-6 font-shadows-into-light">
          Review and reflect on your past readings
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-8 md:py-12">
          <div className="bg-gray-800/50 rounded-lg p-6 md:p-8 max-w-2xl mx-auto">
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 font-caveat-brush">No Journal Entries Yet</h3>
            <p className="text-gray-300 mb-4 md:mb-6 font-shadows-into-light text-sm md:text-base">
              Your saved readings will appear here. Start by creating a new reading!
            </p>
            <Button
              onClick={() => window.location.href = '/reading'}
              className="bg-purple-600 hover:bg-purple-700 font-caveat-brush text-sm md:text-base px-4 md:px-6 py-2 md:py-3"
            >
              Create New Reading
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {entries.map((entry) => (
              <Card key={entry.id} className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="font-caveat-brush text-lg sm:text-2xl tarot-purple truncate">
                        {entry.title || 'Untitled Reading'}
                      </CardTitle>
                      <CardDescription className="text-gray-400 mt-2 flex items-center gap-2 font-just-another-hand tracking-widest text-sm">
                        <Calendar className="h-4 w-4" />
                        {formatDate(entry.createdAt)}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                      {editingEntry === entry.id ? (
                        <>
                          <Button
                            onClick={handleSaveEdit}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 p-2"
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={handleCancelEdit}
                            size="sm"
                            variant="outline"
                            className="border-gray-600 p-2"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => handleEditClick(entry)}
                          size="sm"
                          variant="outline"
                          className="border-gray-600 p-2"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-caveat-brush text-sm sm:text-lg text-purple-300 mb-2">
                      Spread: {getSpreadTypeDisplay(entry.reading.spreadType)}
                    </h4>
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                      {entry.reading.readingCards.map((card, index) => (
                        <div
                          key={index}
                          className="px-2 sm:px-3 py-1 bg-purple-900/50 text-purple-200 text-xs sm:text-sm rounded-full border border-purple-700 font-just-another-hand tracking-widest"
                        >
                          {card.card.name}
                          {card.isReversed && <span className="ml-1 text-red-300">↺</span>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {editingEntry === entry.id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 font-just-another-hand text-white tracking-widest">Title</label>
                        <Input
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="bg-gray-900/50 border-gray-600 text-white font-just-another-hand tracking-widest text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-white font-just-another-hand tracking-widest">Interpretation</label>
                        <Textarea
                          value={editForm.notes}
                          onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                          className="min-h-[100px] sm:min-h-[120px] bg-gray-900/50 border-gray-600 text-white font-shadows-into-light text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-white font-just-another-hand tracking-widest">Your Notes</label>
                        <Textarea
                          value={editForm.userNotes}
                          onChange={(e) => setEditForm({ ...editForm, userNotes: e.target.value })}
                          className="min-h-[80px] sm:min-h-[100px] bg-gray-900/50 border-gray-600 text-white font-shadows-into-light text-sm"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-caveat-brush text-lg text-purple-300 mb-2">Interpretation</h4>
                        <p className="text-gray-300 text-sm leading-relaxed font-shadows-into-light">{entry.notes}</p>
                      </div>
                      {entry.userNotes && (
                        <div>
                          <h4 className="font-caveat-brush text-lg text-purple-300 mb-2">Your Reflections</h4>
                          <p className="text-gray-300 text-sm leading-relaxed font-shadows-into-light">{entry.userNotes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mt-6 sm:mt-8 font-caveat-brush">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                className="border-gray-600 text-sm sm:text-base px-3 sm:px-4 py-2"
              >
                <ChevronLeft className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Previous</span>
              </Button>
              
              <div className="flex items-center gap-1 sm:gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      className={currentPage === pageNum ? "bg-purple-600" : "border-gray-600"}
                      size="sm"
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
                className="border-gray-600 text-sm sm:text-base px-3 sm:px-4 py-2"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4 ml-1 sm:ml-2" />
              </Button>
            </div>
          )}

          <div className="text-center text-gray-400 text-sm sm:text-xl mt-3 sm:mt-4 font-just-another-hand tracking-widest">
            Page {currentPage} of {totalPages} • {totalEntries} total entries
          </div>
        </>
      )}
    </div>
  )
}