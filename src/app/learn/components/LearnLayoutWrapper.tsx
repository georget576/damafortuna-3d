"use client"
import { ReactNode } from 'react'
import SidebarNavigation from './SidebarNavigation'
import LearningNavigation from './LearningNavigation'

interface LearnLayoutWrapperProps {
  children: ReactNode
  currentPage?: string
}

export default function LearnLayoutWrapper({ children, currentPage = 'overview' }: LearnLayoutWrapperProps) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
      <div className="flex h-screen">
        {/* Desktop Sidebar only */}
        <div className={`
          hidden lg:block lg:static inset-y-0 left-0 z-50 lg:z-auto
          w-80 bg-gray-900/80 border-r border-gray-700 overflow-y-auto
        `}>
          <SidebarNavigation currentPage={currentPage} />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 lg:px-6 py-4 lg:py-8">
            {/* Learning Navigation for desktop */}
            <div className="hidden lg:block mb-6">
              <LearningNavigation
                selectedModule={currentPage}
                onModuleSelect={(moduleId) => {
                  // Handle navigation for desktop
                  const routeMap: Record<string, string> = {
                    'overview': '/learn',
                    'cards': '/learn/card-meanings',
                    'spreads': '/learn/spreads',
                    'exercises': '/learn/practice'
                  }
                  window.location.href = routeMap[moduleId]
                }}
              />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

