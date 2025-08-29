"use client"
import LearningOverview from './components/LearningOverview'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function LearnPage() {
  const pathname = usePathname()
  const [currentModule, setCurrentModule] = useState('overview')

  useEffect(() => {
    // Extract the module from the pathname
    const pathParts = pathname.split('/')
    const module = pathParts[pathParts.length - 1] || 'overview'
    
    // Map module names
    const moduleMap: Record<string, string> = {
      'overview': 'overview',
      'card-meanings': 'cards',
      'spreads': 'spreads',
      'practice': 'exercises'
    }
    
    setCurrentModule(moduleMap[module] || 'overview')
  }, [pathname])

  // Render the appropriate module content
  const renderModuleContent = () => {
    switch (currentModule) {
      case 'overview':
        return <LearningOverview />
      case 'cards':
        // This will redirect to the actual page
        return null
      case 'spreads':
        // This will redirect to the actual page
        return null
      case 'exercises':
        // This will redirect to the actual page
        return null
      default:
        return <LearningOverview />
    }
  }

  return (
    <div className="w-full">
      {/* Module Content */}
      {renderModuleContent()}
    </div>
  )
}