'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { SpreadType } from '@/app/types/tarot'

interface ReflectionSectionProps {
  reflection?: string
  onReflectionChange?: (reflection: string) => void
  editable?: boolean
  onSaveReading?: () => void
  isSaving?: boolean
  status?: 'loading' | 'authenticated' | 'unauthenticated'
  spreadType?: SpreadType
}

export function ReflectionSection({
  reflection,
  onReflectionChange,
  editable = true,
  onSaveReading,
  isSaving = false,
  status = 'unauthenticated',
  spreadType
}: ReflectionSectionProps) {
  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="font-caveat-brush text-2xl tarot-purple">Your Thoughts & Reflections</CardTitle>
      </CardHeader>
      <CardContent>
        {editable ? (
          <Textarea
            value={reflection || ''}
            onChange={(e) => onReflectionChange?.(e.target.value)}
            placeholder="Share your thoughts about this reading, what resonates with you, or any questions you have..."
            className="w-full min-h-[120px] bg-gray-700/50 border-gray-600 text-gray-300 placeholder:text-gray-400 resize-none font-shadows-into-light"
          />
        ) : (
          <div className="prose prose-invert max-w-none">
            <p className="font-shadows-into-light whitespace-pre-wrap text-gray-300">
              {reflection || "Share your thoughts about this reading, what resonates with you, or any questions you have..."}
            </p>
          </div>
        )}
        
        {/* Save button moved to ReflectionSection */}
        {onSaveReading && (
          <div className="mt-4 flex justify-center">
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
        )}
      </CardContent>
    </Card>
  )
}