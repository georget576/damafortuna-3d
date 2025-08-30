import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { User, Calendar, MessageCircle, Eye, Edit } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

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

interface PostCardProps {
  post: ForumPost
}

export default function PostCard({ post }: PostCardProps) {
  const { data: session } = useSession()
  const router = useRouter()

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Card key={post.id} className="bg-gray-800/50 border-gray-700 hover:border-purple-500 transition-colors">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <Link href={`/community/${post.slug}`}>
              <CardTitle className="font-caveat-brush text-lg text-purple-300 hover:text-purple-200 cursor-pointer transition-colors">
                {post.title}
              </CardTitle>
            </Link>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
              <span className="px-2 py-1 bg-purple-900/30 text-purple-200 rounded-full text-base font-just-another-hand tracking-widest">
                {getPostTypeDisplay(post.type)}
              </span>
              {post.isFeatured && (
                <span className="px-2 py-1 bg-yellow-900/30 text-yellow-200 rounded-full text-base font-just-another-hand tracking-widest">
                  Featured
                </span>
              )}
              {post.isSticky && (
                <span className="px-2 py-1 bg-green-900/30 text-green-200 rounded-full text-base font-just-another-hand tracking-widest">
                  Pinned
                </span>
              )}
            </div>
          </div>
          {session?.user?.id === post.author.id && (
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                className="border-gray-600 p-1"
                onClick={() => router.push(`/community/${post.slug}/edit`)}
              >
                <Edit className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-300 mb-4 line-clamp-3 font-shadows-into-light tracking-wide">
          {post.excerpt || post.content.substring(0, 150) + '...'}
        </CardDescription>
        
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="font-just-another-hand tracking-widest">
              {post.author.name || 'Anonymous'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="font-just-another-hand tracking-widest">
              {formatDate(post.createdAt)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 text-sm">
          <div className="flex items-center gap-1 text-gray-400">
            <MessageCircle className="h-4 w-4" />
            <span className="font-just-another-hand tracking-widest">
              {post._count?.replies || 0} replies
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <Eye className="h-4 w-4" />
            <span className="font-just-another-hand tracking-widest">
              {post.views} views
            </span>
          </div>
        </div>
        
        <div className="mt-4">
          <Link href={`/community/${post.slug}`}>
            <Button variant="outline" className="w-full border-gray-600 text-black hover:bg-purple-700 font-caveat-brush">
              Read More
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}