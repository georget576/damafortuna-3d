'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SpreadType } from '@/app/types/tarot'

interface EmptyStateProps {
  spreadType: SpreadType
  setSpreadType?: (type: SpreadType) => void
  onGenerateReading: () => void
  disabled?: boolean
  isLoading?: boolean
  error?: string
}

const spreadInfo = {
  single: {
    title: "Single Card Reading",
    description: "Gain quick insight into your current situation or a specific question with a single card draw.",
    icon: "🔮",
    color: "from-purple-500 to-pink-500"
  },
  'three-card': {
    title: "Past-Present-Future",
    description: "Explore how your past has shaped your present and what the future may hold with this classic three-card spread.",
    icon: "📅",
    color: "from-blue-500 to-teal-500"
  },
  'celtic-cross': {
    title: "Celtic Cross",
    description: "A comprehensive 10-card spread that provides deep insight into complex situations and life patterns.",
    icon: "✨",
    color: "from-emerald-500 to-cyan-500"
  }
}

export function EmptyState({ spreadType, setSpreadType, onGenerateReading, disabled = false }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-12">
      <div className="text-center space-y-6 max-w-2xl">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold font-caveat-brush text-white">
          Ready for Your {spreadInfo[spreadType].title}?
        </h2>

        <p className="text-gray-300 text-lg max-w-2xl mx-auto font-shadows-into-light tracking-wide">
          {spreadInfo[spreadType].description}
        </p>
      </div>
      
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-4xl">
        {Object.entries(spreadInfo).map(([type, info]) => (
          <Card 
            key={type} 
            className={`bg-gradient-to-br ${info.color} text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${
              spreadType === type ? 'ring-4 ring-white ring-opacity-50' : ''
            }`}
            onClick={() => setSpreadType && setSpreadType(type as SpreadType)}
          >
            <CardHeader className="text-center pb-4 font-caveat-brush">
              <div className="text-4xl mb-2">{info.icon}</div>
              <CardTitle className="text-xl font-bold">{info.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-white text-opacity-90 text-center font-shadows-into-light tracking-widest text-base">
                {info.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}