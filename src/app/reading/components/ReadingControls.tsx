'use client'

import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { SpreadType } from '@/app/types/tarot'

interface ReadingControlsProps {
  spreadType: SpreadType
  onGenerateReading: () => void
  isLoading: boolean
}

export function ReadingControls({
  spreadType,
  onGenerateReading,
  isLoading
}: ReadingControlsProps) {
  return (
    <div className="w-full flex justify-center mb-6">
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
    </div>
  )
}