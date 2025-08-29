import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface EmptyStateProps {
  session: any
  onCreatePost: () => void
}

export default function EmptyState({ session, onCreatePost }: EmptyStateProps) {
  return (
    <div className="text-center py-8 text-purple-300">
      <div className="bg-gray-800/50 rounded-lg p-6 max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold mb-3 font-caveat-brush">No Posts Yet</h3>
        <p className="text-gray-300 mb-4 font-shadows-into-light">
          {session ? 'Be the first to create a post and start the discussion!' : 'Sign in to create posts and join the community!'}
        </p>
        {session && (
          <Button
            onClick={onCreatePost}
            className="bg-purple-600 hover:bg-purple-700 font-caveat-brush"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create First Post
          </Button>
        )}
      </div>
    </div>
  )
}