"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Calendar, User, MessageCircle, ArrowLeft, Edit, Trash2, Heart, Send, Eye } from 'lucide-react'
import { toast } from 'sonner'

interface ForumPost {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  type: string // Updated to support all PostType values
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
  views: number
  isSticky: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name?: string
    email?: string
    image?: string
  }
  category: {
    id: string
    name: string
    slug: string
  }
  reading?: {
    id: string
    spreadType: string
    readingCards: Array<{
      id: string
      position: number
      isReversed: boolean
      card: {
        id: string
        name: string
        imageUrl?: string
        keywords?: string[]
        description?: string
        meaningUpright?: string
        meaningReversed?: string
      }
    }>
  }
  journal?: {
    id: string
    title?: string
    notes: string
    userNotes?: string
  }
  card?: {
    id: string
    name: string
    image: string
    description: string
    keywords: string[]
    arcana: 'major' | 'minor'
    suit?: 'cups' | 'wands' | 'swords' | 'pentacles'
  }
  _count?: {
    replies: number
  }
}

interface ForumReply {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    name?: string
    email?: string
    image?: string
  }
}

export default function CommunityPostPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [post, setPost] = useState<ForumPost | null>(null)
  const [replies, setReplies] = useState<ForumReply[]>([])
  const [loading, setLoading] = useState(true)
  const [replyContent, setReplyContent] = useState('')
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    title: '',
    content: ''
  })

  // Fetch post data
  const fetchPost = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/community/posts/${params.slug}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data)
        setEditForm({
          title: data.title,
          content: data.content
        })
      } else {
        const error = await response.json()
        toast.error(error.error || 'Post not found')
        router.push('/community')
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      toast.error('Failed to load post')
      router.push('/community')
    } finally {
      setLoading(false)
    }
  }

  // Fetch replies
  const fetchReplies = async () => {
    try {
      const response = await fetch(`/api/community/posts/${params.slug}/replies`)
      if (response.ok) {
        const data = await response.json()
        setReplies(data.replies)
      }
    } catch (error) {
      console.error('Error fetching replies:', error)
    }
  }

  useEffect(() => {
    fetchPost()
  }, [params.slug])

  useEffect(() => {
    if (post) {
      fetchReplies()
      // Increment view count
      fetch(`/api/community/posts/${params.slug}/view`, {
        method: 'POST'
      })
    }
  }, [post])

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session) {
      toast.error('Please sign in to reply')
      return
    }

    if (!replyContent.trim()) {
      toast.error('Reply content is required')
      return
    }

    try {
      const response = await fetch(`/api/community/posts/${params.slug}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: replyContent }),
      })

      if (response.ok) {
        toast.success('Reply posted successfully!')
        setReplyContent('')
        setShowReplyForm(false)
        fetchReplies() // Refresh replies
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to post reply')
      }
    } catch (error) {
      console.error('Error posting reply:', error)
      toast.error('Failed to post reply')
    }
  }

  const handleEditPost = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!post || !session || session.user.id !== post.author.id) {
      toast.error('You can only edit your own posts')
      return
    }

    if (!editForm.title.trim() || !editForm.content.trim()) {
      toast.error('Title and content are required')
      return
    }

    try {
      const response = await fetch(`/api/community/posts/${params.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Post updated successfully!')
        setIsEditing(false)
        setPost(data)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update post')
      }
    } catch (error) {
      console.error('Error updating post:', error)
      toast.error('Failed to update post')
    }
  }

  const handleDeletePost = async () => {
    if (!post || !session || session.user.id !== post.author.id) {
      toast.error('You can only delete your own posts')
      return
    }

    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/community/posts/${params.slug}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Post deleted successfully')
        router.push('/community')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error('Failed to delete post')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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

  const getPostTypeDisplay = (type: string) => {
    switch (type) {
      case 'READING':
        return 'Reading'
      case 'JOURNAL':
        return 'Journal'
      case 'GENERAL':
        return 'General'
      case 'DAILY_DRAW_REFLECTION':
        return 'Daily Draw'
      case 'SPREAD_BREAKDOWN':
        return 'Spread Analysis'
      case 'CARD_STUDY':
        return 'Card Study'
      case 'INTUITIVE_MESSAGE':
        return 'Intuitive Message'
      case 'TAROT_LIFE_EVENT':
        return 'Life Event'
      case 'DECK_REVIEW_COMPARISON':
        return 'Deck Review'
      case 'THEME_BASED_READING':
        return 'Theme Reading'
      case 'TAROT_PROMPT_RESPONSE':
        return 'Prompt Response'
      case 'SYMBOL_ARCHETYPE_EXPLORATION':
        return 'Symbol Study'
      case 'MONTHLY_RECAP':
        return 'Monthly Recap'
      default:
        return type
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className='font-just-another-hand tracking-widest text-2xl text-purple-200'>Loading...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          onClick={() => router.push('/community')}
          variant="outline"
          className="border-gray-600 mb-4 font-caveat-brush"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Community
        </Button>
        
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl sm:text-4xl font-bold font-caveat-brush text-purple-300">
                {post.title ? post.title.split(' ').slice(0, 6).join(' ') + (post.title.split(' ').length > 6 ? '...' : '') : 'Untitled Post'}
              </h1>
              <span className="px-2 py-1 bg-purple-900/30 text-purple-200 rounded-full text-sm text-center font-just-another-hand tracking-widest">
                {getPostTypeDisplay(post.type)}
              </span>
              {post.isFeatured && (
                <span className="px-2 py-1 bg-yellow-900/30 text-yellow-200 rounded-full text-sm">
                  Featured
                </span>
              )}
              {post.isSticky && (
                <span className="px-2 py-1 bg-green-900/30 text-green-200 rounded-full text-sm">
                  Pinned
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                {post.author.image ? (
                  <img
                    src={post.author.image}
                    alt={post.author.name || 'Anonymous'}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-purple-900 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-purple-300" />
                  </div>
                )}
                <span className="font-just-another-hand tracking-widest">
                  {post.author.name || 'Anonymous'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span className="font-just-another-hand tracking-widest">
                  {formatDate(post.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span className="font-just-another-hand tracking-widest">
                  {post._count?.replies || 0} replies
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span className="font-just-another-hand tracking-widest">
                  {post.views} views
                </span>
              </div>
            </div>
          </div>
          
          {session?.user?.id === post.author.id && (
            <div className="flex gap-2">
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="border-gray-600 font-caveat-brush"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                onClick={handleDeletePost}
                variant="outline"
                className="border-red-600 hover:bg-red-600 hover:text-white font-caveat-brush"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          {isEditing ? (
            <form onSubmit={handleEditPost} className="space-y-4">
              <div>
                <label className="block text-base font-medium mb-2 text-white font-just-another-hand tracking-widest">Title</label>
                <Input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="bg-gray-900/50 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-base font-medium mb-2 text-white font-just-another-hand tracking-widest">Content</label>
                <Textarea
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  className="min-h-[300px] bg-gray-900/50 border-gray-600 text-white font-shadows-into-light"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 font-caveat-brush">
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="border-gray-600 font-caveat-brush"
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-gray-300 leading-relaxed font-shadows-into-light">
                {post.content}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reading/Journal Details */}
      {post.type === 'READING' && post.reading && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="font-caveat-brush text-xl text-purple-300">
              Reading Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h3 className="font-semibold text-purple-300 mb-2 font-just-another-hand tracking-widest">Spread: {post.reading.spreadType}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {post.reading.readingCards.map((readingCard, index) => (
                  <div
                    key={index}
                    className="px-3 py-1 bg-purple-900/50 text-purple-200 rounded-full border border-purple-700 text-sm font-just-another-hand tracking-widest"
                  >
                    {readingCard.card.name}
                    {readingCard.isReversed && <span className="ml-1 text-red-300">↺</span>}
                  </div>
                ))}
              </div>
              
              {/* Reading Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {post.reading.readingCards
                  .sort((a, b) => a.position - b.position)
                  .map((readingCard) => (
                    <div key={readingCard.id} className="text-center">
                      <div className="mb-2">
                        {readingCard.card.imageUrl ? (
                          <img
                            src={readingCard.card.imageUrl}
                            alt={readingCard.card.name}
                            className="w-full h-48 object-contain bg-gray-900/30 rounded-lg border border-gray-600"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-900/30 rounded-lg border border-gray-600 flex items-center justify-center">
                            <span className="text-gray-500 text-sm">No Image</span>
                          </div>
                        )}
                      </div>
                      <div className="text-sm">
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-caveat-brush text-purple-300 bg-purple-900/30 px-2 py-1 rounded text-xs">
                            {transformPositionLabel(readingCard.position, post.reading!.spreadType)}
                          </span>
                          <span className="font-caveat-brush text-white">
                            {readingCard.card.name}
                          </span>
                          {readingCard.isReversed && (
                            <span className="text-red-300 text-xs font-caveat-brush">Reversed</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {post.type === 'JOURNAL' && post.journal && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="font-caveat-brush text-xl text-purple-300">
              Journal Entry
            </CardTitle>
          </CardHeader>
          <CardContent>
            {post.journal.title && (
              <h3 className="text-lg font-semibold text-purple-300 mb-2">{post.journal.title}</h3>
            )}
            <div className="text-gray-300 leading-relaxed font-shadows-into-light whitespace-pre-wrap">
              {post.journal.notes}
            </div>
            {post.journal.userNotes && (
              <div className="mt-4">
                <h4 className="font-semibold text-purple-300 mb-2">Personal Reflections</h4>
                <div className="text-gray-300 leading-relaxed font-shadows-into-light whitespace-pre-wrap">
                  {post.journal.userNotes}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Individual Card Details */}
      {post.type === 'READING' && post.card && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="font-caveat-brush text-xl text-purple-300">
              Attached Card
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-shrink-0">
                {post.card.image ? (
                  <img
                    src={post.card.image}
                    alt={post.card.name}
                    className="w-48 h-64 object-contain bg-gray-900/30 rounded-lg border border-gray-600"
                    onError={(e) => {
                      e.currentTarget.src = '/rider-waite/back.jpg'
                    }}
                  />
                ) : (
                  <div className="w-48 h-64 bg-gray-900/30 rounded-lg border border-gray-600 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">No Image</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="mb-4">
                  <span className="text-xs font-medium text-purple-300 bg-purple-900/30 px-2 py-1 rounded">
                    {post.card.arcana === 'major' ? 'Major Arcana' : 'Minor Arcana'}
                  </span>
                  {post.card.suit && (
                    <span className="ml-2 text-xs font-medium text-blue-300 bg-blue-900/30 px-2 py-1 rounded">
                      {post.card.suit}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-caveat-brush">{post.card.name}</h3>
                <div className="mb-3">
                  <span className="text-sm text-gray-400">Keywords:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {post.card.keywords.map((keyword, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-900/30 text-purple-200 rounded-full text-xs font-just-another-hand tracking-widest">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-gray-300 leading-relaxed">
                  <p className="mb-2"><span className="font-semibold text-purple-300">Description:</span> {post.card.description}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reply Section */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="font-caveat-brush text-xl text-purple-300">
            {post._count?.replies || 0} Replies
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Reply Form */}
          {session ? (
            <form onSubmit={handleSubmitReply} className="space-y-4 mb-6">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[120px] bg-gray-900/50 border-gray-600 text-white font-shadows-into-light"
                placeholder="Write your reply..."
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 font-caveat-brush"
                  disabled={!replyContent.trim()}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Post Reply
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4 text-gray-400 font-shadows-into-light">
              <p>Please sign in to reply to this post.</p>
            </div>
          )}

          {/* Replies List */}
          <div className="space-y-4">
            {replies.map((reply) => (
              <Card key={reply.id} className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {reply.author.image ? (
                        <img
                          src={reply.author.image}
                          alt={reply.author.name || 'Anonymous'}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-purple-900 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-purple-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-purple-300 font-caveat-brush">
                          {reply.author.name || 'Anonymous'}
                        </span>
                        <span className="text-xs text-gray-500 font-just-another-hand tracking-widest">
                          {formatDate(reply.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-300 leading-relaxed font-shadows-into-light whitespace-pre-wrap">
                        {reply.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {replies.length === 0 && (
              <div className="text-center py-8 text-gray-300 font-just-another-hand tracking-widest">
                <p>No replies yet. Be the first to reply!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}