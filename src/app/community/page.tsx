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
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    categoryId: '',
    type: 'DAILY_DRAW_REFLECTION' // Default to one of the new types
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
  }, [])

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

    try {
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Post created successfully!')
        setShowCreateForm(false)
        setNewPost({
          title: '',
          content: '',
          categoryId: '',
          type: 'GENERAL'
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