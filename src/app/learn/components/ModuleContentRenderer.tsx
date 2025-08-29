"use client"

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import LearningOverview from './LearningOverview'
import CardMeaningsPage from '../card-meanings/page'
import SpreadsPage from '../spreads/page'
import PracticePage from '../practice/page'

export default function ModuleContentRenderer() {
  const pathname = usePathname()
  const [currentModule, setCurrentModule] = useState('overview')

  useEffect(() => {
    // Extract the module from the pathname
    const pathParts = pathname.split('/')
    const module = pathParts[pathParts.length - 1] || 'overview'
    
    // Map module names
    const moduleMap: Record<string, string> = {
      'overview': 'overview',
      'card-meanings': 'card-meanings',
      'spreads': 'spreads',
      'practice': 'practice'
    }
    
    setCurrentModule(moduleMap[module] || 'overview')
  }, [pathname])

  // Render the appropriate module content
  const renderModuleContent = () => {
    switch (currentModule) {
      case 'overview':
        return <LearningOverview />
      case 'card-meanings':
        return <CardMeaningsPage />
      case 'spreads':
        return <SpreadsPage />
      case 'practice':
        return <PracticePage />
      default:
        return <LearningOverview />
    }
  }

  return (
    <div className="w-full">
      {renderModuleContent()}
    </div>
  )
}