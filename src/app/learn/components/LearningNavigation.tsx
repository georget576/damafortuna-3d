"use client"

import { Button } from '@/components/ui/button'
import { BookOpen, GraduationCap, Target, Lightbulb } from 'lucide-react'

interface LearningModule {
  id: string
  title: string
  description: string
  icon: React.ReactNode
}

interface LearningNavigationProps {
  selectedModule: string
  onModuleSelect: (moduleId: string) => void
}

const learningModules: LearningModule[] = [
  {
    id: 'overview',
    title: 'Learning Overview',
    description: 'Get started with tarot basics',
    icon: <GraduationCap className="w-5 h-5" />
  },
  {
    id: 'cards',
    title: 'Card Meanings',
    description: 'Explore individual tarot cards',
    icon: <BookOpen className="w-5 h-5" />
  },
  {
    id: 'spreads',
    title: 'Spread Techniques',
    description: 'Learn different tarot spreads',
    icon: <Target className="w-5 h-5" />
  },
  {
    id: 'exercises',
    title: 'Practice Exercises',
    description: 'Test your tarot knowledge',
    icon: <Lightbulb className="w-5 h-5" />
  }
]

export default function LearningNavigation({ selectedModule, onModuleSelect }: LearningNavigationProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
      {learningModules.map((module) => (
        <Button
          key={module.id}
          variant={selectedModule === module.id ? 'default' : 'ghost'}
          onClick={() => onModuleSelect(module.id)}
          className={`flex items-center space-x-2 font-caveat-brush ${
            selectedModule === module.id 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {module.icon}
          <span>{module.title}</span>
        </Button>
      ))}
    </div>
  )
}