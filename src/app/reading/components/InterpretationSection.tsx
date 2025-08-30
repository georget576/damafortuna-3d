'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InterpretationResponse } from '@/app/types/tarot'

interface InterpretationSectionProps {
  interpretation?: InterpretationResponse
}

export function InterpretationSection({ interpretation }: InterpretationSectionProps) {
  const readingText = interpretation?.reading || ''
  
  if (!readingText.trim()) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="font-caveat-brush text-2xl tarot-purple">AI Interpretation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-center py-4">No interpretation available</p>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="font-caveat-brush text-2xl tarot-purple">AI Interpretation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="font-shadows-into-light text-gray-300 leading-relaxed text-left max-w-none">
          {readingText.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-lg">
              {paragraph}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}