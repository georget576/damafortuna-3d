"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import CommunityHeader from './components/CommunityHeader'
import CreatePostButton from './components/CreatePostButton'
import SearchAndFilter from './components/SearchAndFilter'
import CreatePostForm from './components/CreatePostForm'
import PostCard from './components/PostCard'
import EmptyState from './components/EmptyState'
import { getJournalEntries } from '@/app/actions/reading-actions'

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
  _count?: {
    replies: number
  }
}

interface ForumCategory {
  id: string
  name: string
  description: string
  slug: string
  _count?: {
    posts: number
  }
}

export default function CommunityPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [categories, setCategories] = useState<ForumCategory[]>([])
  const [savedReadings, setSavedReadings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    categoryId: '',
    type: 'DAILY_DRAW_REFLECTION', // Default to one of the new types
    attachedReadingId: undefined as string | undefined,
    attachedCardId: undefined as string | undefined
  })

  // Fetch categories
  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...')
      const response = await fetch('/api/community/categories')
      console.log('Categories response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Categories fetched:', data)
        setCategories(data)
        console.log('Categories state set to:', data.length, 'categories')
      } else {
        console.error('Failed to fetch categories:', response.statusText)
        const errorData = await response.json().catch(() => ({}))
        console.error('Error details:', errorData)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  // Fetch posts
  const fetchPosts = async (category?: string, search?: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category) params.append('category', category)
      if (search) params.append('search', search)
      
      const response = await fetch(`/api/community/posts?${params}`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts)
      } else {
        throw new Error('Failed to fetch posts')
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      toast.error('Failed to load community posts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('Community page mounting...')
    fetchCategories()
    fetchPosts()
    fetchSavedReadings()
    
    // Check for journal slug in URL params
    const urlParams = new URLSearchParams(window.location.search)
    const journalSlug = urlParams.get('journalSlug')
    const readingId = urlParams.get('readingId')
    if (journalSlug) {
      setShowCreateForm(true)
      setNewPost(prev => ({
        ...prev,
        title: `Journal: ${journalSlug}`,
        content: `I'd like to share my journal entry from "${journalSlug}" with the community.`,
        attachedReadingId: readingId || undefined,
        attachedCardId: undefined
      }))
    }
  }, [])

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

  // Fetch saved readings for the current user
  const fetchSavedReadings = async () => {
    try {
      const { entries } = await getJournalEntries()
      // Transform journal entries to match SavedReading interface
      const transformedReadings = entries.map(entry => ({
        id: entry.reading.id,
        title: entry.slug || entry.reading.spreadType,
        spreadType: entry.reading.spreadType,
        createdAt: entry.reading.createdAt,
        cards: entry.reading.readingCards.map(rc => ({
          id: rc.card.id,
          name: rc.card.name,
          imageUrl: rc.card.imageUrl,
          isReversed: rc.isReversed,
          position: rc.position,
          positionLabel: transformPositionLabel(rc.position, entry.reading.spreadType)
        }))
      }))
      setSavedReadings(transformedReadings)
    } catch (error) {
      console.error('Error fetching saved readings:', error)
    }
  }

  useEffect(() => {
    console.log('Categories state updated:', categories.length, 'categories')
  }, [categories])

  useEffect(() => {
    console.log('Categories state updated:', categories.length, 'categories')
  }, [categories])

  useEffect(() => {
    if (searchQuery || selectedCategory) {
      fetchPosts(selectedCategory, searchQuery)
    } else {
      fetchPosts()
    }
  }, [searchQuery, selectedCategory])

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session) {
      toast.error('Please sign in to create a post')
      return
    }

    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error('Title and content are required')
      return
    }

    // If a reading or card is attached, set the post type to READING
    const postToCreate = {
      ...newPost,
      type: (newPost.attachedReadingId || newPost.attachedCardId) ? 'READING' : newPost.type
    }

    try {
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postToCreate),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Post created successfully!')
        setShowCreateForm(false)
        setNewPost({
          title: '',
          content: '',
          categoryId: '',
          type: 'DAILY_DRAW_REFLECTION',
          attachedReadingId: undefined,
          attachedCardId: undefined
        })
        fetchPosts()
        router.push(`/community/${data.slug}`)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create post')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error('Failed to create post')
    }
  }

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

  return (
    <div className="space-y-8">
      <CommunityHeader 
        title="Tarot Community"
        description="Share your readings, journal entries, and connect with other tarot enthusiasts"
      />

      <CreatePostButton onClick={() => setShowCreateForm(true)} />

      <SearchAndFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />

      <CreatePostForm
        showCreateForm={showCreateForm}
        setShowCreateForm={setShowCreateForm}
        categories={categories}
        savedReadings={savedReadings}
        newPost={newPost}
        setNewPost={setNewPost}
        handleCreatePost={handleCreatePost}
      />

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      ) : posts.length === 0 ? (
        <EmptyState 
          session={session} 
          onCreatePost={() => setShowCreateForm(true)} 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}