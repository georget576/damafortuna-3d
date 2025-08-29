'use client'

import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { SpreadType } from '@/app/types/tarot'

interface ReadingControlsProps {
  spreadType: SpreadType
  onGenerateReading: () => void
  onSaveReading: () => void
  isLoading: boolean
  isSaving: boolean
  status: 'loading' | 'authenticated' | 'unauthenticated'
}

export function ReadingControls({
  spreadType,
  onGenerateReading,
  onSaveReading,
  isLoading,
  isSaving,
  status
}: ReadingControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
      <Button
        onClick={onGenerateReading}
        disabled={isLoading}
        className="bg-purple-600 hover:bg-purple-700 font-caveat-brush"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin font-just-another-hand tracking-wide" />
            Generating...
          </>
        ) : (
          'Get My Reading'
        )}
      </Button>
      
      <Button
        onClick={onSaveReading}
        className={`${status === 'loading' ? 'bg-gray-600' : status === 'authenticated' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} font-just-another-hand text-2xl`}
        disabled={status === 'loading' || status !== 'authenticated' || isSaving}
      >
        {status === 'loading' ? 'Checking...' :
         status !== 'authenticated' ? 'You must be logged in to save' :
         isSaving ? (
           <>
             <Loader2 className="mr-2 h-4 w-4 animate-spin font-just-another-hand tracking-wide" />
             Saving...
           </>
         ) : 'Save Reading'}
      </Button>
    </div>
  )
}