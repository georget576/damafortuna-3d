import { ReactNode } from 'react'
import SidebarNavigation from './SidebarNavigation'

interface LearnLayoutWrapperProps {
  children: ReactNode
  currentPage?: string
}

export default function LearnLayoutWrapper({ children, currentPage = 'overview' }: LearnLayoutWrapperProps) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
      <div className="flex h-screen">
        <SidebarNavigation currentPage={currentPage} />
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}