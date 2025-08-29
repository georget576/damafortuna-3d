'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

interface ReflectionSectionProps {
  reflection?: string
  onReflectionChange?: (reflection: string) => void
  editable?: boolean
}

export function ReflectionSection({ reflection, onReflectionChange, editable = true }: ReflectionSectionProps) {
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
      </CardContent>
    </Card>
  )
}