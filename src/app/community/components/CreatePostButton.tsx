import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface CreatePostButtonProps {
  onClick: () => void
}

export default function CreatePostButton({ onClick }: CreatePostButtonProps) {
  const { data: session } = useSession()

  if (!session) return null

  return (
    <div className="flex justify-end mb-6">
      <Button
        onClick={onClick}
        className="bg-purple-600 hover:bg-purple-700 font-caveat-brush"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create Post
      </Button>
    </div>
  )
}